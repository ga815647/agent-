import assert from 'node:assert/strict';
import test from 'node:test';
import {
  composerStillContainsPrompt,
  messageMatchesPromptEvidence,
  normalizeEvidenceText,
  structuredResultEvidence
} from './dispatch-evidence.mjs';

const prompt = [
  'ROLE=Bounded-Worker',
  'PROJECT=Chat Dev',
  '',
  '--- MACHINE-GENERATED STRUCTURED RESULT RETURN CONTRACT ---',
  'Target repository: ga815647/agent-',
  'Originating Issue: 35',
  'Protocol version: SUBCHAT_WORKER_RESULT_V1',
  'Workflow run ID: 33595122099',
  'Correlation nonce: 0123456789abcdef0123456789abcdef',
  '',
  'After completing the assignment, post the structured result.'
].join('\n');

test('normalizeEvidenceText normalizes CRLF and insignificant whitespace', () => {
  assert.equal(normalizeEvidenceText(' a\r\n  b\t c \n\n d '), 'a\nb c\nd');
});

test('structuredResultEvidence extracts machine contract anchors', () => {
  assert.deepEqual(structuredResultEvidence(prompt), {
    protocolVersion: 'Protocol version: SUBCHAT_WORKER_RESULT_V1',
    originatingIssue: 'Originating Issue: 35',
    workflowRunId: 'Workflow run ID: 33595122099',
    correlationNonce: 'Correlation nonce: 0123456789abcdef0123456789abcdef'
  });
});

test('messageMatchesPromptEvidence accepts exact full prompt text', () => {
  assert.equal(messageMatchesPromptEvidence(prompt, prompt), true);
});

test('messageMatchesPromptEvidence accepts rendered message with nonce plus two supporting anchors', () => {
  const rendered = [
    'Some rendered assignment text',
    'Originating Issue: 35',
    'Protocol version: SUBCHAT_WORKER_RESULT_V1',
    'Correlation nonce: 0123456789abcdef0123456789abcdef'
  ].join('\n');
  assert.equal(messageMatchesPromptEvidence(rendered, prompt), true);
});

test('messageMatchesPromptEvidence rejects matching metadata with the wrong nonce', () => {
  const rendered = [
    'Originating Issue: 35',
    'Protocol version: SUBCHAT_WORKER_RESULT_V1',
    'Workflow run ID: 33595122099',
    'Correlation nonce: deadbeefdeadbeefdeadbeefdeadbeef'
  ].join('\n');
  assert.equal(messageMatchesPromptEvidence(rendered, prompt), false);
});

test('messageMatchesPromptEvidence rejects nonce-only evidence', () => {
  const rendered = 'Correlation nonce: 0123456789abcdef0123456789abcdef';
  assert.equal(messageMatchesPromptEvidence(rendered, prompt), false);
});

test('composerStillContainsPrompt accepts normalized full prompt', () => {
  const composer = prompt.replace(/\n/g, '\r\n');
  assert.equal(composerStillContainsPrompt(composer, prompt), true);
});

test('composerStillContainsPrompt rejects a changed long prompt', () => {
  const changed = `${prompt.slice(0, 120)}\nDIFFERENT TAIL`;
  assert.equal(composerStillContainsPrompt(changed, prompt), false);
});
