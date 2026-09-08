# Chat Dev Project Profile Contract

Status: PUBLIC AUTHORING / VALIDATION CONTRACT — NOT RUNTIME BOOTSTRAP INPUT

This contract derives from the active release-pinned `chat-dev/ARCHITECTURE.md`. It does not override that architecture, change caller/BRAIN/W runtime semantics, or require an additional fresh-epoch preload. Use it when creating, auditing or repairing a Project Profile.

## Purpose

A Project Profile is a **project-local overlay**, not another Chat Dev control plane and not a copy of project canonical truth.

Its job is only to bridge:

```text
release-pinned Chat Dev control
        ↓
Project Profile
        ↓
project canonical durable truth
```

A correct Profile answers three questions with the least durable duplication possible:

1. **What project / scope is this?**
2. **Where does a fresh Orchestrator route to recover the project's current durable truth?**
3. **What project-specific authority, capability, delivery or execution boundary differs from the cross-project default, if any?**

The third class is optional. A Project that needs routing but no override must not invent one merely to satisfy a template.

## Required semantic classes

A Profile needs only:

### 1. Project identity / scope

Identify the Project closely enough to avoid routing into a different project, product, or usage surface.

### 2. Current durable-authority route

Point to the source that owns the Project's current product/technical/operational truth and give the minimum fresh-read path needed to reach it.

Valid shapes include:

- canonical repository + repo first entry/read order;
- a project-local Notion authority when no canonical backend exists yet;
- another explicit project-local durable source.

Repository existence alone never creates an authority transition. If no canonical repo/backend exists, say so and point to the actual interim owner.

## Optional semantic classes

Include these only when the Project actually needs them:

- project-specific decision-authority boundaries;
- standing merge/delivery/live-proof authorization with bounded scope;
- project-specific execution/capability boundaries;
- Development / Usage or other project-surface boundaries;
- domain, upstream or downstream routing pointers;
- an explicit migration/authority-transition condition for an interim owner.

These are semantic classes, not required headings or a fixed schema.

## Placement and single-owner rules

### Cross-project Chat Dev mechanics

Do not copy global O/BRAIN/W/Reviewer/Mutation Lock/dependency/transport/runtime-entry semantics into a Profile. Those come from the active release-pinned Chat Dev control plane.

### Project truth

Do not duplicate product specifications, technical rules, validation truth, implementation state, research conclusions or current progress that already has a canonical project-local owner. Point to the owner.

### Dynamic state

A value that may change without promoting this Profile must have exactly one live owner.

Do not copy current SHAs, PRs, workflow runs, provider/runtime versions, progress, temporary checkpoints, activation runs/statuses, or version bundles into the Profile when another live source owns them.

A Profile may itself be the deliberate live owner of a **routing choice**. In that case, keep the routing pin as small as possible: point to the exact selected registry/source identity and let that source own its internal version bundle, release metadata and detailed semantics.

### Private execution state

Private Chat Dev execution implementation/state in `ga815647/chatdev-exec` is not Project Profile truth. A Profile may describe a project-specific capability boundary, but must not duplicate mutable private execution configuration.

## Compatibility / evolution

- Existing Profiles are not normalized merely to match a preferred layout.
- A working legacy Profile remains valid when its routing, authority ownership and boundaries satisfy this contract.
- Repair only concrete duplication, stale authority, misrouting, or boundary defects.
- No-repo Projects are valid: a compact Profile may route to a project-local durable authority until an explicit authority transition is accepted.
- Project Profiles remain private/project-local by default. The public global Chat Dev control plane does not require a private Project inventory.

## Non-authority

A Profile does not:

- override the active public Chat Dev control release except for explicit project-specific overrides permitted by that control plane;
- grant W or another backend O's final acceptance/commitment authority;
- make a repo, page, run, or implementation canonical merely by linking to it;
- turn volatile external evidence into durable truth merely by mentioning it.
