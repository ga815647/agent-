export const DEFAULT_RATE_LIMIT_COOLDOWN_MS = 10 * 60 * 1000;
export const DEFAULT_SOFT_RATE_LIMIT_MAX_ATTEMPTS = 6;
export const DEFAULT_SOFT_RATE_LIMIT_BACKOFF_MS = 400;

function normalizedText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function boundedInteger(value, fallback, min, max) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
  return /^(?:知道了|我知道了|了解|確定|OK|Okay|Got it|Dismiss)$/i.test(normalizedText(value));
}

export function createRateLimitTracker() {
  return {
    noticeSeen: false,
    noticeCount: 0,
    dismissalAttempts: 0,
    dismissalCount: 0,
    dismissControlMisses: 0,
    recoveryCount: 0,
    noticeDismissed: false,
    recovered: false
  };
}

export async function handleSoftRateLimitNotice(tracker, adapter, initialNotice = null, options = {}) {
  const maxAttempts = boundedInteger(
    options.maxAttempts,
    DEFAULT_SOFT_RATE_LIMIT_MAX_ATTEMPTS,
    1,
    20
  );
  const backoffMs = boundedInteger(
    options.backoffMs,
    DEFAULT_SOFT_RATE_LIMIT_BACKOFF_MS,
    0,
    5000
  );

  let notice = initialNotice || await adapter.detect();
  if (!notice) return { kind: 'NONE' };

  while (notice) {
    tracker.noticeSeen = true;
    tracker.noticeCount += 1;

    if (!notice.dismissible) {
      tracker.dismissControlMisses = (tracker.dismissControlMisses || 0) + 1;
      if (tracker.dismissControlMisses >= maxAttempts) {
        return { kind: 'BLOCKED', reason: 'RATE_LIMIT_DISMISS_CONTROL_UNAVAILABLE' };
      }
      if (backoffMs) await sleep(backoffMs);
      notice = await adapter.detect();
      if (!notice) {
        return { kind: 'BLOCKED', reason: 'RATE_LIMIT_RECOVERY_UNCONFIRMED' };
      }
      continue;
    }

    if (tracker.dismissalAttempts >= maxAttempts) {
      return { kind: 'BLOCKED', reason: 'RATE_LIMIT_DISMISS_ATTEMPTS_EXHAUSTED' };
    }

    tracker.dismissalAttempts += 1;
    try {
      await adapter.dismiss(notice);
      tracker.dismissalCount += 1;
      tracker.noticeDismissed = true;
    } catch {
      if (tracker.dismissalAttempts >= maxAttempts) {
        return { kind: 'BLOCKED', reason: 'RATE_LIMIT_DISMISS_FAILED' };
      }
      if (backoffMs) await sleep(backoffMs);
      notice = await adapter.detect();
      if (!notice) {
        return { kind: 'BLOCKED', reason: 'RATE_LIMIT_RECOVERY_UNCONFIRMED' };
      }
      continue;
    }

    const recovery = await adapter.waitForRecovery(notice);
    if (recovery.recovered) {
      tracker.recoveryCount += 1;
      tracker.recovered = true;
      return { kind: 'RECOVERED' };
    }

    if (tracker.dismissalAttempts >= maxAttempts && (recovery.persistentModal || recovery.nextNotice)) {
      return { kind: 'BLOCKED', reason: 'RATE_LIMIT_DISMISS_ATTEMPTS_EXHAUSTED' };
    }

    if (recovery.persistentModal || recovery.nextNotice) {
      if (backoffMs) await sleep(backoffMs);
      notice = recovery.nextNotice || await adapter.detect();
      if (!notice) {
        return { kind: 'BLOCKED', reason: 'RATE_LIMIT_RECOVERY_UNCONFIRMED' };
      }
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
    rate_limit_dismiss_control_miss_count: tracker?.dismissControlMisses || 0,
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
