const J = (x, status = 200) => new Response(JSON.stringify(x, null, 2), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  },
});

const auth = (request, env) =>
  !!env.ADMIN_TOKEN && request.headers.get("authorization") === `Bearer ${env.ADMIN_TOKEN}`;

const esc = (v) => String(v ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

export class HandoffStore {
  constructor(ctx, env) {
    this.ctx = ctx;
    this.env = env;
  }

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
  return `<!doctype html>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Cache-Control" content="no-store">
<title>PoC-3B Protected Handoff</title>
<style>
body{font-family:system-ui;max-width:760px;margin:28px auto;padding:0 16px;line-height:1.45}
input{width:100%;padding:12px;box-sizing:border-box;font-size:16px}
button{padding:12px 16px;margin:10px 0;font-size:16px}
.box{white-space:pre-wrap;background:#eee;padding:12px;border-radius:8px;word-break:break-word}
.ok{background:#e8f5e9}.warn{background:#fff8e1}.err{background:#ffebee}
a{word-break:break-all;font-size:18px}
code{word-break:break-all}
</style>
<h2>PoC-3B Protected Handoff</h2>
${inner}`;
}

function loginPage(message = "Enter token and tap Load current handoff.", cls = "warn") {
  return shell(`
<p>This version uses a normal HTML form — no JavaScript is required.</p>
<form method="post" action="/handoff" autocomplete="off">
  <input name="token" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="POC3A_ADMIN_TOKEN" required>
  <button type="submit">Load current handoff</button>
</form>
<div class="box ${esc(cls)}">${esc(message)}</div>`);
}

function readyPage(h) {
  const expires = h.expires_at ? new Date(h.expires_at).toLocaleString("en-US", { timeZone: "UTC" }) + " UTC" : "unknown";
  return shell(`
<div class="box ok">READY
Run: ${esc(h.run_id || "unknown")}
Basic user: ${esc(h.basic_user)}
Basic password: ${esc(h.basic_pass)}
VNC password: ${esc(h.vnc_pass)}
Expires: ${esc(expires)}</div>
<p><a href="${esc(h.novnc_url)}" target="_blank" rel="noopener">Open protected remote Chrome</a></p>
<p><b>Google login:</b> prefer phone approval / passkey / QR. Do not type the Google account password into the remote browser.</p>
<p><a href="/handoff">Back</a></p>`);
}

export default {
  async fetch(request, env) {
    const u = new URL(request.url);

    if (request.method === "GET" && (u.pathname === "/" || u.pathname === "/handoff")) {
      return new Response(loginPage(), {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
      });
    }

    if (request.method === "POST" && u.pathname === "/handoff") {
      let token = "";
      try {
        const form = await request.formData();
        token = String(form.get("token") || "").trim();
      } catch {}

      if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) {
        return new Response(loginPage("Unauthorized — check POC3A_ADMIN_TOKEN.", "err"), {
          status: 401,
          headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
        });
      }

      const r = await handoffStub(env).fetch("https://handoff/current");
      const j = await r.json();
      if (!j.ok || !j.handoff) {
        return new Response(loginPage("No active handoff. The runner may have finished or the handoff may have expired.", "warn"), {
          headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
        });
      }

      return new Response(readyPage(j.handoff), {
        headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
      });
    }

    if (request.method === "GET" && u.pathname === "/health") {
      return J({ ok: true, service: "ordinary-chat-poc3b-handoff" });
    }

    if (u.pathname.startsWith("/api/") && !auth(request, env)) {
      return J({ ok: false, error: "UNAUTHORIZED" }, 401);
    }

    if (request.method === "GET" && u.pathname === "/api/handoff/current") {
      return handoffStub(env).fetch("https://handoff/current");
    }
    if (request.method === "POST" && u.pathname === "/api/handoff/publish") {
      const body = await request.text();
      return handoffStub(env).fetch("https://handoff/publish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body
      });
    }
    if (request.method === "POST" && u.pathname === "/api/handoff/clear") {
      return handoffStub(env).fetch("https://handoff/clear", { method: "POST" });
    }

    return J({ ok: false, error: "NOT_FOUND" }, 404);
  }
};
