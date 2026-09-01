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
    dismissalAttempts: 0,
    dismissalCount: 0,
    recoveryCount: 0,
    noticeDismissed: false,
    recovered: false
  };
}

export async function handleSoftRateLimitNotice(tracker, adapter, initialNotice = null) {
  let notice = initialNotice || await adapter.detect();
  if (!notice) return { kind: 'NONE' };

  while (notice) {
    tracker.noticeSeen = true;
    tracker.noticeCount += 1;
    if (!notice.dismissible) {
      return { kind: 'BLOCKED', reason: 'RATE_LIMIT_MODAL_NOT_DISMISSIBLE' };
    }

    tracker.dismissalAttempts += 1;
    try {
      await adapter.dismiss(notice);
      tracker.dismissalCount += 1;
      tracker.noticeDismissed = true;
    } catch {
      return { kind: 'BLOCKED', reason: 'RATE_LIMIT_DISMISS_FAILED' };
    }

    const recovery = await adapter.waitForRecovery(notice);
    if (recovery.persistentModal) {
      return { kind: 'BLOCKED', reason: 'RATE_LIMIT_MODAL_PERSISTENT' };
    }
    if (recovery.recovered) {
      tracker.recoveryCount += 1;
      tracker.recovered = true;
      return { kind: 'RECOVERED' };
    }
    if (recovery.nextNotice) {
      notice = recovery.nextNotice;
      continue;
    }
    return { kind: 'BLOCKED', reason: 'RATE_LIMIT_RECOVERY_TIMEOUT' };
  }

  return { kind: 'BLOCKED', reason: 'RATE_LIMIT_RECOVERY_TIMEOUT' };
}

export function buildRateLimitBlockedState({ now = Date.now(), cooldownMs = DEFAULT_RATE_LIMIT_COOLDOWN_MS, reason, authentication = 'UNKNOWN', tracker }) {
  return {
    status: 'RATE_LIMITED',
    classification: 'RATE_LIMIT_BLOCKED',
    detected_at: new Date(now).toISOString(),
    cooldown_until: new Date(now + cooldownMs).toISOString(),
    reason,
    authentication,
    rate_limit_notice_seen: tracker?.noticeSeen === true,
    rate_limit_notice_count: tracker?.noticeCount || 0,
    rate_limit_dismissal_attempted: (tracker?.dismissalAttempts || 0) > 0,
    rate_limit_dismissal_count: tracker?.dismissalCount || 0,
    rate_limit_notice_dismissed: tracker?.noticeDismissed === true,
    rate_limit_recovered: false,
    retry_allowed_now: false
  };
}

export function cooldownStateForOutcome(outcome, options) {
  return outcome?.kind === 'BLOCKED'
    ? buildRateLimitBlockedState({ ...options, reason: outcome.reason })
    : null;
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
