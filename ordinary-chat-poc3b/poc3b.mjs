import { chromium } from 'playwright-core';
import fs from 'node:fs';

const PROMPT = 'Return exactly: ORDINARY_CHAT_WORKER_001';
const EXPECTED = 'ORDINARY_CHAT_WORKER_001';
const CDP = process.env.CDP_URL || 'http://127.0.0.1:9222';

const sleep = ms => new Promise(r => setTimeout(r, ms));
const pathOnly = u => { try { const x = new URL(u); return `${x.host}${x.pathname}`; } catch { return String(u); } };
const cid = u => u.match(/\/c\/([0-9a-f-]{20,})/i)?.[1] || null;

async function visible(page, sels) {
  for (const s of sels) {
    const loc = page.locator(s).first();
    try { if (await loc.count() && await loc.isVisible()) return loc; } catch {}
  }
  return null;
}
async function loggedIn(page) {
  if (!page?.url().includes('chatgpt.com')) return false;
  const login = await visible(page, [
    'button:has-text("Log in")','a:has-text("Log in")','button:has-text("登入")','a:has-text("登入")',
    'button:has-text("Sign up")','a:has-text("Sign up")','button:has-text("註冊")','a:has-text("註冊")'
  ]);
  if (login) return false;
  const profile = await visible(page, [
    '[data-testid="profile-button"]','[data-testid="accounts-profile-button"]','button[data-testid*="profile"]',
    'button[aria-label*="Profile"]','button[aria-label*="Account"]','button[aria-label*="帳戶"]','button[aria-label*="個人"]'
  ]);
  if (profile) return true;
  const historyCount = await page.locator('a[href^="/c/"]').count().catch(() => 0);
  return historyCount > 0;
}
async function lastAssistant(page) {
  const loc = page.locator('[data-message-author-role="assistant"]');
  try { const n = await loc.count(); return n ? (await loc.nth(n - 1).innerText()).trim() : ''; } catch { return ''; }
}
async function waitStableAnswer(page, timeout = 180000) {
  const start = Date.now(); let last = '', stable = 0;
  while (Date.now() - start < timeout) {
    const stop = await visible(page, ['button[data-testid="stop-button"]','button[aria-label*="Stop"]','button[aria-label*="停止"]']);
    const t = await lastAssistant(page);
    if (t && t === last && !stop) stable++; else stable = 0;
    if (t) last = t;
    if (last && stable >= 3) return last;
    await sleep(1000);
  }
  return last;
}

const browser = await chromium.connectOverCDP(CDP);
const context = browser.contexts()[0];
let page = context.pages().find(p => p.url().includes('chatgpt.com')) || context.pages().at(-1) || await context.newPage();
const posts = [];
const attach = p => p.on('request', r => {
  if (r.method() === 'POST' && r.url().startsWith('https://chatgpt.com') && posts.length < 150) posts.push(pathOnly(r.url()));
});
context.pages().forEach(attach);
context.on('page', attach);

if (!context.pages().some(p => p.url().includes('chatgpt.com'))) await page.goto('https://chatgpt.com/', {waitUntil:'domcontentloaded', timeout:45000}).catch(()=>{});
console.log('WAITING_FOR_AUTHENTICATED_CHATGPT_UI');

let composer = null;
let authenticated = false;
for (let i=0;i<720;i++) {
  page = context.pages().find(p => p.url().includes('chatgpt.com')) || context.pages().at(-1) || page;
  if (page?.url().includes('chatgpt.com')) {
    authenticated = await loggedIn(page);
    if (authenticated) {
      if (/\/work(?:\/|$)|\/codex(?:\/|$)/i.test(new URL(page.url()).pathname)) {
        await page.goto('https://chatgpt.com/', {waitUntil:'domcontentloaded', timeout:45000}).catch(()=>{});
      }
      composer = await visible(page, ['#prompt-textarea','[data-testid="prompt-textarea"]','div[contenteditable="true"][role="textbox"]']);
      if (composer) break;
    }
  }
  if (i % 10 === 0) console.log(`AUTH_WAIT ${i}s url=${page?.url() || ''} authenticated=${authenticated}`);
  await sleep(1000);
}

if (!composer || !authenticated) {
  const result = {status:'FAIL', reason:'AUTH_LOGIN_TIMEOUT_OR_BOT_GATE', current_url:page?.url() || null, title:await page?.title().catch(()=>''), openai_api_token_used:false};
  fs.writeFileSync('poc3b-result.json', JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
  process.exit(2);
}

console.log('AUTHENTICATED_ORDINARY_CHAT_DETECTED_SENDING_FIXED_PROMPT');
await composer.click();
try { await composer.fill(PROMPT); } catch { await page.keyboard.insertText(PROMPT); }
const send = await visible(page, ['button[data-testid="send-button"]','button[aria-label="Send prompt"]','button[aria-label="Send message"]','button[aria-label*="傳送"]']);
if (send) await send.click(); else await composer.press('Enter');
await page.waitForURL(/\/c\/[0-9a-f-]{20,}/i, {timeout:60000}).catch(()=>{});
const answer = (await waitStableAnswer(page)).trim();
const conversation_url = page.url();
const conversation_id = cid(conversation_url);
let history_link_seen = false;
if (conversation_id) {
  for (let i=0;i<15 && !history_link_seen;i++) {
    history_link_seen = await page.locator(`a[href^="/c/${conversation_id}"]`).count().then(n=>n>0).catch(()=>false);
    if (!history_link_seen) await sleep(1000);
  }
}
const codex_endpoint_seen = posts.some(p => /\/backend-api\/codex(?:\/|$)|\/codex\/responses(?:\/|$)/i.test(p));
const work_endpoint_seen = posts.some(p => /\/(?:workspace-agent|agentic|work)\/(?:responses|conversation|runs?)(?:\/|$)/i.test(p));
const ordinary_conversation_post_seen = posts.some(p => /\/conversation(?:\/|$)/i.test(p) && !/codex|workspace-agent|agentic/i.test(p));
const exact_answer = answer === EXPECTED;
const ordinary_chat_url = !!conversation_id && /^https:\/\/chatgpt\.com\/c\//i.test(conversation_url);
const status = exact_answer && ordinary_chat_url && history_link_seen && !codex_endpoint_seen && !work_endpoint_seen
  ? 'TECHNICAL_PASS_POOL_UNVERIFIED' : 'FAIL';
const result = {
  status, prompt:PROMPT, answer, expected:EXPECTED, exact_answer,
  conversation_id, conversation_url, ordinary_chat_url, history_link_seen,
  evidence:{ordinary_conversation_post_seen,codex_endpoint_seen,work_endpoint_seen,chatgpt_post_paths:posts},
  pool_verification:'UNVERIFIED', openai_api_token_used:false, codex_or_work_used_as_orchestrator:false
};
fs.writeFileSync('poc3b-result.json', JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
await browser.close().catch(()=>{});
