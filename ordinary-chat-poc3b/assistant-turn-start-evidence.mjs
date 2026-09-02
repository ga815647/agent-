export function isChatGptConversationUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      url.hostname === 'chatgpt.com' &&
      /\/c\/[0-9a-f-]{20,}/i.test(url.pathname) &&
      !/\/(?:work|codex)(?:\/|$)/i.test(url.pathname);
  } catch {
    return false;
  }
}

export function assistantTurnEvidence({ stopControlPresent = false, assistantNodePresent = false } = {}) {
  if (stopControlPresent) return 'STOP_CONTROL_SEEN';
  if (assistantNodePresent) return 'ASSISTANT_TURN_NODE_CREATED';
  return 'NONE';
}

export function assistantTurnStarted(state = {}) {
  return assistantTurnEvidence(state) !== 'NONE';
}
