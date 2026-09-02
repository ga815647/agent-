import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assistantTurnEvidence,
  assistantTurnStarted,
  isChatGptConversationUrl
} from './assistant-turn-start-evidence.mjs';

test('accepts only ordinary ChatGPT conversation routes', () => {
  assert.equal(isChatGptConversationUrl('https://chatgpt.com/g/g-p-test/project/c/1234567890abcdef12345678'), true);
  assert.equal(isChatGptConversationUrl('https://chatgpt.com/'), false);
  assert.equal(isChatGptConversationUrl('https://chatgpt.com/work/c/1234567890abcdef12345678'), false);
  assert.equal(isChatGptConversationUrl('https://example.com/c/1234567890abcdef12345678'), false);
});

test('assistant node is sufficient non-content start evidence', () => {
  assert.equal(assistantTurnStarted({ assistantNodePresent: true }), true);
  assert.equal(assistantTurnEvidence({ assistantNodePresent: true }), 'ASSISTANT_TURN_NODE_CREATED');
});

test('stop control is sufficient and preferred start evidence', () => {
  assert.equal(assistantTurnStarted({ stopControlPresent: true }), true);
  assert.equal(assistantTurnEvidence({ stopControlPresent: true, assistantNodePresent: true }), 'STOP_CONTROL_SEEN');
});

test('user-message-only state is not execution-start evidence', () => {
  assert.equal(assistantTurnStarted({}), false);
  assert.equal(assistantTurnEvidence({}), 'NONE');
});
