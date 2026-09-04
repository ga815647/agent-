# Chat Dev Repo-Centered Architecture

Status: SHADOW CANDIDATE / NON-AUTHORITATIVE / REVERSIBLE

## 1. Goal

Reduce duplicated cross-project control truth while keeping project-local operational state in the substrate that actually owns it.

Target chain:

```text
Project Instructions bootstrap shim
        ↓
repo BOOTSTRAP.md at stable bootstrap pointer
        ↓
CONTROL_RELEASE=<immutable commit SHA>
        ↓
BRAIN.md / W.md / architecture + public control modules at same release
        ↓
relevant Project Profile only when needed
        ↓
project canonical durable truth
```

The Project Instructions shim exists because the runtime entry cannot bootstrap its own load.

## 2. Distinct entry concepts

1. **Bootstrap shim/kernel** — minimal out-of-band Project Instructions rule.
2. **Runtime control entry/manifest** — `BOOTSTRAP.md`; model-facing current control entry and immutable-release selector.
3. **Adoption/initialization** — `ADOPT-CHAT-DEV.md`; human-facing installation/adoption process, not runtime bootstrap.

## 3. Authority ownership

### Public `ga815647/agent-`
Owns cross-project Chat Dev control semantics and public-safe contracts:

- runtime caller-entry semantics;
- current control release selection;
- stable BRAIN/W interfaces;
- architecture/collaboration invariants;
- Mutation Lock and public Reasoning Brake semantics;
- handoff/adoption/Project Instructions authoring guidance.

### Private `ga815647/chatdev-exec`
Owns reviewer execution substrate, reviewer policy and private reviewer results only. It never overrides public semantics.

### Project-local durable source
Owns:

- Project Profile routing/authority/capability overrides;
- operational/research state;
- structured human-maintained state;
- product/technical truth in each project's canonical source.

Global Chat Dev mechanics must not be copied into Project Profiles.

## 4. Runtime invariants

Default actor is `O` unless explicitly assigned another role.

`O` alone owns Worker/Reviewer evidence acceptance, routing decisions, formal state transitions, commitments and final synthesis.

BRAIN and W are lazy capabilities.

Visible caller route remains binary:

- `ROUTE=DIRECT`
- `ROUTE=BRAIN`

BRAIN owns downstream Worker selection, dependency waiting, Mutation Lock application and hard-commitment review escalation.

Normal Worker transport remains human-mediated unless a future explicit production change replaces it.

## 5. Release coherence

`BOOTSTRAP.md` is read from the configured stable bootstrap pointer. It selects exactly one immutable `CONTROL_RELEASE` commit SHA.

All downstream Chat Dev public repo reads for that epoch use the same SHA. Never mix independently resolved mutable `main` reads for BRAIN/W/control contracts.

The stable bootstrap pointer is the intentionally mutable current-entry surface. Changing its selected release is itself a production control change.

See `RELEASE-CONTRACT.md`.

## 6. Compatibility with existing public docs

During shadow evaluation, current production files remain authoritative.

Candidate promotion policy:

- `chat-dev/` becomes the current control entry/interface layer;
- detailed module contracts that remain useful, including Mutation Lock and Reasoning Brake, stay in their existing module directories and are pinned by `CONTROL_RELEASE`;
- `chat-dev-control-plane-v0/ARCHITECTURE.md` stops being a competing current architecture authority and becomes a compatibility pointer or historical baseline;
- `BRAIN-AUTO-PILOT.md` may remain the detailed BRAIN implementation contract while `chat-dev/BRAIN.md` is the stable interface;
- no old production file is deleted merely for cosmetic cleanup.

## 7. Notion after activation

The goal is not to replace Notion globally.

`Chat Dev Durable` may remain a human dashboard/index. `Chat Dev｜Current`, `Chat Dev｜BRAIN`, `Chat Dev｜W` and the Handoff guide may later become pointer-only compatibility pages or be archived after the rollback window.

Project Profiles remain private/project-local by default.

## 8. Degraded bootstrap behavior

If the repo runtime entry cannot be loaded, do not invent current Chat Dev control semantics from memory for consequential/external actions.

Harmless ordinary conversation may continue only when it does not require current Chat Dev control truth. Control-plane changes, external mutations, dependency releases and other consequential commitments remain uncommitted until the approved path is available or an approved fallback is explicitly selected.

This is a behavioral rule, not deterministic fail-closed enforcement.

## 9. Production boundary

Shadow refactor, parity work and documentation cleanup are reversible local work.

Production activation begins only when a current authority/pointer changes: repo current entry, Project Instructions, Notion Current/BRAIN/W authority, or equivalent control semantics.

That boundary requires a fresh hard-commitment decision/review.