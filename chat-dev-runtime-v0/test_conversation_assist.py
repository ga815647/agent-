import copy
import unittest
from conversation_assist import packet, validate, join, legacy_request


class ConversationTests(unittest.TestCase):
    def setUp(self):
        self.context = packet("session", 1, [{"id": "a", "role": "assistant", "text": "我會先檢查問題，再修正。"}, {"id": "u", "role": "user", "text": "好"}])
        self.answer = dict(intent="CONFIRMATION", move="CONTINUE", current_goal="修正問題", interpretation="同意先檢查再修正", reason="前文有具體提案", question="", suggested_response="我先檢查。", evidence_ids=["a", "u"])

    def test_original_messages_preserved(self):
        self.assertEqual(self.context["messages"][-1]["text"], "好")

    def test_same_revision_different_messages_cannot_reuse_advice(self):
        result = validate(self.answer, self.context)
        changed = copy.deepcopy(self.context)
        changed["messages"][-1]["text"] = "先不要改"
        with self.assertRaises(ValueError): join(result, changed)

    def test_wrong_session_cannot_reuse_advice(self):
        result = validate(self.answer, self.context)
        with self.assertRaises(ValueError): join(result, {**self.context, "session_id": "other"})

    def test_advice_cannot_add_authorization(self):
        with self.assertRaises(ValueError): validate({**self.answer, "authorized_effects": ["deploy"]}, self.context)

    def test_missing_latest_evidence_rejected(self):
        with self.assertRaises(ValueError): validate({**self.answer, "evidence_ids": ["a"]}, self.context)

    def test_question_requires_material_ambiguity(self):
        with self.assertRaises(ValueError): validate({**self.answer, "question": "確定嗎？"}, self.context)

    def test_existing_transport_shape_and_policy(self):
        request = legacy_request(self.context, "probe", "LOW_SENSITIVITY")
        self.assertEqual(request["op"], "spark_run")
        self.assertIn("好", request["spark"]["context"])
        with self.assertRaises(ValueError): legacy_request(self.context, "probe", "OWNER_CODE_RESEARCH")

    def test_no_silent_context_truncation(self):
        with self.assertRaises(ValueError): packet("s", 1, [{"id": "u", "role": "user", "text": "x" * 24001}])


if __name__ == "__main__": unittest.main()
