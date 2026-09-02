const assert = require('node:assert/strict');
const test = require('node:test');
const {
  PROTOCOL_VERSION,
  buildWorkerPrompt,
  prepareCorrelation,
  selectFirstValidResult,
  sha256Hex,
  timeoutOutcome,
  validateCandidate
} = require('./subchat-worker-result-v1.cjs');

const nonce = '0123456789abcdef0123456789abcdef';
const context = {
  dispatchIssue: 123,
  sourceIssue: 123,
  workflowRunId: '33573235789',
  correlationSha256: sha256Hex(nonce),
  repositoryOwner: 'ga815647',
  allowedApps: [{ id: '1144995', slug: 'chatgpt-codex-connector' }]
};

function payload(status = 'PASS') {
  const value = {
    protocol_version: PROTOCOL_VERSION,
    dispatch_issue: 123,
    workflow_run_id: '33573235789',
    correlation_nonce: nonce,
    status,
    summary: `fixture ${status}`
  };
  if (status === 'BLOCKED') value.blocker = 'fixture blocker';
  if (status === 'ERROR') value.error = 'fixture error';
  return value;
}

function comment(overrides = {}, payloadOverride = payload()) {
  const body = `${PROTOCOL_VERSION}\n${JSON.stringify(payloadOverride)}`;
  return {
    id: 100,
    created_at: '2026-09-01T00:00:01Z',
    html_url: 'https://github.com/example/repo/issues/123#issuecomment-100',
    issue_number: 123,
    body,
    user: { login: 'ga815647' },
    performed_via_github_app: { id: 1144995, slug: 'chatgpt-codex-connector' },
    ...overrides
  };
}

test('correlation preparation creates a fresh 128-bit lowercase nonce and commitment', () => {
  const first = prepareCorrelation();
  const second = prepareCorrelation();
  assert.match(first.nonce, /^[0-9a-f]{32}$/);
  assert.match(first.correlationSha256, /^[0-9a-f]{64}$/);
  assert.equal(first.correlationSha256, sha256Hex(first.nonce));
  assert.notEqual(first.nonce, second.nonce);
});

test('worker prompt preserves assignment and injects same-Issue V1 correlation contract', () => {
  const prompt = buildWorkerPrompt({
    assignment: 'Keep sentinel STRUCTURED_RESULT_RETURN_FIXTURE',
    repository: 'ga815647/agent-',
    dispatchIssue: 123,
    workflowRunId: '33573235789',
    nonce
  });
  assert.ok(prompt.startsWith('Keep sentinel STRUCTURED_RESULT_RETURN_FIXTURE'));
  assert.match(prompt, /Originating Issue: 123/);
  assert.match(prompt, /Protocol version: SUBCHAT_WORKER_RESULT_V1/);
  assert.match(prompt, /Workflow run ID: 33573235789/);
  assert.ok(prompt.includes(`Correlation nonce: ${nonce}`));
  assert.match(prompt, /SAME originating Issue/);
});

for (const status of ['PASS', 'BLOCKED', 'ERROR']) {
  test(`valid ${status}`, () => {
    const result = validateCandidate(comment({}, payload(status)), context);
    assert.equal(result.valid, true);
    assert.equal(result.payload.status, status);
  });
}

test('malformed JSON is rejected', () => {
  assert.equal(validateCandidate(comment({ body: `${PROTOCOL_VERSION}\n{bad` }), context).code, 'MALFORMED_JSON');
});

test('result body must contain only marker and one compact JSON line', () => {
  assert.equal(validateCandidate(comment({ body: `${PROTOCOL_VERSION}\n${JSON.stringify(payload())}\n` }), context).code, 'INVALID_BODY_SHAPE');
  assert.equal(validateCandidate(comment({ body: `${PROTOCOL_VERSION}\n{ "protocol_version":"${PROTOCOL_VERSION}"}` }), context).code, 'JSON_NOT_COMPACT');
});

test('wrong dispatch Issue is rejected', () => {
  assert.equal(validateCandidate(comment({}, { ...payload(), dispatch_issue: 124 }), context).code, 'DISPATCH_ISSUE_MISMATCH');
  assert.equal(validateCandidate(comment({ issue_number: 124 }), context).code, 'COMMENT_ISSUE_MISMATCH');
});

test('wrong workflow run is rejected', () => {
  assert.equal(validateCandidate(comment({}, { ...payload(), workflow_run_id: '1' }), context).code, 'WORKFLOW_RUN_MISMATCH');
});

test('invalid nonce is rejected', () => {
  assert.equal(validateCandidate(comment({}, { ...payload(), correlation_nonce: 'ABC' }), context).code, 'INVALID_NONCE');
});

test('nonce hash mismatch is rejected', () => {
  const wrong = 'ffffffffffffffffffffffffffffffff';
  assert.equal(validateCandidate(comment({}, { ...payload(), correlation_nonce: wrong }), context).code, 'NONCE_HASH_MISMATCH');
});

test('wrong or manual author provenance is rejected', () => {
  assert.equal(validateCandidate(comment({ user: { login: 'someone-else' } }), context).code, 'WRONG_AUTHOR');
  assert.equal(validateCandidate(comment({ performed_via_github_app: null }), context).code, 'WRONG_APP_PROVENANCE');
  assert.equal(validateCandidate(comment({ performed_via_github_app: { id: 1, slug: 'other-app' } }), context).code, 'WRONG_APP_PROVENANCE');
});

test('github-actions bot is always rejected', () => {
  const botContext = {
    ...context,
    repositoryOwner: 'github-actions[bot]',
    allowedApps: [{ id: '15368', slug: 'github-actions' }]
  };
  assert.equal(validateCandidate(comment({
    user: { login: 'github-actions[bot]' },
    performed_via_github_app: { id: 15368, slug: 'github-actions' }
  }), botContext).code, 'FORBIDDEN_GITHUB_ACTIONS_BOT');
});

test('BLOCKED without blocker is rejected', () => {
  assert.equal(validateCandidate(comment({}, { ...payload(), status: 'BLOCKED' }), context).code, 'BLOCKED_SEMANTICS');
});

test('ERROR without error is rejected', () => {
  assert.equal(validateCandidate(comment({}, { ...payload(), status: 'ERROR' }), context).code, 'ERROR_SEMANTICS');
});

test('unknown status is rejected', () => {
  assert.equal(validateCandidate(comment({}, { ...payload(), status: 'UNKNOWN' }), context).code, 'UNKNOWN_STATUS');
});

test('extra property is rejected', () => {
  assert.equal(validateCandidate(comment({}, { ...payload(), extra: true }), context).code, 'SCHEMA_EXTRA_PROPERTY');
});

test('evidence must be unique non-empty strings', () => {
  assert.equal(validateCandidate(comment({}, { ...payload(), evidence: ['same', 'same'] }), context).code, 'INVALID_EVIDENCE');
  assert.equal(validateCandidate(comment({}, { ...payload(), evidence: [''] }), context).code, 'INVALID_EVIDENCE');
  assert.equal(validateCandidate(comment({}, { ...payload(), evidence: ['one', 'two'] }), context).valid, true);
});

test('first valid correlated result wins with deterministic duplicate diagnostic', () => {
  const laterIdButEarlierTime = comment({ id: 200, created_at: '2026-09-01T00:00:00Z' });
  const earlierIdButLaterTime = comment({ id: 100, created_at: '2026-09-01T00:00:01Z' });
  const sameTimeHigherId = comment({ id: 201, created_at: '2026-09-01T00:00:00Z' });
  const selected = selectFirstValidResult([earlierIdButLaterTime, sameTimeHigherId, laterIdButEarlierTime], context);
  assert.equal(selected.status, 'ACCEPTED');
  assert.equal(selected.accepted.commentId, 200);
  assert.deepEqual(selected.duplicates.map(item => item.commentId), [201, 100]);
  assert.ok(selected.duplicates.every(item => item.code === 'DUPLICATE_VALID_RESULT'));
});

test('timeout does not fabricate a worker result', () => {
  const waiting = selectFirstValidResult([], context);
  assert.equal(waiting.status, 'WAITING');
  assert.deepEqual(timeoutOutcome(waiting), {
    status: 'RESULT_TIMEOUT',
    accepted: null,
    duplicates: [],
    diagnostics: []
  });
});
