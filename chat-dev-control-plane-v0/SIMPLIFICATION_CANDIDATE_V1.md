# Chat Dev Simplification Candidate v1

Status: STAGED CANDIDATE — NOT ACTIVE / NOT PROMOTED
Date: 2026-09-02

This candidate simplifies Chat Dev around the user's current operating goal: keep Orchestrator judgment and a small automatic Sol-low brake, make Worker transport explicitly human-mediated, and remove normal-operation dependency on the user's local Windows/Chrome/runner substrate.

`Chat Dev｜Current` v15 and `chat-dev-control-plane-v0/ARCHITECTURE.md` remain authoritative until this candidate satisfies its promotion gates.

## 1. Candidate control path

```text
new task / new Orchestrator epoch
        ↓
O THIN FRAME
        ├─ O DIRECT
        └─ MANUAL BOUNDED WORKER
              ↓
          O emits ready-to-paste Worker prompt
              ↓
          user opens fresh Worker Chat and pastes prompt
              ↓
          user pastes complete Worker result back to O
              ↓
          O parses / validates / accepts evidence
        ↓
O forms provisional decision when a consequential commitment exists
        ↓
trigger-qualified?
  ├─ no → O FINAL
  └─ yes → REMOTE SOL-LOW → O resolves → FINAL
```

O remains the sole authority for Worker-result acceptance, routing, formal state transitions, and final synthesis.

## 2. THIN FRAME entry consistency

Keep the old Harness latch retired. Do not restore FRAME/REVIEW/SYNTHESIZE ceremony or a stateful latch machine.

Candidate invariant:

`new task / new Orchestrator epoch → THIN FRAME before execution routing`

Return semantics remain conditional:

- Worker/Sol return does not automatically rerun THIN FRAME.
- Re-enter THIN FRAME only when routing-relevant state materially changes or rerouting is required.

The intent is semantic consistency, not a per-message stage or persistent `THIN_FRAME_ENTERED` state variable.

## 3. Worker routing

Candidate production default:

- automatic fresh-Chat Worker transport: RETIRED from normal runtime;
- persistent-host Worker routing/result transport: RETIRED from normal runtime;
- Worker handoff: O emits a compact ready-to-paste bounded prompt with routing header;
- user manually opens the intended fresh Chat and pastes the prompt;
- user manually pastes the complete Worker result back to O;
- O alone accepts/rejects that evidence.

This deliberately removes the need for Worker-side result-return connectors, Playwright Copy transport, local spool, private result backends, soft rate-limit automation, and automated Worker join polling.

Historical PoCs remain evidence and are not rewritten.

## 4. Reasoning Brake target

Reviewer semantics stay unchanged:

- model: `gpt-5.6-sol`;
- reasoning effort: `low`;
- compact public-safe falsification packet;
- exactly one independent falsifier;
- Reviewer only; no Worker or dispatch authority.

Target substrate:

`GitHub Issue → GitHub-hosted Ubuntu → OpenAI Responses API → gpt-5.6-sol low → GitHub result → O`

The target uses API-key authentication rather than copied ChatGPT subscription `auth.json`.

Why:

- Issues #11/#13 and the delegated/A-B workflows prove that GitHub-hosted runners can execute Sol/Terra without local Windows execution.
- Issue #48 plus current `reasoning-brake-v0/RUNTIME.md` reject copied `CODEX_AUTH_JSON` as a production auth path because refresh-token rotation/reuse made it unreliable.
- A pure falsifier only needs text-in/text-out; direct Responses API is thinner than a full Codex agent runtime and exposes exact usage for cost validation.

## 5. Current remote status

Experimental workflow:

`.github/workflows/codex-reasoning-brake-remote-poc.yml`

Issue #89 reached the GitHub-hosted auth gate and returned:

```text
REMOTE_SOL_LOW_POC_BLOCKED
status: BLOCKED_AUTH
auth: OPENAI_API_KEY_MISSING
local_substrate_used: false
```

Therefore the remote Sol target is **BLOCKED_AUTH**, not production-proven.

Do not claim zero-local Chat Dev yet.

## 6. Promotion gates

Before changing Current or canonical architecture, all must pass:

1. repository secret `OPENAI_API_KEY` is available to the remote PoC workflow;
2. one known-PASS Sol-low canary completes on GitHub-hosted Ubuntu;
3. one known-CHALLENGE Sol-low canary completes on GitHub-hosted Ubuntu;
4. both results satisfy the canonical four-line falsifier contract;
5. workflow reports `local_substrate_used: false`;
6. actual input/output/reasoning token usage and estimated per-review cost are recorded and judged acceptable;
7. the migration candidate itself is resolved against Issue #88's Sol challenge;
8. only then patch `reasoning-brake-v0/RUNTIME.md`, canonical architecture, and `Chat Dev｜Current` in one coherent promotion.

Until then:

- v15 stays active;
- old local Sol-low remains the current active brake if used;
- manual Worker routing may be used operationally by user choice, but is not yet promoted as the cross-project durable default.

## 7. Evidence

- Issue #11: GitHub-hosted delegated Terra/Sol subscription run PASS.
- Issue #13: GitHub-hosted Terra×2 → Sol benchmark PASS.
- Issue #48: ephemeral copied subscription-auth brake failed; current v0 records refresh-token rotation/reuse as the rejection reason.
- Issue #88: migration decision Sol-low CHALLENGE — require remote live canary before selecting API-backed runtime.
- Issue #89: remote GitHub-hosted PoC reached auth gate, `BLOCKED_AUTH`, no local substrate used.
