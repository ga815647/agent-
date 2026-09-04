# Chat Dev Repo-Centered Validation

Status: SHADOW CANDIDATE / NON-AUTHORITATIVE

Validation is a promotion aid, not the main refactor workstream.

## Static semantic parity

Before activation, confirm the candidate preserves production v29 semantics for:

- fresh-epoch bootstrap before normal response/task execution;
- exact first-visible `ROUTE=DIRECT` / `ROUTE=BRAIN` caller line;
- short-confirmation inheritance;
- lazy BRAIN/W loading;
- O-only final acceptance/commitment authority;
- Worker authority limits and human-mediated transport;
- required dependency joins;
- Mutation Lock;
- hard A-E independent review gate;
- final control-latch marker;
- project-local Profile routing;
- degraded bootstrap behavior.

## Release integrity

Confirm:

- stable `BOOTSTRAP.md` selects one exact `CONTROL_RELEASE` SHA;
- all downstream Chat Dev public repo reads use that SHA for the epoch;
- no required runtime pointer silently resolves from mutable `main`;
- rollback target is recorded.

## Exact-source loading regression

Exercise at least one case where an exact authoritative pin/version is correct but the first connector read returns a truncated/partial body.

Expected behavior:

1. keep the same exact source/version identity;
2. use bounded continuation/section/pagination/targeted reads when supported;
3. reconstruct the required authoritative body without substituting another source or memory;
4. continue the bounded task when recovery succeeds;
5. return `BLOCKED` only if the exact required body remains unrecoverable, or the source/version/authority is actually wrong or unavailable.

A first-call `TRUNCATED` result alone must not be treated as evidence that the authoritative source is unavailable.

## Lightweight fresh-epoch smoke

When practical before activation, prove the actual configured path can start from a fresh epoch:

1. shim → `BOOTSTRAP.md` → `ROUTE=DIRECT`;
2. shim → `BOOTSTRAP.md` → `ROUTE=BRAIN` → `BRAIN.md`;
3. one project-local route when the adopting Project has a Profile.

A heavy standalone New Project Canary program is optional unless a material uncertainty specifically requires it.

## Failure cases worth checking

When convenient or decision-relevant:

- repo bootstrap unavailable;
- BRAIN/W read at selected release unavailable;
- project Profile unavailable;
- exact authoritative source correctly identified but first read truncated;
- exact source remains unrecoverable after bounded same-source retrieval;
- stale memory conflicts with durable bootstrap truth;
- short confirmation inherits a BRAIN-boundary action;
- stable bootstrap changes after an epoch has already selected a release.

## Promotion interpretation

Passing this checklist supports activation judgment; it does not establish deterministic/fail-closed enforcement or statistically prove long-context reliability.

If static parity exposes a material semantic regression, fix the shadow candidate before activation.