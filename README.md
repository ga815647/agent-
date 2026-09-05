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

This public repository (`ga815647/agent-`) contains the public-safe Chat Dev control semantics, architecture, stable runtime interfaces, selected control modules, and historical/experimental evidence.

The private execution plane used by the repository owner for independent reviewer execution is separate (`ga815647/chatdev-exec`). It contains the owner's private workflow/runner surface and Codex-authenticated execution environment. It is not a public execution service, and reading this public repository does not grant access to or trigger that private plane.

Not every historical or experimental file in this repository is current runtime authority. For an active Chat Dev epoch, follow the release selected by `chat-dev/BOOTSTRAP.md`.

## Design principles

- **Keep control at the narrowest correct scope.** Cross-project Chat Dev mechanics belong in the global control layer; project-local truth stays with the Project; task-specific constraints stay task-local.
- **Prefer concrete failure evidence over speculative prompt growth.** Add or retain controls for observable, material failure modes. When further review only produces hypothetical edge cases, test the system instead of continuing to grow the prompt.

## Start reading

- [`chat-dev/BOOTSTRAP.md`](chat-dev/BOOTSTRAP.md) — current model-facing runtime entry and release selector.
- [`chat-dev/ARCHITECTURE.md`](chat-dev/ARCHITECTURE.md) — repo-centered architecture and authority ownership.
- [`chat-dev/BRAIN.md`](chat-dev/BRAIN.md) — lazy cognitive/control interface.
- [`chat-dev/W.md`](chat-dev/W.md) — bounded Worker interface.
- [`reasoning-brake-v0/RUNTIME.md`](reasoning-brake-v0/RUNTIME.md) — independent hard-commitment review contract.
- [`chat-dev-control-plane-v0/MUTATION-LOCK.md`](chat-dev-control-plane-v0/MUTATION-LOCK.md) — external mutation binding control.

Chat Dev is primarily a working architecture and control plane, not a turnkey hosted product or one-click installer.
