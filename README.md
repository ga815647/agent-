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
release-pinned CALLER / BRAIN / W / control modules
        ↓
Project-local Profile and canonical project truth
```

The Orchestrator (`O`) retains final acceptance and commitment authority. Stronger controls are loaded only when the actual task boundary requires them.

## Authority and repository head

For an active Chat Dev epoch, runtime authority comes from the immutable `CONTROL_RELEASE` selected by `chat-dev/BOOTSTRAP.md`. Repository `main` is the current source/development head and may contain newer accepted source or documentation that is not active runtime control until a release promotion selects it.

Do not reconstruct current runtime semantics from repository history, old PoCs, compatibility documents, or memory when the release-pinned source is available.

## Public and private surfaces

This public repository (`ga815647/agent-`) owns **cross-project Chat Dev semantics, public-safe contracts, and public-safe implementation families whose source ownership has been explicitly promoted here**. That includes bootstrap/release semantics, O/BRAIN/W authority and collaboration rules, Mutation Lock and Reasoning Brake semantics, adoption/handoff guidance, Runtime Entry source, mutation-PREPARE source, and their public deterministic tests where present.

The separate private repository (`ga815647/chatdev-exec`) owns the owner's **deployment/execution substrate, private mutable policy/state, secret-sensitive glue, deployment projections/manifests, and execution evidence**. Private paths may consume exact immutable public source SHAs; those deployment identities are operational state and are independent of `CONTROL_RELEASE` unless a specific contract says otherwise.

The private execution plane implements public contracts; it does not define or override O/BRAIN/W authority or public control semantics. Conversely, this public repository must not duplicate mutable private runtime values such as current provider/model/output budgets, mailbox identifiers, runner configuration, adapter availability, or owner-specific deployment state as current truth when a live private owner exists.

Project Profiles remain project-local overlays for project-specific routing/authority/capability differences. Product, technical, and current-progress truth remains in each project's own canonical durable source.

## Start reading

### Active runtime/control entry

- [`chat-dev/BOOTSTRAP.md`](chat-dev/BOOTSTRAP.md) — stable model-facing entry and immutable release selector.
- [`chat-dev/CALLER.md`](chat-dev/CALLER.md) — release-pinned caller cognition and route contract.
- [`chat-dev/ARCHITECTURE.md`](chat-dev/ARCHITECTURE.md) — current repo-centered authority topology.
- [`chat-dev/BRAIN.md`](chat-dev/BRAIN.md) — lazy cognitive/control interface.
- [`chat-dev/W.md`](chat-dev/W.md) — bounded Worker interface and executor-eligibility contract.
- [`chat-dev/RUNTIME-ENTRY.md`](chat-dev/RUNTIME-ENTRY.md) — Runtime Entry sequencing and receipt contract.
- [`chat-dev/RELEASE-CONTRACT.md`](chat-dev/RELEASE-CONTRACT.md) — release/pinning coherence.

### Active module contracts

- [`reasoning-brake-v0/RUNTIME.md`](reasoning-brake-v0/RUNTIME.md) — independent hard-commitment review contract.
- [`chat-dev-control-plane-v0/MUTATION-LOCK.md`](chat-dev-control-plane-v0/MUTATION-LOCK.md) — external mutation binding control.

### Public-safe runtime source

- [`chat-dev-runtime-v0/`](chat-dev-runtime-v0/) — public source-owned runtime families and deterministic tests. Private production deploys may pin exact source SHAs from here.

### Human adoption and authoring

- [`chat-dev/ADOPT-CHAT-DEV.md`](chat-dev/ADOPT-CHAT-DEV.md) — human adoption entry.
- [`chat-dev/PROJECT-INSTRUCTIONS-SHIM.md`](chat-dev/PROJECT-INSTRUCTIONS-SHIM.md) — minimal Project Instructions bootstrap template.
- [`chat-dev/PROJECT-PROFILE.md`](chat-dev/PROJECT-PROFILE.md) — Project Profile contract.
- [`chat-dev/HANDOFF-AUTHORING.md`](chat-dev/HANDOFF-AUTHORING.md) — rollover/Worker handoff authoring guide.
- [`chat-dev/WORK-MANAGEMENT.md`](chat-dev/WORK-MANAGEMENT.md) — durable work/knowledge placement guidance.
- [`chat-dev/VALIDATION.md`](chat-dev/VALIDATION.md) — non-authoritative validation/promotion checks.

### Compatibility and history

`chat-dev/COMPATIBILITY.md`, `chat-dev/ACTIVATION.md`, `chat-dev/MIGRATION.md`, and `chat-dev/PARITY-AUDIT.md` preserve the repo-centered migration/activation lineage. They are not current runtime entry documents. Historical control-plane candidates and old PoCs remain provenance/evidence unless a current release explicitly names them as an active module contract.

## Design principles

- **Keep control at the narrowest correct scope.** Cross-project Chat Dev mechanics belong in the global control layer; project-local truth stays with the Project; task-specific constraints stay task-local.
- **One live owner per fact.** Public semantics, public-safe source, private deployment state, private mutable policy/evidence, and project truth should not silently duplicate one another as co-equal current truth.
- **Execution is not authority.** Runtime services, Workers and Reviewers produce bounded effects/evidence under public contracts; `O` retains acceptance and commitment authority.
- **Prefer boundary/JIT reconstruction over model-memory growth.** State or rules that can be deterministically re-derived at a natural boundary should not become permanent context by default.
- **Prefer concrete failure evidence over speculative prompt growth.** Add or retain controls for observable, material failure modes; test the system instead of indefinitely growing reminder prose.

Chat Dev is primarily a working architecture and control plane, not a turnkey hosted product or one-click installer.
