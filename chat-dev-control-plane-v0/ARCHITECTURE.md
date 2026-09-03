# Chat Dev Control Plane v0

Status: ACTIVE BASELINE — REVERSIBLE
Promotion date: 2026-09-03
Scope: cross-project Chat Dev orchestration semantics.

Public architecture authority remains this repository. Private reviewer execution lives in `ga815647/chatdev-exec`; that private repo is execution/policy/result substrate, not architecture authority.

## 1. Canonical path

```text
new Orchestrator epoch
        ↓
Project Instructions bootstrap
fetch Chat Dev｜Current before normal assistant-visible response/task execution
        ↓
every O turn
        ↓
ROUTE=DIRECT or ROUTE=BRAIN
   ├─ DIRECT → O DIRECT
   └─ BRAIN
        ├─ CONTINUE / REVISE / VERIFY → O
        ├─ USE_W → MANUAL BOUNDED WORKER → O validates / accepts evidence
        ├─ WAIT → block only the dependent transition
        └─ ESCALATE_REVIEW → PRIVATE REASONING BRAKE → O resolves
        ↓
O FINAL / commitment when applicable
```

The Orchestrator alone owns routing, Worker-result acceptance, formal state transitions, commitment, and final synthesis.

The visible caller route is intentionally binary. `WAIT` and Worker selection are downstream BRAIN/control outcomes, not caller pre-classifications. Collapsing the route does not weaken dependency joins, Worker authority boundaries, Mutation Lock, Stage-1, or hard A-E review.

Worker/Reviewer return does not automatically rerun the caller route beyond the normal next-turn latch. Re-enter BRAIN only when the next action again approaches a BRAIN boundary.

## 2. Context lifecycle / bootstrap

`ROLLOVER` is same-role Orchestrator context-epoch renewal, not execution delegation or a role handoff.

Sequence:
1. Preserve only necessary non-durable edge state.
2. End the current O epoch.
3. Start a fresh O with the same role/authority/workstream.
4. **Before any normal assistant-visible response or task execution, Project Instructions fetch `Chat Dev｜Current`.** This bootstrap invariant must live outside Current because a Current-only rule cannot bootstrap its own load.
5. Rehydrate from `Chat Dev｜Current → relevant Project Profile → repo/current durable truth → rollover checkpoint when present`.
6. Before task execution on each O turn, emit the current binary caller route from Current.

Invariant:

`new O epoch → bootstrap Current before normal response/task execution → binary route before task execution`

This is a soft caller protocol, not a deterministic output/dispatch latch. Do not claim fail-closed enforcement.

Do not restore a stateful Harness service or mandatory FRAME/REVIEW/SYNTHESIZE ceremony.

## 3. Binary caller routing and execution routing

### ROUTE=DIRECT
Use O directly when the turn does not approach a BRAIN boundary. Ordinary lookup, explanation, translation, mechanical transformation, simple judgment, and direct work remain here unless their actual effect independently crosses a boundary.

### ROUTE=BRAIN
Enter BRAIN before task execution when the turn approaches any of:

- substantial bounded work where `W` may materially save O context or execution burden;
- delegation / Worker handoff;
- external mutation;
- release of a required pending Worker / production Reviewer dependency;
- consequential commitment.

A short confirmation inherits the immediately preceding proposed action for boundary detection. The caller does not classify `WAIT`, `W_CANDIDATE`, Mutation Lock, Stage-1, or Reviewer families itself; BRAIN applies only the downstream controls actually needed.

Canonical BRAIN semantics: `chat-dev-control-plane-v0/BRAIN-AUTO-PILOT.md`.

### O DIRECT
Use O directly when delegation overhead exceeds the likely context/latency benefit or the task requires continuous Orchestrator judgment.

### MANUAL BOUNDED WORKER
Within BRAIN, select `W` for substantial bounded execution when a Worker can reach a useful checkpoint without continuous O judgment and doing the work directly would materially consume O context.

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

## 4. Dependency, mutation, and Reasoning Brake

### Dependency join
A required Reviewer or Worker dependency blocks only the **dependent** acceptance / final / handoff until terminal, explicitly rerouted/cancelled, or otherwise cleared under canonical semantics. `WAIT` is a BRAIN/downstream outcome; there is no caller-facing `ROUTE=WAIT`.

### External mutation
External mutation applies `chat-dev-control-plane-v0/MUTATION-LOCK.md`: bind mutation effect, target resource type, and exact target identity/destination before choosing a write action. The binary caller route does not replace Mutation Lock.

### Reasoning Brake
Canonical runtime: `reasoning-brake-v0/RUNTIME.md`.

External review is effect-gated. Trigger one production independent review only when the pending commitment meets at least one hard A-E effect from RUNTIME: durable/canonical/control change; authority/safety/dependency boundary; material external effect not fully rollback-neutralized; costly/hard-to-reverse commitment; or residual decision-controlling uncertainty/evidence conflict.

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
- exactly one production-authoritative falsifier;
- Reviewer lane only, no Worker/dispatch authority;
- model/effort are controlled by private repo policy, not VPS-local service config;
- no `OPENAI_API_KEY` production dependency;
- no desktop/Windows runtime dependency;
- bounded private operational packets/results are allowed in the private repo;
- credentials, reusable secrets, auth files, private keys, cookies, and session material are never packet/result content.

`PASS` → continue. `CHALLENGE` → O must resolve, verify, narrow, or reject the material issue before commitment.

Once O dispatches a qualifying production review, that review is a required dependency of the **specific reviewed commitment**. Until a validated terminal production result, explicit reviewer unavailability, explicit user reroute/cancel, or bounded-budget expiry followed by the defined O-local fallback, O must not communicate, rely on, accept, hand off, or finalize that commitment. Progress updates and unrelated replies may proceed, but unrelated replies must not embed or transfer the pending commitment. The temporary shadow review is never a blocking dependency.

If the external reviewer is unsafe/unavailable/timed out, do not auto-retry and do not fall back to the retired Windows lane. Every trigger-qualified commitment receives one O-local minimum falsification check. High-cost/hard-to-reverse decisions with unresolved decision-controlling uncertainty remain tentative/blocked until verified.

Full VPS host reboot recovery was not live-validated at original reviewer promotion. Service restart/reconnect and post-restart review were validated. This is an availability uncertainty, not permission to silently restore local orchestration substrate.

## 5. Privacy / result boundary

Public `ga815647/agent-` carries architecture, contracts, public-safe evidence, and historical PoCs.

Private `ga815647/chatdev-exec` is the proven bounded reviewer execution/result plane. Repeated ChatGPT-originated E2E tests demonstrated:

`ChatGPT → private Issue → VPS subscription reviewer → private result → ChatGPT readback`

for both PASS and materially correct CHALLENGE cases.

This does **not** claim a general arbitrary-size private Worker artifact backend. The production Worker path is manual human-mediated handoff, so such a backend is not required by the baseline. A future project that needs machine-held private Worker binaries/large artifacts still requires its own validated artifact plane.

GitHub Secrets are credentials only when genuinely required; they are not conversation, packet, result, or artifact transport.

## 6. Retired / non-canonical caller surfaces

The following remain historical evidence but are not the production caller surface:
- caller-facing four-way `ROUTE=DIRECT / ROUTE=BRAIN / ROUTE=W_CANDIDATE / ROUTE=WAIT` v28 latch;
- caller-side THIN FRAME classification as a separate mandatory routing ceremony;
- automatic fresh-Chat Worker transport;
- persistent Windows/browser Worker orchestration;
- Windows self-hosted Sol-low production reviewer;
- public `CODEX-BRAKE-V0|` Issue → Windows runner path;
- copied `CODEX_AUTH_JSON` ephemeral auth;
- API-key-backed remote Sol candidate from `SIMPLIFICATION_CANDIDATE_V1.md`.

The useful routing semantics of THIN FRAME survive inside the binary BRAIN entry and Worker-routing control; only the separate caller ceremony is retired.

Do not use historical lanes as silent fallback. Re-activation requires an explicit new decision.

Local tooling may still be used to debug evidence that genuinely exists only on a local machine; that is maintenance/debug work, not a normal-runtime dependency.

## 7. Durable-term grounding

Before binding project-specific shorthand to durable meaning, use the current conversation plus already-loaded durable truth first. Only when two or more materially different referents remain viable and choosing wrong would materially change the answer/route/commitment should O perform one targeted durable read or surface the ambiguity. Do not broadly reload durable sources for ordinary unambiguous language.

## 8. Evidence / promotion interpretation

Earlier architecture / Reasoning Brake evidence remains in public Issues #49, #51–#55, #58, #65–#66, #69 and the historical PoCs referenced by prior revisions.

Binary caller-surface promotion evidence on 2026-09-03:
- a live fresh-epoch miss showed that a first-visible-line rule stored only in Current can be violated before Current is fetched;
- a natural small read-only continuation was classified `W_CANDIDATE`, demonstrating caller-side downstream-classification false-positive risk;
- the frozen three-arm caller-control proxy did **not** establish material safety superiority of generalized BRAIN over the simpler high-salience sentinel, supporting separation of caller salience from BRAIN handler semantics;
- BRAIN already owns `WAIT` and `USE_W`, so caller-facing `WAIT`/`W_CANDIDATE` were redundant once W-worthiness and pending-dependency release were made explicit BRAIN-entry triggers;
- fresh production review for this promotion was explicitly `UNAVAILABLE` in the private execution plane; per canonical RUNTIME, O did not auto-retry or switch reviewer substrates and instead ran exactly one local minimum falsification check. The strongest concern—loss of Worker/dependency salience after route collapse—was resolved by preserving both as explicit BRAIN-entry/downstream semantics.

This promotion is reversible and soft. It does **not** establish deterministic enforcement or statistically proven natural long-context recall superiority. Roll back or revise if natural use shows increased missed Worker opportunities, dependency-release errors, or other control regressions.

## 9. Next priority

Use the binary caller surface in natural work and watch false-positive/false-negative behavior, especially fresh-epoch bootstrap, proactive Worker discovery, and dependency release. Do not add more caller route classes without a concrete live failure that cannot be handled inside BRAIN.
