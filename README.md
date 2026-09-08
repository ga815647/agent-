# Chat Dev

Chat Dev is a repo-centered control and orchestration architecture for using ChatGPT Projects as persistent project orchestrators without turning ordinary conversation into a heavy workflow.

Its runtime model is intentionally split by responsibility:

```text
ChatGPT Project Instructions bootstrap shim
        ↓
chat-dev/BOOTSTRAP.md
        ↓
CONTROL_RELEASE=<immutable commit>
        ↓
lazy BRAIN / W / control modules
        ↓
Project-local Profile and canonical project truth
```

The Orchestrator (`O`) retains final acceptance and commitment authority. Stronger controls are loaded only when the actual task boundary requires them.

## Public and private surfaces

This public repository (`ga815647/agent-`) owns **cross-project Chat Dev semantics and public-safe contracts**: bootstrap/release semantics, O/BRAIN/W authority and collaboration rules, Mutation Lock and Reasoning Brake semantics, adoption/handoff guidance, and non-authoritative validation/projection aids.

The separate private repository (`ga815647/chatdev-exec`) owns the owner's **production execution substrate and mutable execution state**. Current production surfaces there include the production Reviewer runner/policy, Runtime Wrapper and Runtime Entry transport, contributor-safe Spark execution, the Restate-backed runtime adapter/spine, the routed mutation executor subset, and execution-local evidence/validation plumbing.

The private execution plane implements public contracts; it does not define or override O/BRAIN/W authority or public control semantics. Conversely, this public repository must not duplicate mutable private runtime values such as current provider/model/output budgets, mailbox identifiers, runner-local configuration, or other execution-local state as current truth when a live private owner exists.

Project Profiles remain project-local overlays for project-specific routing/authority/capability differences. Product/technical/current-progress truth remains in each project's own canonical durable source. Notion may remain a human dashboard/index and a private Profile substrate, but it is not global Chat Dev runtime authority after repo-centered activation.

Not every historical or experimental file in this repository is current runtime authority. For an active Chat Dev epoch, follow the release selected by `chat-dev/BOOTSTRAP.md`.

## Design principles

- **Keep control at the narrowest correct scope.** Cross-project Chat Dev mechanics belong in the global control layer; project-local truth stays with the Project; task-specific constraints stay task-local.
- **One live owner for mutable execution state.** A machine-readable value intentionally changeable without public `CONTROL_RELEASE` promotion belongs to the artifact actually consumed by the active execution path; documentation points to it rather than copying it as current truth.
- **Execution is not authority.** Runtime services, Workers and Reviewers produce bounded effects/evidence under public contracts; `O` retains acceptance and commitment authority.
- **Prefer concrete failure evidence over speculative prompt growth.** Add or retain controls for observable, material failure modes. When further review only produces hypothetical edge cases, test the system instead of continuing to grow the prompt.

## Start reading

- [`chat-dev/BOOTSTRAP.md`](chat-dev/BOOTSTRAP.md) — current model-facing runtime entry and release selector.
- [`chat-dev/ARCHITECTURE.md`](chat-dev/ARCHITECTURE.md) — repo-centered architecture and authority ownership.
- [`chat-dev/BRAIN.md`](chat-dev/BRAIN.md) — lazy cognitive/control interface.
- [`chat-dev/W.md`](chat-dev/W.md) — bounded Worker interface.
- [`reasoning-brake-v0/RUNTIME.md`](reasoning-brake-v0/RUNTIME.md) — independent hard-commitment review contract.
- [`chat-dev-control-plane-v0/MUTATION-LOCK.md`](chat-dev-control-plane-v0/MUTATION-LOCK.md) — external mutation binding control.
- [`chat-dev/VALIDATION.md`](chat-dev/VALIDATION.md) — non-authoritative promotion/drift checks.

Chat Dev is primarily a working architecture and control plane, not a turnkey hosted product or one-click installer.
