const crypto = require('node:crypto');

const PROTOCOL_VERSION = 'SUBCHAT_WORKER_RESULT_V1';
const RESULT_MARKER = PROTOCOL_VERSION;
const NONCE_PATTERN = /^[0-9a-f]{32}$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
const RUN_ID_PATTERN = /^[0-9]+$/;
const ALLOWED_PROPERTIES = new Set([
  'protocol_version',
  'dispatch_issue',
  'workflow_run_id',
  'correlation_nonce',
  'status',
  'summary',
  'evidence',
  'blocker',
  'error'
]);

function sha256Hex(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function prepareCorrelation() {
  const nonce = crypto.randomBytes(16).toString('hex');
  return { nonce, correlationSha256: sha256Hex(nonce) };
}

function parseAllowedApps(value) {
  let parsed = value;
  if (typeof value === 'string') parsed = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('At least one allowed worker GitHub App must be configured.');
  }
  return parsed.map(entry => {
    const id = String(entry?.id || '');
    const slug = String(entry?.slug || '').toLowerCase();
    if (!/^[0-9]+$/.test(id) || !/^[a-z0-9-]+$/.test(slug)) {
      throw new Error('Worker GitHub App allowlist entries require numeric id and lowercase slug.');
    }
    return { id, slug };
  });
}

function buildWorkerPrompt({ assignment, repository, dispatchIssue, workflowRunId, nonce }) {
  if (typeof assignment !== 'string' || !assignment.trim()) throw new Error('Worker assignment is empty.');
  if (typeof repository !== 'string' || !/^[^/\s]+\/[^/\s]+$/.test(repository)) throw new Error('Repository is invalid.');
  if (!Number.isInteger(dispatchIssue) || dispatchIssue < 1) throw new Error('Dispatch issue is invalid.');
  if (!RUN_ID_PATTERN.test(String(workflowRunId))) throw new Error('Workflow run ID is invalid.');
  if (!NONCE_PATTERN.test(nonce)) throw new Error('Correlation nonce is invalid.');

  const example = JSON.stringify({
    protocol_version: PROTOCOL_VERSION,
    dispatch_issue: dispatchIssue,
    workflow_run_id: String(workflowRunId),
    correlation_nonce: nonce,
    status: 'PASS',
    summary: '<brief result summary containing any requested sentinel>'
  });

  return [
    assignment.trim(),
    '',
    '--- MACHINE-GENERATED STRUCTURED RESULT RETURN CONTRACT ---',
    `Target repository: ${repository}`,
    `Originating Issue: ${dispatchIssue}`,
    `Protocol version: ${PROTOCOL_VERSION}`,
    `Workflow run ID: ${workflowRunId}`,
    `Correlation nonce: ${nonce}`,
    '',
    'After completing the assignment, use the native GitHub connector available in this ChatGPT conversation to add exactly one result comment to the SAME originating Issue.',
    `Line 1 must be exactly: ${RESULT_MARKER}`,
    `Line 2 must be exactly one compact JSON object matching this shape: ${example}`,
    'Allowed status values are PASS, BLOCKED, and ERROR.',
    'PASS requires blocker and error to be absent.',
    'BLOCKED requires a non-empty blocker and error to be absent.',
    'ERROR requires a non-empty error and blocker to be absent.',
    'Optional evidence must be a unique non-empty string array. No additional JSON properties are allowed.',
    'Preserve any unique sentinel requested by the assignment in summary.',
    'Do not post the result to another Issue. Do not merely describe the comment; actually create it with the native GitHub connector.',
    'If native GitHub write is unavailable, report that truthfully in this conversation; do not invent a GitHub result.'
  ].join('\n');
}

function hasWhitespaceOutsideStrings(value) {
  let inString = false;
  let escaped = false;
  for (const character of value) {
    if (inString) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') inString = false;
    } else if (character === '"') {
      inString = true;
    } else if (/\s/.test(character)) {
      return true;
    }
  }
  return false;
}

function invalid(code, candidate = true) {
  return { valid: false, candidate, code };
}

function validatePayload(payload, context) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return invalid('SCHEMA_NOT_OBJECT');
  const keys = Object.keys(payload);
  if (keys.some(key => !ALLOWED_PROPERTIES.has(key))) return invalid('SCHEMA_EXTRA_PROPERTY');

  const required = ['protocol_version', 'dispatch_issue', 'workflow_run_id', 'correlation_nonce', 'status', 'summary'];
  if (required.some(key => !Object.hasOwn(payload, key))) return invalid('SCHEMA_REQUIRED_PROPERTY');
  if (payload.protocol_version !== PROTOCOL_VERSION) return invalid('PROTOCOL_VERSION_MISMATCH');
  if (!Number.isInteger(payload.dispatch_issue) || payload.dispatch_issue !== context.dispatchIssue) {
    return invalid('DISPATCH_ISSUE_MISMATCH');
  }
  if (typeof payload.workflow_run_id !== 'string' || payload.workflow_run_id !== String(context.workflowRunId)) {
    return invalid('WORKFLOW_RUN_MISMATCH');
  }
  if (typeof payload.correlation_nonce !== 'string' || !NONCE_PATTERN.test(payload.correlation_nonce)) {
    return invalid('INVALID_NONCE');
  }
  if (sha256Hex(payload.correlation_nonce) !== context.correlationSha256) {
    return invalid('NONCE_HASH_MISMATCH');
  }
  if (!['PASS', 'BLOCKED', 'ERROR'].includes(payload.status)) return invalid('UNKNOWN_STATUS');
  if (typeof payload.summary !== 'string' || !payload.summary.trim()) return invalid('INVALID_SUMMARY');

  if (Object.hasOwn(payload, 'evidence')) {
    if (!Array.isArray(payload.evidence) || payload.evidence.length === 0 ||
        payload.evidence.some(item => typeof item !== 'string' || !item.trim()) ||
        new Set(payload.evidence).size !== payload.evidence.length) {
      return invalid('INVALID_EVIDENCE');
    }
  }

  const blockerPresent = Object.hasOwn(payload, 'blocker');
  const errorPresent = Object.hasOwn(payload, 'error');
  if (blockerPresent && (typeof payload.blocker !== 'string' || !payload.blocker.trim())) return invalid('INVALID_BLOCKER');
  if (errorPresent && (typeof payload.error !== 'string' || !payload.error.trim())) return invalid('INVALID_ERROR');
  if (payload.status === 'PASS' && (blockerPresent || errorPresent)) return invalid('PASS_HAS_BLOCKER_OR_ERROR');
  if (payload.status === 'BLOCKED' && (!blockerPresent || errorPresent)) return invalid('BLOCKED_SEMANTICS');
  if (payload.status === 'ERROR' && (!errorPresent || blockerPresent)) return invalid('ERROR_SEMANTICS');

  return { valid: true };
}

function validateCandidate(comment, context) {
  const body = typeof comment?.body === 'string' ? comment.body.replace(/\r\n/g, '\n') : '';
  if (!body.startsWith(RESULT_MARKER)) return invalid('NOT_PROTOCOL_COMMENT', false);
  const lines = body.split('\n');
  if (lines.length !== 2 || lines[0] !== RESULT_MARKER || !lines[1]) return invalid('INVALID_BODY_SHAPE');
  if (hasWhitespaceOutsideStrings(lines[1])) return invalid('JSON_NOT_COMPACT');

  let payload;
  try {
    payload = JSON.parse(lines[1]);
  } catch {
    return invalid('MALFORMED_JSON');
  }

  if (context.sourceIssue !== context.dispatchIssue ||
      (comment.issue_number !== undefined && comment.issue_number !== context.dispatchIssue)) {
    return invalid('COMMENT_ISSUE_MISMATCH');
  }
  const author = String(comment.user?.login || '');
  if (author.toLowerCase() === 'github-actions[bot]') return invalid('FORBIDDEN_GITHUB_ACTIONS_BOT');
  if (author.toLowerCase() !== String(context.repositoryOwner).toLowerCase()) return invalid('WRONG_AUTHOR');

  const allowedApps = parseAllowedApps(context.allowedApps);
  const appId = String(comment.performed_via_github_app?.id || '');
  const appSlug = String(comment.performed_via_github_app?.slug || '').toLowerCase();
  if (!allowedApps.some(entry => entry.id === appId && entry.slug === appSlug)) return invalid('WRONG_APP_PROVENANCE');

  const payloadResult = validatePayload(payload, context);
  if (!payloadResult.valid) return payloadResult;
  if (!Number.isInteger(comment.id) || comment.id < 1 || Number.isNaN(Date.parse(comment.created_at))) {
    return invalid('INVALID_COMMENT_METADATA');
  }

  return {
    valid: true,
    candidate: true,
    payload,
    commentId: comment.id,
    createdAt: comment.created_at,
    htmlUrl: comment.html_url || null,
    author,
    app: { id: appId, slug: appSlug }
  };
}

function selectFirstValidResult(comments, context) {
  if (!SHA256_PATTERN.test(context.correlationSha256 || '')) throw new Error('Correlation SHA256 is invalid.');
  const valid = [];
  const diagnostics = [];
  for (const comment of comments) {
    const result = validateCandidate(comment, context);
    if (result.valid) valid.push(result);
    else if (result.candidate) diagnostics.push({ commentId: comment?.id || null, code: result.code });
  }
  valid.sort((left, right) => {
    const timeDifference = Date.parse(left.createdAt) - Date.parse(right.createdAt);
    return timeDifference || left.commentId - right.commentId;
  });
  const accepted = valid[0] || null;
  const duplicates = valid.slice(1).map(result => ({
    commentId: result.commentId,
    code: 'DUPLICATE_VALID_RESULT'
  }));
  return {
    status: accepted ? 'ACCEPTED' : 'WAITING',
    accepted,
    duplicates,
    diagnostics: [...diagnostics, ...duplicates]
  };
}

function timeoutOutcome(selection) {
  if (selection?.accepted) return selection;
  return {
    status: 'RESULT_TIMEOUT',
    accepted: null,
    duplicates: selection?.duplicates || [],
    diagnostics: selection?.diagnostics || []
  };
}

module.exports = {
  PROTOCOL_VERSION,
  RESULT_MARKER,
  buildWorkerPrompt,
  parseAllowedApps,
  prepareCorrelation,
  selectFirstValidResult,
  sha256Hex,
  timeoutOutcome,
  validateCandidate
};
