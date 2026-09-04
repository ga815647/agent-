# Chat Dev Handoff Authoring Guide

Status: SHADOW CANDIDATE / NON-AUTHORITATIVE GUIDE

This guide is a writing aid. It does not override runtime control truth, Project Profiles, canonical repo truth, active protocols, or accepted checkpoints.

## Principle

Preserve enough context to continue or execute correctly without reteaching durable truth.

**Constraints should protect boundaries, not replace reasoning.**

## Rollover

Rollover = continuation delta.

Carry only non-durable edge state whose loss could make the next Orchestrator continue incorrectly: current workstream/NEXT OBJECTIVE, unfinished execution position, pending dependency/blocker, task-local ordering/stop/refresh conditions, and exact pointers needed to recover durable state.

Do not copy generic Chat Dev mechanics, stable accepted project state, or canonical protocol text already recoverable from durable sources.

## Worker handoff

Worker handoff = execution contract + task delta.

Carry only what binds this Worker run: role/workstream, bounded objective, scope/out-of-scope, authority/write boundary, exact read path and active pins, run-specific state/IDs/revisions, required return, stop condition, and genuinely task-local constraints.

Do not reteach generic O/W/BRAIN/Reviewer/Mutation Lock behavior or protocol-defined schemas when exact durable pointers are available.

## Self-check

For each line ask:

- Is it run/continuation-specific or copied durable truth?
- Could removing it materially change execution/continuation correctness?
- Could it become a stale second copy?
- Does it protect a real boundary or merely narrow judgment?

When in doubt, omit and point to canonical truth.