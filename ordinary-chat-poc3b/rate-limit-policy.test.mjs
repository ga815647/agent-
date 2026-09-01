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
  const outcome = await handleSoftRateLimitNotice(tracker, fixture.api);
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
  assert.deepEqual(await handleSoftRateLimitNotice(tracker, first.api), { kind: 'RECOVERED' });
  assert.deepEqual(await handleSoftRateLimitNotice(tracker, second.api), { kind: 'RECOVERED' });
  assert.equal(first.dismissCount() + second.dismissCount(), 2);
  assert.equal(tracker.noticeCount, 2);
  assert.equal(tracker.dismissalCount, 2);
  assert.equal(tracker.recoveryCount, 2);
});

test('multiple repeated notices each recover and the dispatch can finish', async () => {
  const tracker = createRateLimitTracker();
  let dismissals = 0;
  for (let index = 0; index < 4; index += 1) {
    const fixture = fixtureAdapter();
    assert.deepEqual(await handleSoftRateLimitNotice(tracker, fixture.api), { kind: 'RECOVERED' });
    dismissals += fixture.dismissCount();
  }
  assert.equal(dismissals, 4);
  assert.equal(tracker.noticeCount, 4);
  assert.equal(tracker.recoveryCount, 4);
});

test('a notice that reappears before the recovery probe settles is also dismissed', async () => {
  const tracker = createRateLimitTracker();
  const fixture = fixtureAdapter({
    recoveries: [
      { recovered: false, nextNotice: { dismissible: true } },
      { recovered: true }
    ]
  });
  const outcome = await handleSoftRateLimitNotice(tracker, fixture.api);
  assert.deepEqual(outcome, { kind: 'RECOVERED' });
  assert.equal(fixture.dismissCount(), 2);
  assert.equal(tracker.noticeCount, 2);
  assert.equal(tracker.recoveryCount, 1);
});

test('modal that cannot be dismissed becomes RATE_LIMIT_BLOCKED', async () => {
  const tracker = createRateLimitTracker();
  const outcome = await handleSoftRateLimitNotice(tracker, {
    detect: async () => ({ dismissible: false }),
    dismiss: async () => assert.fail('dismiss must not run'),
    waitForRecovery: async () => assert.fail('recovery must not run')
  });
  assert.deepEqual(outcome, { kind: 'BLOCKED', reason: 'RATE_LIMIT_MODAL_NOT_DISMISSIBLE' });
});

test('dismiss failure becomes RATE_LIMIT_BLOCKED without retry', async () => {
  const tracker = createRateLimitTracker();
  let dismissCount = 0;
  const outcome = await handleSoftRateLimitNotice(tracker, {
    detect: async () => ({ dismissible: true }),
    dismiss: async () => { dismissCount += 1; throw new Error('fixture click failure'); },
    waitForRecovery: async () => assert.fail('recovery must not run')
  });
  assert.deepEqual(outcome, { kind: 'BLOCKED', reason: 'RATE_LIMIT_DISMISS_FAILED' });
  assert.equal(dismissCount, 1);
});

test('dismissed modal without composer or progress recovery becomes blocked', async () => {
  const tracker = createRateLimitTracker();
  const fixture = fixtureAdapter({ recoveries: [{ recovered: false }] });
  const outcome = await handleSoftRateLimitNotice(tracker, fixture.api);
  assert.deepEqual(outcome, { kind: 'BLOCKED', reason: 'RATE_LIMIT_RECOVERY_TIMEOUT' });
  assert.equal(fixture.dismissCount(), 1);
});

test('persistent modal after dismissal becomes blocked', async () => {
  const tracker = createRateLimitTracker();
  const fixture = fixtureAdapter({ recoveries: [{ recovered: false, persistentModal: true }] });
  const outcome = await handleSoftRateLimitNotice(tracker, fixture.api);
  assert.deepEqual(outcome, { kind: 'BLOCKED', reason: 'RATE_LIMIT_MODAL_PERSISTENT' });
});

test('repeated recovered notices do not create cooldown', async () => {
  const tracker = createRateLimitTracker();
  const fixture = fixtureAdapter({
    recoveries: [
      { recovered: false, nextNotice: { dismissible: true } },
      { recovered: true }
    ]
  });
  const outcome = await handleSoftRateLimitNotice(tracker, fixture.api);
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
    tracker: { noticeSeen: true, noticeCount: 2, dismissalAttempts: 2, dismissalCount: 2, noticeDismissed: true }
  });
  assert.deepEqual(state, buildRateLimitBlockedState({
    now,
    cooldownMs: 600000,
    reason: outcome.reason,
    authentication: 'AUTHENTICATED',
    tracker: { noticeSeen: true, noticeCount: 2, dismissalAttempts: 2, dismissalCount: 2, noticeDismissed: true }
  }));
  assert.equal(state.classification, 'RATE_LIMIT_BLOCKED');
  assert.equal(cooldownDecision(state, now + 1000).status, 'ACTIVE');
  assert.equal(cooldownDecision(state, now + 600000).status, 'EXPIRED');
});
