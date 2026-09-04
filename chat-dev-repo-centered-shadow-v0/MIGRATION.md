# Chat Dev Repo-Centered Migration Plan — Shadow Candidate

Status: SHADOW / NON-AUTHORITATIVE

This plan separates target-state refactor from production activation.

## Phase 1 — Shadow target-state refactor

No production authority changes.

- finalize `BOOTSTRAP.md`, `ARCHITECTURE.md`, `BRAIN.md`, `W.md`;
- finalize `PROJECT-INSTRUCTIONS-SHIM.md`, `HANDOFF-AUTHORING.md`, `ADOPT-CHAT-DEV.md`;
- define immutable release semantics in `RELEASE-CONTRACT.md`;
- map every v29 control responsibility to exactly one target owner;
- remove semantic duplication inside the shadow candidate;
- retain existing production documents untouched.

## Phase 2 — Semantic parity / compatibility audit

Compare target candidate against production v29 for at least:

- fresh-epoch bootloader invariant;
- binary first-visible caller route;
- short-confirmation inheritance;
- lazy BRAIN/W loading;
- Worker authority and human-mediated transport;
- dependency joins;
- Mutation Lock;
- hard A-E Reasoning Brake gate;
- O-only acceptance/commitment authority;
- final control-latch marker;
- project-local Profile routing;
- degraded bootstrap behavior.

Any material missing semantic is fixed in shadow before activation.

## Phase 3 — Build immutable candidate release

Create one candidate commit containing the complete repo-centered release snapshot.

Record its exact commit SHA as the proposed `CONTROL_RELEASE`.

No Project Instructions or Notion authority changes are required yet.

A lightweight fresh-epoch/smoke proof may be performed here or immediately before activation. A heavy standalone canary program is not part of the main refactor workstream.

## Phase 4 — Production activation decision

Form one bounded activation commitment:

- selected release SHA;
- stable bootstrap pointer;
- exact Project Instructions shim;
- compatibility behavior for Notion Current/BRAIN/W;
- rollback release/path.

Because this changes production canonical/control semantics, run the normal hard-commitment review before activation.

## Phase 5 — Staged activation

Preferred order:

1. Make the repo-centered candidate available at its final canonical repo path without yet changing existing Project Instructions.
2. Activate the stable repo `BOOTSTRAP.md` selector for the accepted release.
3. Update Project Instructions to the minimal repo bootstrap shim in a controlled staged manner.
4. Keep Notion `Current/BRAIN/W` available as compatibility/rollback sources during the rollback window.
5. After stable use, demote those Notion pages to pointer-only/index roles where appropriate.

Do not move project operational/research state as part of this activation.

## Compatibility mapping

| Production v29 source | Target owner | Post-activation disposition |
| --- | --- | --- |
| Project Instructions bootstrap kernel | Project Instructions minimal shim | retained, smaller |
| Notion `Chat Dev｜Current` | repo `BOOTSTRAP.md` + `ARCHITECTURE.md` | compatibility pointer/dashboard entry |
| Notion `Chat Dev｜BRAIN` | repo `BRAIN.md` + detailed BRAIN contract | compatibility pointer |
| Notion `Chat Dev｜W` | repo `W.md` + architecture Worker section | compatibility pointer |
| Notion Handoff Authoring Guide | repo `HANDOFF-AUTHORING.md` | pointer/archive after rollback window |
| Notion Project Instructions Sample | repo `PROJECT-INSTRUCTIONS-SHIM.md` / adoption guide | pointer/archive as appropriate |
| Project Profiles | project-local durable source | remain project-local |
| `chat-dev-control-plane-v0/ARCHITECTURE.md` | repo-centered `ARCHITECTURE.md` | compatibility pointer or historical baseline |
| `BRAIN-AUTO-PILOT.md` | detailed BRAIN implementation contract | retain if still useful; no longer competing entry authority |
| Mutation Lock / Reasoning Brake modules | existing public module files | retain and pin by release SHA |

## Rollback

Before retiring any old authority, keep a known-good path back to v29.

Rollback must not require reconstructing project operational state. The migration moves control authority/pointers, not project state.