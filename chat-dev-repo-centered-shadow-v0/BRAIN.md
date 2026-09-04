# Chat Dev BRAIN — Stable Interface Shadow

Status: SHADOW / NON-AUTHORITATIVE

`BRAIN` is Chat Dev's soft goal-aligned cognitive/control protocol. It is not a deterministic runtime service, state machine, sandbox, output gate, or hard latch.

Use only when selected by the runtime control entry. Do not preload during ordinary direct work.

## Interface

Callable by `O` or `W`.

Input:
- caller role;
- pending action, transition, or commitment;
- caller scope/authority bounds;
- relevant dependency state;
- conversation/project context already available to caller.

The caller does not pre-classify downstream control families.

## Behavior

1. Check whether the pending means/action is obviously aligned with the user's stated or established goal.
2. If alignment is clear, do not reconstruct latent intent; apply only needed operational controls.
3. If means-to-goal alignment is materially mismatched or uncertain, run one bounded goal/alternative escape pass.
4. Operational uncertainty alone does not trigger latent-goal reconstruction.
5. Apply only controls required by the boundary: Worker routing/Stage-1, dependency join, Mutation Lock, and independent hard-commitment review.

## Results

Return only minimum next-step guidance such as:
`CONTINUE`, `REVISE`, `VERIFY`, `WAIT`, `USE_W` (O only), `RETURN_TO_O` (W), or `ESCALATE_REVIEW`.

BRAIN never grants authority, executes bounded work, creates Workers, accepts evidence, or owns final commitments.

## Detailed semantics during shadow

Canonical detailed semantics remain `../chat-dev-control-plane-v0/BRAIN-AUTO-PILOT.md` until a future explicit promotion changes authority.
