from __future__ import annotations

import hashlib
import importlib.util
import json
import unittest
from copy import deepcopy
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "turn_entry.py"
spec = importlib.util.spec_from_file_location("chatdev_turn_entry", MODULE_PATH)
assert spec is not None and spec.loader is not None
turn_entry = importlib.util.module_from_spec(spec)
spec.loader.exec_module(turn_entry)


class TurnEntryTests(unittest.TestCase):
    def request(self) -> dict:
        return {
            "schema_version": "runtime_wrapper_turn_entry_v0",
            "request_id": "test-request-1",
            "mailbox_state": "REQUEST",
            "control_release": "0123456789abcdef0123456789abcdef01234567",
            "project_profile": "NONE",
            "epoch_id": "epoch-1",
            "turn_id": "turn-1",
        }

    def test_success_preserves_envelope_and_builds_expected_digest(self) -> None:
        request = self.request()
        result = turn_entry.run(request)

        self.assertEqual(result["schema_version"], "runtime_wrapper_result_v0")
        self.assertEqual(result["status"], "COMPLETE")
        self.assertEqual(result["request_id"], request["request_id"])
        self.assertEqual(result["mailbox_state"], "RESULT")
        self.assertTrue(result["receipt_marker"].startswith("[CHATDEV｜OK｜ID="))

        entry = result["entry"]
        self.assertEqual(entry["entry_version"], "turn_entry_v0")
        self.assertTrue(entry["invoked"])
        self.assertEqual(entry["control_release"], request["control_release"])
        self.assertEqual(entry["project_profile"], request["project_profile"])
        self.assertEqual(entry["epoch_id"], request["epoch_id"])
        self.assertEqual(entry["turn_id"], request["turn_id"])
        self.assertEqual(
            entry["caller_contract"],
            f"chat-dev/CALLER.md@{request['control_release']}",
        )
        self.assertEqual(entry["caller_next"], "GROUND_ROUTE_RECONSIDER")
        self.assertEqual(entry["semantic_routing"], "O_OWNED")
        self.assertEqual(entry["heavy_execution"], "NOT_REQUESTED")

        envelope = {
            "control_release": request["control_release"],
            "project_profile": request["project_profile"],
            "epoch_id": request["epoch_id"],
            "turn_id": request["turn_id"],
        }
        canonical = json.dumps(
            envelope,
            sort_keys=True,
            separators=(",", ":"),
            ensure_ascii=False,
        ).encode("utf-8")
        expected = hashlib.sha256(canonical).hexdigest()
        self.assertEqual(entry["turn_envelope_sha256"], expected)

    def test_run_does_not_mutate_private_transport_request(self) -> None:
        request = self.request()
        original = deepcopy(request)
        result = turn_entry.run(request)

        self.assertEqual(request, original)
        self.assertNotIn("deployment", result)

    def test_unsupported_schema_returns_terminal_error(self) -> None:
        request = self.request()
        request["schema_version"] = "wrong"
        result = turn_entry.run(request)
        self.assertEqual(result["status"], "ERROR")
        self.assertEqual(result["reason"], "UNSUPPORTED_REQUEST_SCHEMA")
        self.assertTrue(result["receipt_marker"].startswith("[CHATDEV｜ERROR｜ID="))

    def test_invalid_mailbox_state_is_rejected_with_request_id(self) -> None:
        request = self.request()
        request["mailbox_state"] = "RESULT"
        result = turn_entry.run(request)
        self.assertEqual(result["status"], "ERROR")
        self.assertEqual(result["reason"], "INVALID_MAILBOX_STATE")
        self.assertEqual(result["request_id"], request["request_id"])

    def test_empty_required_envelope_field_is_rejected(self) -> None:
        for field in ("control_release", "project_profile", "epoch_id", "turn_id"):
            with self.subTest(field=field):
                request = self.request()
                request[field] = ""
                result = turn_entry.run(request)
                self.assertEqual(result["status"], "ERROR")
                self.assertEqual(result["reason"], "INVALID_TURN_ENVELOPE")
                self.assertIn(field, result["detail"])


if __name__ == "__main__":
    unittest.main()
