import { chromium } from 'playwright-core';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  buildRateLimitBlockedState,
  classifyRateLimitCopy,
  cooldownDecision,
  createRateLimitTracker,
  DEFAULT_RATE_LIMIT_COOLDOWN_MS,
  handleSoftRateLimitNotice,
  isRateLimitDismissLabel
} from './rate-limit-policy.mjs';

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
const CONFIG_PATH = path.join(HOST_ROOT, 'host-config.json');
const RATE_LIMIT_STATE_PATH = path.join(HOST_ROOT, 'rate-limit-state.json');
const OWNER_PATH = path.join(HOST_ROOT, 'profile-owner.json');
const LOCK_PATH = path.join(HOST_ROOT, 'controller.lock');
const RATE_LIMIT_COOLDOWN_MS = Number(process.env.CHATGPT_HOST_RATE_LIMIT_COOLDOWN_MS || DEFAULT_RATE_LIMIT_COOLDOWN_MS);
const ACTION = process.argv[2] || 'status';
const VALID_ACTIONS = new Set(['start', 'open', 'status', 'stop', 'send-test', 'dispatch', 'checkpoint', 'set-worker-project']);

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
  if (!Number.isInteger(RATE_LIMIT_COOLDOWN_MS) || RATE_LIMIT_COOLDOWN_MS < 60000 || RATE_LIMIT_COOLDOWN_MS > 3600000) {
    throw new Error('CHATGPT_HOST_RATE_LIMIT_COOLDOWN_MS must be an integer from 60000 to 3600000.');
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

function readRateLimitState() {
  if (!fs.existsSync(RATE_LIMIT_STATE_PATH)) return null;
  let state;
  try {
    state = JSON.parse(fs.readFileSync(RATE_LIMIT_STATE_PATH, 'utf8'));
  } catch {
    throw new Error('Rate-limit state exists but is not valid JSON.');
  }
  cooldownDecision(state);
  return state;
}

function currentCooldown() {
  const state = readRateLimitState();
  return { state, decision: cooldownDecision(state) };
}

function validateWorkerProjectUrl(value) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('worker_project_url must be a non-empty string.');
  }

  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    throw new Error('worker_project_url is not a valid URL.');
  }

  if (parsed.protocol !== 'https:' || parsed.hostname !== 'chatgpt.com' || parsed.port || parsed.username || parsed.password) {
    throw new Error('worker_project_url must use HTTPS on exactly chatgpt.com with no credentials or custom port.');
  }
  if (parsed.search || parsed.hash) {
    throw new Error('worker_project_url must not contain a query string or fragment.');
  }
  if (!/^\/g\/g-p-[a-z0-9-]+\/project\/?$/i.test(parsed.pathname)) {
    throw new Error('worker_project_url must use the expected /g/g-p-.../project path.');
  }
  return parsed.href;
}

function readWorkerConfig({ required = false } = {}) {
  if (!fs.existsSync(CONFIG_PATH)) {
    if (required) throw new Error(`Worker project config is missing: ${CONFIG_PATH}`);
    return null;
  }

  let config;
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch {
    throw new Error('Worker project config exists but is not valid JSON.');
  }
  if (!config || Array.isArray(config) || typeof config !== 'object') {
    throw new Error('Worker project config must be a JSON object.');
  }
  return {
    workerProjectUrl: validateWorkerProjectUrl(config.worker_project_url)
  };
}

function configureWorkerProject() {
  const workerProjectUrl = validateWorkerProjectUrl(process.env.CHATGPT_HOST_WORKER_PROJECT_URL);
  atomicWrite(CONFIG_PATH, { worker_project_url: workerProjectUrl });
  jsonOut({ status: 'CONFIGURED', config_path: CONFIG_PATH, worker_project_target: 'PRIVATE_CHATGPT_PROJECT' });
  return 0;
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

const COMPOSER_SELECTORS = [
  '#prompt-textarea',
  '[data-testid="prompt-textarea"]',
  'div[contenteditable="true"][role="textbox"]'
];

async function usableComposer(page) {
  const composer = await firstVisible(page, COMPOSER_SELECTORS);
  if (!composer) return null;
  try {
    if (!await composer.isEnabled()) return null;
    if (await composer.getAttribute('aria-disabled') === 'true') return null;
    return composer;
  } catch {
    return null;
  }
}

async function detectRateLimitModal(page) {
  for (const selector of ['[role="alertdialog"]', '[role="dialog"]', '[aria-modal="true"]']) {
    const candidates = page.locator(selector);
    const count = await candidates.count().catch(() => 0);
    for (let index = 0; index < Math.min(count, 12); index += 1) {
      const modal = candidates.nth(index);
      if (!await modal.isVisible().catch(() => false)) continue;
      const modalText = await modal.innerText().catch(() => '');
      const locale = classifyRateLimitCopy(modalText.slice(0, 4000));
      if (!locale) continue;

      const buttons = modal.getByRole('button');
      const buttonCount = await buttons.count().catch(() => 0);
      let dismissButton = null;
      for (let buttonIndex = 0; buttonIndex < Math.min(buttonCount, 12); buttonIndex += 1) {
        const button = buttons.nth(buttonIndex);
        const label = await button.innerText().catch(() => '');
        if (isRateLimitDismissLabel(label) && await button.isVisible().catch(() => false)) {
          dismissButton = button;
          break;
        }
      }
      return { modal, dismissButton, dismissible: !!dismissButton, locale };
    }
  }
  return null;
}

async function firstPageWithRateLimit(context) {
  for (const page of context.pages().filter(candidate => candidate.url().includes('chatgpt.com'))) {
    const notice = await detectRateLimitModal(page);
    if (notice) return { page, notice };
  }
  return null;
}

function rateLimitAdapter(page, { deadline = Date.now() + 7000, progressProbe = () => usableComposer(page) } = {}) {
  return {
    detect: () => detectRateLimitModal(page),
    dismiss: async notice => notice.dismissButton.click(),
    waitForRecovery: async notice => {
      const hideTimeout = Math.max(1, Math.min(3000, deadline - Date.now()));
      await notice.modal.waitFor({ state: 'hidden', timeout: hideTimeout }).catch(() => {});
      if (await notice.modal.isVisible().catch(() => false)) {
        return { recovered: false, persistentModal: true };
      }
      const recoveryDeadline = Math.min(deadline, Date.now() + 7000);
      while (Date.now() < recoveryDeadline) {
        const nextNotice = await detectRateLimitModal(page);
        if (nextNotice) return { recovered: false, nextNotice };
        if (await progressProbe()) return { recovered: true };
        await new Promise(resolve => setTimeout(resolve, 250));
      }
      return { recovered: false };
    }
  };
}

class RateLimitBlockedError extends Error {
  constructor(reason) {
    super(reason);
    this.name = 'RateLimitBlockedError';
    this.reason = reason;
  }
}

async function resolveSoftRateLimit(page, tracker, initialNotice = null, options = {}) {
  const outcome = await handleSoftRateLimitNotice(tracker, rateLimitAdapter(page, options), initialNotice);
  if (outcome.kind === 'BLOCKED') throw new RateLimitBlockedError(outcome.reason);
  return outcome;
}

async function waitForComposerWithRateLimit(page, tracker, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const freshAuth = await authenticationState(page);
    if (freshAuth === 'LOGIN_REQUIRED') {
      throw new Error('Fresh ChatGPT page unexpectedly requires login.');
    }
    const notice = await detectRateLimitModal(page);
    if (notice) {
      await resolveSoftRateLimit(page, tracker, notice, { deadline });
    }
    const composer = await usableComposer(page);
    if (composer) return composer;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  return null;
}

async function waitForAuthenticationWithRateLimit(page, tracker, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  let auth = 'UNKNOWN';
  while (Date.now() < deadline) {
    const notice = await detectRateLimitModal(page);
    if (notice) await resolveSoftRateLimit(page, tracker, notice, { deadline });
    auth = await authenticationState(page);
    if (auth === 'AUTHENTICATED' || auth === 'LOGIN_REQUIRED') return auth;
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  return auth;
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
  const profile = await accountProfile(page);
  const composer = await usableComposer(page);
  return profile && composer ? 'AUTHENTICATED' : 'UNKNOWN';
}

async function accountProfile(page) {
  return firstVisible(page, [
    '[data-testid="profile-button"]',
    '[data-testid="accounts-profile-button"]',
    'button[data-testid*="profile"]',
    'button[aria-label*="Profile"]',
    'button[aria-label*="Account"]',
    'button[aria-label*="帳戶"]',
    'button[aria-label*="個人"]'
  ]);
}

async function chatPage(context, { create = false, targetUrl = CHATGPT_URL } = {}) {
  if (create) {
    const page = await context.newPage();
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
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
  const cooldown = currentCooldown();
  let workerConfig = null;
  let workerConfigError = null;
  try {
    workerConfig = readWorkerConfig();
  } catch (error) {
    workerConfigError = error.message;
  }
  const workerProjectStatus = workerConfigError ? 'INVALID' : (workerConfig ? 'CONFIGURED' : 'NOT_CONFIGURED');
  const profilePids = profileProcessIds();
  if (profilePids.length === 0 || !await cdpReady()) {
    jsonOut({
      status: 'STOPPED',
      profile_path: PROFILE_PATH,
      profile_exists: fs.existsSync(PROFILE_PATH),
      worker_project_config: workerProjectStatus,
      rate_limit_cooldown: cooldown.decision.status,
      retry_allowed_now: cooldown.decision.retryAllowedNow,
      ...(workerConfigError ? { worker_project_config_error: workerConfigError } : {})
    });
    return workerConfigError ? 6 : 3;
  }
  const { context } = await connectBrowser();
  const page = context.pages().find(candidate => candidate.url().includes('chatgpt.com')) || null;
  const auth = await authenticationState(page);
  const visibleRateLimit = !!await firstPageWithRateLimit(context);
  jsonOut({
    status: 'RUNNING',
    browser_pid: profilePids[0],
    profile_path: PROFILE_PATH,
    authentication: auth,
    worker_project_config: workerProjectStatus,
    rate_limit_notice_visible: visibleRateLimit,
    rate_limit_cooldown: cooldown.decision.status,
    retry_allowed_now: cooldown.decision.retryAllowedNow,
    ...(cooldown.decision.status === 'ACTIVE' ? { retry_after_seconds: cooldown.decision.retryAfterSeconds } : {}),
    ...(workerConfigError ? { worker_project_config_error: workerConfigError } : {}),
    ordinary_chat_surface: !!page && !/\/(?:work|codex)(?:\/|$)/i.test(new URL(page.url()).pathname)
  });
  if (workerConfigError) return 6;
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

function issueDispatchPrompt() {
  const prompt = process.env.SUBCHAT_HOST_PROMPT;
  if (!prompt || !prompt.trim()) throw new Error('SUBCHAT_HOST_PROMPT is empty.');
  if (Buffer.byteLength(prompt, 'utf8') > 60000) throw new Error('SUBCHAT_HOST_PROMPT exceeds the 60 KB PoC limit.');
  return prompt.trim();
}

function projectRoute(workerProjectUrl) {
  const pathname = new URL(workerProjectUrl).pathname.replace(/\/$/, '');
  return pathname.slice(0, -'/project'.length);
}

function rateLimitResultFields(tracker) {
  return {
    rate_limit_notice_seen: tracker.noticeSeen,
    rate_limit_notice_count: tracker.noticeCount || 0,
    rate_limit_dismissal_attempted: (tracker.dismissalAttempts || 0) > 0,
    rate_limit_dismissal_count: tracker.dismissalCount || 0,
    rate_limit_notice_dismissed: tracker.noticeDismissed,
    rate_limit_recovery_count: tracker.recoveryCount || 0,
    rate_limit_recovered: tracker.recovered,
    assistant_output_accessed: false
  };
}

function writeResult(result, exitCode) {
  atomicWrite(RESULT_PATH, result);
  jsonOut(result);
  return exitCode;
}

function activeCooldownResult(cooldown, { workerProject }) {
  const tracker = {
    noticeSeen: cooldown.state?.rate_limit_notice_seen === true,
    noticeCount: cooldown.state?.rate_limit_notice_count || 0,
    dismissalAttempts: cooldown.state?.rate_limit_dismissal_count || (cooldown.state?.rate_limit_dismissal_attempted === true ? 1 : 0),
    dismissalCount: cooldown.state?.rate_limit_dismissal_count || (cooldown.state?.rate_limit_notice_dismissed === true ? 1 : 0),
    noticeDismissed: cooldown.state?.rate_limit_notice_dismissed === true,
    recoveryCount: 0,
    recovered: false
  };
  return {
    status: 'RATE_LIMITED',
    tested_at: new Date().toISOString(),
    browser_reused: null,
    host_health: 'PASS',
    authentication: cooldown.state?.authentication || 'UNKNOWN',
    target_kind: workerProject ? 'PROJECT' : 'ROOT',
    project_landing_used: false,
    project_conversation_created: false,
    ordinary_conversation_created: false,
    fixed_prompt_submitted: false,
    conversation_url: null,
    ...rateLimitResultFields(tracker),
    rate_limit_recovered: false,
    cooldown_active: true,
    retry_allowed_now: false,
    retry_after_seconds: cooldown.decision.retryAfterSeconds,
    profile_path: PROFILE_PATH
  };
}

function rateLimitBlockedResult({ reason, tracker, authentication, started, workerProject, projectLandingUsed }) {
  const state = buildRateLimitBlockedState({
    cooldownMs: RATE_LIMIT_COOLDOWN_MS,
    reason,
    authentication,
    tracker
  });
  atomicWrite(RATE_LIMIT_STATE_PATH, state);
  return {
    status: 'RATE_LIMITED',
    tested_at: state.detected_at,
    browser_reused: started?.reused ?? null,
    host_health: 'PASS',
    authentication,
    target_kind: workerProject ? 'PROJECT' : 'ROOT',
    project_landing_used: projectLandingUsed,
    project_conversation_created: false,
    ordinary_conversation_created: false,
    fixed_prompt_submitted: false,
    conversation_url: null,
    ...rateLimitResultFields(tracker),
    rate_limit_recovered: false,
    cooldown_active: true,
    retry_allowed_now: false,
    retry_after_seconds: Math.ceil(RATE_LIMIT_COOLDOWN_MS / 1000),
    profile_path: PROFILE_PATH
  };
}

async function conversationEvidence(page, prompt, { workerProject, expectedProjectRoute }) {
  const conversationPath = new URL(page.url()).pathname;
  const conversationCreated = workerProject
    ? conversationPath.startsWith(`${expectedProjectRoute}/c/`) && /\/c\/[0-9a-f-]{20,}/i.test(conversationPath)
    : /\/c\/[0-9a-f-]{20,}/i.test(conversationPath);
  const promptVisible = await page.getByText(prompt, { exact: true }).count().then(count => count > 0).catch(() => false);
  return { conversationCreated, promptVisible };
}

async function submitComposerWithRateLimit(page, composer, prompt, tracker, deadline) {
  let currentComposer = composer;
  while (Date.now() < deadline) {
    const notice = await detectRateLimitModal(page);
    if (notice) {
      await resolveSoftRateLimit(page, tracker, notice, { deadline });
      currentComposer = await usableComposer(page);
      if (!currentComposer) throw new RateLimitBlockedError('RATE_LIMIT_RECOVERY_TIMEOUT');
      await currentComposer.fill(prompt);
    }

    const send = await firstVisible(page, [
      'button[data-testid="send-button"]',
      'button[aria-label="Send prompt"]',
      'button[aria-label="Send message"]',
      'button[aria-label*="傳送"]'
    ]);
    try {
      if (send) await send.click();
      else await currentComposer.press('Enter');
      return;
    } catch (error) {
      const blockingNotice = await detectRateLimitModal(page);
      if (!blockingNotice) throw error;
      await resolveSoftRateLimit(page, tracker, blockingNotice, { deadline });
      currentComposer = await usableComposer(page);
      if (!currentComposer) throw new RateLimitBlockedError('RATE_LIMIT_RECOVERY_TIMEOUT');
      await currentComposer.fill(prompt);
    }
  }
  throw new RateLimitBlockedError('RATE_LIMIT_PROGRESS_DEADLINE_EXHAUSTED');
}

async function submitPrompt(prompt, { workerProject = false } = {}) {
  const cooldown = currentCooldown();
  if (cooldown.decision.status === 'ACTIVE') {
    return writeResult(activeCooldownResult(cooldown, { workerProject }), 7);
  }

  const tracker = createRateLimitTracker();
  const workerConfig = workerProject ? readWorkerConfig({ required: true }) : null;
  const targetUrl = workerConfig?.workerProjectUrl || CHATGPT_URL;
  let started = null;
  let existingAuth = 'UNKNOWN';
  let projectLandingUsed = workerProject ? false : null;
  try {
    started = await ensureBrowserStarted();
    const { context } = await connectBrowser();

    const existingNotice = await firstPageWithRateLimit(context);
    if (existingNotice) {
      if (await accountProfile(existingNotice.page)) existingAuth = 'AUTHENTICATED';
      await resolveSoftRateLimit(existingNotice.page, tracker, existingNotice.notice);
    }

    const authenticatedPage = await chatPage(context);
    existingAuth = await waitForAuthenticationWithRateLimit(authenticatedPage, tracker);
    if (existingAuth !== 'AUTHENTICATED') {
      throw new Error(`ChatGPT session is not authenticated (state: ${existingAuth}). Complete manual login first.`);
    }

    const page = await chatPage(context, { create: true, targetUrl });
    await page.bringToFront();
    if (/\/(?:work|codex)(?:\/|$)/i.test(new URL(page.url()).pathname)) {
      throw new Error('Refusing to submit on a Work/Codex surface.');
    }

    const targetPath = new URL(targetUrl).pathname.replace(/\/$/, '');
    const landingPath = new URL(page.url()).pathname.replace(/\/$/, '');
    projectLandingUsed = workerProject ? landingPath === targetPath : null;
    if (workerProject && !projectLandingUsed) {
      throw new Error('Configured worker Project landing page did not remain on the expected ChatGPT Project route.');
    }

    let composer = await waitForComposerWithRateLimit(page, tracker);
    if (!composer) throw new Error('Ordinary ChatGPT composer was not found.');

    await composer.click();
    try {
      await composer.fill(prompt);
    } catch {
      await page.keyboard.insertText(prompt);
    }

    const submissionDeadline = Date.now() + 60000;
    const preSubmissionNotice = await detectRateLimitModal(page);
    if (preSubmissionNotice) {
      await resolveSoftRateLimit(page, tracker, preSubmissionNotice, { deadline: submissionDeadline });
      composer = await usableComposer(page);
      if (!composer) throw new RateLimitBlockedError('RATE_LIMIT_RECOVERY_TIMEOUT');
      await composer.fill(prompt);
    }

    const expectedProjectRoute = workerProject ? projectRoute(targetUrl) : null;
    await submitComposerWithRateLimit(page, composer, prompt, tracker, submissionDeadline);

    let conversationCreated = false;
    let promptVisible = false;
    let postSubmissionNoticeSeen = false;
    while (Date.now() < submissionDeadline) {
      const submissionNotice = await detectRateLimitModal(page);
      if (submissionNotice) {
        postSubmissionNoticeSeen = true;
        await resolveSoftRateLimit(page, tracker, submissionNotice, {
          deadline: submissionDeadline,
          progressProbe: async () => {
            const evidence = await conversationEvidence(page, prompt, { workerProject, expectedProjectRoute });
            return (evidence.conversationCreated && evidence.promptVisible) || !!await usableComposer(page);
          }
        });
      }
      const evidence = await conversationEvidence(page, prompt, { workerProject, expectedProjectRoute });
      conversationCreated = evidence.conversationCreated;
      promptVisible = evidence.promptVisible;
      if (conversationCreated && promptVisible) break;
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    if ((!conversationCreated || !promptVisible) && postSubmissionNoticeSeen) {
      throw new RateLimitBlockedError('RATE_LIMIT_PROGRESS_DEADLINE_EXHAUSTED');
    }

    const result = {
      status: conversationCreated && promptVisible ? 'PASS' : 'FAIL',
      tested_at: new Date().toISOString(),
      browser_reused: started.reused,
      host_health: 'PASS',
      authentication: existingAuth,
      target_kind: workerProject ? 'PROJECT' : 'ROOT',
      project_landing_used: projectLandingUsed,
      project_conversation_created: workerProject ? conversationCreated : null,
      ordinary_conversation_created: conversationCreated,
      fixed_prompt_submitted: promptVisible,
      conversation_url: conversationCreated ? (workerProject ? 'PRIVATE_PROJECT_CONVERSATION' : page.url()) : null,
      ...rateLimitResultFields(tracker),
      cooldown_active: false,
      retry_allowed_now: true,
      profile_path: PROFILE_PATH
    };
    return writeResult(result, result.status === 'PASS' ? 0 : 5);
  } catch (error) {
    if (error instanceof RateLimitBlockedError) {
      return writeResult(rateLimitBlockedResult({
        reason: error.reason,
        tracker,
        authentication: existingAuth,
        started,
        workerProject,
        projectLandingUsed
      }), 7);
    }
    throw error;
  }
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
    if (ACTION === 'send-test') return submitPrompt(FIXED_PROMPT);
    if (ACTION === 'dispatch') return submitPrompt(issueDispatchPrompt(), { workerProject: true });
    if (ACTION === 'stop') return stopBrowser();
    if (ACTION === 'checkpoint') return createCheckpoint();
    if (ACTION === 'set-worker-project') return configureWorkerProject();
    return 1;
  });
}

main()
  .then(code => setTimeout(() => process.exit(code), 50))
  .catch(error => {
    jsonOut({ status: 'ERROR', error: error.message, profile_path: PROFILE_PATH });
    setTimeout(() => process.exit(1), 50);
  });
