from __future__ import annotations

import unittest

from mutation_prepare import ActionContract, MutationIntent, MutationPreparer


class MutationPrepareTests(unittest.TestCase):
    def setUp(self) -> None:
        self.preparer = MutationPreparer()

    def intent(
        self,
        *,
        effect: str = "UPDATE_GITHUB_FILE",
        resource_type: str = "github_file",
        target: str = "github:example/repo@main:path.txt",
    ) -> MutationIntent:
        return MutationIntent(
            effect=effect,
            resource_type=resource_type,
            target=target,
            expected_observable_effect="content changes to the bound value",
        )

    def test_exact_action_effect_resource_target_is_ready(self) -> None:
        result = self.preparer.prepare(self.intent(), "github.update_file")
        self.assertEqual(result.status, "READY")
        self.assertIsNone(result.rejection_reason)
        self.assertIn("effect_match=true", result.checks)
        self.assertIn("resource_match=true", result.checks)
        self.assertIn("target_prefix_match=true", result.checks)

    def test_cross_effect_misbinding_is_rejected(self) -> None:
        result = self.preparer.prepare(self.intent(), "github.delete_file")
        self.assertEqual(result.status, "REJECTED")
        self.assertEqual(result.rejection_reason, "ACTION_TARGET_MISMATCH")
        self.assertIn("effect_match=false", result.checks)

    def test_cross_resource_misbinding_is_rejected(self) -> None:
        result = self.preparer.prepare(
            self.intent(resource_type="github_issue", effect="UPDATE_GITHUB_ISSUE"),
            "github.update_file",
        )
        self.assertEqual(result.status, "REJECTED")
        self.assertIn("resource_match=false", result.checks)

    def test_empty_target_is_rejected(self) -> None:
        result = self.preparer.prepare(self.intent(target=""), "github.update_file")
        self.assertEqual(result.status, "REJECTED")
        self.assertIn("target_present=false", result.checks)

    def test_wrong_target_prefix_is_rejected(self) -> None:
        result = self.preparer.prepare(self.intent(target="not-github:example"), "github.update_file")
        self.assertEqual(result.status, "REJECTED")
        self.assertIn("target_prefix_match=false", result.checks)

    def test_unknown_action_is_explicitly_rejected(self) -> None:
        result = self.preparer.prepare(self.intent(), "github.unknown")
        self.assertEqual(result.status, "REJECTED")
        self.assertEqual(result.rejection_reason, "UNKNOWN_ACTION")
        self.assertEqual(result.checks, ("action_known=false",))

    def test_custom_catalog_preserves_same_contract(self) -> None:
        preparer = MutationPreparer(
            {
                "custom.send": ActionContract(
                    "custom.send", "SEND_MESSAGE", "message", "msg:"
                )
            }
        )
        intent = MutationIntent(
            effect="SEND_MESSAGE",
            resource_type="message",
            target="msg:recipient",
            expected_observable_effect="message sent",
        )
        self.assertEqual(preparer.dry_run(intent, "custom.send").status, "READY")


if __name__ == "__main__":
    unittest.main()
