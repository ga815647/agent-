#!/usr/bin/env python3
from __future__ import annotations

"""Public-safe pure Runtime Entry implementation.

Transport and deployment ownership intentionally live outside this module. The
private execution plane supplies the request body, selects an immutable public
source SHA, and persists terminal evidence. This module owns only schema
validation and bounded result construction.
"""

import hashlib
import json
import secrets
import sys
from pathlib import Path

REQUEST_SCHEMA = "runtime_wrapper_turn_entry_v0"
RESULT_SCHEMA = "runtime_wrapper_result_v0"
ENTRY_VERSION = "turn_entry_v0"


def _receipt_marker(status: str, receipt: str | None = None) -> str:
    if status == "COMPLETE" and receipt:
        return f"[CHATDEV｜OK｜ID={receipt}]"
    if status == "ERROR" and receipt:
        return f"[CHATDEV｜ERROR｜ID={receipt}]"
    return "[CHATDEV｜NO-RECEIPT]"


def fail(
    reason: str,
    *,
    request_id: str | None = None,
    detail: str | None = None,
) -> dict:
    failure_receipt = secrets.token_hex(4)
    result: dict = {
        "schema_version": RESULT_SCHEMA,
        "status": "ERROR",
        "op": "turn_entry",
        "reason": reason,
        "failure_receipt": failure_receipt,
        "receipt_marker": _receipt_marker("ERROR", failure_receipt),
    }
    if request_id:
        result["request_id"] = request_id
    if detail:
        result["detail"] = detail[:500]
    return result


def run(request: dict) -> dict:
    if request.get("schema_version") != REQUEST_SCHEMA:
        return fail("UNSUPPORTED_REQUEST_SCHEMA")

    request_id = request.get("request_id")
    if not isinstance(request_id, str) or not request_id.strip():
        return fail("INVALID_REQUEST_ID")

    if request.get("mailbox_state") != "REQUEST":
        return fail("INVALID_MAILBOX_STATE", request_id=request_id)

    control_release = request.get("control_release")
    project_profile = request.get("project_profile")
    epoch_id = request.get("epoch_id")
    turn_id = request.get("turn_id")

    required = {
        "control_release": control_release,
        "project_profile": project_profile,
        "epoch_id": epoch_id,
        "turn_id": turn_id,
    }
    for key, value in required.items():
        if not isinstance(value, str) or not value.strip():
            return fail(
                "INVALID_TURN_ENVELOPE",
                request_id=request_id,
                detail=f"{key} must be a non-empty string",
            )

    envelope = {
        "control_release": control_release,
        "project_profile": project_profile,
        "epoch_id": epoch_id,
        "turn_id": turn_id,
    }
    canonical = json.dumps(
        envelope,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")
    digest = hashlib.sha256(canonical).hexdigest()
    receipt = secrets.token_hex(4)

    return {
        "schema_version": RESULT_SCHEMA,
        "status": "COMPLETE",
        "request_id": request_id,
        "op": "turn_entry",
        "mailbox_state": "RESULT",
        "receipt_marker": _receipt_marker("COMPLETE", receipt),
        "entry": {
            "entry_version": ENTRY_VERSION,
            "invoked": True,
            "receipt": receipt,
            "turn_envelope_sha256": digest,
            "control_release": control_release,
            "project_profile": project_profile,
            "epoch_id": epoch_id,
            "turn_id": turn_id,
            "caller_contract": f"chat-dev/CALLER.md@{control_release}",
            "caller_next": "GROUND_ROUTE_RECONSIDER",
            "semantic_routing": "O_OWNED",
            "heavy_execution": "NOT_REQUESTED",
        },
    }


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("usage: turn_entry.py REQUEST_JSON RESULT_JSON")
    source = Path(sys.argv[1])
    target = Path(sys.argv[2])
    try:
        request = json.loads(source.read_text(encoding="utf-8"))
        if not isinstance(request, dict):
            raise ValueError("request must be an object")
        result = run(request)
    except Exception as exc:
        result = fail("TURN_ENTRY_FAILED", detail=f"{type(exc).__name__}: {exc}")
    target.write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
