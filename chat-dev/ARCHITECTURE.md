# Chat Dev Repo-Centered Architecture

Authority: this architecture is current for a Project only when that Project's active bootstrap selects a `CONTROL_RELEASE` containing this file. Repository presence alone does not activate it.

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

A short confirmation such as `好`, `可以`, `go`, `改吧`, or `做` inherits the immediately preceding proposed action for caller-boundary detection.

A required Worker or production Reviewer dependency blocks only its dependent acceptance/final/handoff until terminal, explicitly rerouted/cancelled, or otherwise cleared under the active contract.

External mutation remains read-only until the intended effect, target resource type and exact target identity/destination are bound under Mutation Lock.

Normal Worker transport remains human-mediated unless a future explicit production change replaces it.

`ROLLOVER` remains same-role Orchestrator context-epoch renewal, not Worker delegation. Preserve only continuation delta/non-durable edge state and re-enter through the active bootstrap on the fresh epoch.

Before binding project-specific shorthand to durable meaning, use current conversation plus already-loaded durable truth first. Perform targeted lookup only when multiple materially different referents remain viable and choosing wrong would materially change the answer/route/commitment.

At the end of every final user-visible response under the active binary latch, append the exact active control-latch marker supplied by `BOOTSTRAP.md`.

This is a soft protocol; do not claim deterministic or fail-closed enforcement.

## 5. Release coherence

`BOOTSTRAP.md` is read from the configured stable bootstrap pointer. It selects exactly one immutable `CONTROL_RELEASE` commit SHA.

All downstream Chat Dev public repo reads for that epoch use the same SHA. Never mix independently resolved mutable `main` reads for BRAIN/W/control contracts.

The stable bootstrap pointer is the intentionally mutable current-entry surface. Changing its selected release is itself a production control change.

See `RELEASE-CONTRACT.md`.

## 6. Compatibility with existing public docs

Before repo-centered activation, the existing production files remain authoritative for Projects still bootstrapped through v29 Notion Current.

After activation, compatibility policy is:

- `chat-dev/` is the current control entry/interface layer for migrated Projects;
- detailed module contracts that remain useful, including Mutation Lock and Reasoning Brake, stay in their existing module directories and are pinned by `CONTROL_RELEASE`;
- `chat-dev-control-plane-v0/ARCHITECTURE.md` must not remain a competing current architecture authority; after the rollback window it becomes a compatibility pointer or historical baseline;
- `BRAIN-AUTO-PILOT.md` may remain the detailed BRAIN implementation contract while `chat-dev/BRAIN.md` is the stable interface;
- no old production file is deleted merely for cosmetic cleanup.

See `COMPATIBILITY.md`.

## 7. Notion after activation

The goal is not to replace Notion globally.

`Chat Dev Durable` remains useful as a human dashboard/index. `Chat Dev｜Current`, `Chat Dev｜BRAIN`, `Chat Dev｜W` and the Handoff guide remain intact while any Project still depends on v29 or while they are the active rollback source. Only after the rollback window closes should they become pointer-only compatibility pages or history/archive.

Project Profiles remain private/project-local by default.

## 8. Degraded bootstrap behavior

If the repo runtime entry cannot be loaded, do not invent current Chat Dev control semantics from memory for consequential/external actions.

Harmless ordinary conversation may continue only when it does not require current Chat Dev control truth. Control-plane changes, external mutations, dependency releases and other consequential commitments remain uncommitted until the approved path is available or an approved fallback is explicitly selected.

This is a behavioral rule, not deterministic fail-closed enforcement.

## 9. Activation boundary

Publishing these files to the repository does not by itself change a Project's runtime authority.

A Project enters repo-centered control when its active Project Instructions bootstrap loads repo `chat-dev/BOOTSTRAP.md`, which then selects an immutable `CONTROL_RELEASE`.

Changing the stable bootstrap selector, changing a Project's bootstrap kernel, demoting an existing production authority, or otherwise promoting canonical/control semantics is a hard-effect transition and uses the normal BRAIN / independent-review path.

See `ACTIVATION.md` and `MIGRATION.md`.