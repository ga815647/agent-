import { acquire, connect, limits } from "@cloudflare/playwright";

const PROMPT = "Return exactly: ORDINARY_CHAT_WORKER_001";
const EXPECTED = "ORDINARY_CHAT_WORKER_001";
const KEEP_ALIVE = 600000;

const J = (x, status = 200) => new Response(JSON.stringify(x, null, 2), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});
const auth = (r, e) => e.ADMIN_TOKEN && r.headers.get("authorization") === `Bearer ${e.ADMIN_TOKEN}`;
const cid = (u) => u.match(/\/c\/([0-9a-f-]{20,})/i)?.[1] || null;
const pathOnly = (u) => { try { const x = new URL(u); return `${x.host}${x.pathname}`; } catch { return String(u); } };

export class HandoffStore {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; }
  async fetch(request) {
    const u = new URL(request.url);
    if (request.method === "POST" && u.pathname === "/publish") {
      const h = await request.json();
      await this.ctx.storage.put("handoff", h);
      return J({ ok:true, stored:true, run_id:h.run_id || null });
    }
    if (request.method === "POST" && u.pathname === "/clear") {
      await this.ctx.storage.delete("handoff");
      return J({ ok:true, cleared:true });
    }
    if (request.method === "GET" && u.pathname === "/current") {
      let h = await this.ctx.storage.get("handoff");
      if (h?.expires_at && Date.now() > h.expires_at) {
        await this.ctx.storage.delete("handoff");
        h = null;
      }
      return J({ ok:!!h, handoff:h || null });
    }
    return J({ok:false,error:"NOT_FOUND"},404);
  }
}

function handoffStub(env) {
  const id = env.HANDOFF.idFromName("ordinary-chat-poc3b-current");
  return env.HANDOFF.get(id);
}

async function visible(page, selectors) {
  for (const s of selectors) {
    const x = page.locator(s).first();
    try { if (await x.count() && await x.isVisible()) return x; } catch {}
  }
  return null;
}
async function assistantText(page) {
  const x = page.locator('[data-message-author-role="assistant"]');
  try { const n = await x.count(); return n ? (await x.nth(n - 1).innerText()).trim() : ""; } catch { return ""; }
}
async function finish(page, ms = 150000) {
  const start = Date.now(); let last = "", stable = 0;
  while (Date.now() - start < ms) {
    const stop = await visible(page, ['button[data-testid="stop-button"]','button[aria-label*="Stop"]','button[aria-label*="停止"]']);
    const t = await assistantText(page);
    stable = t && t === last && !stop ? stable + 1 : 0;
    if (t) last = t;
    if (last && stable >= 3) return last;
    await page.waitForTimeout(1000);
  }
  return last;
}
async function liveView(page) {
  const cdp = await page.context().newCDPSession(page);
  const { devtoolsFrontendUrl } = await cdp.send("Cloudflare.getLiveView", { mode: "tab", expiresInMs: KEEP_ALIVE });
  await cdp.detach().catch(() => {});
  return devtoolsFrontendUrl;
}
async function session(env, sessionId) {
  const browser = await connect(env.BROWSER, { sessionId, persistent: true });
  const context = browser.contexts()[0] || await browser.newContext();
  const page = context.pages()[0] || await context.newPage();
  return { browser, context, page };
}

async function startLogin(env) {
  const { sessionId } = await acquire(env.BROWSER, { keep_alive: KEEP_ALIVE });
  const { browser, page } = await session(env, sessionId);
  let navigation_error = null;
  try { await page.goto("https://chatgpt.com/", { waitUntil: "domcontentloaded", timeout: 45000 }); }
  catch (e) { navigation_error = String(e?.message || e); }
  const out = {
    ok: true,
    status: "LOGIN_HANDOFF_READY",
    session_id: sessionId,
    live_view_url: await liveView(page),
    current_url: page.url(),
    title: await page.title().catch(() => ""),
    navigation_error,
    instruction: "Open live_view_url, manually log into ChatGPT, stay in ordinary Chat, then run the PoC before the session idles out."
  };
  await browser.close();
  return out;
}

async function run(env, sessionId) {
  const { browser, context, page } = await session(env, sessionId);
  const posts = [];
  page.on("request", r => {
    if (r.method() === "POST" && r.url().startsWith("https://chatgpt.com") && posts.length < 100) posts.push(pathOnly(r.url()));
  });
  try { await page.goto("https://chatgpt.com/", { waitUntil: "domcontentloaded", timeout: 45000 }); }
  catch (e) { const lv = await liveView(page).catch(() => null); await browser.close(); return { ok:false,status:"NAVIGATION_FAILED",error:String(e?.message||e),live_view_url:lv }; }

  const composer = await visible(page, ["#prompt-textarea",'[data-testid="prompt-textarea"]','div[contenteditable="true"][role="textbox"]']);
  if (!composer) {
    const lv = await liveView(page).catch(() => null);
    const excerpt = (await page.locator("body").innerText().catch(() => "")).slice(0,1200);
    await browser.close();
    return { ok:false,status:"LOGIN_OR_BOT_GATE",current_url:page.url(),title:await page.title().catch(()=>""),body_excerpt:excerpt,live_view_url:lv };
  }

  await composer.click();
  try { await composer.fill(PROMPT); } catch { await page.keyboard.insertText(PROMPT); }
  const send = await visible(page, ['button[data-testid="send-button"]','button[aria-label="Send prompt"]','button[aria-label="Send message"]','button[aria-label*="傳送"]']);
  if (send) await send.click(); else await composer.press("Enter");
  await page.waitForURL(/\/c\/[0-9a-f-]{20,}/i, { timeout:60000 }).catch(()=>{});

  const answer = (await finish(page)).trim();
  const conversation_url = page.url();
  const conversation_id = cid(conversation_url);
  let history_link_seen = false;
  if (conversation_id) {
    for (let i=0;i<6 && !history_link_seen;i++) {
      history_link_seen = await page.locator(`a[href^="/c/${conversation_id}"]`).count().then(n=>n>0).catch(()=>false);
      if (!history_link_seen) await page.waitForTimeout(1000);
    }
  }

  const codex_endpoint_seen = posts.some(p => /\/backend-api\/codex(?:\/|$)|\/codex\/responses(?:\/|$)/i.test(p));
  const work_endpoint_seen = posts.some(p => /\/(?:workspace-agent|agentic|work)\/(?:responses|conversation|runs?)(?:\/|$)/i.test(p));
  const ordinary_conversation_post_seen = posts.some(p => /\/conversation(?:\/|$)/i.test(p) && !/codex|workspace-agent|agentic/i.test(p));
  const exact_answer = answer === EXPECTED;
  const ordinary_chat_url = !!conversation_id && /^https:\/\/chatgpt\.com\/c\//i.test(conversation_url);
  const status = exact_answer && ordinary_chat_url && history_link_seen && !codex_endpoint_seen && !work_endpoint_seen
    ? "TECHNICAL_PASS_POOL_UNVERIFIED" : "FAIL";

  const result = {
    ok: status !== "FAIL", status, prompt:PROMPT, answer, expected:EXPECTED, exact_answer,
    conversation_id, conversation_url, ordinary_chat_url, history_link_seen,
    evidence:{ ordinary_conversation_post_seen, codex_endpoint_seen, work_endpoint_seen, chatgpt_post_paths:posts },
    pool_verification:"UNVERIFIED", openai_api_token_used:false, codex_or_work_used_as_orchestrator:false
  };
  try {
    const cdp = await context.newCDPSession(page);
    await cdp.send("Browser.close");
  } catch { await browser.close().catch(()=>{}); }
  return result;
}

function handoffPanel() { return `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>PoC-3B Protected Handoff</title>
<style>body{font-family:system-ui;max-width:760px;margin:28px auto;padding:0 16px}input{width:100%;padding:12px;box-sizing:border-box}button{padding:11px;margin:10px 0}pre{white-space:pre-wrap;background:#eee;padding:12px;border-radius:8px}a{word-break:break-all;font-size:18px}</style>
<h2>PoC-3B Protected Handoff</h2><p>Enter POC3A_ADMIN_TOKEN. Tunnel credentials are never written to the public GitHub repository.</p>
<input id=t type=password placeholder="POC3A_ADMIN_TOKEN"><button id=b>Load current handoff</button><div id=v></div><pre id=o>Waiting</pre>
<script>const o=document.querySelector('#o'),v=document.querySelector('#v');b.onclick=async()=>{const r=await fetch('/api/handoff/current',{headers:{authorization:'Bearer '+t.value}});const j=await r.json();if(!j.ok){o.textContent=JSON.stringify(j,null,2);v.innerHTML='';return}const h=j.handoff;o.textContent='Run: '+h.run_id+'\nBasic user: '+h.basic_user+'\nBasic password: '+h.basic_pass+'\nVNC password: '+h.vnc_pass+'\nExpires: '+new Date(h.expires_at).toLocaleString();v.innerHTML='<p><a target=_blank rel=noopener href="'+h.novnc_url+'">Open protected remote Chrome</a></p>'}</script>`; }

function panel() { return `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>PoC-3A</title>
<style>body{font-family:system-ui;max-width:800px;margin:30px auto;padding:0 16px}input{width:100%;padding:10px;box-sizing:border-box}button{padding:10px;margin:8px 5px 8px 0}pre{white-space:pre-wrap;background:#eee;padding:12px}a{word-break:break-all}</style>
<h2>Ordinary ChatGPT Worker PoC-3A</h2><p>Cloudflare Browser Run only. No OpenAI API token.</p>
<p><a href="/handoff">PoC-3B protected handoff</a></p>
<input id=t type=password placeholder="POC3A_ADMIN_TOKEN"><br><button id=s>1 Start login</button><button id=r disabled>2 Run test</button><button id=l>Limits</button><p id=v></p><pre id=o>Ready</pre>
<script>let sid;const o=document.querySelector('#o'),v=document.querySelector('#v'),r=document.querySelector('#r');
async function call(p,b={}){const x=await fetch(p,{method:'POST',headers:{authorization:'Bearer '+document.querySelector('#t').value,'content-type':'application/json'},body:JSON.stringify(b)});const j=await x.json();o.textContent=JSON.stringify(j,null,2);return j}
s.onclick=async()=>{const j=await call('/api/login/start');if(j.session_id){sid=j.session_id;r.disabled=false;v.innerHTML='<a target=_blank href="'+j.live_view_url+'">Open Live View</a>'}};
r.onclick=async()=>{r.disabled=true;const j=await call('/api/run',{session_id:sid});if(j.conversation_url)v.innerHTML='<a target=_blank href="'+j.conversation_url+'">Open conversation</a>'};l.onclick=()=>call('/api/limits');</script>`; }

export default { async fetch(request, env) {
  const u = new URL(request.url);
  if (request.method === "GET" && u.pathname === "/") return new Response(panel(), { headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"} });
  if (request.method === "GET" && u.pathname === "/handoff") return new Response(handoffPanel(), { headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"} });
  if (request.method === "GET" && u.pathname === "/health") return J({ok:true,service:"ordinary-chat-poc3a"});
  if (u.pathname.startsWith("/api/") && !auth(request,env)) return J({ok:false,error:"UNAUTHORIZED"},401);

  if (u.pathname === "/api/handoff/current" && request.method === "GET") return handoffStub(env).fetch("https://handoff/current");
  if (u.pathname === "/api/handoff/publish" && request.method === "POST") {
    const body = await request.text();
    return handoffStub(env).fetch("https://handoff/publish", {method:"POST",headers:{"content-type":"application/json"},body});
  }
  if (u.pathname === "/api/handoff/clear" && request.method === "POST") return handoffStub(env).fetch("https://handoff/clear", {method:"POST"});

  if (request.method === "POST" && u.pathname === "/api/limits") return J({ok:true,limits:await limits(env.BROWSER)});
  if (request.method === "POST" && u.pathname === "/api/login/start") try { return J(await startLogin(env)); } catch(e) { return J({ok:false,status:"START_FAILED",error:String(e?.stack||e)},500); }
  if (request.method === "POST" && u.pathname === "/api/run") {
    let b={}; try { b=await request.json(); } catch {}
    if (!b.session_id) return J({ok:false,error:"session_id required"},400);
    try { return J(await run(env,b.session_id)); } catch(e) { return J({ok:false,status:"RUN_FAILED",error:String(e?.stack||e)},500); }
  }
  return J({ok:false,error:"NOT_FOUND"},404);
}};
