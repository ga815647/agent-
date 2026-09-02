import {
  assistantTurnEvidence,
  assistantTurnStarted,
  isChatGptConversationUrl
} from './assistant-turn-start-evidence.mjs';
import { messageMatchesPromptEvidence } from './dispatch-evidence.mjs';

const CDP_PORT = Number(process.env.CHATGPT_HOST_PORT || 9333);
const CDP_BASE = `http://127.0.0.1:${CDP_PORT}`;
const PROMPT = String(process.env.SUBCHAT_HOST_PROMPT || '').trim();
const WAIT_MS = Number(process.env.SUBCHAT_ASSISTANT_TURN_WAIT_MS || 30000);
const POLL_MS = 250;

function output(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

function failure(reason) {
  return {
    status: 'FAIL',
    prompt_page_found: false,
    assistant_turn_started: false,
    assistant_turn_start_evidence: 'NONE',
    reason,
    assistant_output_accessed: false
  };
}

async function cdpEvaluate(target, expression) {
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  const opened = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('CDP_OPEN_TIMEOUT')), 3000);
    ws.addEventListener('open', () => {
      clearTimeout(timer);
      resolve();
    }, { once: true });
    ws.addEventListener('error', () => {
      clearTimeout(timer);
      reject(new Error('CDP_OPEN_ERROR'));
    }, { once: true });
  });
  await opened;
  try {
    const id = 1;
    const response = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('CDP_EVALUATE_TIMEOUT')), 3000);
      ws.addEventListener('message', event => {
        let message;
        try { message = JSON.parse(String(event.data)); } catch { return; }
        if (message.id !== id) return;
        clearTimeout(timer);
        if (message.error) reject(new Error('CDP_EVALUATE_ERROR'));
        else resolve(message);
      });
    });
    ws.send(JSON.stringify({
      id,
      method: 'Runtime.evaluate',
      params: { expression, returnByValue: true, awaitPromise: true }
    }));
    const message = await response;
    return message?.result?.result?.value;
  } finally {
    ws.close();
  }
}

async function listTargets() {
  const response = await fetch(`${CDP_BASE}/json/list`, { signal: AbortSignal.timeout(3000) });
  if (!response.ok) throw new Error('CDP_TARGET_LIST_FAILED');
  const targets = await response.json();
  return targets.filter(target =>
    target?.type === 'page' &&
    typeof target.webSocketDebuggerUrl === 'string' &&
    isChatGptConversationUrl(target.url)
  );
}

async function lastUserMessage(target) {
  const expression = `(() => {
    const nodes = Array.from(document.querySelectorAll('[data-message-author-role="user"]'));
    const last = nodes.at(-1);
    return last ? (last.innerText || last.textContent || '') : '';
  })()`;
  return String(await cdpEvaluate(target, expression) || '');
}

async function turnState(target) {
  const expression = `(() => ({
    stopControlPresent: !!document.querySelector(
      'button[data-testid="stop-button"], button[aria-label="Stop generating"], button[aria-label*="停止產生"], button[aria-label*="停止生成"]'
    ),
    assistantNodePresent: !!document.querySelector('[data-message-author-role="assistant"]')
  }))()`;
  const value = await cdpEvaluate(target, expression);
  return value && typeof value === 'object' ? value : {};
}

async function findPromptTarget() {
  const targets = await listTargets();
  for (const target of [...targets].reverse()) {
    try {
      const userMessage = await lastUserMessage(target);
      if (messageMatchesPromptEvidence(userMessage, PROMPT)) return target;
    } catch {}
  }
  return null;
}

async function main() {
  if (!PROMPT) {
    output(failure('PROMPT_MISSING'));
    process.exitCode = 1;
    return;
  }
  if (!Number.isInteger(WAIT_MS) || WAIT_MS < 1000 || WAIT_MS > 60000) {
    output(failure('WAIT_CONFIGURATION_INVALID'));
    process.exitCode = 1;
    return;
  }

  let target;
  try {
    target = await findPromptTarget();
  } catch {
    output(failure('CDP_UNAVAILABLE'));
    process.exitCode = 1;
    return;
  }
  if (!target) {
    output(failure('CORRELATED_CONVERSATION_NOT_FOUND'));
    process.exitCode = 1;
    return;
  }

  const deadline = Date.now() + WAIT_MS;
  let state = {};
  while (Date.now() < deadline) {
    try {
      state = await turnState(target);
      if (assistantTurnStarted(state)) break;
    } catch {
      output({
        ...failure('CDP_PROBE_FAILED'),
        prompt_page_found: true
      });
      process.exitCode = 1;
      return;
    }
    await new Promise(resolve => setTimeout(resolve, POLL_MS));
  }

  const evidence = assistantTurnEvidence(state);
  const started = evidence !== 'NONE';
  output({
    status: started ? 'PASS' : 'FAIL',
    prompt_page_found: true,
    assistant_turn_started: started,
    assistant_turn_start_evidence: evidence,
    reason: started ? null : 'GENERATION_START_UNCONFIRMED',
    assistant_output_accessed: false
  });
  process.exitCode = started ? 0 : 1;
}

await main();
