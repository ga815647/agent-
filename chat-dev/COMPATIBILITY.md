# Chat Dev Compatibility Map

Status: SHADOW CANDIDATE / NON-AUTHORITATIVE

This file defines the intended post-activation disposition of existing Chat Dev durable sources. The goal is one current control entry without deleting useful module contracts, history, project-local state, or rollback sources prematurely.

## Core rule

After repo-centered activation, only one surface is the model runtime current-entry authority:

`Project Instructions shim -> chat-dev/BOOTSTRAP.md -> CONTROL_RELEASE`

Other documents may remain active module contracts, human dashboards, project-local truth, compatibility pointers, or historical evidence. They must not present themselves as a competing current runtime entry.

## Public repo disposition

| Existing source | Post-activation role | Action |
| --- | --- | --- |
| `chat-dev/BOOTSTRAP.md` | current runtime entry / release selector | ACTIVE authority when a Project shim points here |
| `chat-dev/ARCHITECTURE.md` | current cross-project architecture | ACTIVE canonical architecture |
| `chat-dev/BRAIN.md` | stable BRAIN interface | ACTIVE interface |
| `chat-dev/W.md` | stable W interface | ACTIVE interface |
| `chat-dev/HANDOFF-AUTHORING.md` | handoff writing guide | ACTIVE guide, non-runtime |
| `chat-dev/PROJECT-INSTRUCTIONS-SHIM.md` | installation/migration template | ACTIVE template, non-runtime |
| `chat-dev/ADOPT-CHAT-DEV.md` | human adoption entry | ACTIVE human guide, non-runtime |
| `chat-dev-control-plane-v0/ARCHITECTURE.md` | legacy baseline / compatibility pointer | after rollback window, mark legacy and point to `chat-dev/ARCHITECTURE.md`; preserve historical body or history |
| `chat-dev-control-plane-v0/BRAIN-AUTO-PILOT.md` | detailed BRAIN module contract during compatibility phase | RETAIN; it is not the current runtime entry and may be loaded only from the selected `CONTROL_RELEASE` |
| `chat-dev-control-plane-v0/MUTATION-LOCK.md` | Mutation Lock module contract | RETAIN active module contract; load from selected release |
| `reasoning-brake-v0/RUNTIME.md` | Reasoning Brake module contract | RETAIN active module contract; load from selected release |
| `reasoning-brake-v0/STAGE1-PILOT.md` | narrow Stage-1 module contract | RETAIN; load only when its condition is met and from selected release |
| `SIMPLIFICATION_CANDIDATE_V1.md`, `TRANSITION-SENTINEL-PILOT.md` and old PoCs | historical/evaluation evidence | RETAIN as history; never treat as current authority |

Do not mass-delete old repo files merely to make the tree look cleaner.

## Notion disposition

### `Chat Dev Durable`

Target role: human dashboard/index.

After all active Projects have migrated and the rollback baseline is separately preserved, it should point humans to:

- current repo runtime entry / architecture;
- active Project Profiles;
- development/history;
- rollback/history pointers when still useful.

It is not model runtime authority.

### `Chat Dev｜Current`

During staged migration: **leave the full v29 page unchanged** while any Project still bootstraps through it, and while it remains the simplest rollback target.

After all intended Projects are migrated and the rollback window closes:

1. preserve the full v29 state as an explicit rollback/history snapshot if continued rollback support is desired;
2. then demote `Chat Dev｜Current` to a compatibility pointer/dashboard entry that points to repo `chat-dev/BOOTSTRAP.md` and states that repo runtime authority is current.

Do not pointerize Current before the last Project that depends on v29 has migrated.

### `Chat Dev｜BRAIN` and `Chat Dev｜W`

During staged migration: leave unchanged because v29 Projects may still load them.

After Current is no longer a live v29 bootstrap source and the rollback window closes: demote to concise compatibility pointers to repo `chat-dev/BRAIN.md` and `chat-dev/W.md` respectively.

### Handoff Authoring Guide / Project Instructions Sample

Keep available during migration. After repo adoption is stable, convert to pointer-only guidance or archive as appropriate. They are not runtime authority.

### Project Profiles

Remain private/project-local. Do not migrate them into the public global Chat Dev repo merely for centralization.

Project Instructions carry the exact Project Profile pointer when one exists, so the public global control plane does not need a private Project inventory.

## Mixed-mode migration is intentional

During staged rollout it is valid for:

- migrated Project A to use repo bootstrap;
- unmigrated Project B to use Notion v29 Current;
- both to share the same project-local canonical sources where applicable.

This is not authority ambiguity because each Project has one explicit bootstrap kernel. Do not make a migrated Project consult Notion Current and repo BOOTSTRAP as co-equal runtime authorities.

## Rollback window

The simplest rollback while mixed mode exists is per-Project: restore that Project's old v29 Project Instructions bootstrap.

Therefore keep v29 `Current/BRAIN/W` intact until rollback is no longer expected or until an equivalent explicit v29 snapshot path has been proven.
