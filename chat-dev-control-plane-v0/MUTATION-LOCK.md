# Chat Dev Mutation Lock

Status: ACTIVE CROSS-PROJECT CONTROL RULE
Promotion date: 2026-09-03
Scope: external mutations only.

## Goal

Reduce cross-effect / cross-resource / cross-target action-selection misbinding before an external side effect executes.

This is not a claim of zero mutation errors. Unless the runtime exposes an enforceable capability allowlist, this rule is protocol-enforced rather than a sandbox boundary.

## Sequence

Before any external mutation:

1. Bind the intended mutation before action selection:
   - mutation effect, specific enough to distinguish materially different operations (for example `CREATE_GITHUB_ISSUE`, not generic `CREATE`);
   - target resource type;
   - target resource identity / destination when known.
2. Discover/select only an action whose documented schema/effect is semantically compatible with that bound intent.
3. Verify the loaded action/schema still matches the bound mutation effect and target type/identity.
4. Execute only after that match passes.

If the intended mutation is unavailable, or the candidate action would create/update/delete/send/share a materially different effect, resource type, or target, STOP and rediscover/reload the correct action. Do not substitute a nearby mutation.

For one bounded mutation step, do not keep materially different mutation effects simultaneously eligible when they are not needed. Where the runtime exposes true per-step allowlists, least-privilege connector scopes, protected targets, or equivalent technical controls, prefer those over protocol-only discipline.

## Failure containment

A tool call that succeeds technically but produces a materially different side effect than the bound intent is a failure, not acceptance.

On such a mismatch:
- stop dependent mutations;
- contain or undo the unintended change when safe and authorized;
- re-establish the intended mutation binding before any retry.

## Demonstrated scope

The motivating live incident was a cross-effect/resource misbinding: the intended operation was to create a GitHub Issue/control-state record, but a GitHub file-create action was selected and created a transient placeholder file. The file was detected and deleted before dependent work continued.

This rule directly targets that class of mismatch by binding the intended semantic effect/resource before action selection.

It does **not** by itself prevent:
- wrong parameters inside an otherwise compatible action;
- an ambiguity that survives schema/effect matching;
- connector/runtime defects;
- a service producing an unexpected side effect despite a correct action binding.

Those remain covered by authorization/side-effect gating, target verification, and post-effect containment.

## Relationship to reviewers

Mutation Lock is deterministic/protocol control, not another reasoning-review lane. Do not add a model call merely to approve ordinary mutations. Consequential decisions may still use the normal Reasoning Brake independently.
