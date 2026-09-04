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

## Production transport compatibility

During the compatibility phase, normal Worker transport remains human-mediated:

O emits a compact routing header + ready-to-paste Worker prompt → user opens the intended fresh Worker Chat → user returns the complete Worker result → O validates/accepts evidence.

Do not silently depend on retired automated fresh-Chat/browser/Windows Worker transport.

## Release consistency

When W is part of a repo-centered epoch, Chat Dev public control documents it reads must use the same `CONTROL_RELEASE` selected by `BOOTSTRAP.md`, unless the task's exact project-local authority explicitly points elsewhere.