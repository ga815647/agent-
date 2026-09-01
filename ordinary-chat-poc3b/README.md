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

For the repo-scoped self-hosted Actions PoC, `dispatch` reads the issue payload only from the `SUBCHAT_HOST_PROMPT` environment variable. It returns execution metadata and the ordinary conversation URL, but never reads the assistant response:

```powershell
$env:SUBCHAT_HOST_PROMPT = 'Return exactly: ACTIONS_PERSISTENT_CHAT_001'
.\persistent-host.ps1 dispatch
Remove-Item Env:\SUBCHAT_HOST_PROMPT
```

The adapted `subchat-bridge-poc.yml` supports owner-only `SUBCHAT-HOST-POC` issue events and pre-merge `workflow_dispatch` tests. GitHub only activates the `issues` event version stored on the default branch, so automatic Issue-to-host routing remains inactive until the workflow change is accepted onto the default branch. Branch-ref manual dispatch is evidence for runner/controller execution only; it is not evidence that the Issue event triggered the host job.

Before a reboot, create a non-secret checkpoint and close Chrome cleanly:

```powershell
.\persistent-host.ps1 checkpoint
.\persistent-host.ps1 stop
```

After Windows restarts:

```powershell
.\resume-after-reboot.ps1
```

Optional environment overrides are `CHATGPT_HOST_ROOT`, `CHATGPT_HOST_PROFILE`, `CHATGPT_HOST_PORT`, and `CHATGPT_HOST_CHROME`. The profile override is rejected if it is inside this repository or the Windows temporary directory.
