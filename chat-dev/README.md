# Chat Dev

This directory is the canonical-shape public control-plane surface for repo-centered Chat Dev.

Repository presence alone does not activate it for a Project. Runtime authority is per-Project: the Project Instructions bootstrap chooses whether that Project enters repo `BOOTSTRAP.md` or a prior approved bootstrap path.

## Runtime/control

- `BOOTSTRAP.md` — model-facing stable entry and immutable release selector.
- `ARCHITECTURE.md` — authority topology and cross-project invariants.
- `BRAIN.md` — stable BRAIN interface.
- `W.md` — stable bounded Worker interface.
- `RELEASE-CONTRACT.md` — coherent release/pinning rules.

## Human/authoring

- `PROJECT-INSTRUCTIONS-SHIM.md` — minimal bootstrap kernel template.
- `ADOPT-CHAT-DEV.md` — human/new-repo adoption entry.
- `HANDOFF-AUTHORING.md` — rollover/Worker handoff authoring guide.
- `COMPATIBILITY.md` — disposition of legacy repo/Notion sources.
- `ACTIVATION.md` — exact staged production cutover and rollback contract.
- `MIGRATION.md` — overall migration phases.
- `VALIDATION.md` — lightweight/deferred validation checklist.
- `PARITY-AUDIT.md` — v29 → repo-centered static responsibility audit.

## Core split

Project Instructions contain only the unavoidable out-of-band bootstrap shim plus genuine Project-local instructions/pointers.

`BOOTSTRAP.md` is the model runtime entry.

`ADOPT-CHAT-DEV.md` is for humans installing/adopting Chat Dev and is not runtime bootstrap.

Global Chat Dev control semantics belong here. Project Profiles, operational/research state and project-specific truth stay in their project-local canonical sources.

## Activation model

`BOOTSTRAP.md` selects one exact immutable `CONTROL_RELEASE`. Downstream Chat Dev repo control reads use that same release.

A Project becomes repo-centered only when its active Project Instructions bootstrap loads this repo entry. This allows staged mixed-mode migration while the prior v29 Notion bootstrap remains intact for unmigrated Projects and rollback.