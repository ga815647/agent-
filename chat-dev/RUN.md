# Chat Dev Unified RUN

Authority: this contract is active only when loaded from the exact `CONTROL_RELEASE` selected by the active `chat-dev/BOOTSTRAP.md` for the current Project/epoch.

Role: define the single bounded runtime surface used by `O` when task execution beyond O-local synthesis is required. RUN is an execution/evidence capability, not a new actor, user-intent authority, approval gate, or final-commitment authority.

## Normal flow

```text
User
  -> O thin semantic bind
  -> RUN
       -> durable identity / exact replay / rejoin
       -> Goal Gate
       -> immutable GOAL_LOCK
       -> optional narrowly-gated independent rethink
       -> delegation-authority check
       -> bounded planner chooses 0 / 1 / N subwork
       -> mechanical dispatch / retry / timeout / join / idempotency
       -> bounded effects + exact result publication
       -> terminal envelope
  -> O evidence acceptance / required read-only verification / final synthesis
  -> User
```

The only semantic back-edge is:

```text
RUN -> NEEDS_O | REFRAME_REQUIRED -> O adjudicates -> same episode resumes
```

A second recursive challenge lane is not created.

## O authority

`O` remains sole authority for:

- latest visible user intent, correction, cancellation and referent;
- the semantic envelope supplied to RUN;
- Worker/delegation authorization;
- consequential-effect authorization;
- Worker/Reviewer evidence acceptance;
- exception judgment and formal state transitions;
- final commitment and user-visible synthesis.

Runtime, planner, Worker, effect executor and Reviewer remain bounded capabilities. None may silently broaden goal, authority or effects.

## Thin semantic envelope

O supplies only conclusions and bindings needed by the run, not hidden chain-of-thought. The envelope binds at least:

- current turn identity and exact user-turn hash;
- candidate goal and success criteria;
- material constraints and durable pointers;
- allowed and forbidden effects;
- momentum/rethink gate when material;
- `delegation_allowed`;
- stable run nonce / episode identity.

`delegation_allowed` is **false by default**. It may be true only when current release-pinned O/BRAIN routing has explicitly authorized bounded Worker use for this turn/episode. Planner or Worker cannot change it.

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

`NEEDS_O` and `REFRAME_REQUIRED` have zero downstream effect.

`GOAL_LOCK` binds at least:

- goal;
- success criteria;
- allowed / forbidden effects;
- source user-turn identity/hash;
- material constraints and durable pointers;
- `delegation_allowed`.

Every downstream subwork carries the same goal-lock identity/hash. Planner topology may change; locked semantics may not silently drift.

## Delegation authority and dynamic 0 / 1 / N

Delegation is authority-bounded before planning.

- `delegation_allowed=false` -> RUN performs **0 delegated work**. Planner/Worker invocation cannot create delegation authority. RUN may return a zero-work terminal for O to finalize.
- `delegation_allowed=true` -> a depth-1 planner may choose `0`, `1`, or bounded `N` subwork inside GOAL_LOCK.

A true delegation flag permits bounded Worker use; it does not require delegation. Planner cannot broaden goal, effects, acceptance criteria, data access, actor authority, or Worker depth.

Each Worker contract is frozen before dispatch. Worker cannot invoke another Worker, accept its own evidence, broaden scope, or final-commit. If wider authority or missing decisive input is required, control returns to O.

## Independent rethink

Routine alignment does not pay an independent-judge cost.

Independent rethink is permitted at most once for the topic/turn and only when the active envelope and release semantics authorize it, including the required HIGH momentum / independent-rethink conditions. It cannot create a judge-on-judge recursion. A conclusion-changing result returns `REFRAME_REQUIRED` before effects.

## Mechanical runtime

O-facing terminal vocabulary remains exactly:

- `COMPLETE`
- `FAILED`
- `NEEDS_O`
- `REFRAME_REQUIRED`

Execution subclasses live in compact failure metadata such as `FAILED.reason_code`; do not proliferate workflow terminal states.

Required mechanics include:

- durable run identity and same-key binding;
- fan-out and mechanical join;
- bounded retry and execution budget;
- exact duplicate suppression and stable replay;
- same-key changed-request conflict failure;
- durable terminal persistence before delivery where recovery is claimed;
- same-nonce reconnect/rejoin without redispatch;
- exact result/artifact identity and hashing.

The contract does not claim exactly-once arbitrary external effects. Non-repeatable effects require an effect-specific idempotency/recovery design and explicit ledger semantics.

## Bounded synchronous wait and rejoin

Transport wait ceiling and runtime execution deadline are different facts.

One RUN invocation blocks only for the bounded synchronous wait supported by the active private transport. If the run becomes terminal inside that wait, return the terminal. Otherwise return a non-terminal `PENDING` envelope with stable identity sufficient to rejoin the same durable episode.

`PENDING` means:

- the run is not terminal;
- no new logical run is authorized;
- caller must rejoin using the same run nonce / durable run identity;
- retry means retrieval/rejoin, **not redispatch**;
- an implementation may expose a process identifier for observability, but process identity is not canonical run identity.

If the transport itself drops before `PENDING` is delivered, the caller still performs same-nonce lookup/rejoin. The backend must persist run identity before long execution when it claims this recovery property.

A normal long task may therefore be observed as:

```text
RUN -> bounded wait -> PENDING
    -> REJOIN same episode -> PENDING
    -> REJOIN same episode -> terminal
```

Public semantics do not hard-code provider names, ports, host identities, or transport-specific timeout numbers. Those are private operational state.

## Effect plane

Effects execute only after GOAL_LOCK and only inside the explicitly bound effect authorization plus the active Mutation Lock target/effect binding.

Terminal effect evidence records exact facts where applicable, such as source checkout SHA, edited path/hash, test result, created commit, pushed ref/SHA, PR identity, CI status, and artifact identity/hash/size.

For routine code work, runtime publication targets a dedicated job ref such as `chatdev/job/<job_id>`, never direct routine push to `main`.

A runtime Git claim is evidence, not accepted truth. When Git identity matters to acceptance, O performs read-only GitHub verification of exact ref/commit/diff/SHA/CI. Contradictory or unverifiable claims are rejected or left unresolved.

## Terminal and receipt

A terminal result carries orthogonal dimensions rather than new workflow states, including:

- stable run/turn identity and `result_hash`;
- terminal status and compact reason when applicable;
- GOAL_LOCK identity/hash when one exists;
- planner/subwork/join summary;
- exact effect ledger;
- exact artifact/Git identities where applicable;
- advisory `next_for_o` handling.

`next_for_o` is metadata only and never grants approval or commitment authority.

A successful RUN terminal may satisfy the current-turn delivery receipt obligation only when it contains a validated backend-derived current-turn receipt under `chat-dev/RUNTIME-ENTRY.md` from the same release.

`PENDING`, transport timeout, or caller disconnect is not a terminal receipt failure while same-episode retrieval/rejoin remains available inside the active delivery-liveness contract.

## Reviewer / hard commitments

Unified RUN does not replace BRAIN, Mutation Lock, production Reviewer, Reasoning Brake, or O adjudication.

Hard production/canonical/authority/safety commitments that meet the active review gate remain blocked on the required production Reviewer dependency and O adjudication. Candidate/job-branch evidence may be produced before promotion only when its actual effects are separately authorized and reversible; it must not silently promote canonical control or production deployment.

## Public / private ownership

Public Chat Dev control owns the semantic contract in this file.

Private execution plane owns mutable transport/deployment implementation, synchronous-wait thresholds, runtime host/process state, credentials, durable execution state and evidence plumbing. Public control does not copy current mailbox IDs, workflow names, provider settings, runner names, ports, or transport-specific timeout values as semantic truth.

Replaceable ingress adapters never gain semantic authority from their transport identity.
