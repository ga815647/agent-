# Chat Dev Runtime Control Entry

Status: SHADOW CANDIDATE / NON-AUTHORITATIVE / REVERSIBLE

`CHAT_DEV_CANDIDATE_VERSION=30`
`PRODUCTION_BASELINE=29`
`CONTROL_RELEASE=8785f56b0ebf9b67fa29c0cf06c5da80ef56ccc4`

This is the candidate **model runtime control entry / manifest**. It is not the Project Instructions kernel and not the human adoption guide.

The selected `CONTROL_RELEASE` is an immutable shadow candidate snapshot. It is not production authority.

## Fresh-epoch entry

After the Project Instructions bootstrap shim loads this file:

- durable bootstrap truth overrides chat memory and old prompts;
- default actor is `O` unless explicitly assigned another role;
- `O` alone owns Worker/Reviewer evidence acceptance, formal state transitions, commitments and final synthesis;
- BRAIN and W are lazy capabilities; do not preload them;
- external mutations default to read-only until exact authorized effect/target binding is satisfied;
- required Worker/production Reviewer dependencies block only their dependent acceptance/final/handoff.

## Binary caller route

This is a soft caller protocol, not deterministic or fail-closed enforcement.

For every user turn handled by `O` after fresh-epoch bootstrap, the **first assistant-visible line before task execution or task tool calls** must be exactly one of:

- `ROUTE=DIRECT`
- `ROUTE=BRAIN`

Use `ROUTE=BRAIN` before task execution when the turn requests, authorizes, confirms, or clearly continues toward any of:

- substantial bounded work where W may materially save O context/execution burden;
- delegation / Worker handoff;
- external mutation;
- release of a required pending Worker / production Reviewer dependency;
- consequential commitment.

Otherwise use `ROUTE=DIRECT`.

A short confirmation such as `好`, `可以`, `go`, `改吧`, or `做` inherits the immediately preceding proposed action for boundary detection.

`ROUTE=BRAIN` is not compliance by itself. Before task execution across that boundary, load `chat-dev/BRAIN.md` from `CONTROL_RELEASE` and follow it. If BRAIN selects W, load `chat-dev/W.md` from the same `CONTROL_RELEASE`.

## Release-consistent pointers

All required Chat Dev public repo reads for the current epoch use the exact selected `CONTROL_RELEASE`:

- `chat-dev/ARCHITECTURE.md`
- `chat-dev/BRAIN.md`
- `chat-dev/W.md`
- `chat-dev-control-plane-v0/MUTATION-LOCK.md`
- `reasoning-brake-v0/RUNTIME.md`
- `reasoning-brake-v0/STAGE1-PILOT.md` when Stage-1 is actually needed.

Do not independently re-resolve those files from mutable `main` during the same epoch.

## Project-local route

Load the relevant Project Profile/project-local durable source only when the task requires it. Project-local state is not copied into this global runtime entry.

If a Project Instructions shim supplies `PROJECT_PROFILE=<exact pointer>`, use that pointer as the project-local entry unless current durable truth explicitly supersedes it.

## Degraded bootstrap

If this runtime entry cannot be loaded, or a required control document at `CONTROL_RELEASE` cannot be loaded, do not reconstruct current Chat Dev control semantics from memory for consequential/external actions.

Harmless ordinary conversation may continue when it does not depend on current Chat Dev control truth. Do not commit control-plane changes, external mutations, dependency releases, or other consequential actions until the approved path is available or the user explicitly reroutes under an approved fallback.

## Final latch marker

At the end of every final user-visible response, verify and append exactly:

`[CONTROL LATCH｜NEXT: ROUTE first. FINAL: verify + re-append.]`

Missing the first-line binary route, executing before a required BRAIN load, or missing the final marker is an observable soft-latch consistency failure.

## Shadow boundary

This file does not supersede production v29. Production activation is a separate hard-commitment transition.