# Chat Dev Control Plane v0

Status: HISTORICAL / COMPATIBILITY PROJECTION — NON-CURRENT

This file preserves the pre repo-centered control-plane lineage. It is **not** a competing current architecture authority and must not be used to reconstruct current runtime state.

## Current authority

For an active repo-centered Chat Dev epoch, use the exact `CONTROL_RELEASE` selected by `chat-dev/BOOTSTRAP.md` and read current semantics from that same immutable release:

- `chat-dev/CALLER.md` — caller cognition / route interface;
- `chat-dev/ARCHITECTURE.md` — current architecture and authority ownership;
- `chat-dev/BRAIN.md` plus the release-pinned detailed BRAIN contract when selected;
- `chat-dev/W.md` — Worker eligibility, transport selection, authority and evidence contract;
- `chat-dev-control-plane-v0/MUTATION-LOCK.md` — mutation binding semantics;
- `reasoning-brake-v0/RUNTIME.md` — independent-review semantics.

The stable bootstrap path selects the release; mutable `main`, old Notion dashboards, this historical document, and chat memory are not substitutes for the release-pinned runtime contract.

## Compatibility mapping

The useful invariants carried forward from this lineage are now owned by the current repo-centered interfaces:

- O remains the default actor and retains final evidence acceptance, formal state transition, commitment and synthesis authority.
- Caller route selection is internal control state under `chat-dev/CALLER.md`; protocol compliance does not require a visible route line.
- BRAIN owns downstream Worker selection, dependency waiting, Mutation Lock application and review escalation.
- Worker transport is capability-selected under `chat-dev/W.md`. Eligible contributor-safe bounded cognition prefers the private Runtime Wrapper; unsupported, private, tool-rich, mutation-capable or explicitly rerouted work uses the human-mediated fresh Worker Chat path.
- Worker output remains evidence only regardless of transport; transport never transfers O authority.
- Production Reviewer semantics are public, while mutable production reviewer model and reasoning effort are owned by private `ga815647/chatdev-exec/reviewer-policy.json`. This file intentionally does not copy those values as current truth.
- Required Worker/Reviewer dependencies block only their dependent acceptance/final/handoff.
- External mutation still requires exact effect/resource/target binding before write execution.

## Historical boundary

Older descriptions in repository history may refer to Notion `Chat Dev｜Current` bootstrap, visible caller-route ceremony, a human-mediated-only Worker baseline, fixed Worker models, or copied Reviewer model/effort values. Those are historical snapshots, not current instructions.

Do not reactivate a retired lane or infer a current mutable value from repository history. Re-activation or a new control-semantic promotion requires an explicit new O decision and the normal independent-review path.

## Why this file remains

Some old links and evidence refer to `chat-dev-control-plane-v0/ARCHITECTURE.md`. Keeping a small compatibility projection preserves provenance without maintaining two live architecture descriptions.

For current architecture, always follow `chat-dev/ARCHITECTURE.md` from the active immutable `CONTROL_RELEASE`.
