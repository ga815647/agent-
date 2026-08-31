const J = (x, status = 200) => new Response(JSON.stringify(x, null, 2), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

const enc = new TextEncoder();
const esc = (v) => String(v ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const apiAuth = (request, env) =>
  !!env.ADMIN_TOKEN && request.headers.get("authorization") === `Bearer ${env.ADMIN_TOKEN}`;

async function cookieValue(env) {
  if (!env.ADMIN_TOKEN) return "";
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(env.ADMIN_TOKEN), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("poc3b-handoff-v1"));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, "0")).join("");
}

async function uiAuth(request, env) {
  const expected = await cookieValue(env);
  if (!expected) return false;
  const cookie = request.headers.get("cookie") || "";
  const got = cookie.split(/;\s*/).find(x => x.startsWith("poc3b_auth="))?.slice("poc3b_auth=".length) || "";
  return got === expected;
}

export class HandoffStore {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; }
  async fetch(request) {
    const u = new URL(request.url);
    if (request.method === "POST" && u.pathname === "/publish") {
      const h = await request.json();
      await this.ctx.storage.put("handoff", h);
      return J({ ok: true, stored: true, run_id: h.run_id || null });
    }
    if (request.method === "POST" && u.pathname === "/clear") {
      await this.ctx.storage.delete("handoff");
      return J({ ok: true, cleared: true });
    }
    if (request.method === "GET" && u.pathname === "/current") {
      let h = await this.ctx.storage.get("handoff");
      if (h?.expires_at && Date.now() > h.expires_at) {
        await this.ctx.storage.delete("handoff");
        h = null;
      }
      return J({ ok: !!h, handoff: h || null });
    }
    return J({ ok: false, error: "NOT_FOUND" }, 404);
  }
}

function handoffStub(env) {
  const id = env.HANDOFF.idFromName("ordinary-chat-poc3b-current");
  return env.HANDOFF.get(id);
}

function shell(inner) {
  return `<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Cache-Control" content="no-store"><title>PoC-3B Protected Handoff</title>
<style>body{font-family:system-ui;max-width:760px;margin:28px auto;padding:0 16px;line-height:1.45}input{width:100%;padding:12px;box-sizing:border-box;font-size:16px}button{padding:12px 16px;margin:10px 0;font-size:16px}.box{white-space:pre-wrap;background:#eee;padding:12px;border-radius:8px;word-break:break-word}.ok{background:#e8f5e9}.warn{background:#fff8e1}.err{background:#ffebee}a{word-break:break-all;font-size:18px}code{word-break:break-all}</style>
<h2>PoC-3B Protected Handoff</h2>${inner}`;
}

function loginPage(message = "Enter POC3A_ADMIN_TOKEN once. This browser will remember it for 1 hour.", cls = "warn") {
  return shell(`<p>After successful verification, a Secure HttpOnly cookie is used; the token is not shown again.</p>
<form method="post" action="/handoff/login" autocomplete="off"><input name="token" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="POC3A_ADMIN_TOKEN" required><button type="submit">Unlock handoff</button></form><div class="box ${esc(cls)}">${esc(message)}</div>`);
}

function noHandoffPage() {
  return shell(`<div class="box warn">Authenticated. No active handoff yet. Refresh this page in a moment.</div><p><a href="/handoff">Refresh</a></p><form method="post" action="/handoff/logout"><button type="submit">Forget this browser</button></form>`);
}

function readyPage(h) {
  const expires = h.expires_at ? new Date(h.expires_at).toLocaleString("en-US", { timeZone: "UTC" }) + " UTC" : "unknown";
  return shell(`<div class="box ok">READY
Run: ${esc(h.run_id || "unknown")}
Remote user: ${esc(h.basic_user)}
Remote password: ${esc(h.basic_pass)}
Expires: ${esc(expires)}</div>
<p><a href="${esc(h.novnc_url)}" target="_blank" rel="noopener">Open protected remote Chrome</a></p>
<p>You only need the Remote user/password once. There is no separate VNC password.</p>
<p><b>Google login:</b> prefer phone approval / passkey / QR. Do not type the Google account password into the remote browser.</p>
<form method="post" action="/handoff/logout"><button type="submit">Forget this browser</button></form>`);
}

export default {
  async fetch(request, env) {
    const u = new URL(request.url);

    if (request.method === "GET" && (u.pathname === "/" || u.pathname === "/handoff")) {
      if (!(await uiAuth(request, env))) {
        return new Response(loginPage(), { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
      }
      const r = await handoffStub(env).fetch("https://handoff/current");
      const j = await r.json();
      return new Response(j.ok && j.handoff ? readyPage(j.handoff) : noHandoffPage(), {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
      });
    }

    if (request.method === "POST" && u.pathname === "/handoff/login") {
      let token = "";
      try { token = String((await request.formData()).get("token") || "").trim(); } catch {}
      if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
        return new Response(loginPage("Unauthorized — check POC3A_ADMIN_TOKEN.", "err"), {
          status: 401, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
        });
      }
      const value = await cookieValue(env);
      return new Response(null, {
        status: 303,
        headers: {
          location: "/handoff",
          "set-cookie": `poc3b_auth=${value}; Max-Age=3600; Path=/; Secure; HttpOnly; SameSite=Strict`,
          "cache-control": "no-store"
        }
      });
    }

    if (request.method === "POST" && u.pathname === "/handoff/logout") {
      return new Response(null, {
        status: 303,
        headers: {
          location: "/handoff",
          "set-cookie": "poc3b_auth=; Max-Age=0; Path=/; Secure; HttpOnly; SameSite=Strict",
          "cache-control": "no-store"
        }
      });
    }

    if (request.method === "GET" && u.pathname === "/health") return J({ ok: true, service: "ordinary-chat-poc3b-handoff" });

    if (u.pathname.startsWith("/api/") && !apiAuth(request, env)) return J({ ok: false, error: "UNAUTHORIZED" }, 401);
    if (request.method === "GET" && u.pathname === "/api/handoff/current") return handoffStub(env).fetch("https://handoff/current");
    if (request.method === "POST" && u.pathname === "/api/handoff/publish") {
      const body = await request.text();
      return handoffStub(env).fetch("https://handoff/publish", { method: "POST", headers: { "content-type": "application/json" }, body });
    }
    if (request.method === "POST" && u.pathname === "/api/handoff/clear") return handoffStub(env).fetch("https://handoff/clear", { method: "POST" });

    return J({ ok: false, error: "NOT_FOUND" }, 404);
  }
};
