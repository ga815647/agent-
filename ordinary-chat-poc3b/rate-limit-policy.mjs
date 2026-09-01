export const DEFAULT_RATE_LIMIT_COOLDOWN_MS = 10 * 60 * 1000;

function normalizedText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

export function classifyRateLimitCopy(value) {
  const text = normalizedText(value);
  if (/太多要求/.test(text) || (/要求過於頻繁/.test(text) && /暫時限制/.test(text))) {
    return 'zh-TW';
  }
  if (/too many requests/i.test(text) || (/requests?.*(?:too frequent|too many)/i.test(text) && /(?:temporarily|try again)/i.test(text))) {
    return 'en';
  }
  return null;
}

export function isRateLimitDismissLabel(value) {
  return /^(?:知道了|確定|OK|Okay|Got it|Dismiss)$/i.test(normalizedText(value));
}

export function createRateLimitTracker() {
  return {
    noticeSeen: false,
    noticeCount: 0,
    dismissAttempted: false,
    noticeDismissed: false,
    recovered: false
  };
}

export async function handleSoftRateLimitNotice(tracker, adapter, initialNotice = null) {
  const notice = initialNotice || await adapter.detect();
  if (!notice) return { kind: 'NONE' };

  tracker.noticeSeen = true;
  tracker.noticeCount += 1;
  if (tracker.dismissAttempted) {
    return { kind: 'HARD', reason: 'RATE_LIMIT_NOTICE_REPEATED' };
  }
  if (!notice.dismissible) {
    return { kind: 'HARD', reason: 'RATE_LIMIT_NOTICE_NOT_DISMISSIBLE' };
  }

  tracker.dismissAttempted = true;
  try {
    await adapter.dismiss(notice);
    tracker.noticeDismissed = true;
  } catch {
    return { kind: 'HARD', reason: 'RATE_LIMIT_DISMISS_FAILED' };
  }
  const recovery = await adapter.waitForRecovery(notice);
  if (recovery.modalVisible) {
    return { kind: 'HARD', reason: 'RATE_LIMIT_NOTICE_REPEATED' };
  }
  if (!recovery.composerUsable) {
    return { kind: 'HARD', reason: 'COMPOSER_NOT_RECOVERED' };
  }

  tracker.recovered = true;
  return { kind: 'RECOVERED' };
}

export function buildHardRateLimitState({ now = Date.now(), cooldownMs = DEFAULT_RATE_LIMIT_COOLDOWN_MS, reason, authentication = 'UNKNOWN', tracker }) {
  return {
    status: 'RATE_LIMITED',
    detected_at: new Date(now).toISOString(),
    cooldown_until: new Date(now + cooldownMs).toISOString(),
    reason,
    authentication,
    rate_limit_notice_seen: tracker?.noticeSeen === true,
    rate_limit_dismissal_attempted: tracker?.dismissAttempted === true,
    rate_limit_notice_dismissed: tracker?.noticeDismissed === true,
    retry_allowed_now: false
  };
}

export function cooldownDecision(state, now = Date.now()) {
  if (!state || state.status !== 'RATE_LIMITED') {
    return { status: 'NONE', retryAllowedNow: true, retryAfterSeconds: 0 };
  }
  const cooldownUntilMs = Date.parse(state.cooldown_until);
  if (!Number.isFinite(cooldownUntilMs)) {
    throw new Error('Rate-limit state has an invalid cooldown_until value.');
  }
  if (cooldownUntilMs <= now) {
    return { status: 'EXPIRED', retryAllowedNow: true, retryAfterSeconds: 0 };
  }
  return {
    status: 'ACTIVE',
    retryAllowedNow: false,
    retryAfterSeconds: Math.ceil((cooldownUntilMs - now) / 1000),
    cooldownUntil: new Date(cooldownUntilMs).toISOString()
  };
}
