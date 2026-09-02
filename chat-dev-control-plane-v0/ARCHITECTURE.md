# Chat Dev Control Plane v0

Status: FROZEN BASELINE — ACTIVE / REVERSIBLE
Scope: cross-project Chat Dev orchestration semantics.

This file freezes the smallest currently accepted control-plane architecture. It records only semantics that are active or sufficiently proven. Unresolved private/artifact transport remains explicitly outside the frozen baseline.

## 1. Three orthogonal control planes

Do not collapse context lifecycle, execution delegation, and decision braking into one router.

```text
USER
 ↓
CONTEXT LIFECYCLE
 ├─ CONTINUE
 └─ ROLLOVER
       ↓
   fresh Orchestrator rehydrate
       ↓
O THIN FRAME
 ├─ O DIRECT
 ├─ BOUNDED WORKER
 └─ narrow pre-execution Sol-low only when routing/decomposition is
    materially consequential if wrong AND genuinely uncertain
       ↓
O accepts evidence / forms provisional decision when a consequential commitment exists
       ↓
REASONING BRAKE
 ├─ not trigger-qualified → skip
 └─ trigger-qualified → Sol-low external brake when safe/available
                         └─ local minimum fallback if external unavailable/unsafe/timeout
       ↓
O acceptance / final
```

Both Worker and Sol-low always return to the Orchestrator. The Orchestrator alone owns routing, Worker-result acceptance, formal state transitions, and final synthesis.

The normal path is fixed and evidence-first. Do not run a mandatory FRAME after every Worker/Sol return. Re-enter THIN FRAME only when a return materially changes routing-relevant state or otherwise requires rerouting, such as Worker `BLOCKED` / `ERROR`, transport or capability failure, or a newly exposed execution/evidence dependency.

General Codex execution is not part of this frozen production baseline. The live Codex lane is the Sol-low Reviewer used by Reasoning Brake v0. A future Codex executor may be added without changing the lifecycle or reasoning-brake semantics.

## 2. ROLLOVER

`ROLLOVER` is an Orchestrator lifecycle primitive: same-role context-epoch renewal.

It is not ordinary execution routing, not lossy conversation compression, and not a role/owner handoff.

Sequence:
1. Preserve only necessary edge state not already durable.
2. End the current Orchestrator context epoch.
3. Start a fresh Orchestrator with the same role, authority, and workstream.
4. Rehydrate from `Chat Dev｜Current → relevant Project Profile → repo / durable truth → rollover checkpoint when present`.
5. Re-run normal execution routing from the fresh context.

A rollover checkpoint may use handoff-style mechanics, but its semantics are continuity of the same Orchestrator role.

Checkpoint content should be minimal:
- current accepted state;
- unresolved open loops / blockers;
- next objective;
- required evidence pointers;
- explicit do-not-reopen boundaries when needed.

Do not copy durable truth into rollover prose merely to make the checkpoint self-contained. Prefer pointers. Do not summarize the whole conversation.

Default trigger: rollover when current Orchestrator context quality has degraded enough that a fresh Orchestrator would materially improve the next substantial decision or Worker dispatch.

Ordinary rollover/routing judgment does not itself require Sol-low unless it creates a consequential commitment with material decision risk.

## 3. Execution routing

Execution routing is separate from ROLLOVER and Reasoning Brake.

### THIN FRAME
Run one compact Orchestrator routing pass at the start of the task/epoch. It establishes the real goal and decides whether direct execution or bounded delegation is the better route.

THIN FRAME is not a full cognitive ceremony and is not automatically rerun after every return. Re-enter it only when routing-relevant state materially changes or the current route requires replacement/recomposition.

### O DIRECT
Use the Orchestrator directly when delegation overhead exceeds the likely context/latency benefit, or when the task requires continuous Orchestrator judgment.

### BOUNDED WORKER
Delegate substantial bounded execution when the Worker can reach a durable checkpoint without continuous Orchestrator judgment and doing the work directly would materially consume Orchestrator context.

Current automated Worker transport default:
- fresh Chat in `Chat Dev | Ephemeral Workers`;
- structured result is evidence only;
- required Worker must reach a terminal state before the Orchestrator finalizes;
- only the Orchestrator accepts results and owns formal state transitions.

Worker handoffs contain only the execution contract needed by the Worker: objective, scope/out-of-scope, authority/read path, validation/acceptance criteria, stop condition, and return evidence. Do not inject legacy Harness latch or Orchestrator cognitive ceremony into Worker prompts.

### Narrow pre-execution review exception

Do not make Sol-low a universal pre-Worker gate.

Before Worker dispatch, one Sol-low review is allowed only when the proposed routing/decomposition is itself both:
- materially consequential if wrong; and
- genuinely uncertain.

Sol-low returns to the Orchestrator and has no dispatch authority. The Orchestrator resolves the review and decides whether/how to dispatch.

### Return / reroute semantics

A Worker/Sol return normally continues along the fixed path without a fresh FRAME pass.

Re-enter THIN FRAME only when routing-relevant state materially changes or a reroute is required. Examples include:
- Worker `BLOCKED` / `ERROR` or transport/capability failure;
- evidence that reveals a new substantial execution dependency;
- a Sol challenge that exposes a material evidence gap needing Worker execution;
- another return that invalidates the current decomposition even though the top-level user objective is unchanged.

This conditional escape preserves retry/replacement capability without turning the Orchestrator into a one-action-per-FRAME event loop.

### Automated-dispatch fallback

Automatic fresh-Chat dispatch is primary.

If automatic transport is unavailable but manual fresh-Chat dispatch is still a genuinely different viable path, return a ready-to-paste bounded Worker prompt with the normal routing header.

Do not pretend manual dispatch bypasses a shared ChatGPT capacity/rate-limit failure. In that case, the Orchestrator must reassess direct execution versus a real BLOCKED state rather than mechanically handing the user the same doomed prompt.

## 4. Reasoning Brake

Canonical runtime: `reasoning-brake-v0/RUNTIME.md`.

Sol-low is not a tax on all judgment. Trigger only for consequential commitments where a missed framing, assumption, alternative, or evidence problem could materially change the decision.

Examples that normally do not trigger solely because they involve judgment:
- tool choice;
- ordinary reversible routing;
- whether to rollover;
- simple status/acceptance against an explicit deterministic contract;
- small reversible operational choices.

The narrow pre-execution exception above applies only when routing/decomposition itself becomes a consequential uncertain commitment. It does not widen the normal Reasoning Brake trigger to ordinary routing.

External profile:
- `gpt-5.6-sol`;
- reasoning `low`;
- one independent falsifier;
- compact public-safe decision packet;
- no full conversation;
- Reviewer lane only, no Worker authority.

External result:
- `PASS` → continue;
- `CHALLENGE` → O must resolve, verify, or reject the material issue before commitment.

If a post-decision Sol challenge exposes a material evidence gap, the Orchestrator may dispatch a bounded Worker, accept the returned evidence, and rebuild the provisional decision. Do not automatically run a second Sol-low; rerun it only if the rebuilt commitment independently remains trigger-qualified.

External failure/unsafe packet:
- fail open only with respect to the external dependency;
- do not retry automatically or spawn a replacement subchat;
- every trigger-qualified consequential decision still gets one local minimum falsification check before commitment;
- high-cost/hard-to-reverse decisions with unresolved decision-controlling uncertainty remain tentative/blocked until verified.

## 5. Privacy and artifact boundary

The public GitHub control plane may carry only public-safe routing/evidence/result envelopes.

Private Worker artifact transport is NOT SOLVED in v0.

Known evidence:
- Drive create-new private result artifact: live BLOCKED by connector safety layer (Issue #33).
- Drive edit-existing/private dataflow: no clean repeated E2E PASS; treat as UNPROVEN.

Therefore do not claim a production private artifact container. Private payloads, long private outputs, binary artifacts, or private Worker↔O result material need a separately validated artifact plane.

Reasoning Brake privacy is independently handled: unsafe/private decision packets are not externalized to the public GitHub brake path and use the local minimum falsification fallback.

## 6. Frozen vs experimental

Frozen baseline:
- ROLLOVER lifecycle semantics;
- O-centered THIN FRAME with fixed evidence-first main path;
- O DIRECT vs bounded Worker separation;
- narrow pre-execution Sol-low only for materially risky + genuinely uncertain routing/decomposition;
- conditional THIN FRAME re-entry only on material routing-state change / reroute need;
- fresh-Chat Worker transport default and Orchestrator acceptance authority;
- automatic-dispatch → viable manual-prompt fallback semantics;
- Worker prompts exclude legacy Harness latch/cognitive ceremony;
- Reasoning Brake trigger boundary and local fallback invariant;
- private artifact plane remains unresolved.

Observation-only / still experimental:
- long-run Sol-low falsifier recall, false-positive rate, latency, and cost;
- exact workload threshold for Worker admission / dispatch economics;
- future general Codex executor lane;
- private artifact backend selection.

Do not expand the control plane merely to make it more symmetric. Add a new lane only after a concrete failure mode or capability need is demonstrated.

## 7. Evidence

Reasoning Brake: Issues #49, #51–#55, #58, #65–#66.
Rollover semantics: existing durable Orchestrator rollover checkpoints plus Reasoning Brake review Issue #57.
Private artifact boundary: Issues #33, #34, #35, #40, #45.

Control architecture representative-trace validation:
- Issue #65 rejected mandatory per-return FRAME and established the fixed evidence-first main path + narrow pre-execution review exception.
- Issue #66 validated simple/direct, obvious bounded Worker, evidence-ready consequential decision, risky/uncertain pre-Sol, post-Sol hidden evidence gap, plus an adversarial unchanged-objective Worker-BLOCKED reroute trace.

## 8. Next priority

Next workstream: `Private Artifact Plane / Result Transport`.

Goal: prove one private backend can carry bounded Worker assignment/result artifacts without leaking private content to the public GitHub control plane, then repeat the E2E path before promotion. Backend selection remains open; do not assume Drive is the winner because prior Drive create-new was blocked.
