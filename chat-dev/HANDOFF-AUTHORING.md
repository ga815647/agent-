# Chat Dev Handoff Authoring Guide

Status: SHADOW CANDIDATE / NON-AUTHORITATIVE GUIDE

This guide is a writing aid. It does not override runtime control truth, Project Profiles, canonical repo truth, active protocols, or accepted checkpoints.

## Principle

Preserve enough context to continue or execute correctly without reteaching durable truth.

**Constraints should protect boundaries, not replace reasoning.**

Use the shortest unambiguous artifact. Do not add structure merely for completeness.

## Rollover

Rollover = continuation delta.

Carry only non-durable edge state whose loss could make the next Orchestrator continue incorrectly:

- current workstream / NEXT OBJECTIVE;
- current unfinished execution position;
- pending dependency/blocker;
- task-local ordering, stop condition or refresh trigger;
- exact pointers needed to recover durable state.

Do not copy generic Chat Dev mechanics, stable accepted project state, or canonical protocol text already recoverable from durable sources.

Minimal shape when useful:

```text
你現在接任「<WORKSTREAM> Orchestrator」。

依 Project Instructions fresh rehydrate，並由 current durable pointers 解析 accepted state。

NEXT OBJECTIVE:
<objective>

Continue from:
<non-durable edge state; otherwise NONE>

Task-local constraints:
- <only what materially binds continuation>

Pending / refresh trigger:
<item; otherwise NONE>

Expected checkpoint / stop:
<checkpoint>
```

## Worker handoff

Worker handoff = execution contract + task delta.

Carry only what binds this Worker run:

- role/workstream;
- bounded objective/useful checkpoint;
- scope/out-of-scope;
- authority/write boundary;
- exact read path and active pins;
- run-specific state/IDs/revisions when material;
- required return artifact/evidence;
- stop condition;
- genuinely task-local constraints not safely recoverable from pinned sources.

These are semantic requirements, not mandatory headings.

Do not reteach generic O/W/BRAIN/Reviewer/Mutation Lock behavior or protocol-defined schemas when exact durable pointers are available.

Minimal shape when useful:

```text
ROLE=Bounded Worker
WORKSTREAM=<workstream>

OBJECTIVE
<bounded outcome>

AUTHORITY
<write / acceptance boundary>

FRESH READ
<exact current pointers / active pins>

RUN / TARGET BINDING
<only task-specific state that matters>

TASK
<bounded execution>

OUT OF SCOPE
<boundaries>

REQUIRED RETURN
<artifact / proposed deltas / blockers>

STOP
<useful checkpoint>
```

## Self-check

For each line ask:

- Is it run/continuation-specific or copied durable truth?
- Could removing it materially change execution/continuation correctness?
- Could it become a stale second copy?
- Does it protect a real boundary or merely narrow judgment?

When in doubt, omit and point to canonical truth.