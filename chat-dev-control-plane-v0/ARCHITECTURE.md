# Chat Dev Control Plane v0

Status: FROZEN BASELINE — ACTIVE / REVERSIBLE
Promotion date: 2026-09-03
Scope: cross-project Chat Dev orchestration semantics.

Public architecture authority remains this repository. Private reviewer execution lives in `ga815647/chatdev-exec`; that private repo is execution/policy/result substrate, not architecture authority.

## 1. Canonical path

```text
new task / new Orchestrator epoch
        ↓
O THIN FRAME
   ├─ O DIRECT
   └─ MANUAL BOUNDED WORKER
         ↓
      O emits ready-to-paste Worker prompt
         ↓
      user opens fresh Worker Chat
         ↓
      user pastes complete Worker result back to O
         ↓
      O validates / accepts evidence
        ↓
O forms provisional decision when a consequential commitment exists
        ↓
trigger-qualified?
   ├─ no → O FINAL
   └─ yes → PRIVATE REASONING BRAKE → O resolves → FINAL
```

The Orchestrator alone owns routing, Worker-result acceptance, formal state transitions, commitment, and final synthesis.

Worker/Sol return does not automatically rerun THIN FRAME. Re-enter only when routing-relevant state materially changes or rerouting is required.

## 2. Context lifecycle

`ROLLOVER` is same-role Orchestrator context-epoch renewal, not execution delegation or a role handoff.

Sequence:
1. Preserve only necessary non-durable edge state.
2. End the current O epoch.
3. Start a fresh O with the same role/authority/workstream.
4. Rehydrate from `Chat Dev｜Current → relevant Project Profile → repo/current durable truth → rollover checkpoint when present`.
5. Run THIN FRAME before execution routing.

Invariant:

`new task / new Orchestrator epoch → THIN FRAME before execution routing`

Do not restore a stateful Harness latch or mandatory FRAME/REVIEW/SYNTHESIZE ceremony.

## 3. Execution routing

### O DIRECT
Use O directly when delegation overhead exceeds the likely context/latency benefit or the task requires continuous Orchestrator judgment.

### MANUAL BOUNDED WORKER
Delegate substantial bounded execution when a Worker can reach a useful checkpoint without continuous O judgment and doing the work directly would materially consume O context.

Production Worker transport is human-mediated:
- O emits a compact routing header plus ready-to-paste bounded Worker prompt;
- the user opens the intended fresh Worker Chat and pastes it;
- the user pastes the complete Worker result back to O;
- Worker result is evidence only; O accepts/rejects it;
- if the Worker is required for the current operation, O does not make the dependent acceptance/final until the result returns, the user changes route, or the dependency becomes terminal in another explicit way.

Normal runtime does **not** depend on automated fresh-Chat routing, local Chrome/Playwright, persistent Windows Worker hosts, result-return polling, or local spool transport.

Worker prompts contain only the execution contract needed by the Worker: objective, scope/out-of-scope, authority/read path, validation/acceptance criteria, stop condition, and return evidence. Do not inject legacy Harness latch/cognitive ceremony.

### Narrow pre-execution Sol exception
Sol is not a universal pre-Worker gate. One pre-execution review is allowed only when routing/decomposition itself is both materially consequential if wrong and genuinely uncertain. Sol returns to O and has no dispatch authority.

## 4. Reasoning Brake

Canonical runtime: `reasoning-brake-v0/RUNTIME.md`.

Trigger only for consequential commitments where a missed framing, assumption, alternative, or evidence problem could materially change the decision. Ordinary reversible routing, simple deterministic acceptance, lookup, translation, and mechanical work do not trigger solely because judgment is present.

Production external lane:

```text
O
 ↓
private Issue in ga815647/chatdev-exec
 ↓
repo-scoped VPS runner: chatdev-sol-vps
 ↓
persistent ChatGPT subscription Codex identity
 ↓
reviewer model / effort from reviewer-policy.json
 ↓
private Issue result
 ↓
O
```

Current reviewer policy at promotion: `gpt-5.6-sol`, reasoning `low`.

Properties:
- exactly one falsifier;
- Reviewer lane only, no Worker/dispatch authority;
- model/effort are controlled by private repo policy, not VPS-local service config;
- no `OPENAI_API_KEY` production dependency;
- no desktop/Windows runtime dependency;
- bounded private operational packets/results are allowed in the private repo;
- credentials, reusable secrets, auth files, private keys, cookies, and session material are never packet/result content.

`PASS` → continue. `CHALLENGE` → O must resolve, verify, narrow, or reject the material issue before commitment.

If the external reviewer is unsafe/unavailable/timed out, do not auto-retry and do not fall back to the retired Windows lane. Every trigger-qualified consequential decision receives one O-local minimum falsification check. High-cost/hard-to-reverse decisions with unresolved decision-controlling uncertainty remain tentative/blocked until verified.

Full VPS host reboot recovery was not live-validated at promotion. Service restart/reconnect and post-restart review were validated. This is an availability uncertainty, not permission to silently restore local orchestration substrate.

## 5. Privacy / result boundary

Public `ga815647/agent-` carries architecture, contracts, public-safe evidence, and historical PoCs.

Private `ga815647/chatdev-exec` is the proven bounded reviewer execution/result plane. Repeated ChatGPT-originated E2E tests demonstrated:

`ChatGPT → private Issue → VPS subscription reviewer → private result → ChatGPT readback`

for both PASS and materially correct CHALLENGE cases.

This does **not** claim a general arbitrary-size private Worker artifact backend. The production Worker path is manual human-mediated handoff, so such a backend is not required by the baseline. A future project that needs machine-held private Worker binaries/large artifacts still requires its own validated artifact plane.

GitHub Secrets are credentials only when genuinely required; they are not conversation, packet, result, or artifact transport.

## 6. Retired normal-runtime paths

The following remain historical evidence but are retired from the production default:
- automatic fresh-Chat Worker transport;
- persistent Windows/browser Worker orchestration;
- Windows self-hosted Sol-low production reviewer;
- public `CODEX-BRAKE-V0|` Issue → Windows runner path;
- copied `CODEX_AUTH_JSON` ephemeral auth;
- API-key-backed remote Sol candidate from `SIMPLIFICATION_CANDIDATE_V1.md`.

Do not use historical lanes as silent fallback. Re-activation requires an explicit new decision.

Local tooling may still be used to debug evidence that genuinely exists only on a local machine; that is maintenance/debug work, not a normal-runtime dependency.

## 7. Durable-term grounding

Before binding project-specific shorthand to durable meaning, use the current conversation plus already-loaded durable truth first. Only when two or more materially different referents remain viable and choosing wrong would materially change the answer/route/commitment should O perform one targeted durable read or surface the ambiguity. Do not broadly reload durable sources for ordinary unambiguous language.

## 8. Evidence

Earlier architecture / Reasoning Brake evidence remains in public Issues #49, #51–#55, #58, #65–#66, #69 and the historical PoCs referenced by prior revisions.

2026-09-03 private-runtime promotion evidence:
- `ga815647/chatdev-exec` private Issue #13: ChatGPT-originated E2E PASS;
- private Issue #14: ChatGPT-originated E2E materially correct CHALLENGE;
- private Issue #15: promotion review CHALLENGE on untested full-host reboot recovery; baseline narrowed to mark that recovery property unverified and retain safe O-local fallback on reviewer unavailability;
- private repo policy mutability and runner service restart/reconnect were validated before promotion.

## 9. Next priority

Collect natural real-use Reasoning Brake cases and watch false-positive/false-negative behavior. Do not expand transport or restore automation merely for symmetry. Add a lane only after a concrete capability need or failure mode is demonstrated.
