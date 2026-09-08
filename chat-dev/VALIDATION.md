# Chat Dev Repo-Centered Validation

Status: CURRENT PROMOTION AID / NON-AUTHORITATIVE

Validation supports promotion judgment; it does not own runtime semantics.

## Static semantic parity

Before activation, confirm the candidate preserves the current release-pinned invariants:

- fresh-epoch bootstrap loads stable `BOOTSTRAP.md`, then exact immutable `CONTROL_RELEASE`, then `CALLER.md` before normal work;
- caller route selection remains internal control state; no visible `ROUTE=DIRECT` / `ROUTE=BRAIN` line is required merely for protocol compliance;
- short-confirmation inheritance;
- lazy BRAIN/W loading;
- O-only final acceptance/commitment authority;
- Worker authority limits and capability-selected transport under `W.md`;
- required dependency joins;
- Mutation Lock effect/resource/target binding;
- hard A-E independent review gate;
- final control-latch marker;
- project-local Profile routing;
- degraded bootstrap behavior.

## Release integrity

Confirm:

- stable `BOOTSTRAP.md` selects one exact `CONTROL_RELEASE` SHA;
- all downstream Chat Dev public repo reads use that SHA for the epoch;
- no required runtime pointer silently resolves from mutable `main`;
- rollback target is recorded;
- a release candidate is reviewed as an exact immutable diff before the stable selector is changed.

## Repository ownership boundary

This checklist validates projections of the already-active authority split; it does not create a second boundary authority.

Confirm:

- public `ga815647/agent-` owns cross-project Chat Dev **semantics**: bootstrap/release contracts, O/BRAIN/W authority/collaboration rules, Mutation Lock and Reasoning Brake semantics, and public-safe adoption/handoff guidance;
- private `ga815647/chatdev-exec` owns the owner's **execution substrate and mutable execution state**: production Reviewer execution/policy, Runtime Wrapper and Runtime Entry transport, contributor-safe Spark execution, Restate runtime adapter/spine, routed mutation executor implementation, execution-local evidence, and validation tooling;
- private execution artifacts implement public contracts and do not define, grant, remove, or override O/BRAIN/W authority or public control semantics;
- public current-state prose does not duplicate private mutable machine values such as provider/model/output budgets, runtime endpoint/mailbox identifiers, runner-local settings, or other execution-local configuration when a live private owner exists;
- Project Profiles contain only project-specific routing/authority/capability overlays and pointers, not copied global Chat Dev mechanics;
- product/technical/current-progress truth remains in each project's canonical durable source rather than either global Chat Dev repo;
- Notion dashboard/index pages and compatibility pages do not self-identify as global Chat Dev runtime authority after repo-centered activation.

A repository path is not authoritative merely because it is public, private, on `main`, or machine-readable. Authority follows the active bootstrap/control contract and the explicit owner of each mutable execution value.

## Dynamic-state drift check

Before promoting a release that references mutable operational state, confirm:

- every value intentionally mutable without `CONTROL_RELEASE` promotion has one live owning artifact;
- narrative README/dashboard/public control prose does not duplicate that value as **current** state;
- historical copies are explicitly dated/labeled as historical evidence;
- current-state lookup instructions point to the live owner;
- if the execution path consumes a machine-readable policy/config file, that consumed artifact wins over descriptive prose;
- compatibility projections do not copy release/model/effort/provider/output-budget values that can be read from their authoritative owner.

A duplicated mutable value is a drift risk even when the copies happen to match at promotion time.

## Projection consistency check

For compatibility, pilot, validation and other non-canonical projections:

1. identify the current owner for each asserted semantic or mutable value;
2. reject projections that self-identify as current authority when they are historical/compatibility only;
3. reject obsolete bootstrap, route-visibility or Worker-transport assertions;
4. reject copied mutable Reviewer/Worker runtime values presented as current truth;
5. reject private execution documentation that narrows the execution plane to a retired subset when active production paths have expanded beyond it;
6. prefer a pointer to the active owner over duplicating prose when a projection no longer needs a full live copy.

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

When practical before activation, prove the configured path can start from a fresh epoch:

1. shim → stable `BOOTSTRAP.md` → exact release `CALLER.md` → an ordinary DIRECT outcome without requiring a visible route line;
2. shim → stable `BOOTSTRAP.md` → exact release `CALLER.md` → BRAIN selection → exact release `BRAIN.md`;
3. one project-local route when the adopting Project has a Profile.

A heavy standalone New Project Canary program is optional unless a material uncertainty specifically requires it.

## Failure cases worth checking

When convenient or decision-relevant:

- repo bootstrap unavailable;
- CALLER/BRAIN/W read at selected release unavailable;
- project Profile unavailable;
- exact authoritative source correctly identified but first read truncated;
- exact source remains unrecoverable after bounded same-source retrieval;
- stale memory conflicts with durable bootstrap truth;
- short confirmation inherits a BRAIN-boundary action;
- stable bootstrap changes after an epoch has already selected a release;
- descriptive documentation claims a current mutable operational value that differs from its owning artifact;
- a historical/compatibility projection contradicts current release semantics;
- public documentation treats private mutable execution state as semantic authority;
- private execution documentation claims authority over O/BRAIN/W semantics or omits active production execution surfaces in a way that misstates ownership;
- wrapper transport is unavailable or ambiguous and O must explicitly choose the W fallback rather than silently resubmit.

## Promotion interpretation

Passing this checklist supports activation judgment; it does not establish deterministic/fail-closed enforcement or statistically prove long-context reliability.

If static parity, ownership-boundary consistency or projection consistency exposes a material semantic regression, fix the candidate before activation.
