# Chat Dev High-Salience Transition Sentinel Pilot

Status: RETIRED / SUPERSEDED — HISTORICAL EVIDENCE ONLY
Start date: 2026-09-03
Retired date: 2026-09-03
Superseded by: `chat-dev-control-plane-v0/BRAIN-AUTO-PILOT.md`

This caller-surface pilot is no longer active. Its underlying Stage-1 and dependency-join semantics remain active through their canonical authorities; only this two-surface Sentinel caller cue has been retired. Preserve this file as historical evidence and do not apply its caller cue as a second live overlay alongside BRAIN AUTO.

Scope: historical cross-project caller-side consistency evaluation at two demonstrated control-transition surfaces.

## Goal

Test whether one compact, high-salience transition cue reduces natural-use caller misses without adding a model call, external lookup, durable state machine, new authority, or broad control ceremony.

This pilot is explicitly **soft / non-deterministic**. It is not a latch, output gate, sandbox boundary, or fail-closed enforcement mechanism.

## Historical caller cue

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

This pilot did not:
- replace THIN FRAME;
- change Worker routing authority;
- change Reviewer/Worker join semantics;
- add a new reviewer/model call;
- add an external dependency registry or state service;
- expand into Mutation Lock;
- grant Workers new authority;
- claim deterministic or fail-closed enforcement.

Mutation action-family consistency remains governed separately by `MUTATION-LOCK.md`.

## Why this was a live pilot

The motivating failures occurred despite the correct Stage-1 and dependency-join prose already being present in the control plane. Prior representative-trace evaluation supported the smaller high-salience sentinel as a low-ceremony candidate with no modeled false blocking, no model call, and no new state/infrastructure, but did not measure actual natural-use compliance gain.

A later three-arm isolated proxy did not establish a material incremental benefit for a generalized Cognitive Gateway over the smaller sentinel and also did not establish Sentinel > distributed baseline. Subsequent architecture reassessment recognized that the distributed baseline already had decision-relevant live failures and that the relevant next question was broader: whether one caller-facing entry across control families is more usable in natural conversation. That hypothesis is now tested by `BRAIN-AUTO-PILOT.md`.

## Historical natural-use evidence plan

The Sentinel pilot intended to observe only naturally occurring sentinel-relevant transitions and track:
- Stage-1 miss or successful interception at a consequential + uncertain Worker handoff;
- premature dependent release or successful interception while a required Reviewer/Worker is active;
- false blocking of ordinary/confident Worker routing;
- false blocking of unrelated replies or terminal dependencies;
- noticeable ceremony/context burden;
- any evidence that the cue itself is being skipped under conversational load.

Its planned first-10 checkpoint is retired with the pilot and should not be combined with the BRAIN pilot count.

## Relationship to the frozen baseline

`chat-dev-control-plane-v0/ARCHITECTURE.md`, `reasoning-brake-v0/RUNTIME.md`, `reasoning-brake-v0/STAGE1-PILOT.md`, and `chat-dev-control-plane-v0/MUTATION-LOCK.md` remain authoritative for their existing semantics. Retiring this file retires only the Sentinel caller cue, not those underlying controls.
