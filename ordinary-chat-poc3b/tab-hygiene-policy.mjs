export const DEFAULT_STALE_TAB_AGE_MS = 120 * 60 * 1000;

export function isChatGptConversationUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' &&
      url.hostname === 'chatgpt.com' &&
      /\/c\//i.test(url.pathname);
  } catch {
    return false;
  }
}

export function selectStaleConversationTabs(
  tabs,
  { now = Date.now(), staleAfterMs = DEFAULT_STALE_TAB_AGE_MS } = {}
) {
  if (!Number.isFinite(now)) throw new Error('now must be finite.');
  if (!Number.isFinite(staleAfterMs) || staleAfterMs <= 0) {
    throw new Error('staleAfterMs must be a positive finite number.');
  }

  return tabs.filter(tab => {
    if (!isChatGptConversationUrl(tab?.url)) return false;
    if (tab?.visible === true) return false;
    if (!Number.isFinite(tab?.timeOrigin)) return false;
    return now - tab.timeOrigin >= staleAfterMs;
  });
}
