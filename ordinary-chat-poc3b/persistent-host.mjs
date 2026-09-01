import { chromium } from 'playwright-core';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const FIXED_PROMPT = 'Return exactly: PERSISTENT_CHAT_HOST_001';
const CHATGPT_URL = 'https://chatgpt.com/';
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_ROOT = path.join(process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local'), 'ChatDev', 'PersistentChatHost');
const HOST_ROOT = path.resolve(process.env.CHATGPT_HOST_ROOT || DEFAULT_ROOT);
const PROFILE_PATH = path.resolve(process.env.CHATGPT_HOST_PROFILE || path.join(HOST_ROOT, 'chrome-user-data'));
const CDP_PORT = Number(process.env.CHATGPT_HOST_PORT || 9333);
const CDP_BASE = `http://127.0.0.1:${CDP_PORT}`;
const STATE_PATH = path.join(HOST_ROOT, 'host-state.json');
const RESULT_PATH = path.join(HOST_ROOT, 'last-result.json');
const OWNER_PATH = path.join(HOST_ROOT, 'profile-owner.json');
const LOCK_PATH = path.join(HOST_ROOT, 'controller.lock');
const ACTION = process.argv[2] || 'status';
const VALID_ACTIONS = new Set(['start', 'open', 'status', 'stop', 'send-test', 'checkpoint']);

function jsonOut(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function normalizeForCompare(value) {
  return path.resolve(value).replace(/[\\/]+$/, '').toLowerCase();
}

function isWithin(parent, child) {
  const base = `${normalizeForCompare(parent)}${path.sep}`;
  const target = `${normalizeForCompare(child)}${path.sep}`;
  return target.startsWith(base);
}

function assertSafePaths() {
  if (!Number.isInteger(CDP_PORT) || CDP_PORT < 1024 || CDP_PORT > 65535) {
    throw new Error('CHATGPT_HOST_PORT must be an integer from 1024 to 65535.');
  }
  if (isWithin(os.tmpdir(), PROFILE_PATH)) {
    throw new Error(`Persistent profile must not be under the temporary directory: ${PROFILE_PATH}`);
  }
  if (isWithin(REPO_ROOT, PROFILE_PATH)) {
    throw new Error(`Persistent profile must not be stored inside the repository: ${PROFILE_PATH}`);
  }
}

function atomicWrite(target, value) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const temporary = `${target}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
  fs.renameSync(temporary, target);
}

function readJson(target) {
  try {
    return JSON.parse(fs.readFileSync(target, 'utf8'));
  } catch {
    return null;
  }
}

function processExists(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function profileProcessIds() {
  if (process.platform !== 'win32') return [];
  const script = [
    '$needle = $env:CHATGPT_HOST_PROFILE_LOOKUP',
    "$items = @(Get-CimInstance Win32_Process | Where-Object { $_.Name -in @('chrome.exe','msedge.exe') -and $_.CommandLine -and $_.CommandLine.IndexOf($needle, [System.StringComparison]::OrdinalIgnoreCase) -ge 0 } | Select-Object -ExpandProperty ProcessId)",
    '$items | ConvertTo-Json -Compress'
  ].join('; ');
  const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', script], {
    encoding: 'utf8',
    windowsHide: true,
    env: { ...process.env, CHATGPT_HOST_PROFILE_LOOKUP: PROFILE_PATH }
  });
  if (result.status !== 0 || !result.stdout.trim()) return [];
  try {
    const parsed = JSON.parse(result.stdout.trim());
    return (Array.isArray(parsed) ? parsed : [parsed]).map(Number).filter(Number.isInteger);
  } catch {
    return [];
  }
}

async function tcpPortOpen() {
  return new Promise(resolve => {
    const socket = net.createConnection({ host: '127.0.0.1', port: CDP_PORT });
    const done = value => {
      socket.destroy();
      resolve(value);
    };
    socket.setTimeout(700);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
  });
}

async function cdpReady() {
  try {
    const response = await fetch(`${CDP_BASE}/json/version`, { signal: AbortSignal.timeout(1500) });
    if (!response.ok) return false;
    const value = await response.json();
    return typeof value.webSocketDebuggerUrl === 'string';
  } catch {
    return false;
  }
}

async function waitFor(predicate, timeoutMs, intervalMs = 250) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await predicate()) return true;
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  return false;
}

async function withControllerLock(callback) {
  fs.mkdirSync(HOST_ROOT, { recursive: true });
  let descriptor;
  try {
    descriptor = fs.openSync(LOCK_PATH, 'wx', 0o600);
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    const ageMs = Date.now() - fs.statSync(LOCK_PATH).mtimeMs;
    if (ageMs < 120000) throw new Error('Another persistent-host controller is active.');
    fs.unlinkSync(LOCK_PATH);
    descriptor = fs.openSync(LOCK_PATH, 'wx', 0o600);
  }
  fs.writeFileSync(descriptor, `${process.pid}\n`, 'utf8');
  try {
    return await callback();
  } finally {
    fs.closeSync(descriptor);
    fs.rmSync(LOCK_PATH, { force: true });
  }
}

function chromeCandidates() {
  const values = [
    process.env.CHATGPT_HOST_CHROME,
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    process.env['PROGRAMFILES(X86)'] && path.join(process.env['PROGRAMFILES(X86)'], 'Google', 'Chrome', 'Application', 'chrome.exe'),
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    process.env.PROGRAMFILES && path.join(process.env.PROGRAMFILES, 'Microsoft', 'Edge', 'Application', 'msedge.exe'),
    process.env['PROGRAMFILES(X86)'] && path.join(process.env['PROGRAMFILES(X86)'], 'Microsoft', 'Edge', 'Application', 'msedge.exe')
  ];
  return [...new Set(values.filter(Boolean).map(value => path.resolve(value)))];
}

function findBrowserExecutable() {
  const executable = chromeCandidates().find(candidate => fs.existsSync(candidate));
  if (!executable) throw new Error('No supported Chrome or Edge executable was found. Set CHATGPT_HOST_CHROME explicitly.');
  return executable;
}

function ensureDedicatedProfile() {
  const owner = readJson(OWNER_PATH);
  if (owner) {
    if (normalizeForCompare(owner.profile_path) !== normalizeForCompare(PROFILE_PATH)) {
      throw new Error('Existing profile-owner marker points at a different profile path.');
    }
    fs.mkdirSync(PROFILE_PATH, { recursive: true });
    return owner;
  }

  if (fs.existsSync(PROFILE_PATH) && fs.readdirSync(PROFILE_PATH).length > 0) {
    throw new Error('Refusing to adopt a non-empty unowned browser profile. Choose a new dedicated CHATGPT_HOST_PROFILE path.');
  }
  fs.mkdirSync(PROFILE_PATH, { recursive: true });
  const created = {
    purpose: 'Chat Dev Persistent ChatGPT Host PoC',
    profile_path: PROFILE_PATH,
    created_at: new Date().toISOString(),
    contains_credentials: true,
    commit_or_upload: false
  };
  atomicWrite(OWNER_PATH, created);
  return created;
}

async function discoverExistingBrowser() {
  const state = readJson(STATE_PATH);
  const profilePids = profileProcessIds();
  const statePid = Number(state?.browser_pid);
  const matchingStatePid = profilePids.includes(statePid) && processExists(statePid);

  if (profilePids.length > 0) {
    const ready = await waitFor(cdpReady, 8000);
    if (!ready) {
      throw new Error(`A browser already uses the dedicated profile, but CDP port ${CDP_PORT} is unavailable. Refusing to launch a second browser.`);
    }
    return { pid: matchingStatePid ? statePid : profilePids[0], reused: true, state };
  }

  if (await cdpReady() || await tcpPortOpen()) {
    throw new Error(`Port ${CDP_PORT} is already in use by an unknown process. Refusing to attach or launch.`);
  }
  return null;
}

async function ensureBrowserStarted() {
  assertSafePaths();
  ensureDedicatedProfile();
  const existing = await discoverExistingBrowser();
  if (existing) {
    const next = {
      ...(existing.state || {}),
      browser_pid: existing.pid,
      profile_path: PROFILE_PATH,
      cdp_port: CDP_PORT,
      last_reused_at: new Date().toISOString()
    };
    atomicWrite(STATE_PATH, next);
    return { ...existing, executable: next.browser_executable || null };
  }

  const executable = findBrowserExecutable();
  const child = spawn(executable, [
    `--user-data-dir=${PROFILE_PATH}`,
    '--remote-debugging-address=127.0.0.1',
    `--remote-debugging-port=${CDP_PORT}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--new-window',
    CHATGPT_URL
  ], { detached: true, stdio: 'ignore', windowsHide: false });
  child.unref();

  const state = {
    browser_pid: child.pid,
    browser_executable: executable,
    browser_family: path.basename(executable).toLowerCase().startsWith('msedge') ? 'edge' : 'chrome',
    profile_path: PROFILE_PATH,
    cdp_port: CDP_PORT,
    started_at: new Date().toISOString()
  };
  atomicWrite(STATE_PATH, state);

  if (!await waitFor(cdpReady, 30000, 500)) {
    throw new Error('Browser was launched but its local controller endpoint did not become ready.');
  }
  const actualPids = profileProcessIds();
  if (actualPids.length > 0 && !actualPids.includes(state.browser_pid)) {
    state.browser_pid = actualPids[0];
    atomicWrite(STATE_PATH, state);
  }
  return { pid: state.browser_pid, reused: false, executable };
}

async function connectBrowser() {
  if (!await cdpReady()) throw new Error('Persistent browser is not running.');
  const browser = await chromium.connectOverCDP(CDP_BASE);
  const context = browser.contexts()[0];
  if (!context) throw new Error('Persistent browser has no default context.');
  return { browser, context };
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

async function authenticationState(page) {
  if (!page || !page.url().includes('chatgpt.com')) return 'NOT_ON_CHATGPT';
  const login = await firstVisible(page, [
    'button:has-text("Log in")', 'a:has-text("Log in")',
    'button:has-text("登入")', 'a:has-text("登入")',
    'button:has-text("Sign up")', 'a:has-text("Sign up")',
    'button:has-text("註冊")', 'a:has-text("註冊")'
  ]);
  if (login) return 'LOGIN_REQUIRED';
  const profile = await firstVisible(page, [
    '[data-testid="profile-button"]',
    '[data-testid="accounts-profile-button"]',
    'button[data-testid*="profile"]',
    'button[aria-label*="Profile"]',
    'button[aria-label*="Account"]',
    'button[aria-label*="帳戶"]',
    'button[aria-label*="個人"]'
  ]);
  const composer = await firstVisible(page, [
    '#prompt-textarea',
    '[data-testid="prompt-textarea"]',
    'div[contenteditable="true"][role="textbox"]'
  ]);
  return profile && composer ? 'AUTHENTICATED' : 'UNKNOWN';
}

async function chatPage(context, { create = false } = {}) {
  if (create) {
    const page = await context.newPage();
    await page.goto(CHATGPT_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    return page;
  }
  let page = context.pages().find(candidate => candidate.url().includes('chatgpt.com'));
  if (!page) {
    page = await context.newPage();
    await page.goto(CHATGPT_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }
  return page;
}

async function reportStatus() {
  assertSafePaths();
  const profilePids = profileProcessIds();
  if (profilePids.length === 0 || !await cdpReady()) {
    jsonOut({ status: 'STOPPED', profile_path: PROFILE_PATH, profile_exists: fs.existsSync(PROFILE_PATH) });
    return 3;
  }
  const { context } = await connectBrowser();
  const page = context.pages().find(candidate => candidate.url().includes('chatgpt.com')) || null;
  const auth = await authenticationState(page);
  jsonOut({
    status: 'RUNNING',
    browser_pid: profilePids[0],
    profile_path: PROFILE_PATH,
    authentication: auth,
    ordinary_chat_surface: !!page && !/\/(?:work|codex)(?:\/|$)/i.test(new URL(page.url()).pathname)
  });
  return auth === 'AUTHENTICATED' ? 0 : 4;
}

async function openChat() {
  const started = await ensureBrowserStarted();
  const { context } = await connectBrowser();
  const page = await chatPage(context);
  await page.bringToFront();
  jsonOut({
    status: started.reused ? 'REUSED_EXISTING_BROWSER' : 'STARTED_NEW_BROWSER',
    browser_pid: started.pid,
    profile_path: PROFILE_PATH,
    authentication: await authenticationState(page)
  });
  return 0;
}

async function sendFixedPrompt() {
  const started = await ensureBrowserStarted();
  const { context } = await connectBrowser();
  const page = await chatPage(context, { create: true });
  await page.bringToFront();

  const auth = await authenticationState(page);
  if (auth !== 'AUTHENTICATED') {
    throw new Error(`ChatGPT session is not authenticated (state: ${auth}). Complete manual login first.`);
  }
  if (/\/(?:work|codex)(?:\/|$)/i.test(new URL(page.url()).pathname)) {
    throw new Error('Refusing to submit on a Work/Codex surface.');
  }

  const composer = await firstVisible(page, [
    '#prompt-textarea',
    '[data-testid="prompt-textarea"]',
    'div[contenteditable="true"][role="textbox"]'
  ]);
  if (!composer) throw new Error('Ordinary ChatGPT composer was not found.');

  await composer.click();
  try {
    await composer.fill(FIXED_PROMPT);
  } catch {
    await page.keyboard.insertText(FIXED_PROMPT);
  }
  const send = await firstVisible(page, [
    'button[data-testid="send-button"]',
    'button[aria-label="Send prompt"]',
    'button[aria-label="Send message"]',
    'button[aria-label*="傳送"]'
  ]);
  if (send) await send.click();
  else await composer.press('Enter');

  await page.waitForURL(/\/c\/[0-9a-f-]{20,}/i, { timeout: 60000 }).catch(() => {});
  const conversationCreated = /\/c\/[0-9a-f-]{20,}/i.test(new URL(page.url()).pathname);
  const promptVisible = await page.getByText(FIXED_PROMPT, { exact: true }).count().then(count => count > 0).catch(() => false);
  const result = {
    status: conversationCreated && promptVisible ? 'PASS' : 'FAIL',
    tested_at: new Date().toISOString(),
    browser_reused: started.reused,
    ordinary_conversation_created: conversationCreated,
    fixed_prompt_submitted: promptVisible,
    assistant_output_accessed: false,
    profile_path: PROFILE_PATH
  };
  atomicWrite(RESULT_PATH, result);
  jsonOut(result);
  return result.status === 'PASS' ? 0 : 5;
}

async function stopBrowser() {
  assertSafePaths();
  const pids = profileProcessIds();
  if (pids.length === 0) {
    jsonOut({ status: 'ALREADY_STOPPED', profile_path: PROFILE_PATH });
    return 0;
  }
  if (await cdpReady()) {
    const { browser } = await connectBrowser();
    const session = await browser.newBrowserCDPSession();
    await session.send('Browser.close');
  }
  const stopped = await waitFor(() => Promise.resolve(profileProcessIds().length === 0), 15000, 500);
  if (!stopped) throw new Error('Browser did not close within 15 seconds.');
  const state = readJson(STATE_PATH) || {};
  atomicWrite(STATE_PATH, { ...state, browser_pid: null, stopped_at: new Date().toISOString() });
  jsonOut({ status: 'STOPPED', profile_path: PROFILE_PATH, profile_preserved: true });
  return 0;
}

async function createCheckpoint() {
  assertSafePaths();
  ensureDedicatedProfile();
  const current = readJson(STATE_PATH) || {};
  const checkpoint = {
    ...current,
    profile_path: PROFILE_PATH,
    checkpoint_at: new Date().toISOString(),
    resume_command: '.\\ordinary-chat-poc3b\\resume-after-reboot.ps1',
    secrets_in_checkpoint: false
  };
  atomicWrite(STATE_PATH, checkpoint);
  jsonOut({ status: 'CHECKPOINT_READY', profile_path: PROFILE_PATH, checkpoint_path: STATE_PATH, secrets_in_checkpoint: false });
  return 0;
}

async function main() {
  if (process.platform !== 'win32') throw new Error('Persistent ChatGPT Host PoC is intentionally Windows-only.');
  if (!VALID_ACTIONS.has(ACTION)) throw new Error(`Unknown action: ${ACTION}`);
  assertSafePaths();
  if (ACTION === 'status') return reportStatus();
  return withControllerLock(async () => {
    if (ACTION === 'start' || ACTION === 'open') return openChat();
    if (ACTION === 'send-test') return sendFixedPrompt();
    if (ACTION === 'stop') return stopBrowser();
    if (ACTION === 'checkpoint') return createCheckpoint();
    return 1;
  });
}

main()
  .then(code => setTimeout(() => process.exit(code), 50))
  .catch(error => {
    jsonOut({ status: 'ERROR', error: error.message, profile_path: PROFILE_PATH });
    setTimeout(() => process.exit(1), 50);
  });

