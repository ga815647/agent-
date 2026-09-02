import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { messageMatchesPromptEvidence } from './dispatch-evidence.mjs';

const CDP_PORT = Number(process.env.CHATGPT_HOST_PORT || 9333);
const CDP_BASE = `http://127.0.0.1:${CDP_PORT}`;
const PROMPT = String(process.env.SUBCHAT_HOST_PROMPT || '').trim();
const RUN_ID = String(process.env.CHATDEV_RESULT_RUN_ID || '').trim();
const WAIT_MS = Number(process.env.CHATDEV_RESULT_WAIT_MS || 180000);
const POLL_MS = 350;
const COPY_MAX_ATTEMPTS = 3;
const COPY_RETRY_BACKOFF_MS = 450;
const DEFAULT_SPOOL_ROOT = path.join(
  process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'),
  'ChatDev',
  'PersistentChatHost',
  'worker-results'
);
const SPOOL_ROOT = path.resolve(process.env.CHATDEV_RESULT_SPOOL_ROOT || DEFAULT_SPOOL_ROOT);

function out(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

function sha256Bytes(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function failure(reason, extra = {}) {
  return {
    status: 'FAIL',
    run_id: RUN_ID || null,
    generation_terminal: false,
    capture_method: 'COPY_BUTTON',
    reason,
    assistant_output_transport_accessed: false,
    assistant_output_semantically_accessed: false,
    ...extra
  };
}

async function cdpCall(target, method, params = {}) {
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
      const timer = setTimeout(() => reject(new Error('CDP_RESPONSE_TIMEOUT')), 5000);
      ws.addEventListener('message', event => {
        let message;
        try { message = JSON.parse(String(event.data)); } catch { return; }
        if (message.id !== id) return;
        clearTimeout(timer);
        if (message.error) reject(new Error(`CDP_${method}_ERROR`));
        else resolve(message.result || {});
      });
    });
    ws.send(JSON.stringify({ id, method, params }));
    return await response;
  } finally {
    ws.close();
  }
}

async function cdpEvaluate(target, expression) {
  const result = await cdpCall(target, 'Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true
  });
  return result?.result?.value;
}

async function listTargets() {
  const response = await fetch(`${CDP_BASE}/json/list`, { signal: AbortSignal.timeout(3000) });
  if (!response.ok) throw new Error('CDP_TARGET_LIST_FAILED');
  const targets = await response.json();
  return targets.filter(target => {
    if (target?.type !== 'page' || typeof target.webSocketDebuggerUrl !== 'string') return false;
    try {
      const url = new URL(target.url);
      return url.protocol === 'https:' && url.hostname === 'chatgpt.com' && /\/c\//i.test(url.pathname);
    } catch {
      return false;
    }
  });
}

async function lastUserMessage(target) {
  const expression = `(() => {
    const nodes = Array.from(document.querySelectorAll('[data-message-author-role="user"]'));
    const last = nodes.at(-1);
    return last ? (last.innerText || last.textContent || '') : '';
  })()`;
  return String(await cdpEvaluate(target, expression) || '');
}

async function findPromptTarget() {
  const targets = await listTargets();
  for (const target of [...targets].reverse()) {
    try {
      const text = await lastUserMessage(target);
      if (messageMatchesPromptEvidence(text, PROMPT)) return target;
    } catch {}
  }
  return null;
}

const TURN_STATE_EXPRESSION = `(() => {
  const roleNodes = Array.from(document.querySelectorAll('[data-message-author-role]'));
  let lastUserIndex = -1;
  for (let i = roleNodes.length - 1; i >= 0; i -= 1) {
    if (roleNodes[i].getAttribute('data-message-author-role') === 'user') {
      lastUserIndex = i;
      break;
    }
  }
  const assistants = roleNodes
    .map((node, index) => ({ node, index }))
    .filter(item => item.index > lastUserIndex && item.node.getAttribute('data-message-author-role') === 'assistant');
  const assistantItem = assistants.at(-1) || null;
  const assistantNode = assistantItem?.node || null;
  const turn = assistantNode
    ? (assistantNode.closest('[data-testid^="conversation-turn"]') || assistantNode.closest('article') || assistantNode)
    : null;
  const allAssistants = Array.from(document.querySelectorAll('[data-message-author-role="assistant"]'));
  const assistantTurnIndex = assistantNode ? allAssistants.indexOf(assistantNode) : -1;
  const stopControlPresent = !!document.querySelector(
    'button[data-testid="stop-button"], button[aria-label="Stop generating"], button[aria-label*="停止產生"], button[aria-label*="停止生成"]'
  );
  const copySelectors = [
    'button[data-testid="copy-turn-action-button"]',
    'button[aria-label="Copy"]',
    'button[aria-label="複製"]',
    'button[aria-label*="Copy"]',
    'button[aria-label*="複製"]'
  ];
  let copyButton = null;
  if (turn) {
    for (const selector of copySelectors) {
      copyButton = turn.querySelector(selector);
      if (copyButton) break;
    }
  }
  const rectOf = element => {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return null;
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      centerX: rect.x + rect.width / 2,
      centerY: rect.y + rect.height / 2
    };
  };
  return {
    lastUserIndex,
    assistantPresent: !!assistantNode,
    assistantTurnIndex,
    structuralIndex: assistantItem?.index ?? -1,
    stopControlPresent,
    copyPresent: !!copyButton,
    copyRect: rectOf(copyButton),
    turnRect: rectOf(turn)
  };
})()`;

async function turnState(target) {
  const value = await cdpEvaluate(target, TURN_STATE_EXPRESSION);
  return value && typeof value === 'object' ? value : {};
}

async function moveMouse(target, rect) {
  if (!rect) return;
  await cdpCall(target, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: rect.centerX,
    y: rect.centerY,
    button: 'none'
  });
}

async function waitForTerminal(target) {
  const deadline = Date.now() + WAIT_MS;
  let stable = 0;
  let last = {};
  while (Date.now() < deadline) {
    last = await turnState(target);
    if (last.assistantPresent && !last.stopControlPresent && last.turnRect && !last.copyRect) {
      await moveMouse(target, last.turnRect).catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 120));
      last = await turnState(target);
    }
    const terminal = last.assistantPresent && !last.stopControlPresent && !!last.copyRect;
    stable = terminal ? stable + 1 : 0;
    if (stable >= 3) return last;
    await new Promise(resolve => setTimeout(resolve, POLL_MS));
  }
  return null;
}

function powershell(command, env = {}) {
  return spawnSync('powershell.exe', ['-NoProfile', '-STA', '-Command', command], {
    encoding: 'utf8',
    windowsHide: true,
    env: { ...process.env, ...env },
    maxBuffer: 8 * 1024 * 1024
  });
}

function setClipboardMarker(marker) {
  const command = [
    "$ErrorActionPreference='Stop'",
    'Add-Type -AssemblyName System.Windows.Forms',
    '[System.Windows.Forms.Clipboard]::SetText($env:CHATDEV_CLIPBOARD_MARKER, [System.Windows.Forms.TextDataFormat]::UnicodeText)'
  ].join('; ');
  const result = powershell(command, { CHATDEV_CLIPBOARD_MARKER: marker });
  if (result.status !== 0) throw new Error('CLIPBOARD_MARKER_WRITE_FAILED');
}

function readClipboard() {
  const command = [
    "$ErrorActionPreference='Stop'",
    '[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)',
    'Add-Type -AssemblyName System.Windows.Forms',
    '[Console]::Out.Write([System.Windows.Forms.Clipboard]::GetText([System.Windows.Forms.TextDataFormat]::UnicodeText))'
  ].join('; ');
  const result = powershell(command);
  if (result.status !== 0) throw new Error('CLIPBOARD_READ_FAILED');
  return String(result.stdout ?? '');
}

async function clickCopy(target, rect) {
  await cdpCall(target, 'Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: rect.centerX,
    y: rect.centerY,
    button: 'none'
  });
  await cdpCall(target, 'Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: rect.centerX,
    y: rect.centerY,
    button: 'left',
    clickCount: 1
  });
  await cdpCall(target, 'Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: rect.centerX,
    y: rect.centerY,
    button: 'left',
    clickCount: 1
  });
}

async function waitForClipboardChange(marker, timeoutMs = 7000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const current = readClipboard();
    if (current && current !== marker) return current;
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  return null;
}

async function assistantOuterHtml(target) {
  const expression = `(() => {
    const roleNodes = Array.from(document.querySelectorAll('[data-message-author-role]'));
    let lastUserIndex = -1;
    for (let i = roleNodes.length - 1; i >= 0; i -= 1) {
      if (roleNodes[i].getAttribute('data-message-author-role') === 'user') {
        lastUserIndex = i;
        break;
      }
    }
    const assistants = roleNodes
      .map((node, index) => ({ node, index }))
      .filter(item => item.index > lastUserIndex && item.node.getAttribute('data-message-author-role') === 'assistant');
    const assistantNode = assistants.at(-1)?.node || null;
    if (!assistantNode) return null;
    const turn = assistantNode.closest('[data-testid^="conversation-turn"]') || assistantNode.closest('article') || assistantNode;
    return turn.outerHTML || null;
  })()`;
  return await cdpEvaluate(target, expression);
}

async function main() {
  if (!PROMPT || !RUN_ID) {
    out(failure('REQUIRED_INPUT_MISSING'));
    process.exitCode = 1;
    return;
  }
  if (!Number.isInteger(WAIT_MS) || WAIT_MS < 10000 || WAIT_MS > 900000) {
    out(failure('WAIT_CONFIGURATION_INVALID'));
    process.exitCode = 1;
    return;
  }

  let target;
  try {
    target = await findPromptTarget();
  } catch {
    out(failure('CDP_UNAVAILABLE'));
    process.exitCode = 1;
    return;
  }
  if (!target) {
    out(failure('CORRELATED_CONVERSATION_NOT_FOUND'));
    process.exitCode = 1;
    return;
  }

  const terminal = await waitForTerminal(target).catch(() => null);
  if (!terminal?.copyRect) {
    out(failure('GENERATION_TERMINAL_UNCONFIRMED', {
      conversation_correlated: true
    }));
    process.exitCode = 1;
    return;
  }

  let copied = null;
  let copyAttempts = 0;
  let lastCopyFailure = 'CLIPBOARD_COPY_UNCONFIRMED';
  while (!copied && copyAttempts < COPY_MAX_ATTEMPTS) {
    copyAttempts += 1;
    const marker = `CHATDEV_CLIPBOARD_PRECAPTURE_${RUN_ID}_${copyAttempts}_${crypto.randomBytes(8).toString('hex')}`;
    try {
      const latest = await turnState(target);
      if (!latest.assistantPresent || latest.stopControlPresent) {
        lastCopyFailure = 'CORRELATED_ASSISTANT_TURN_NO_LONGER_TERMINAL';
        break;
      }
      if (latest.turnRect && !latest.copyRect) {
        await moveMouse(target, latest.turnRect).catch(() => {});
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      const ready = await turnState(target);
      if (!ready.copyRect) {
        lastCopyFailure = 'COPY_BUTTON_NOT_ACTIONABLE';
      } else {
        setClipboardMarker(marker);
        await clickCopy(target, ready.copyRect);
        copied = await waitForClipboardChange(marker, 4000);
        if (!copied) lastCopyFailure = 'CLIPBOARD_COPY_UNCONFIRMED';
      }
    } catch {
      lastCopyFailure = 'COPY_BUTTON_INVOCATION_FAILED';
    }
    if (!copied && copyAttempts < COPY_MAX_ATTEMPTS) {
      await new Promise(resolve => setTimeout(resolve, COPY_RETRY_BACKOFF_MS));
    }
  }
  if (!copied) {
    out(failure(lastCopyFailure, {
      conversation_correlated: true,
      generation_terminal: true,
      copy_attempts: copyAttempts
    }));
    process.exitCode = 1;
    return;
  }

  const html = await assistantOuterHtml(target).catch(() => null);
  if (typeof html !== 'string' || !html) {
    out(failure('ASSISTANT_TURN_HTML_CAPTURE_FAILED', {
      conversation_correlated: true,
      generation_terminal: true
    }));
    process.exitCode = 1;
    return;
  }

  const resultBytes = Buffer.from(copied, 'utf8');
  const htmlBytes = Buffer.from(html, 'utf8');
  const resultSha = sha256Bytes(resultBytes);
  const htmlSha = sha256Bytes(htmlBytes);
  const runDir = path.join(SPOOL_ROOT, RUN_ID);
  fs.mkdirSync(runDir, { recursive: true });

  const resultPath = path.join(runDir, 'result.md');
  const htmlPath = path.join(runDir, 'message.html');
  const metadataPath = path.join(runDir, 'metadata.json');

  fs.writeFileSync(resultPath, resultBytes, { mode: 0o600 });
  fs.writeFileSync(htmlPath, htmlBytes, { mode: 0o600 });

  const metadata = {
    run_id: RUN_ID,
    captured_at: new Date().toISOString(),
    capture_method: 'COPY_BUTTON',
    copy_attempts: copyAttempts,
    conversation_correlation: {
      conversation_url: target.url,
      prompt_sha256: sha256Bytes(Buffer.from(PROMPT, 'utf8')),
      last_user_message_exact_match: true
    },
    assistant_turn_index: terminal.assistantTurnIndex,
    structural_locator: {
      message_role: 'assistant',
      message_structural_index: terminal.structuralIndex,
      relation: 'latest_assistant_after_exact_last_user_prompt'
    },
    generation_terminal: true,
    result_byte_length: resultBytes.length,
    result_sha256: resultSha,
    html_sha256: htmlSha,
    assistant_output_transport_accessed: true,
    assistant_output_semantically_accessed: false
  };
  fs.writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });

  out({
    status: 'PASS',
    run_id: RUN_ID,
    conversation_correlated: true,
    generation_terminal: true,
    capture_method: 'COPY_BUTTON',
    copy_attempts: copyAttempts,
    assistant_turn_index: terminal.assistantTurnIndex,
    message_structural_index: terminal.structuralIndex,
    result_byte_length: resultBytes.length,
    result_sha256: resultSha,
    html_sha256: htmlSha,
    assistant_output_transport_accessed: true,
    assistant_output_semantically_accessed: false
  });
  process.exitCode = 0;
}

await main();
