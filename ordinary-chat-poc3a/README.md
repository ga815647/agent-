# Ordinary ChatGPT Subworker PoC-3A — Cloudflare Browser Run

Goal: prove that a Cloudflare Browser Run session can create a real ordinary ChatGPT conversation that appears in normal ChatGPT history, without OpenAI API tokens and without Codex/Work.

## Fixed test

Prompt: `Return exactly: ORDINARY_CHAT_WORKER_001`

Technical pass requires all of:

- answer exactly `ORDINARY_CHAT_WORKER_001`
- URL becomes `https://chatgpt.com/c/<conversation-id>`
- the same conversation appears in the ChatGPT sidebar/history
- no observed POST to Codex/Work submission endpoints
- no OpenAI API token is used

The Worker intentionally reports `TECHNICAL_PASS_POOL_UNVERIFIED`, not final PASS, until Chat vs Codex/Work allowance usage is separately checked.

## Deploy from GitHub Actions

Repository secrets required:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `POC3A_ADMIN_TOKEN`

Recommended Cloudflare API token permissions for the selected account:

- Workers Scripts: Edit
- Browser Rendering: Edit
- Account Settings: Read

Run workflow: `.github/workflows/ordinary-chat-cloudflare-poc3a.yml`

## Live test

1. Open the deployed `ordinary-chat-poc3a.<subdomain>.workers.dev` URL.
2. Enter the same value stored in GitHub secret `POC3A_ADMIN_TOKEN`.
3. Tap **Start login**.
4. Open the returned Live View URL and manually sign in to ChatGPT. Complete MFA/CAPTCHA if requested. Stay in ordinary Chat, not Work/Codex.
5. Return to the control page before the browser session idles out and tap **Run test**.
6. Inspect the JSON result and open `conversation_url` in normal ChatGPT history.

## Important limitation

Cloudflare Browser Run documents that its browser traffic is identified as bot traffic. Therefore ChatGPT may reject the session even though the automation is technically correct. If the result is `LOGIN_OR_BOT_GATE`, PoC-3A is considered failed and the next experiment should be GitHub Actions with headed Chrome/Xvfb.
