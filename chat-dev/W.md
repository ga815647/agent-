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

## Production transport compatibility

During the compatibility phase, normal Worker transport remains human-mediated:

O emits a compact routing header + ready-to-paste Worker prompt → user opens the intended fresh Worker Chat → user returns the complete Worker result → O validates/accepts evidence.

Do not silently depend on retired automated fresh-Chat/browser/Windows Worker transport.

## Release consistency

When W is part of a repo-centered epoch, Chat Dev public control documents it reads must use the same `CONTROL_RELEASE` selected by `BOOTSTRAP.md`, unless the task's exact project-local authority explicitly points elsewhere.