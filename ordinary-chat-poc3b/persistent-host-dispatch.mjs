import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import {
  COMPOSER_SELECTORS,
  SEND_BUTTON_SELECTORS,
  USER_MESSAGE_SELECTOR,
  composerStillContainsPrompt,
  messageMatchesPromptEvidence
} from './dispatch-evidence.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CONTROLLER = path.join(SCRIPT_DIR, 'persistent-host.mjs');
const CDP_PORT = Number(process.env.CHATGPT_HOST_PORT || 9333);
const CDP_BASE = `http://127.0.0.1:${CDP_PORT}`;
const PROMPT = String(process.env.SUBCHAT_HOST_PROMPT || '').trim();
const RECOVERY_TIMEOUT_MS = 30000;

function jsonOut(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function fallbackResult(reason) {
  return {
    status: 'ERROR',
    host_health: 'FAIL',
    authentication: 'UNKNOWN',
    target_kind: 'PROJECT',
    project_landing_used: false,
    project_conversation_created: false,
    ordinary_conversation_created: false,
    fixed_prompt_submitted: false,
    conversation_url: null,
    rate_limit_notice_seen: false,
    rate_limit_notice_dismissal_count: 0,
    rate_limit_notice_dismissed: false,
    rate_limit_recovered: false,
    retry_allowed_now: false,
    assistant_output_accessed: false,
    dispatch_recovery: reason
  };
}

function parseControllerResult(stdout) {
  try {
    return JSON.parse(String(stdout || '').trim());
  } catch {
    return null;
  }
}

function eligibleForRecovery(result) {
  return result?.status === 'FAIL' &&
    result.host_health === 'PASS' &&
    result.authentication === 'AUTHENTICATED' &&
    result.target_kind === 'PROJECT' &&
    result.project_landing_used === true &&
    result.project_conversation_created === true &&
    result.ordinary_conversation_created === true &&
    result.fixed_prompt_submitted === false &&
    result.assistant_output_accessed === false &&
    PROMPT.length > 0;
}

function markPass(result, recoveryMode) {
  return {
    ...result,
    status: 'PASS',
    fixed_prompt_submitted: true,
    retry_allowed_now: true,
    dispatch_recovery: recoveryMode
  };
}

async function firstVisible(page, selectors) {
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    try {
      if (await locator.count() && await locator.isVisible()) return locator;
    } catch {}
  }
  return null;
}

async function targetConversationPage(context) {
  const pages = context.pages().filter(page => {
    try {
      const url = new URL(page.url());
      return url.protocol === 'https:' && url.hostname === 'chatgpt.com' && /\/c\//i.test(url.pathname);
    } catch {
      return false;
    }
  });
  if (!pages.length) return null;

  for (const page of [...pages].reverse()) {
    try {
      const visible = await page.evaluate(() => document.visibilityState === 'visible');
      if (visible) return page;
    } catch {}
  }
  return pages.at(-1) || null;
}

async function lastUserMessageMatches(page) {
  const messages = page.locator(USER_MESSAGE_SELECTOR);
  const count = await messages.count().catch(() => 0);
  if (!count) return false;
  try {
    const text = await messages.nth(count - 1).innerText();
    return messageMatchesPromptEvidence(text, PROMPT);
  } catch {
    return false;
  }
}

async function readComposerText(composer) {
  try {
    const inputValue = await composer.inputValue();
    if (typeof inputValue === 'string') return inputValue;
  } catch {}
  try {
    return await composer.evaluate(element => element.innerText || element.textContent || '');
  } catch {
    return '';
  }
}

async function waitForUserMessageEvidence(page, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await lastUserMessageMatches(page)) return true;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  return false;
}

async function recoverDispatch(result) {
  let browser;
  try {
    browser = await chromium.connectOverCDP(CDP_BASE);
    const context = browser.contexts()[0];
    if (!context) return { ...result, dispatch_recovery: 'NO_BROWSER_CONTEXT' };
    const page = await targetConversationPage(context);
    if (!page) return { ...result, dispatch_recovery: 'NO_CONVERSATION_PAGE' };

    if (await lastUserMessageMatches(page)) {
      return markPass(result, 'USER_MESSAGE_EVIDENCE');
    }

    const composer = await firstVisible(page, COMPOSER_SELECTORS);
    if (!composer) return { ...result, dispatch_recovery: 'NO_COMPOSER' };
    const composerText = await readComposerText(composer);
    if (!composerStillContainsPrompt(composerText, PROMPT)) {
      return { ...result, dispatch_recovery: 'UNCONFIRMED_EMPTY_OR_CHANGED_COMPOSER' };
    }

    const send = await firstVisible(page, SEND_BUTTON_SELECTORS);
    if (send) {
      const enabled = await send.isEnabled().catch(() => false);
      if (!enabled) return { ...result, dispatch_recovery: 'SEND_BUTTON_DISABLED' };
      await send.click();
    } else {
      await composer.press('Enter');
    }

    if (await waitForUserMessageEvidence(page, RECOVERY_TIMEOUT_MS)) {
      return markPass(result, 'SAFE_RESEND_CONFIRMED');
    }
    return { ...result, dispatch_recovery: 'SAFE_RESEND_UNCONFIRMED' };
  } catch {
    return { ...result, dispatch_recovery: 'RECOVERY_ERROR' };
  }
}

const child = spawnSync(process.execPath, [CONTROLLER, 'dispatch'], {
  cwd: SCRIPT_DIR,
  encoding: 'utf8',
  env: process.env,
  windowsHide: true,
  maxBuffer: 1024 * 1024
});

const original = parseControllerResult(child.stdout);
if (!original) {
  jsonOut(fallbackResult('CONTROLLER_OUTPUT_INVALID'));
  process.exitCode = 1;
} else if (!eligibleForRecovery(original)) {
  jsonOut(original);
  process.exitCode = child.status === 0 ? 0 : 1;
} else {
  const recovered = await recoverDispatch(original);
  jsonOut(recovered);
  process.exitCode = recovered.status === 'PASS' ? 0 : 1;
}
