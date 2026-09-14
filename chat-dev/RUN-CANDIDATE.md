# Chat Dev Unified RUN — Candidate Contract

Status: CANDIDATE / NOT PRODUCTION.

Provenance: Issue `ga815647/chatdev-exec#339` vertical proof. This file is a review candidate only. It does not change `BOOTSTRAP.md`, the active `CONTROL_RELEASE`, production Runtime Entry transport, resident deployment, O authority, or any Project bootstrap.

## Goal

Converge the ordinary O execution path around one bounded runtime operation:

```text
User
  -> O thin semantic bind
  -> RUN
       -> identity / exact replay / rejoin
       -> Goal Gate
       -> immutable GOAL_LOCK
       -> optional narrowly-gated independent rethink
       -> bounded planner chooses 0 / 1 / N subwork
       -> mechanical dispatch / retry / timeout / join / idempotency
       -> bounded effects + exact result publication
       -> terminal envelope
  -> O evidence acceptance / required read-only verification / final synthesis
  -> User
```

Normal happy path target: one caller RUN invocation to terminal. A caller/connector timeout does not authorize redispatch: the same nonce rejoins the same durable logical run.

Only one semantic back-edge is permitted:

```text
RUN -> NEEDS_O | REFRAME_REQUIRED -> O adjudicates -> same episode resume
```

A second semantic return for the same challenge round fails boundedly rather than recursing.

## Authority

O remains sole authority for:

- latest visible user intent, correction, cancellation and referent;
- the candidate semantic envelope supplied to RUN;
- explicit consequential-effect authorization;
- Worker/Reviewer evidence acceptance;
- exception judgment;
- formal state transitions and final commitment;
- final user-visible synthesis.

Runtime, planner, Worker, effect executor and Reviewer are evidence/execution capabilities. None becomes user-intent authority or final-commitment authority.

## O thin semantic envelope

O supplies conclusions and bindings, not hidden chain-of-thought. Include only what the run needs, such as:

- current user-turn identity/hash and exact current instruction when material;
- candidate goal and success criteria;
- current referent and explicit correction/cancellation/authorization;
- constraints and exact durable pointers/hashes;
- allowed and forbidden effects;
- run nonce / episode identity when material.

Do not copy large durable context when an exact pointer/hash is sufficient. Do not truncate raw user input merely to satisfy a model-facing salience budget.

## Goal Gate and GOAL_LOCK

Before planner decomposition or downstream effects, RUN compares the candidate envelope against the supplied current evidence.

Outcomes:

- aligned -> create immutable `GOAL_LOCK`;
- materially ambiguous -> `NEEDS_O`;
- explicit correction, goal shift or conclusion-changing mismatch -> `REFRAME_REQUIRED`.

Hard invariants:

> **NO DECOMPOSITION BEFORE GOAL_LOCK.**
>
> **NO EFFECT BEFORE GOAL_LOCK.**

`NEEDS_O` and `REFRAME_REQUIRED` must have zero downstream effect.

`GOAL_LOCK` binds at least:

- goal;
- success criteria;
- allowed / forbidden effects;
- source user-turn identity/hash;
- material constraints and durable pointers.

Every downstream subwork carries the same goal-lock identity/hash. Planner topology may change; the locked goal may not silently drift.

## Independent rethink

Routine alignment does not pay an independent-judge cost.

Independent rethink is permitted at most once for the topic/turn and only when all required gating evidence is present, including:

- `momentum_risk=HIGH`;
- `rethink_depth=INDEPENDENT`;
- consequential architecture/strategy or equivalent repeated failed-repair context;
- material incumbent-frame / sunk-investment risk.

There is no judge-on-judge recursion. If the rethink changes the conclusion, return `REFRAME_REQUIRED` before effects.

## Dynamic bounded planner

Only after GOAL_LOCK, a depth-1 planner may choose:

- `0` subwork -> no delegated work; terminal may direct O to finalize;
- `1` subwork -> one bounded execution contract;
- `N` subwork -> bounded fan-out and mechanical join.

Planner chooses topology, sequencing and decomposition inside GOAL_LOCK only. It cannot broaden the goal, allowed effects, actor authority or acceptance criteria.

Each Worker contract is frozen before dispatch. Worker cannot invoke another Worker, accept its own evidence, broaden scope, or final-commit. If wider scope/authority is needed, control returns to O.

## Mechanical runtime

O-facing terminal vocabulary remains exactly:

- `COMPLETE`
- `FAILED`
- `NEEDS_O`
- `REFRAME_REQUIRED`

Execution subclasses live in `FAILED.reason_code`; do not proliferate workflow terminal states.

Identity supports:

`turn_id -> optional episode_id -> call_id -> subwork_id -> attempt_id`

with a separate nonce/idempotency binding.

Required mechanics:

- fan-out and mechanical join;
- bounded retry and timeout/budget;
- exact duplicate suppression and stable replay;
- same-key changed-request conflict failure;
- durable terminal persistence before delivery where the substrate claims recovery;
- same-nonce reconnect/rejoin without redispatch;
- exact result/artifact identity and hashing.

The contract does not claim exactly-once arbitrary external effects. Non-repeatable effects require an effect-specific idempotency/recovery design and explicit ledger semantics.

## Effect plane

Effects execute only after GOAL_LOCK and only inside the explicitly bound effect authorization plus Mutation Lock target/effect binding.

Terminal effect ledger records exact facts where applicable, for example:

- `SOURCE_CHECKOUT` exact SHA;
- `FILE_EDIT` path + hash;
- `TEST_RUN` command/result;
- `COMMIT_CREATED` SHA;
- `REF_PUSHED` repo/ref/SHA;
- `PR_CREATED` number;
- `CI_OBSERVED` run/status;
- exact artifact identity/SHA/size.

For code work, routine runtime publication targets a dedicated job ref such as `chatdev/job/<job_id>`, never direct routine push to `main`.

A runtime Git claim is evidence, not accepted truth. When Git identity matters to acceptance, O performs read-only GitHub verification of the exact ref/commit/diff/SHA/CI. If the claim cannot be verified or contradicts GitHub fact, O rejects or marks the evidence unresolved.

For non-code artifacts, publish through a durable artifact/result channel with manifest + content hash rather than model-text byte transport when available.

## Terminal envelope

Terminal result carries orthogonal dimensions rather than new workflow states:

- identity: turn/episode/call IDs and stable `result_hash`;
- terminal + compact failure reason when applicable;
- GOAL_LOCK identity/hash when one exists;
- subwork count, join result, retries/tests summary;
- exact effect ledger;
- exact artifact/Git identities where applicable;
- `next_for_o` advisory handling.

Candidate `next_for_o` values:

- `FINALIZE`
- `INSPECT_GITHUB`
- `RETURN_TO_O`
- `REVIEW_REQUIRED`
- `REPORT_FAILURE`

`next_for_o` is handling metadata only. It is never approval or commitment authority.

## Delivery / receipt

A successful RUN terminal may satisfy the turn-delivery receipt obligation only when its terminal contains a backend-derived current-turn receipt under the active release semantics.

The final user-visible response still ends with exactly one valid current-turn delivery marker. O never invents, rewrites or reuses a receipt from another turn.

A non-terminal request, caller timeout or connector timeout is not `NO-RECEIPT` evidence while terminal retrieval/rejoin remains available inside the active liveness contract. Transport timeout and runtime terminal failure are distinct facts.

## Reviewer and hard commitments

Unified RUN does not replace BRAIN, Mutation Lock, production Reviewer or O adjudication.

A hard production/canonical/authority/safety commitment that meets the active Reasoning Brake A-E gate remains blocked on the required production Reviewer dependency and O adjudication. `REVIEW_REQUIRED` may make that need salient but does not itself invoke, approve or waive review.

Candidate/job-branch execution evidence may be produced before production promotion when its actual effect is separately authorized and reversible; it must not silently promote canonical control or production deployment.

## Public/private ownership

Public Chat Dev control owns the semantic contract above.

Private execution plane owns mutable transport/deployment implementation details, operational policy, durable runtime state and private evidence plumbing. Public control does not copy current mailbox IDs, workflow names, ports, provider settings, runner names or transport-specific timeout values as semantic truth.

Fixed DC/Floot/MCP/plugin/other adapters are replaceable ingress surfaces. Adapter identity never grants semantic authority.

## Promotion delta if accepted

A later reviewed release should minimally:

1. make release-pinned `CALLER.md` bind the thin semantic envelope and invoke one unified RUN surface rather than expose routine dispatch/status/artifact choreography;
2. make the active delivery contract accept a validated RUN terminal receipt as the current-turn receipt;
3. reference this RUN contract from `ARCHITECTURE.md`;
4. preserve existing BRAIN / W / Mutation Lock / Reasoning Brake authority semantics except where an exact compatibility edit is required;
5. keep private transport/deployment details out of public control;
6. promote only through a new immutable `CONTROL_RELEASE` selected by `BOOTSTRAP.md` after production Reviewer evidence and explicit O adjudication.

Until that promotion occurs, v40 and its existing GitHub Runtime Entry remain production authority.