# Chat Dev Repo-Centered Control Plane — Shadow Candidate

Status: SHADOW / NON-AUTHORITATIVE / REVERSIBLE
Production baseline remains Chat Dev v29.

## Purpose

Build the complete repo-centered target state before any production authority cutover.

This package is intentionally usable as both:

- a model-facing control-plane candidate; and
- a human-facing distribution/adoption package.

Those surfaces share one repository but do not share one entry document.

## Entry concepts

1. **Project Instructions bootstrap shim** — minimal out-of-band fresh-epoch kernel.
2. **Runtime control entry / manifest** — `BOOTSTRAP.md`, which carries current caller-entry semantics and selects one immutable control release.
3. **Adoption / initialization entry** — `ADOPT-CHAT-DEV.md`, for humans bringing a new Project/repo into Chat Dev.

Do not call adoption/bootstrap installation the runtime bootstrap.

## Target files

### Runtime / control

- `BOOTSTRAP.md` — current model-facing entry + release selector.
- `ARCHITECTURE.md` — authority topology and cross-project invariants.
- `BRAIN.md` — stable BRAIN interface.
- `W.md` — stable bounded Worker interface.
- `RELEASE-CONTRACT.md` — coherent immutable-release rules.

### Human / authoring

- `PROJECT-INSTRUCTIONS-SHIM.md` — minimal Project Instructions template.
- `ADOPT-CHAT-DEV.md` — adoption/initialization guide.
- `HANDOFF-AUTHORING.md` — rollover/Worker handoff writing guide.
- `MIGRATION.md` — v29 → repo-centered activation/compatibility plan.
- `COLD-START-PROOF.md` — deferred promotion smoke/proof checklist, not the main refactor workstream.

## Authority split

Public `ga815647/agent-` candidate owner:
- global Chat Dev control semantics;
- stable runtime interfaces;
- public-safe architecture/contracts/templates.

Private `ga815647/chatdev-exec`:
- reviewer execution/policy/results only.

Project-local durable sources:
- Project Profiles;
- operational/research state;
- structured human state;
- product/technical truth in each project's canonical source.

The goal is not to move all Notion content into Git.

## Production isolation

Everything in this directory remains shadow-only. Do not treat these files as current authority while production Projects still bootstrap through Chat Dev v29.

Production activation starts only when a current pointer/authority is changed. That later transition requires a fresh hard-commitment decision/review.