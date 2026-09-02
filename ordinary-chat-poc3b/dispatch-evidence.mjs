export const USER_MESSAGE_SELECTOR = '[data-message-author-role="user"]';

export const COMPOSER_SELECTORS = [
  '#prompt-textarea',
  '[data-testid="prompt-textarea"]',
  'div[contenteditable="true"][role="textbox"]'
];

export const SEND_BUTTON_SELECTORS = [
  'button[data-testid="send-button"]',
  'button[aria-label="Send prompt"]',
  'button[aria-label="Send message"]',
  'button[aria-label*="傳送"]'
];

export function normalizeEvidenceText(value) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[\t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function promptLines(prompt) {
  return String(prompt ?? '')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
}

export function structuredResultEvidence(prompt) {
  const lines = promptLines(prompt);
  const find = prefix => lines.find(line => line.startsWith(prefix)) || null;
  return {
    protocolVersion: find('Protocol version:'),
    originatingIssue: find('Originating Issue:'),
    workflowRunId: find('Workflow run ID:'),
    correlationNonce: find('Correlation nonce:')
  };
}

export function messageMatchesPromptEvidence(messageText, prompt) {
  const actual = normalizeEvidenceText(messageText);
  const expected = normalizeEvidenceText(prompt);
  if (!actual || !expected) return false;
  if (actual === expected || actual.includes(expected)) return true;

  const evidence = structuredResultEvidence(prompt);
  if (!evidence.correlationNonce) return false;
  if (!actual.includes(normalizeEvidenceText(evidence.correlationNonce))) return false;

  const supporting = [
    evidence.protocolVersion,
    evidence.originatingIssue,
    evidence.workflowRunId
  ].filter(Boolean);
  if (supporting.length < 2) return false;

  const matchedSupporting = supporting.filter(line =>
    actual.includes(normalizeEvidenceText(line))
  ).length;
  return matchedSupporting >= 2;
}

export function composerStillContainsPrompt(composerText, prompt) {
  const actual = normalizeEvidenceText(composerText);
  const expected = normalizeEvidenceText(prompt);
  if (!actual || !expected) return false;
  if (actual === expected) return true;

  if (expected.length < 160) return actual.includes(expected);
  const head = expected.slice(0, 96);
  const tail = expected.slice(-96);
  return actual.includes(head) && actual.includes(tail);
}
