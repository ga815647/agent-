const J = (x, status = 200) => new Response(JSON.stringify(x, null, 2), {
  status,
  headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  },
});

const auth = (request, env) =>
  !!env.ADMIN_TOKEN && request.headers.get("authorization") === `Bearer ${env.ADMIN_TOKEN}`;

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

function page() {
  return `<!doctype html>
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>PoC-3B Protected Handoff</title>
<style>
  body{font-family:system-ui;max-width:760px;margin:28px auto;padding:0 16px;line-height:1.45}
  input{width:100%;padding:12px;box-sizing:border-box;font-size:16px}
  button{padding:11px 16px;margin:10px 0;font-size:16px}
  pre{white-space:pre-wrap;background:#eee;padding:12px;border-radius:8px;word-break:break-word}
  a{word-break:break-all;font-size:18px}
  .ok{background:#e8f5e9}.warn{background:#fff8e1}.err{background:#ffebee}
</style>
<h2>PoC-3B Protected Handoff</h2>
<p>Enter <code>POC3A_ADMIN_TOKEN</code>. The token stays in this tab and is sent only as an Authorization header.</p>
<input id="token" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="POC3A_ADMIN_TOKEN">
<button id="load" type="button">Load current handoff</button>
<div id="link"></div>
<pre id="status" class="warn">Ready — enter token and tap Load current handoff.</pre>
<script>
(() => {
  const token = document.getElementById('token');
  const load = document.getElementById('load');
  const status = document.getElementById('status');
  const link = document.getElementById('link');

  const show = (text, cls='warn') => {
    status.className = cls;
    status.textContent = text;
  };

  load.addEventListener('click', async () => {
    const value = token.value.trim();
    link.innerHTML = '';
    if (!value) {
      show('Token is empty.', 'err');
      return;
    }

    load.disabled = true;
    show('Loading current handoff…', 'warn');

    try {
      const r = await fetch('/api/handoff/current', {
        headers: { authorization: 'Bearer ' + value },
        cache: 'no-store'
      });
      const j = await r.json();

      if (r.status === 401) {
        show('Unauthorized — check POC3A_ADMIN_TOKEN.', 'err');
        return;
      }

      if (!j.ok || !j.handoff) {
        show('No active handoff. The runner may still be starting, may have finished, or the handoff may have expired.', 'warn');
        return;
      }

      const h = j.handoff;
      const expires = h.expires_at ? new Date(h.expires_at).toLocaleString() : 'unknown';
      show(
        'READY\n' +
        'Run: ' + (h.run_id || 'unknown') + '\n' +
        'Basic user: ' + h.basic_user + '\n' +
        'Basic password: ' + h.basic_pass + '\n' +
        'VNC password: ' + h.vnc_pass + '\n' +
        'Expires: ' + expires,
        'ok'
      );

      const a = document.createElement('a');
      a.href = h.novnc_url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = 'Open protected remote Chrome';
      const p = document.createElement('p');
      p.appendChild(a);
      link.appendChild(p);
    } catch (e) {
      show('Load failed: ' + (e?.message || String(e)), 'err');
    } finally {
      load.disabled = false;
    }
  });
})();
</script>`;
}

export default {
  async fetch(request, env) {
    const u = new URL(request.url);

    if (request.method === "GET" && (u.pathname === "/" || u.pathname === "/handoff")) {
      return new Response(page(), {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "no-store"
        }
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
