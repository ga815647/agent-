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

## Production transport

When O/BRAIN selects W, choose transport by the actual job boundary rather than by habit.

### Wrapper-backed contributor lane — preferred when eligible

Use the production Runtime Wrapper when all of the following hold:

- the work is bounded cognition/reasoning/research synthesis that can complete from the supplied packet/context;
- the packet is contributor-safe `PUBLIC`, `LOW_SENSITIVITY`, or `PUBLIC_OR_LOW_SENSITIVITY`;
- W does not need arbitrary shell, connectors, mutations, privileged/private tools, or authority outside the supplied packet;
- the private execution substrate is reachable.

The production execution surface is private repo `ga815647/chatdev-exec`:

- submit one typed request at `runtime-wrapper-v0/spark-requests/<request_id>.json` on `main`;
- request schema: `runtime_wrapper_request_v0`, `op: spark_run`, with bounded `spark` task/context/acceptance/effort fields;
- provider/model policy is owned by the private runtime; O/W must not broaden it from the public contract;
- read the compact result at `runtime-wrapper-v0/results/<request_id>.json`;
- preserve the returned raw-evidence pointer for O verification when material.

Transport states:

- `COMPLETE` — Worker evidence is available; O still owns acceptance/synthesis/commitment;
- `AMBIGUOUS` — a durable dispatch exists without validated terminal evidence; **do not auto-resubmit**. O may re-check for terminal evidence or explicitly reroute;
- `UNAVAILABLE` / `ERROR` — do not silently broaden scope or retry authority. Return/fallback to O under the existing route.

The wrapper uses deterministic logical job identity and a durable create-only dispatch claim before provider execution. This is a duplicate-suppression/runtime-safety mechanism, not a transfer of Worker authority and not a universal exactly-once claim.

### Human-mediated lane — required fallback / richer capability

Use the existing human-mediated fresh Worker Chat when the job is:

- private or otherwise outside contributor-safe packet classes;
- tool-rich / connector-dependent / mutation-capable;
- unsupported by the wrapper contract;
- blocked by wrapper unavailability or an unresolved `AMBIGUOUS` state when O explicitly chooses rerouting.

Human-mediated flow remains:

O emits a compact routing header + ready-to-paste Worker prompt → user opens the intended fresh Worker Chat → user returns the complete Worker result → O validates/accepts evidence.

Do not silently depend on retired automated fresh-Chat/browser/Windows Worker transport.

Transport choice changes plumbing only. It does not change W scope, authority, evidence status, dependency semantics, or O's final acceptance/commitment authority.

## Release consistency

When W is part of a repo-centered epoch, Chat Dev public control documents it reads must use the same `CONTROL_RELEASE` selected by `BOOTSTRAP.md`, unless the task's exact project-local authority explicitly points elsewhere.