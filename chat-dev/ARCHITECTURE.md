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
CALLER.md + BRAIN.md / W.md / architecture + public control modules at same release
        ↓
relevant Project Profile only when needed
        ↓
project canonical durable truth
```

The Project Instructions shim exists because the runtime entry cannot bootstrap its own load.

## 2. Distinct entry concepts

1. **Bootstrap shim/kernel** — minimal out-of-band Project Instructions rule.
2. **Runtime control entry/manifest** — `BOOTSTRAP.md`; model-facing current release selector and fresh-epoch loader.
3. **Caller cognition interface** — `CALLER.md`; release-pinned `GROUND -> ROUTE -> RECONSIDER` caller contract.
4. **Adoption/initialization** — `ADOPT-CHAT-DEV.md`; human-facing installation/adoption process, not runtime bootstrap.

## 3. Authority ownership

### Public `ga815647/agent-`
Owns cross-project Chat Dev control semantics and public-safe contracts:

- runtime caller-entry semantics;
- current control release selection;
- stable caller/BRAIN/W interfaces;
- architecture/collaboration invariants;
- Mutation Lock and public Reasoning Brake semantics;
- handoff/adoption/Project Instructions authoring guidance.

### Private `ga815647/chatdev-exec`
Owns private execution substrate and operational evidence plumbing, including:

- production Reviewer execution substrate, reviewer policy and private reviewer results;
- Runtime Wrapper implementation for bounded snapshot/read aggregation, mutation PREPARE, and contributor-safe Spark W execution;
- execution-local/durable dispatch state and raw/compact execution evidence produced by those paths.

Private execution artifacts implement public contracts but never override public authority/control semantics. Execution evidence/state is not automatically canonical project truth; O retains acceptance/promotion authority under the active public contract.

### Project-local durable source
Owns:

- Project Profile routing/authority/capability overrides;
- operational/research state;
- structured human-maintained state;
- product/technical truth in each project's canonical source.

Global Chat Dev mechanics must not be copied into Project Profiles.

### Dynamic operational state

A value that is intentionally allowed to change without promoting a new public `CONTROL_RELEASE` must have exactly one live owning source.

Rules:

- the artifact actually consumed by the active execution path is authoritative for that mutable value;
- narrative README/dashboard/control documents must not duplicate the value as **current** state;
- those documents may contain a pointer to the live owner and may retain dated historical snapshots only when explicitly labeled as historical evidence;
- when answering a question about current mutable operational state, fresh-read the owning artifact rather than inferring from promotion prose, historical evidence, memory, or a compatibility dashboard;
- if an operational state has no stable owning artifact, do not manufacture a second pseudo-SSOT in documentation; either derive it from the active implementing artifacts or introduce an explicit owner only when the implementation will actually consume/maintain it.

For the current private Reviewer path, `ga815647/chatdev-exec/reviewer-policy.json` is the live authority for production reviewer model and reasoning effort because the production workflow consumes it. Public Reasoning Brake docs own reviewer **semantics**, not the mutable model/effort value.

For the Runtime Wrapper contributor lane, the active private workflow/adapter owns mutable provider/model/output-budget/runtime configuration because that execution path consumes it. Public `W.md` owns Worker eligibility, transport/fallback semantics, authority boundaries and evidence status; it must not duplicate mutable private runtime settings as current truth.

This rule prevents descriptive documentation from becoming a competing, silently stale current-state copy.

## 4. Runtime invariants

Default actor is `O` unless explicitly assigned another role.

`O` alone owns Worker/Reviewer evidence acceptance, formal state transitions, commitments and final synthesis.

`CALLER.md` defines `O`'s normal caller-entry cognition and primary route-selection procedure. This does not create another actor or transfer final authority. `O` does not routinely re-run a valid caller-route result; only the exception-only correction defined by `CALLER.md` may override a missing/malformed or explicitly contradictory result.

BRAIN and W are lazy capabilities.

Visible caller route remains binary:

- `ROUTE=DIRECT`
- `ROUTE=BRAIN`

The caller cognition envelope is intentionally small:

```text
GROUND -> ROUTE -> RECONSIDER
```

`RECONSIDER` is bounded and stop-early. Ordinary BRAIN-routed turns do not receive a second post-BRAIN reconsideration pass. When a BRAIN-routed turn is itself evaluating a proposed method/solution, BRAIN uses its existing single bounded goal/alternative slot for the caller interface's means-independent comparison before operational controls.

BRAIN owns downstream Worker selection, dependency waiting, Mutation Lock application and hard-commitment review escalation.

A short confirmation such as `好`, `可以`, `go`, `改吧`, or `做` inherits the immediately preceding proposed action for caller-boundary detection.

A required Worker or production Reviewer dependency blocks only its dependent acceptance/final/handoff until terminal, explicitly rerouted/cancelled, or otherwise cleared under the active contract.

External mutation remains read-only until the intended effect, target resource type and exact target identity/destination are bound under Mutation Lock.

Worker transport is capability-selected under `W.md`:

- eligible cognition-only contributor-safe bounded jobs prefer the private Runtime Wrapper typed transport;
- private, tool-rich, unsupported, wrapper-unavailable, or explicitly rerouted jobs use the human-mediated fresh Worker Chat path;
- transport choice changes plumbing only and does not change W authority, evidence status, dependency semantics, or O's final acceptance/commitment authority;
- a wrapper dispatch with durable claim but no validated terminal evidence is `AMBIGUOUS` and must not auto-resubmit.

### Exact-source retrieval robustness

When runtime work requires an exact authoritative source/version/revision, **transport incompleteness is not automatically authority failure**.

A correct exact source that returns a truncated or partial body should be recovered through bounded same-source continuation, targeted section reads, pagination, or equivalent connector-supported retrieval when available. All recovered material must retain the same authoritative source/version identity.

Do not substitute another source/version, cached summary, or memory reconstruction merely to bypass truncation.

`BLOCKED` is appropriate when the required exact source is wrong, missing, inaccessible, authority-mismatched, or remains unrecoverable after bounded same-source retrieval. Do not encode single-call completeness as a generic requirement unless the active task-specific protocol has a substantive evidence reason for it.

This invariant applies to O and W source loading; W-specific execution behavior is described in `W.md`.

`ROLLOVER` remains same-role Orchestrator context-epoch renewal, not Worker delegation. Preserve only continuation delta/non-durable edge state and re-enter through the active bootstrap on the fresh epoch.

Before binding project-specific shorthand to durable meaning, use current conversation plus already-loaded durable truth first. Perform targeted lookup only when multiple materially different referents remain viable and choosing wrong would materially change the answer/route/commitment.

At the end of every final user-visible response under the active caller interface, append the exact active control-latch marker supplied by `CALLER.md`.

This is a soft protocol; do not claim deterministic or fail-closed enforcement beyond the specific runtime checks actually implemented by an execution substrate.

## 5. Release coherence

`BOOTSTRAP.md` is read from the configured stable bootstrap pointer. It selects exactly one immutable `CONTROL_RELEASE` commit SHA and loads the caller interface from that release before normal work.

All downstream Chat Dev public repo reads for that epoch, including `CALLER.md`, BRAIN/W and detailed control contracts, use the same SHA. Never mix independently resolved mutable `main` reads for runtime contracts.

The stable bootstrap pointer is the intentionally mutable current-entry surface. Changing its selected release is itself a production control change.

See `RELEASE-CONTRACT.md`.

## 6. Compatibility with existing public docs

Before repo-centered activation, the existing production files remain authoritative for Projects still bootstrapped through v29 Notion Current.

After activation, compatibility policy is:

- `chat-dev/` is the current control entry/interface layer for migrated Projects;
- `chat-dev/CALLER.md` is the current release-pinned caller cognition interface;
- detailed module contracts that remain useful, including Mutation Lock and Reasoning Brake, stay in their existing module directories and are pinned by `CONTROL_RELEASE`;
- `chat-dev-control-plane-v0/ARCHITECTURE.md` must not remain a competing current architecture authority; after the rollback window it becomes a compatibility pointer or historical baseline;
- `BRAIN-AUTO-PILOT.md` may remain the detailed BRAIN implementation contract while `chat-dev/BRAIN.md` is the stable interface, but its caller-entry semantics must defer to `CALLER.md` from the same release;
- no old production file is deleted merely for cosmetic cleanup.

See `COMPATIBILITY.md`.

## 7. Notion after activation

The goal is not to replace Notion globally.

`Chat Dev Durable` remains useful as a human dashboard/index. `Chat Dev｜Current`, `Chat Dev｜BRAIN`, `Chat Dev｜W` and the Handoff guide remain intact while any Project still depends on v29 or while they are the active rollback source. Only after the rollback window closes should they become pointer-only compatibility pages or history/archive.

Project Profiles remain private/project-local by default.

## 8. Degraded bootstrap behavior

If the repo runtime entry or required caller interface cannot be loaded, do not invent current Chat Dev control semantics from memory for consequential/external actions.

Harmless ordinary conversation may continue only when it does not require current Chat Dev control truth. Control-plane changes, external mutations, dependency releases and other consequential commitments remain uncommitted until the approved path is available or an approved fallback is explicitly selected.

This is a behavioral rule, not deterministic fail-closed enforcement.

## 9. Activation boundary

Publishing these files to the repository does not by itself change a Project's runtime authority.

A Project enters repo-centered control when its active Project Instructions bootstrap loads repo `chat-dev/BOOTSTRAP.md`, which then selects an immutable `CONTROL_RELEASE` and loads `CALLER.md` from that release.

Changing the stable bootstrap selector, changing a Project's bootstrap kernel, demoting an existing production authority, or otherwise promoting canonical/control semantics is a hard-effect transition and uses the normal BRAIN / independent-review path.

See `ACTIVATION.md` and `MIGRATION.md`.