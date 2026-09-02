import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_STALE_TAB_AGE_MS,
  isChatGptConversationUrl,
  selectStaleConversationTabs
} from './tab-hygiene-policy.mjs';

test('recognizes only ChatGPT conversation URLs', () => {
  assert.equal(isChatGptConversationUrl('https://chatgpt.com/c/abc'), true);
  assert.equal(isChatGptConversationUrl('https://chatgpt.com/g/g-p-x/project'), false);
  assert.equal(isChatGptConversationUrl('https://example.com/c/abc'), false);
  assert.equal(isChatGptConversationUrl('not a url'), false);
});

test('closes only stale background conversation tabs', () => {
  const now = 10_000_000;
  const staleAfterMs = 1_000;
  const tabs = [
    { id: 'old-bg', url: 'https://chatgpt.com/c/old', timeOrigin: now - 1_001, visible: false },
    { id: 'boundary', url: 'https://chatgpt.com/c/boundary', timeOrigin: now - 1_000, visible: false },
    { id: 'recent', url: 'https://chatgpt.com/c/recent', timeOrigin: now - 999, visible: false },
    { id: 'visible-old', url: 'https://chatgpt.com/c/visible', timeOrigin: now - 50_000, visible: true },
    { id: 'project-old', url: 'https://chatgpt.com/g/g-p-x/project', timeOrigin: now - 50_000, visible: false },
    { id: 'unknown-age', url: 'https://chatgpt.com/c/unknown', timeOrigin: null, visible: false }
  ];

  assert.deepEqual(
    selectStaleConversationTabs(tabs, { now, staleAfterMs }).map(tab => tab.id),
    ['old-bg', 'boundary']
  );
});

test('default stale age stays beyond the 95-minute validator job timeout', () => {
  assert.ok(DEFAULT_STALE_TAB_AGE_MS > 95 * 60 * 1000);
});
