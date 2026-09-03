# Chat Dev High-Salience Transition Sentinel Pilot

Status: TEMPORARY LIVE EVALUATION OVERLAY — ACTIVE / REVERSIBLE
Start date: 2026-09-03
Scope: cross-project caller-side consistency at two demonstrated control-transition surfaces only.

## Goal

Test whether one compact, high-salience transition cue reduces natural-use caller misses without adding a model call, external lookup, durable state machine, new authority, or broad control ceremony.

This pilot is explicitly **soft / non-deterministic**. It is not a latch, output gate, sandbox boundary, or fail-closed enforcement mechanism.

## Caller cue

### PRE-WORKER
Immediately before emitting a Worker handoff:

```text
consequential-if-wrong + genuinely uncertain?
  yes → complete existing Stage-1 review and O re-decision before handoff
  no  → ordinary Worker routing
```

The sentinel does not make Stage-1 universal. Existing `reasoning-brake-v0/STAGE1-PILOT.md` semantics remain authoritative.

### PRE-DEPENDENT-RELEASE
Immediately before accepting, finalizing, or handing off a commitment:

```text
required production Reviewer or required Worker active for this commitment?
  yes → do not release the dependent commitment
  no  → continue under existing semantics
```

Progress updates and unrelated replies remain allowed only when they do not embed or transfer the blocked commitment.

## Explicit non-scope

This pilot does not:
- replace THIN FRAME;
- change Worker routing authority;
- change Reviewer/Worker join semantics;
- add a new reviewer/model call;
- add an external dependency registry or state service;
- expand into Mutation Lock;
- restore Cognitive Gateway / BRAIN AUTO;
- grant Workers new authority;
- claim deterministic or fail-closed enforcement.

Mutation action-family consistency remains governed separately by `MUTATION-LOCK.md`.

## Why this is a live pilot

The motivating failures occurred despite the correct Stage-1 and dependency-join prose already being present in the control plane. Prior representative-trace evaluation supported the smaller high-salience sentinel as a low-ceremony candidate with no modeled false blocking, no model call, and no new state/infrastructure, but did not measure actual natural-use compliance gain.

A later three-arm isolated proxy did not establish a material incremental benefit for a generalized Cognitive Gateway over the smaller sentinel and also did not establish Sentinel > distributed baseline. Therefore the remaining useful question is narrow and empirical: does the compact cue improve natural-use transition consistency enough to justify keeping it?

## Natural-use evidence

Observe only naturally occurring sentinel-relevant transitions. Do not manufacture cases merely to make the pilot look successful.

Record decision-relevant signals when they occur:
- Stage-1 miss or successful interception at a consequential + uncertain Worker handoff;
- premature dependent release or successful interception while a required Reviewer/Worker is active;
- false blocking of ordinary/confident Worker routing;
- false blocking of unrelated replies or terminal dependencies;
- noticeable ceremony/context burden;
- any evidence that the cue itself is being skipped under conversational load.

The first 10 natural sentinel-relevant transitions are an initial checkpoint only, not a statistical reliability claim.

## Interpretation / stop rule

Keep the pilot only if it provides useful consistency signal with negligible false blocking and ceremony.

Stop or revise the pilot if:
- it is repeatedly skipped and shows no practical gain;
- it causes material false blocking or conversation degradation;
- it expands into new model/state/infrastructure tax;
- new evidence shows a simpler no-change strategy is preferable.

A future hard-enforcement claim requires an actual runtime surface that owns dispatch/output release. This pilot never supplies that property.

## Relationship to the frozen baseline

`chat-dev-control-plane-v0/ARCHITECTURE.md`, `reasoning-brake-v0/RUNTIME.md`, `reasoning-brake-v0/STAGE1-PILOT.md`, and `chat-dev-control-plane-v0/MUTATION-LOCK.md` remain authoritative for their existing semantics. This file adds only a temporary caller-salience cue and evaluation boundary.
