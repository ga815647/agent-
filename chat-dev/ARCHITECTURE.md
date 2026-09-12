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
Owns cross-project Chat Dev control semantics, public-safe contracts, and public-safe runtime implementation families whose source ownership has been explicitly promoted here, including:

- runtime caller-entry semantics;
- current control release selection;
- stable caller/BRAIN/W interfaces;
- architecture/collaboration invariants;
- Mutation Lock and public Reasoning Brake semantics;
- handoff/adoption/Project Instructions authoring guidance;
- public-safe Runtime Entry implementation/tests;
- public-safe mutation PREPARE implementation/tests.

A public source commit and an active `CONTROL_RELEASE` are distinct identities. Public-safe executable source may be deployed by exact immutable source SHA without that deployment SHA becoming the active control release.

### Private `ga815647/chatdev-exec`
Owns private deployment/execution substrate, private mutable operational state, secret-sensitive glue and operational evidence plumbing, including:

- production Reviewer execution substrate, reviewer policy and private reviewer results;
- Runtime Wrapper transport, bounded snapshot/read aggregation, contributor-safe Spark execution plumbing, and private exact-source deployment pointers/projections for public Runtime Entry and mutation PREPARE;
- private online/external execution adapters and their machine-consumed deployment/capability state;
- Restate-backed runtime-spine state where that path is actually used;
- routed hard Mutation Gate/live-adapter implementation for the supported subset;
- execution-local/durable dispatch state and raw/compact execution evidence produced by those paths.

A byte-identical private deployed projection of a public-safe source family is not a second source owner. Private deployment/source pointers are operational state and remain independent of public `CONTROL_RELEASE` unless a specific public contract explicitly binds them.

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

For public-source/private-deploy runtime families, the private machine-consumed deployment manifest owns the exact deployed source selection. The public repository owns the implementation source and tests; the manifest's deployed source SHA does not become `CONTROL_RELEASE`.

For bounded private execution bridges/adapters, the active private machine-consumed deployment/capability artifact owns owner-specific adapter availability and accepted operational limitations. Public architecture describes the authority boundary, not a copied current adapter matrix.

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

Worker execution is capability-selected under `W.md`:

- freeze the bounded Worker contract, data-handling class, residual required capability set, and existing effect/authority boundary before executor selection;
- choose only an executor whose current evidence/policy proves it eligible for the full frozen requirement set;
- provider/model/transport identity is implementation plumbing and never grants W authority;
- trusted preprocessing/hydration may satisfy an input dependency without granting its credential/connector/mutation authority to W, but it must preserve provenance and actual data sensitivity;
- fallback/reroute may substitute only another independently eligible executor under the same frozen contract; transport failure never creates capability escalation;
- if no eligible executor exists, return to O for narrowing, decomposition, explicit new bounded authorization, or a separately verified manual path;
- transport choice changes plumbing only and does not change W authority, evidence status, dependency semantics, or O's final acceptance/commitment authority;
- a wrapper dispatch with durable claim but no validated terminal evidence is `AMBIGUOUS` and must not auto-resubmit.

Current executor/provider/adapter availability and capability evidence are mutable operational state owned by the active instance/project implementation; this architecture does not hard-code one owner-specific executor ladder.

### Exact-source retrieval robustness

When runtime work requires an exact authoritative source/version/revision, **transport incompleteness is not automatically authority failure**.

A correct exact source that returns a truncated or partial body should be recovered through bounded same-source continuation, targeted section reads, pagination, or equivalent connector-supported retrieval when available. All recovered material must retain the same authoritative source/version identity.

Do not substitute another source/version, cached summary, or memory reconstruction merely to bypass truncation.

`BLOCKED` is appropriate when the required exact source is wrong, missing, inaccessible, authority-mismatched, or remains unrecoverable after bounded same-source retrieval. Do not encode single-call completeness as a generic requirement unless the active task-specific protocol has a substantive evidence reason for it.

This invariant applies to O and W source loading; W-specific execution behavior is described in `W.md`.

`ROLLOVER` remains same-role Orchestrator context-epoch renewal, not Worker delegation. Preserve only continuation delta/non-durable edge state and re-enter through the active bootstrap on the fresh epoch.

Before binding project-specific shorthand to durable meaning, use current conversation plus already-loaded durable truth first. Perform targeted lookup only when multiple materially different referents remain viable and choosing wrong would materially change the answer/route/commitment.

When the active caller interface requires a Runtime Entry attempt report, append its exact receipt marker as specified by `CALLER.md`. Ordinary delivery in `NOT_REQUIRED` has no marker and makes no execution-success claim.

This is a soft protocol; do not claim deterministic or fail-closed enforcement beyond the specific runtime checks actually implemented by an execution substrate.

## 5. Release coherence

`BOOTSTRAP.md` is read from the configured stable bootstrap pointer. It selects exactly one immutable `CONTROL_RELEASE` commit SHA and loads the caller interface from that release before normal work.

All downstream Chat Dev public repo reads for that epoch, including `CALLER.md`, BRAIN/W and detailed control contracts, use the same SHA. Never mix independently resolved mutable `main` reads for runtime contracts.

The stable bootstrap pointer is the intentionally mutable current-entry surface. Changing its selected release is itself a production control change.

See `RELEASE-CONTRACT.md`.

## 6. Compatibility and historical migration material

`chat-dev/` is the current repo-centered control entry/interface layer for Projects whose active Project Instructions load repo `BOOTSTRAP.md`. Detailed module contracts that remain useful, including Mutation Lock and Reasoning Brake, stay in their existing module directories and are pinned by `CONTROL_RELEASE`.

Historical migration/activation documents may preserve v29, mixed-mode rollout, shadow-candidate, or rollback-window details. They are provenance/compatibility material unless a current contract explicitly grants them an active role; they are not co-equal current runtime entry authorities.

`chat-dev-control-plane-v0/ARCHITECTURE.md` is a compatibility/historical projection and must not compete with this architecture. `BRAIN-AUTO-PILOT.md` may remain a detailed BRAIN module contract while `chat-dev/BRAIN.md` is the stable interface, but its caller-entry semantics defer to `CALLER.md` from the same release.

No old file is deleted merely for cosmetic cleanup. Archive/retire only after its active/non-active role is proven and useful provenance is preserved.

See `COMPATIBILITY.md` for migration lineage.

## 7. Notion and project-local durable state

The goal is not to replace Notion globally.

Notion may remain a human dashboard/index and may host private/project-local state where a Project explicitly points to it. A repo-centered Project does not treat legacy Notion Chat Dev control pages as co-equal global runtime authority with repo `BOOTSTRAP.md`.

If a Project intentionally uses an approved legacy bootstrap path, that Project's explicit bootstrap kernel defines its authority; do not infer global current authority from the continued existence of old Notion pages.

Project Profiles remain private/project-local by default.

## 8. Degraded bootstrap behavior

If the repo runtime entry or required caller interface cannot be loaded, do not invent current Chat Dev control semantics from memory for consequential/external actions.

Harmless ordinary conversation may continue only when it does not require current Chat Dev control truth. Control-plane changes, external mutations, dependency releases and other consequential commitments remain uncommitted until the approved path is available or an approved fallback is explicitly selected.

This is a behavioral rule, not deterministic fail-closed enforcement.

## 9. Activation / promotion boundary

Publishing files to repository `main` does not by itself change an already-running epoch's release-pinned runtime authority.

A repo-centered Project enters through its active Project Instructions bootstrap, which loads repo `chat-dev/BOOTSTRAP.md`; that stable entry selects an immutable `CONTROL_RELEASE` and loads `CALLER.md` from the same release.

Changing the stable bootstrap selector, changing a Project's bootstrap kernel, demoting an existing production authority, or otherwise promoting canonical/control semantics is a hard-effect transition and uses the normal BRAIN / independent-review path.

Historical activation/migration steps remain available in `ACTIVATION.md` and `MIGRATION.md` for provenance and rollback lineage; they are not current runtime entry authority.
