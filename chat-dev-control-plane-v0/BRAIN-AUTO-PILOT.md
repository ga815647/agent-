# Chat Dev Thin BRAIN AUTO Pilot

Status: TEMPORARY LIVE EVALUATION OVERLAY — ACTIVE / REVERSIBLE
Start date: 2026-09-03
Scope: caller-facing cognitive-control entry only.

## Goal

Test whether one high-salience caller entry reduces natural-use control misses caused by distributed recall obligations.

`BRAIN AUTO` is a local cognitive dispatch cue, not another model call, service, MCP, state machine, authority layer, or hard latch. It does not change the semantics of THIN FRAME, Worker routing, Stage-1, Reviewer/Worker join, Mutation Lock, or Reasoning Brake.

## Caller surface

At a **control transition** — when O is about to cross from ordinary reasoning into execution routing/handoff, dependent release, external mutation, or consequential commitment — invoke one local entry:

```text
BRAIN AUTO
```

The caller does not separately recall each downstream control first. BRAIN resolves which existing control family is relevant, if any.

## Resolution

`BRAIN AUTO` may resolve to one or more of:

```text
NONE
FRAME / ROUTE
JOIN / WAIT
MUTATION BINDING
DECISION BRAKE
```

Use the existing canonical semantics underneath:

- `FRAME / ROUTE` → `chat-dev-control-plane-v0/ARCHITECTURE.md` and existing THIN FRAME / Worker routing rules.
- `JOIN / WAIT` → existing required Reviewer / Worker dependency semantics. A pending required dependency blocks only the dependent acceptance/final/handoff.
- `MUTATION BINDING` → `chat-dev-control-plane-v0/MUTATION-LOCK.md`; bind intended mutation effect/resource/target before action discovery/selection.
- `DECISION BRAKE` → existing `reasoning-brake-v0/RUNTIME.md` trigger and runtime semantics.
- `NONE` → continue ordinary reasoning/action with no added ceremony.

For a proposed Worker handoff, existing Stage-1 semantics remain unchanged: if routing/decomposition is materially consequential if wrong and genuinely uncertain, complete the existing Stage-1 review and O re-decision before handoff.

When multiple existing controls apply, preserve their existing prerequisites and sequencing. BRAIN adds no new priority rule and no new authority.

## Non-scope

This pilot does not:
- add a model call merely to execute BRAIN;
- change Worker authority or transport;
- change Reviewer/Worker join semantics;
- make Stage-1 universal;
- expand or weaken Mutation Lock;
- replace the current Reasoning Brake contract;
- create an external dependency registry or durable state service;
- claim deterministic, fail-closed, sandbox, or output-gate enforcement;
- change the frozen canonical baseline underneath this temporary caller-surface overlay.

## Why live-test this

The distributed caller-control baseline has already produced live Stage-1 and Reviewer-join misses even with the relevant prose loaded. A frozen three-arm isolated proxy later showed the thin BRAIN caller surface at 10/10, internal resolution at 9/9, correct simple/direct bypass, and a smaller caller surface, but could not establish natural-use superiority because the clean proxy ceilinged.

That is enough viability evidence for a reversible live pilot, not a production-reliability claim.

## Natural-use evidence

Observe naturally occurring control transitions only. Do not manufacture cases merely to accumulate a count.

Track decision-relevant signals when they occur:
- whether BRAIN itself is remembered at the transition;
- missed or correctly intercepted Stage-1, join, mutation-binding, or decision-brake transitions;
- wrong downstream control-family resolution;
- false activation / ceremony on ordinary direct work;
- whether long-context / rollover conditions degrade recall;
- any measurable reduction in caller-side rule juggling.

The first 10 natural BRAIN-relevant transitions are an initial checkpoint only, not a statistical reliability claim.

## Stop / revise rule

Stop or revise if BRAIN is repeatedly skipped, materially increases ceremony/false blocking, or causes wrong control-family routing. Keep it only if the single-entry surface improves practical consistency with negligible tax.

Hard enforcement still requires a runtime surface that actually owns dispatch/output/action release; this pilot does not provide one.

## Relationship to baseline

`chat-dev-control-plane-v0/ARCHITECTURE.md`, `chat-dev-control-plane-v0/MUTATION-LOCK.md`, `reasoning-brake-v0/STAGE1-PILOT.md`, and `reasoning-brake-v0/RUNTIME.md` remain authoritative for their existing semantics. This file changes only the caller-facing entry used to reach them during the pilot.
