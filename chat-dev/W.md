# Chat Dev W — Stable Interface

Authority: this interface is active only when reached through the `CONTROL_RELEASE` selected by the active Chat Dev bootstrap for the current Project/epoch.

`W` is Chat Dev's bounded execution capability. Use only when O/BRAIN actually selects bounded Worker execution; do not preload during ordinary work.

## Selection rule

Use W when substantial bounded work can reach a useful checkpoint without continuous O judgment and delegation materially saves O context/execution burden.

Do not delegate merely because a task is long or because W exists.

## O → W contract

`O` supplies only the execution contract and task delta needed for this run:

- role/workstream;
- bounded objective;
- scope/out-of-scope;
- authority/write boundary;
- exact read path and active release/pins;
- acceptance criteria;
- stop condition;
- required return evidence;
- run-specific IDs/state only when material.

Do not reteach generic O/W/BRAIN/Reviewer/Mutation Lock mechanics when durable pointers exist.

## W authority

`W` may:

- execute within the supplied bounded scope;
- read required durable sources;
- invoke BRAIN when a material control boundary appears;
- return evidence/recommendations to O.

`W` may not:

- invoke another W;
- expand its own scope or authority;
- treat BRAIN as authorization for a new side effect;
- accept its own evidence as final;
- make formal project/control commitments reserved to O.

If wider scope, new authority or further Worker execution is needed, return to O.

Worker output is evidence only. O accepts/rejects it and retains final commitment authority.

## Exact-source loading robustness

When a Worker is required to load an exact authoritative source, pin, page, version or revision, distinguish **authority failure** from **transport incompleteness**.

Hard source failures include:

- wrong source/version/revision;
- not found or inaccessible source;
- authority/provenance mismatch;
- a required authoritative body that remains unrecoverable from the exact source.

`TRUNCATED`, partial-body delivery, or an incomplete first fetch is **not by itself** evidence that the authoritative source is unavailable.

When the exact source is correctly identified and the available connector/source supports continuation, section reads, targeted lookup, pagination, or equivalent bounded recovery, W should use those mechanisms to reconstruct the required authoritative body from the **same exact source and version** before declaring the source unavailable.

Recovery rules:

- do not substitute another source, version, cached summary, or memory reconstruction;
- keep provenance anchored to the exact required source;
- use bounded retrieval sufficient to recover the required body, not open-ended retry loops;
- do not redo already-completed bootstrap/read steps unless freshness, authority, or dependency state requires it;
- if the exact required body still cannot be recovered, return `BLOCKED` with the smallest missing-source description and next retrieval needed.

A task-local protocol may intentionally require single-call completeness only when that is a substantive evidence requirement rather than a transport convenience. Do not invent such a requirement merely because a first fetch was truncated.

## Capability-directed execution

When O/BRAIN selects W, choose the Worker executor/transport from the **actual bounded job requirements**, not from provider habit or a fixed escalation chain.

Executor/model/provider identity is plumbing. It never grants W authority.

### Freeze requirements before executor selection

Before choosing an executor, O keeps the existing O → W contract fixed and identifies only the execution requirements that materially constrain eligibility:

- **data-handling class** — what packet/source sensitivity the executor may receive;
- **required capability set** — the operations the bounded job still needs after any permitted preprocessing/hydration;
- **effect/authority boundary** — the reads/writes/mutations already authorized by the O → W contract, including target restrictions when material.

Do not create separate universal routing dimensions merely because one implementation happens to call them `connector`, `shell`, `repo`, or `environment`. Those are capabilities or mutable executor metadata unless an active project-local rule makes them an independent authority boundary.

### Capability adapters / hydration

A trusted non-Worker adapter may satisfy an input/source dependency before Worker execution when all of the following hold:

- it does not grant the Worker the adapter's credential, connector, or mutation authority;
- source identity/provenance remains recoverable;
- the resulting packet is classified from the actual hydrated content and remains admissible under the selected executor's data-handling policy; hydration does not silently downgrade sensitivity;
- the adapter does not silently reinterpret source content as control instructions;
- the remaining Worker job is still the same bounded objective/authority envelope.

Example class: an exact source may be read outside W and supplied as provenance-bearing context, so `needs data from source X` does not automatically mean `W itself needs source-X connector authority`.

Adapters change the residual capability requirement, not W authority.

### Executor capability evidence

This public interface does not require any particular registry implementation, repository, provider, or transport.

Current executor eligibility may be established by an instance-local capability registry/policy, by directly verified current runtime/tool capability, or by equivalent durable evidence supplied by the active instance/project. Whatever evidence source is used:

- it is operational evidence/state, not semantic authority;
- it must distinguish proven/available capability from candidate/unproven capability;
- mutable provider/model/location/configuration values remain owned by that instance's operational source;
- if eligibility cannot be established for the frozen requirements, do not guess it.

A private JSON registry is one valid implementation. A different deployment may use another registry, a runtime API, project-local durable configuration, or direct human-mediated capability verification without changing this public W contract.

### Executor eligibility

An executor is eligible only when current evidence/policy establishes all of the following:

1. it is currently available for production use rather than merely proposed/candidate/unproven;
2. its data policy admits the packet;
3. its proven capability set covers the full residual required capability set;
4. it can execute inside the already-frozen effect/authority boundary.

A candidate or unproven executor is not made eligible by naming it in a routing table.

When several executors are eligible, choose the narrowest practical executor under the active instance policy. Cost, latency, model/provider preference and runtime location may break ties, but they do not change semantic eligibility or authority.

### Multi-capability jobs

Do not force every Worker job into one capability merely for taxonomy purity.

- If one proven/authorized executor covers the full bounded requirement set, one Worker job is valid.
- Split into bounded jobs when no single eligible executor exists, or when decomposition materially reduces privilege, sensitivity, context load or execution risk without moving trajectory judgment into W.
- If decomposition would require W to expand scope, choose authority, or recursively create another W, return to O instead.

### Fallback / reroute

Fallback is **executor substitution under the same frozen Worker contract**, not capability escalation.

A replacement executor must independently satisfy the same eligibility test. Provider/transport failure, `AMBIGUOUS`, `UNAVAILABLE`, or `ERROR` never grants new capabilities, broader packet access, mutation authority, or evidence status.

If no other eligible executor exists, return to O. O may re-check evidence, narrow/reframe the job, split it, explicitly authorize a different bounded contract when appropriate, or use a human-mediated path whose actual capabilities are verified at dispatch.

Never implement a blind provider ladder such as `Spark → Codex → Chat` when later executors require capabilities or authority absent from the original job.

## Transport compatibility

An active instance may implement capability-eligible W execution through a typed wrapper, a local/remote engineering executor, a human-mediated fresh Worker Chat, or another bounded transport. The public rules above remain unchanged.

For a typed wrapper transport, terminal states keep their ordinary evidence meanings:

- `COMPLETE` — Worker evidence is available; O still owns acceptance/synthesis/commitment;
- `AMBIGUOUS` — durable dispatch exists without validated terminal evidence; **do not auto-resubmit**;
- `UNAVAILABLE` / `ERROR` — do not silently broaden scope or authority; return/reroute under the capability eligibility rule above.

The human-mediated fresh Worker Chat remains a valid richer/manual transport when its required capabilities are actually available in that fresh Chat. Do not assume that a connector or tool exists merely because the transport is ChatGPT-native; verify the capability needed by the bounded job.

Human-mediated flow remains:

O emits a compact routing header + ready-to-paste Worker prompt → user opens the intended fresh Worker Chat → user returns the complete Worker result → O validates/accepts evidence.

Do not silently depend on retired automated fresh-Chat/browser/Windows Worker transport.

Transport choice changes plumbing only. It does not change W scope, authority, evidence status, dependency semantics, or O's final acceptance/commitment authority.

### Artifact transport / truncation / join

- Persist implementation through a workspace, candidate ref, or durable artifact channel when one is available.
- Normal model output is a compact control receipt — terminal state, `candidate_ref`/`result_ref`, `changed_paths`, validation/tests, and a minimal note — not full source transport.
- Returning full code in model text is exception-only: the artifact must be trivially small and no durable artifact channel may be available.
- `finish_reason=length` / `TRUNCATED` must not trigger an automatic larger-budget retry. Return to O, which may retrieve an already-durable artifact, request a bounded continuation when the protocol genuinely supports it, narrow/reframe the job, or select another eligible executor.
- At most one retry may be explicitly authorized by O when its expected total cost is lower than the alternatives and there is no duplicate-effect risk. Geometric or open-ended output-budget retry is not the default.
- A short bounded W dependency needed for the current user turn is normally joined to a terminal state before O gives the final answer. A pending dispatch is not accepted evidence and is not completion. Liveness expiry, actual unavailability, an independent user status request, or a dependency that is no longer needed are exceptions.
- Pure transport/output failure by itself is not semantic evidence requiring `FRESH_W_AUDIT`. Use fresh independence only when framing, root cause, architecture/security/API/schema semantics, tests-as-spec, or prior Worker reasoning is materially uncertain.

> **SAME_W — transport vs semantic:** `worker_result.status=RETURN_TO_O` is a Worker semantic decision under frozen authority and SHALL NOT be emitted merely for response length/transport inconvenience. `terminal_status=UNAVAILABLE / reason=TRUNCATED` is a transport-layer terminal that returns control to O for transport adjudication only; it is NOT Worker semantic RETURN_TO_O, NOT W completion, and NOT user-turn completion. O must still satisfy the current-turn dependency: retrieve durable artifact if present, use only bounded continuation/recovery if genuinely supported and safe, or reroute/reframe under same frozen authority. No blind full-job resubmit; no geometric token-budget retry.

### SAME_W_REWORK — continuation / early-return rule

- SAME_W_REWORK is continuation affinity/lineage under fixed spec, not a claim of native persistent session; if native resume is unavailable/lost, reconstructed continuation from the #273 minimal handoff is valid but must not be called same-session.
- For fixed-spec localized SAME_W_REWORK with required authority/input/capability available, W continues to a terminal result; partial progress, response length, transport inconvenience, or desire for extra clarification alone are not valid RETURN_TO_O reasons.
- RETURN_TO_O is valid when completion would require scope/authority expansion, a missing decisive input or O decision, conflicting acceptance criteria, materially uncertain root cause/frame/architecture/security/API/schema/tests-as-spec, unsafe/ambiguous effect boundary, or bounded liveness/resource exhaustion.
- After O supplies a missing delta, continuing the same lineage is preferred when uncertainty did not change; repeated RETURN_TO_O for the same unresolved cause must not loop blindly — reframe/reroute/escalate.
- A current user turn depending on this W still joins to terminal before O final, subject to bounded liveness; pending/partial is not completion.

## Release consistency

When W is part of a repo-centered epoch, Chat Dev public control documents it reads must use the same `CONTROL_RELEASE` selected by `BOOTSTRAP.md`, unless the task's exact project-local authority explicitly points elsewhere.
