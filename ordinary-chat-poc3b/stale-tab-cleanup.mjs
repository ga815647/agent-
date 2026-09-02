import {
  isChatGptConversationUrl,
  selectStaleConversationTabs
} from './tab-hygiene-policy.mjs';

const CDP_PORT = Number(process.env.CHATGPT_HOST_PORT || 9333);
const CDP_BASE = `http://127.0.0.1:${CDP_PORT}`;
const COMMAND_TIMEOUT_MS = 3000;

function withTimeout(promise, timeoutMs = COMMAND_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs))
  ]);
}

async function evaluateTarget(target) {
  if (typeof WebSocket !== 'function' || !target?.webSocketDebuggerUrl) return null;
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  const commandId = 1;

  return withTimeout(new Promise((resolve, reject) => {
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({
        id: commandId,
        method: 'Runtime.evaluate',
        params: {
          expression: 'JSON.stringify({timeOrigin: performance.timeOrigin, visible: document.visibilityState === "visible"})',
          returnByValue: true
        }
      }));
    }, { once: true });

    socket.addEventListener('message', event => {
      try {
        const message = JSON.parse(String(event.data));
        if (message.id !== commandId) return;
        const raw = message?.result?.result?.value;
        resolve(typeof raw === 'string' ? JSON.parse(raw) : null);
        socket.close();
      } catch (error) {
        reject(error);
        socket.close();
      }
    });

    socket.addEventListener('error', () => reject(new Error('cdp websocket error')), { once: true });
  })).finally(() => {
    try { socket.close(); } catch {}
  });
}

async function fetchTargets() {
  const response = await fetch(`${CDP_BASE}/json/list`, { signal: AbortSignal.timeout(COMMAND_TIMEOUT_MS) });
  if (!response.ok) return [];
  const targets = await response.json();
  return Array.isArray(targets) ? targets : [];
}

async function closeTarget(id) {
  const response = await fetch(`${CDP_BASE}/json/close/${encodeURIComponent(id)}`, {
    signal: AbortSignal.timeout(COMMAND_TIMEOUT_MS)
  });
  return response.ok;
}

async function main() {
  let targets;
  try {
    targets = await fetchTargets();
  } catch {
    return;
  }

  const candidates = [];
  for (const target of targets) {
    if (target?.type !== 'page' || !isChatGptConversationUrl(target.url)) continue;
    const timing = await evaluateTarget(target).catch(() => null);
    candidates.push({
      id: target.id,
      url: target.url,
      timeOrigin: timing?.timeOrigin,
      visible: timing?.visible === true
    });
  }

  for (const tab of selectStaleConversationTabs(candidates)) {
    await closeTarget(tab.id).catch(() => false);
  }
}

try {
  await main();
} catch {
  // Hygiene is fail-open: cleanup must never make dispatch unavailable.
}
