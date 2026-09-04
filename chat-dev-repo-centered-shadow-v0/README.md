# Chat Dev Repo-Centered Control Plane — Shadow v0

Status: SHADOW / NON-AUTHORITATIVE / REVERSIBLE
Production baseline remains Chat Dev v29 in Notion `Chat Dev｜Current` plus the existing public architecture/contracts.

## Purpose

Evaluate a repo-centered durable control-plane layout without changing production authority.

The shadow separates three previously overloaded entry concepts:

1. **Project Instructions bootstrap shim** — the minimal out-of-band rule that tells a fresh Chat where to load current control truth.
2. **Runtime control entry / manifest** — the model-facing durable entry that selects the current control release and caller route semantics.
3. **Adoption / initialization entry** — the human-facing guide for bringing a new Project/repo into Chat Dev. This is not runtime bootstrap.

## Proposed authority split

Public repo owns cross-project Chat Dev control semantics and stable runtime interfaces.
Notion remains the default home for project-local routing, operational/research state, structured databases, and human-maintained dashboards/indexes.
Private `ga815647/chatdev-exec` remains reviewer execution/policy/result substrate only.

## Shadow files

- `PROJECT-INSTRUCTIONS-SHIM.md` — candidate minimal fresh-epoch kernel.
- `BOOTSTRAP.md` — candidate runtime control entry/manifest.
- `BRAIN.md` — candidate repo-owned stable BRAIN interface.
- `W.md` — candidate repo-owned stable W interface.
- `HANDOFF-AUTHORING.md` — candidate repo-owned handoff authoring guide.
- `ADOPT-CHAT-DEV.md` — human/new-repo adoption and initialization entry.
- `COLD-START-PROOF.md` — promotion proof matrix and rollback criteria.

## Non-goals

This shadow does not change Project Instructions, Notion Current/BRAIN/W authority, Project Profiles, reviewer policy, production routing, or active control semantics.
