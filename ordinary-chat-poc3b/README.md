# PoC-3B

Headed Chrome on a GitHub-hosted runner. The live noVNC URL and one-time remote passwords are published only through the authenticated Cloudflare handoff endpoint, never through public GitHub Issues or logs. Google sign-in should use phone confirmation/passkey when available; do not type a Google account password into the remote browser.

## Windows persistent-host extension

`persistent-host.ps1` reuses the existing Playwright/CDP PoC logic on one Windows machine while keeping a dedicated browser profile across browser and controller restarts. It intentionally does not integrate with GitHub Actions, Cloudflare, tunnels, fanout, or orchestration.

The default credential-bearing profile is outside the repository and outside temporary directories:

```text
%LOCALAPPDATA%\ChatDev\PersistentChatHost\chrome-user-data
```

The controller refuses to adopt a non-empty profile that it did not create. It also detects a running Chrome/Edge process that already uses the dedicated profile and reuses it instead of launching a second process. Chrome is preferred; Edge is only a local fallback when Chrome is unavailable.

Install and validate once:

```powershell
Set-Location ordinary-chat-poc3b
npm install --no-audit --no-fund
npm run host:check
```

Launch the same headed browser/profile, inspect state, stop it without deleting the profile, and restart it:

```powershell
.\persistent-host.ps1 start
.\persistent-host.ps1 status
.\persistent-host.ps1 stop
.\persistent-host.ps1 start
```

Complete `Continue with Google` manually in the headed browser. Do not automate passwords, MFA, CAPTCHA, or Google recovery, and do not sign the dedicated Chrome profile into Chrome Sync.

After `status` reports `AUTHENTICATED`, submit the fixed acceptance prompt in a fresh ordinary ChatGPT conversation:

```powershell
.\persistent-host.ps1 send-test
```

This command records only whether an ordinary `/c/...` conversation was created and whether the fixed user prompt was submitted. It does not retrieve, parse, or scrape assistant output.

Worker dispatches use a machine-local ChatGPT Project target stored outside the repository:

```text
%LOCALAPPDATA%\ChatDev\PersistentChatHost\host-config.json
```

The config contract is a JSON object with one `worker_project_url` string. The URL must use HTTPS, hostname exactly `chatgpt.com`, and the ChatGPT Project route `/g/g-p-.../project`; credentials, ports, query strings, fragments, and non-Project paths are rejected. A malformed existing config causes dispatch to fail instead of falling back to ChatGPT root. Configure the private value without printing it:

```powershell
$env:CHATGPT_HOST_WORKER_PROJECT_URL = '<private ChatGPT Project URL>'
.\persistent-host.ps1 set-worker-project
Remove-Item Env:\CHATGPT_HOST_WORKER_PROJECT_URL
```

Root ChatGPT remains the target for `start`, `open`, `status`, and `send-test`, so authentication and recovery do not depend on a Project route. `dispatch` requires the local config, navigates directly to that Project landing page, and verifies the resulting Project conversation using navigation metadata. It does not use sidebar text or read assistant output.

For the repo-scoped self-hosted Actions PoC, `dispatch` reads the issue payload only from the `SUBCHAT_HOST_PROMPT` environment variable. Project URLs and identifiers are redacted from its result metadata:

```powershell
$env:SUBCHAT_HOST_PROMPT = 'Return exactly: ACTIONS_PERSISTENT_CHAT_001'
.\persistent-host.ps1 dispatch
Remove-Item Env:\SUBCHAT_HOST_PROMPT
```

The adapted `subchat-bridge-poc.yml` supports owner-only, exact-title `SUBCHAT-HOST-POC` issue events and optional diagnostic `workflow_dispatch` tests. Automatic Issue dispatch is active from the default branch and is routed exclusively to the labeled persistent Windows host.

### Structured result return v0

For each accepted dispatch, Actions creates a fresh 128-bit lowercase hexadecimal nonce, masks it before any transport, and adds the raw value only to the worker prompt. `SUBCHAT_HOST_ACK` stores `SUBCHAT_WORKER_RESULT_V1` plus the SHA-256 commitment, never the raw nonce. The persistent-host controller still reports browser-side submission metadata only and never reads assistant output.

The worker writes its native GitHub result to the originating Issue as exactly two lines: the `SUBCHAT_WORKER_RESULT_V1` marker and one compact JSON object. The GitHub-side validator checks the schema, Issue/run correlation, nonce commitment, repository-owner author, and configured native GitHub App provenance, then accepts the earliest valid comment by `created_at` and comment ID. Later valid comments are diagnostics only. Missing results end as `RESULT_TIMEOUT`; they are not converted into a fabricated worker status or redispatched.

Long-running result waiting is separated from browser dispatch. The self-hosted Windows job ends after prompt submission and `SUBCHAT_HOST_ACK`; a separate GitHub-hosted validation job owns the join wait so the persistent browser host is not occupied while the Worker reasons. The current workflow default is a 90-minute result window with one Issue-comment poll every 120 seconds. Those values are substrate policy, not a Chat Dev semantic limit, and may be changed independently as evidence accumulates. Multiple validation waits may overlap while persistent-host dispatches continue to serialize naturally on the self-hosted runner/controller lock.

The wait/poll bounds and the small GitHub App allowlist are explicit workflow configuration. The accepted connector identity is intentionally not embedded in the V1 schema or validator module, so it can be updated independently. No result artifact is uploaded. Event-driven validation may replace polling later; polling is currently a bounded recovery-compatible implementation detail rather than an architectural requirement.

### Soft rate-limit resilience

The controller recognizes the ChatGPT `太多要求` / `Too many requests` modal only within dialog/alert/modal UI. During one dispatch it may dismiss the recognized acknowledgment (`知道了`, `確定`, `OK`, or an equivalent supported label) each time it blocks progress, then verify that the composer, Project route, conversation route, or prompt-submission evidence recovers. Repeated notices are not a blocking condition by count alone. The existing bounded operation deadline remains authoritative, and recovery continues only within the same dispatch; it does not enqueue or submit a second job.

The controller enters internal `RATE_LIMIT_BLOCKED` state (external `status: RATE_LIMITED`) only when the modal cannot be dismissed, stays visible, useful UI progress cannot be restored, prompt submission remains impossible, or the bounded progress deadline expires. Only this actually blocked state creates the following local runtime file outside git:

```text
%LOCALAPPDATA%\ChatDev\PersistentChatHost\rate-limit-state.json
```

The default cooldown is ten minutes. A later dispatch during an active cooldown fails fast without navigating, dismissing, or submitting. Repeated-but-recovered notices do not create cooldown. There is no unbounded dismissal loop, reload loop, new job, or attempt to bypass ChatGPT limits. The Issue status reports the notice as `RECOVERED` or `BLOCKED`, distinguishes `RATE_LIMITED` from authentication failure, and never reads assistant output.

Run deterministic policy fixtures without contacting ChatGPT:

```powershell
npm test
```

Before a reboot, create a non-secret checkpoint and close Chrome cleanly:

```powershell
.\persistent-host.ps1 checkpoint
.\persistent-host.ps1 stop
```

After Windows restarts:

```powershell
.\resume-after-reboot.ps1
```

Optional environment overrides are `CHATGPT_HOST_ROOT`, `CHATGPT_HOST_PROFILE`, `CHATGPT_HOST_PORT`, `CHATGPT_HOST_CHROME`, and `CHATGPT_HOST_RATE_LIMIT_COOLDOWN_MS`. The profile override is rejected if it is inside this repository or the Windows temporary directory. The cooldown override is bounded to one minute through one hour.
