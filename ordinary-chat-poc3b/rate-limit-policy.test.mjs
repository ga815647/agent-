import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildRateLimitBlockedState,
  classifyRateLimitCopy,
  cooldownDecision,
  cooldownStateForOutcome,
  createRateLimitTracker,
  handleSoftRateLimitNotice,
  isRateLimitDismissLabel
} from './rate-limit-policy.mjs';

function fixtureAdapter({ notices = 1, recoveries = [{ recovered: true }] } = {}) {
  let detectCount = 0;
  let dismissCount = 0;
  let recoveryIndex = 0;
  return {
    api: {
      detect: async () => detectCount++ < notices ? { dismissible: true } : null,
      dismiss: async () => { dismissCount += 1; },
      waitForRecovery: async () => recoveries[recoveryIndex++] || { recovered: false }
    },
    dismissCount: () => dismissCount
  };
}

test('recognizes Traditional Chinese rate-limit modal and dismissal', () => {
  const copy = '太多要求\n你的要求過於頻繁。為了保護你的資料，我們已暫時限制了你的對話存取權限。\n請稍等幾分鐘後再試一次。';
  assert.equal(classifyRateLimitCopy(copy), 'zh-TW');
  assert.equal(isRateLimitDismissLabel('知道了'), true);
  assert.equal(isRateLimitDismissLabel('我知道了'), true);
  assert.equal(isRateLimitDismissLabel('了解'), true);
  assert.equal(isRateLimitDismissLabel('確定'), true);
});

test('recognizes English rate-limit modal and acknowledgments', () => {
  assert.equal(classifyRateLimitCopy('Too many requests. Please try again in a few minutes.'), 'en');
  assert.equal(isRateLimitDismissLabel('OK'), true);
  assert.equal(isRateLimitDismissLabel('Got it'), true);
});

test('first modal dismisses and composer progress recovers', async () => {
  const tracker = createRateLimitTracker();
  const fixture = fixtureAdapter();
  const outcome = await handleSoftRateLimitNotice(tracker, fixture.api, null, { backoffMs: 0 });
  assert.deepEqual(outcome, { kind: 'RECOVERED' });
  assert.equal(fixture.dismissCount(), 1);
  assert.equal(tracker.noticeCount, 1);
  assert.equal(tracker.dismissalCount, 1);
  assert.equal(tracker.recoveryCount, 1);
});

test('second modal is dismissed and recovered instead of blocking', async () => {
  const tracker = createRateLimitTracker();
  const first = fixtureAdapter();
  const second = fixtureAdapter();
  assert.deepEqual(await handleSoftRateLimitNotice(tracker, first.api, null, { backoffMs: 0 }), { kind: 'RECOVERED' });
  assert.deepEqual(await handleSoftRateLimitNotice(tracker, second.api, null, { backoffMs: 0 }), { kind: 'RECOVERED' });
  assert.equal(first.dismissCount() + second.dismissCount(), 2);
  assert.equal(tracker.noticeCount, 2);
  assert.equal(tracker.dismissalCount, 2);
  assert.equal(tracker.recoveryCount, 2);
});

test('a notice that reappears before recovery settles is dismissed again', async () => {
  const tracker = createRateLimitTracker();
  const fixture = fixtureAdapter({
    recoveries: [
      { recovered: false, nextNotice: { dismissible: true } },
      { recovered: true }
    ]
  });
  const outcome = await handleSoftRateLimitNotice(tracker, fixture.api, null, { backoffMs: 0 });
  assert.deepEqual(outcome, { kind: 'RECOVERED' });
  assert.equal(fixture.dismissCount(), 2);
  assert.equal(tracker.noticeCount, 2);
  assert.equal(tracker.recoveryCount, 1);
});

test('persistent modal can be clicked repeatedly before recovery', async () => {
  const tracker = createRateLimitTracker();
  let dismissCount = 0;
  let detectCount = 0;
  let recoveryCount = 0;
  const outcome = await handleSoftRateLimitNotice(tracker, {
    detect: async () => {
      detectCount += 1;
      return { dismissible: true };
    },
    dismiss: async () => { dismissCount += 1; },
    waitForRecovery: async () => {
      recoveryCount += 1;
      return recoveryCount < 3 ? { recovered: false, persistentModal: true } : { recovered: true };
    }
  }, { dismissible: true }, { maxAttempts: 5, backoffMs: 0 });
  assert.deepEqual(outcome, { kind: 'RECOVERED' });
  assert.equal(dismissCount, 3);
  assert.equal(detectCount, 2);
  assert.equal(tracker.dismissalCount, 3);
});

test('temporarily missing dismiss control is retried instead of immediate BLOCKED', async () => {
  const tracker = createRateLimitTracker();
  let detects = 0;
  let dismisses = 0;
  const outcome = await handleSoftRateLimitNotice(tracker, {
    detect: async () => {
      detects += 1;
      return detects < 2 ? { dismissible: false } : { dismissible: true };
    },
    dismiss: async () => { dismisses += 1; },
    waitForRecovery: async () => ({ recovered: true })
  }, { dismissible: false }, { maxAttempts: 4, backoffMs: 0 });
  assert.deepEqual(outcome, { kind: 'RECOVERED' });
  assert.equal(detects, 2);
  assert.equal(dismisses, 1);
  assert.equal(tracker.dismissControlMisses, 2);
});

test('missing dismiss control is bounded and blocks after max attempts', async () => {
  const tracker = createRateLimitTracker();
  let detects = 0;
  const outcome = await handleSoftRateLimitNotice(tracker, {
    detect: async () => { detects += 1; return { dismissible: false }; },
    dismiss: async () => assert.fail('dismiss must not run'),
    waitForRecovery: async () => assert.fail('recovery must not run')
  }, { dismissible: false }, { maxAttempts: 3, backoffMs: 0 });
  assert.deepEqual(outcome, { kind: 'BLOCKED', reason: 'RATE_LIMIT_DISMISS_CONTROL_UNAVAILABLE' });
  assert.equal(detects, 2);
  assert.equal(tracker.dismissControlMisses, 3);
});

test('persistent modal is bounded and cannot loop forever', async () => {
  const tracker = createRateLimitTracker();
  let dismisses = 0;
  const outcome = await handleSoftRateLimitNotice(tracker, {
    detect: async () => ({ dismissible: true }),
    dismiss: async () => { dismisses += 1; },
    waitForRecovery: async () => ({ recovered: false, persistentModal: true })
  }, { dismissible: true }, { maxAttempts: 3, backoffMs: 0 });
  assert.deepEqual(outcome, { kind: 'BLOCKED', reason: 'RATE_LIMIT_DISMISS_ATTEMPTS_EXHAUSTED' });
  assert.equal(dismisses, 3);
  assert.equal(tracker.dismissalAttempts, 3);
});

test('dismiss failures may retry but remain bounded', async () => {
  const tracker = createRateLimitTracker();
  let dismissCount = 0;
  const outcome = await handleSoftRateLimitNotice(tracker, {
    detect: async () => ({ dismissible: true }),
    dismiss: async () => { dismissCount += 1; throw new Error('fixture click failure'); },
    waitForRecovery: async () => assert.fail('recovery must not run')
  }, { dismissible: true }, { maxAttempts: 2, backoffMs: 0 });
  assert.deepEqual(outcome, { kind: 'BLOCKED', reason: 'RATE_LIMIT_DISMISS_FAILED' });
  assert.equal(dismissCount, 2);
});

test('dismissed modal without composer or progress recovery becomes blocked', async () => {
  const tracker = createRateLimitTracker();
  const fixture = fixtureAdapter({ recoveries: [{ recovered: false }] });
  const outcome = await handleSoftRateLimitNotice(tracker, fixture.api, null, { backoffMs: 0 });
  assert.deepEqual(outcome, { kind: 'BLOCKED', reason: 'RATE_LIMIT_RECOVERY_TIMEOUT' });
  assert.equal(fixture.dismissCount(), 1);
});

test('repeated recovered notices do not create cooldown', async () => {
  const tracker = createRateLimitTracker();
  const fixture = fixtureAdapter({
    recoveries: [
      { recovered: false, nextNotice: { dismissible: true } },
      { recovered: true }
    ]
  });
  const outcome = await handleSoftRateLimitNotice(tracker, fixture.api, null, { backoffMs: 0 });
  assert.equal(outcome.kind, 'RECOVERED');
  assert.equal(cooldownStateForOutcome(outcome, { tracker }), null);
});

test('actual blocked outcome creates cooldown and active state later expires', () => {
  const now = Date.parse('2026-09-01T00:00:00.000Z');
  const outcome = { kind: 'BLOCKED', reason: 'RATE_LIMIT_RECOVERY_TIMEOUT' };
  const state = cooldownStateForOutcome(outcome, {
    now,
    cooldownMs: 600000,
    authentication: 'AUTHENTICATED',
    tracker: { noticeSeen: true, noticeCount: 2, dismissalAttempts: 2, dismissalCount: 2, dismissControlMisses: 1, noticeDismissed: true }
  });
  assert.deepEqual(state, buildRateLimitBlockedState({
    now,
    cooldownMs: 600000,
    reason: outcome.reason,
    authentication: 'AUTHENTICATED',
    tracker: { noticeSeen: true, noticeCount: 2, dismissalAttempts: 2, dismissalCount: 2, dismissControlMisses: 1, noticeDismissed: true }
  }));
  assert.equal(state.rate_limit_dismiss_control_miss_count, 1);
  assert.equal(state.classification, 'RATE_LIMIT_BLOCKED');
  assert.equal(cooldownDecision(state, now + 1000).status, 'ACTIVE');
  assert.equal(cooldownDecision(state, now + 600000).status, 'EXPIRED');
});
