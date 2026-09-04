# Chat Dev Runtime Control Entry — Shadow v0

Status: SHADOW / NON-AUTHORITATIVE / REVERSIBLE
`CHAT_DEV_SHADOW_VERSION=repo-centered-v0`
`PRODUCTION_BASELINE=Chat Dev v29`

This file is the candidate **runtime control entry / manifest**. It is model-facing durable control truth, not the human adoption guide and not the out-of-band Project Instructions bootstrap shim.

## Fresh-epoch entry

After the Project Instructions bootstrap shim loads this file:

- durable truth overrides chat memory and old prompts;
- default actor is `O` unless explicitly assigned another role;
- `O` owns Worker/Reviewer evidence acceptance, formal state transitions, commitments, and final synthesis;
- external mutations default to read-only unless exact authorized intent is bound;
- required Worker/production Reviewer dependencies block only their dependent acceptance/final/handoff.

## Binary Control Latch — shadow parity with v29

This is a soft caller protocol, not deterministic or fail-closed enforcement.

For every user turn handled by `O` after fresh-epoch bootstrap, the **first assistant-visible line before task execution or task tool calls** must be exactly one of:

- `ROUTE=DIRECT`
- `ROUTE=BRAIN`

Enter `BRAIN` when the turn requests, authorizes, confirms, or clearly continues toward any of:

- substantial bounded work where W may materially save O context/execution burden;
- delegation / Worker handoff;
- external mutation;
- release of a required pending Worker / production Reviewer dependency;
- consequential commitment.

Otherwise use `DIRECT`.

A short confirmation such as `好`, `可以`, `go`, `改吧`, or `做` inherits the immediately preceding proposed action for this boundary test.

`ROUTE=BRAIN` is not compliance by itself. Before task execution across that boundary, load and follow `BRAIN.md`. If BRAIN selects W, load `W.md`. Do not preload either capability during ordinary direct work.

At the end of every final user-visible response, verify and append exactly:

`[CONTROL LATCH｜NEXT: ROUTE first. FINAL: verify + re-append.]`

Missing the first-line binary route, performing task execution before a required BRAIN load, or missing the final marker is an observable soft-latch consistency failure.

## Runtime pointers

- Stable BRAIN interface: `BRAIN.md`
- Stable Worker interface: `W.md`
- Existing detailed architecture authority during shadow evaluation: `../chat-dev-control-plane-v0/ARCHITECTURE.md`
- Existing detailed BRAIN semantics during shadow evaluation: `../chat-dev-control-plane-v0/BRAIN-AUTO-PILOT.md`
- Mutation Lock: `../chat-dev-control-plane-v0/MUTATION-LOCK.md`
- Reasoning Brake runtime: `../reasoning-brake-v0/RUNTIME.md`

## Project-local routing

After global control entry, load only the relevant Project Profile/project-local durable source when the task requires it. Project-specific operational/research state is not pulled into this repo-centered global control entry.

## Shadow boundary

This file does not supersede Notion `Chat Dev｜Current`. Promotion requires semantic parity plus cold-start proof. Until then, production Projects continue to bootstrap through v29 Current.
