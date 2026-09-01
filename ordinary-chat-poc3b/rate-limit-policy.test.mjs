import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildHardRateLimitState,
  classifyRateLimitCopy,
  cooldownDecision,
  createRateLimitTracker,
  handleSoftRateLimitNotice,
  isRateLimitDismissLabel
} from './rate-limit-policy.mjs';

function adapter({ recovery = { composerUsable: true, modalVisible: false } } = {}) {
  let dismissCount = 0;
  return {
    api: {
      detect: async () => ({ dismissible: true }),
      dismiss: async () => { dismissCount += 1; },
      waitForRecovery: async () => recovery
    },
    dismissCount: () => dismissCount
  };
}

test('recognizes Traditional Chinese rate-limit modal and dismissal', () => {
  const copy = '太多要求\n你的要求過於頻繁。為了保護你的資料，我們已暫時限制了你的對話存取權限。\n請稍等幾分鐘後再試一次。';
  assert.equal(classifyRateLimitCopy(copy), 'zh-TW');
  assert.equal(isRateLimitDismissLabel('知道了'), true);
});

test('recognizes English rate-limit modal and acknowledgments', () => {
  assert.equal(classifyRateLimitCopy('Too many requests. Please try again in a few minutes.'), 'en');
  assert.equal(isRateLimitDismissLabel('OK'), true);
  assert.equal(isRateLimitDismissLabel('Got it'), true);
});

test('first notice dismisses once and recovers the same dispatch', async () => {
  const tracker = createRateLimitTracker();
  const fixture = adapter();
  const outcome = await handleSoftRateLimitNotice(tracker, fixture.api);
  assert.deepEqual(outcome, { kind: 'RECOVERED' });
  assert.equal(fixture.dismissCount(), 1);
  assert.deepEqual(tracker, { noticeSeen: true, noticeCount: 1, dismissAttempted: true, noticeDismissed: true, recovered: true });
});

test('composer unavailable after dismissal escalates without another click', async () => {
  const tracker = createRateLimitTracker();
  const fixture = adapter({ recovery: { composerUsable: false, modalVisible: false } });
  const outcome = await handleSoftRateLimitNotice(tracker, fixture.api);
  assert.deepEqual(outcome, { kind: 'HARD', reason: 'COMPOSER_NOT_RECOVERED' });
  assert.equal(fixture.dismissCount(), 1);
});

test('notice reappearance escalates and dismissal stays bounded to one', async () => {
  const tracker = createRateLimitTracker();
  const fixture = adapter();
  assert.equal((await handleSoftRateLimitNotice(tracker, fixture.api)).kind, 'RECOVERED');
  const repeated = await handleSoftRateLimitNotice(tracker, fixture.api);
  assert.deepEqual(repeated, { kind: 'HARD', reason: 'RATE_LIMIT_NOTICE_REPEATED' });
  assert.equal(fixture.dismissCount(), 1);
});

test('notice still visible after dismissal escalates', async () => {
  const tracker = createRateLimitTracker();
  const fixture = adapter({ recovery: { composerUsable: false, modalVisible: true } });
  const outcome = await handleSoftRateLimitNotice(tracker, fixture.api);
  assert.deepEqual(outcome, { kind: 'HARD', reason: 'RATE_LIMIT_NOTICE_REPEATED' });
  assert.equal(fixture.dismissCount(), 1);
});

test('dismissal failure becomes a hard limit without a retry', async () => {
  const tracker = createRateLimitTracker();
  let dismissCount = 0;
  const outcome = await handleSoftRateLimitNotice(tracker, {
    detect: async () => ({ dismissible: true }),
    dismiss: async () => { dismissCount += 1; throw new Error('fixture click failure'); },
    waitForRecovery: async () => ({ composerUsable: true, modalVisible: false })
  });
  assert.deepEqual(outcome, { kind: 'HARD', reason: 'RATE_LIMIT_DISMISS_FAILED' });
  assert.equal(dismissCount, 1);
  assert.equal(tracker.dismissAttempted, true);
  assert.equal(tracker.noticeDismissed, false);
});

test('active cooldown fails fast and expiry permits the next dispatch', () => {
  const now = Date.parse('2026-09-01T00:00:00.000Z');
  const state = buildHardRateLimitState({
    now,
    cooldownMs: 600000,
    reason: 'COMPOSER_NOT_RECOVERED',
    authentication: 'AUTHENTICATED',
    tracker: { noticeSeen: true, noticeDismissed: true }
  });
  assert.deepEqual(cooldownDecision(state, now + 1000), {
    status: 'ACTIVE',
    retryAllowedNow: false,
    retryAfterSeconds: 599,
    cooldownUntil: '2026-09-01T00:10:00.000Z'
  });
  assert.deepEqual(cooldownDecision(state, now + 600000), {
    status: 'EXPIRED',
    retryAllowedNow: true,
    retryAfterSeconds: 0
  });
});
