# Chat Dev control surface

This directory is the primary public navigation surface for repo-centered Chat Dev control contracts.

Repository presence alone does not activate Chat Dev for a Project. An active Project enters through its Project Instructions bootstrap shim, which loads `BOOTSTRAP.md`; `BOOTSTRAP.md` then selects one immutable `CONTROL_RELEASE`. Runtime reads use that release rather than mutable `main`.

## Active runtime/control contracts

These are the normal current-entry documents. For runtime use, read them from the exact active `CONTROL_RELEASE`.

- `BOOTSTRAP.md` — stable model-facing entry and immutable release selector.
- `CALLER.md` — release-pinned `GROUND -> ROUTE -> RECONSIDER` caller contract.
- `ARCHITECTURE.md` — cross-project authority and ownership topology.
- `BRAIN.md` — lazy BRAIN interface.
- `W.md` — bounded Worker interface and executor-eligibility contract.
- `RUNTIME-ENTRY.md` — Runtime Entry sequencing, dependency, and receipt contract.
- `RELEASE-CONTRACT.md` — coherent release/pinning rules.

Detailed active module contracts may live outside this directory, including:

- `../chat-dev-control-plane-v0/MUTATION-LOCK.md` — mutation binding semantics;
- `../reasoning-brake-v0/RUNTIME.md` — independent hard-commitment review semantics.

## Human adoption / authoring / operations guidance

These documents guide humans or authoring flows; they are not independent runtime authorities.

- `ADOPT-CHAT-DEV.md` — human/new-repo adoption entry.
- `PROJECT-INSTRUCTIONS-SHIM.md` — minimal bootstrap-kernel template.
- `PROJECT-PROFILE.md` — thin Project Profile contract.
- `HANDOFF-AUTHORING.md` — rollover and Worker-handoff authoring guide.
- `WORK-MANAGEMENT.md` — guidance for choosing GitHub, Notion, or optional Linear as authoritative homes for work/knowledge.
- `VALIDATION.md` — non-authoritative promotion/drift validation guidance.

## Compatibility / migration history

The following files preserve the repo-centered migration and activation lineage. They are useful for provenance, compatibility, and rollback history, but are **not** current runtime-entry contracts:

- `COMPATIBILITY.md`
- `ACTIVATION.md`
- `MIGRATION.md`
- `PARITY-AUDIT.md`

Their older references to v29, shadow-candidate activation, or mixed-mode migration describe the historical transition that produced the repo-centered architecture. Do not use them to reconstruct current runtime state when the active release-pinned contracts are available.

Likewise, `../chat-dev-control-plane-v0/ARCHITECTURE.md` is already a historical/compatibility projection. Other files in that legacy directory remain active only when a current contract explicitly names them as module contracts (for example `MUTATION-LOCK.md`); candidate/pilot files are provenance rather than current entry authority.

## Public source / private deploy split

Public-safe runtime implementation families whose source ownership has been promoted live under `../chat-dev-runtime-v0/` with their deterministic tests. Current examples include Runtime Entry and mutation PREPARE.

Owner-specific deployment transport, exact deployed-source pointers, mutable provider/capability policy, secret-sensitive glue, and private execution evidence remain in the private execution plane. A private deployed projection of public source is not a second source owner.

## Project-local truth

Project Instructions contain only the unavoidable out-of-band bootstrap shim plus genuine Project-local instructions/pointers. Project Profiles and project/product technical truth stay in their own canonical durable sources; global Chat Dev mechanics are not copied into them.

For a fresh runtime epoch, start at `BOOTSTRAP.md`. For a human adopting Chat Dev, start at `ADOPT-CHAT-DEV.md`.
