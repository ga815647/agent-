# Chat Dev Repo-Centered Architecture — Shadow Candidate

Status: SHADOW / NON-AUTHORITATIVE / REVERSIBLE

This document defines the target authority topology for the repo-centered Chat Dev control plane. Production remains Chat Dev v29 until an explicit promotion.

## 1. Design goal

Reduce duplicated cross-project control truth without moving project-local operational state into the wrong substrate.

Target chain:

```text
Project Instructions bootstrap shim
        ↓
repo BOOTSTRAP.md at the stable bootstrap pointer
        ↓
CONTROL_RELEASE=<immutable commit SHA>
        ↓
BRAIN.md / W.md / architecture + module contracts at that same release
        ↓
relevant Project Profile only when needed
        ↓
project canonical durable truth
```

The Project Instructions shim exists only because a repo runtime entry cannot bootstrap its own load.

## 2. Entry semantics

Three concepts are intentionally distinct:

1. **Bootstrap shim/kernel** — out-of-band Project Instructions rule that tells a fresh Chat to load the repo runtime entry.
2. **Runtime control entry/manifest** — `BOOTSTRAP.md`; model-facing current control entry and immutable-release selector.
3. **Adoption/initialization** — `ADOPT-CHAT-DEV.md`; human-facing process for installing Chat Dev into a Project/repo. It is not runtime bootstrap.

Do not use `bootstrap` as a synonym for adoption.

## 3. Authority ownership

### Public `ga815647/agent-`
Owns cross-project Chat Dev control semantics and public-safe contracts:

- runtime caller-entry semantics;
- current control release selection;
- stable BRAIN interface;
- stable W interface;
- architecture and collaboration invariants;
- Mutation Lock and public Reasoning Brake semantics;
- handoff authoring guidance;
- Project Instructions/adoption templates.

### Private `ga815647/chatdev-exec`
Owns reviewer execution substrate, reviewer policy and private reviewer results only. It does not override public semantics.

### Project-local durable source, normally Notion + project repo
Owns:

- Project Profile routing/authority/capability overrides;
- operational and research state;
- structured human-maintained databases/dashboard state;
- project-specific product/technical truth in that project's canonical repo/source.

Global Chat Dev control truth must not be copied into Project Profiles.

## 4. Runtime roles

Default actor is `O` unless explicitly assigned another role.

`O` alone owns Worker/Reviewer evidence acceptance, routing decisions, formal state transitions, commitments and final synthesis.

`BRAIN` and `W` are lazy capabilities. Do not preload them during direct work.

The visible caller route remains binary:

- `ROUTE=DIRECT`
- `ROUTE=BRAIN`

BRAIN owns downstream Worker selection, dependency waiting, Mutation Lock application and hard-commitment review escalation.

## 5. Release coherence

`BOOTSTRAP.md` is read from the configured stable bootstrap pointer. During that read it selects exactly one immutable `CONTROL_RELEASE` commit SHA.

All downstream Chat Dev repo reads for that epoch use the same SHA. Never mix independently resolved mutable `main` reads for BRAIN/W/control contracts.

The stable bootstrap pointer is the only intentionally mutable cross-project entry. Its mutation is itself a production control change and must use the normal hard-commitment/review path.

See `RELEASE-CONTRACT.md`.

## 6. Existing public control documents

During shadow evaluation, existing production files remain authoritative.

Candidate promotion policy:

- this directory becomes the repo-centered control entry/interface layer;
- detailed module contracts that remain useful (for example Mutation Lock and Reasoning Brake runtime) stay in their current module directories and are pinned by the selected immutable release;
- `chat-dev-control-plane-v0/ARCHITECTURE.md` and `BRAIN-AUTO-PILOT.md` stop being competing current-entry authorities and become compatibility pointers or retained historical/detailed module documentation as appropriate;
- no production file is deleted merely to make the tree look clean. Retire only after pointers and rollback are proven.

## 7. Notion after promotion

Notion remains useful. The goal is not "move Notion to Git".

`Chat Dev Durable` may remain a human dashboard/index. `Chat Dev｜Current`, `Chat Dev｜BRAIN`, `Chat Dev｜W`, and the Handoff guide may later become pointer-only compatibility pages or be archived after the rollback window.

Project Profiles remain private/project-local by default.

## 8. Degraded bootstrap behavior

If the repo runtime entry cannot be loaded, do not invent current control semantics from memory for consequential/external actions.

Ordinary harmless conversation may continue only when it does not require current Chat Dev control truth. Consequential commitments, external mutations, control-plane changes, and dependency releases remain uncommitted until the approved bootstrap path is available or the user explicitly reroutes under an approved fallback.

This is a behavioral safety rule, not a claim of deterministic fail-closed enforcement.

## 9. Promotion boundary

Shadow refactor, parity work and documentation cleanup are reversible local work.

Production promotion begins only when any current authority/pointer is changed: repo `main` current control entry, Project Instructions, Notion Current/BRAIN/W authority, or other production control semantics.

That boundary requires a fresh hard-commitment decision/review.