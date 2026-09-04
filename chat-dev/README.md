# Chat Dev

Status: SHADOW CANDIDATE / NON-AUTHORITATIVE / REVERSIBLE
Production baseline remains Chat Dev v29 until explicit activation.

This directory is the proposed canonical public control-plane surface for repo-centered Chat Dev.

## Runtime/control

- `BOOTSTRAP.md` — model-facing current entry and immutable release selector.
- `ARCHITECTURE.md` — authority topology and cross-project invariants.
- `BRAIN.md` — stable BRAIN interface.
- `W.md` — stable bounded Worker interface.
- `RELEASE-CONTRACT.md` — coherent release/pinning rules.

## Human/authoring

- `PROJECT-INSTRUCTIONS-SHIM.md` — minimal bootstrap kernel template.
- `ADOPT-CHAT-DEV.md` — human/new-repo adoption entry.
- `HANDOFF-AUTHORING.md` — rollover/Worker handoff authoring guide.
- `MIGRATION.md` — activation, compatibility and rollback plan.
- `VALIDATION.md` — lightweight/deferred promotion validation checklist.
- `PARITY-AUDIT.md` — current v29 → repo-centered static responsibility audit.

## Core split

Project Instructions contain only the unavoidable out-of-band bootstrap shim.

`BOOTSTRAP.md` is the runtime entry.

`ADOPT-CHAT-DEV.md` is for humans installing/adopting Chat Dev and is not runtime bootstrap.

Global Chat Dev control semantics belong here. Project Profiles, operational/research state and project-specific truth stay in their project-local canonical sources.

Nothing in this directory is production authority while this work exists only on the shadow branch.