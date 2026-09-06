# Chat Dev BRAIN — Stable Interface

Authority: this interface is active only when reached through the `CONTROL_RELEASE` selected by the active Chat Dev bootstrap for the current Project/epoch.

`BRAIN` is Chat Dev's soft goal-aligned cognitive/control protocol. It is not a deterministic runtime service, state machine, sandbox, output gate, or hard latch.

Use only when selected by the release-pinned caller interface. Do not preload during ordinary direct work.

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

1. If the BRAIN-routed turn is itself evaluating or deciding a proposed method/solution, use the existing single bounded goal/alternative slot once to compare the proposed means against what the caller would independently recommend for the same established user goal without the proposed means. This consumes the turn's bounded alternative slot; it is not an additional reasoning pass.
2. Otherwise run a cheap means-to-goal alignment check.
3. If alignment is clear, do not reconstruct latent intent; continue only to needed operational controls.
4. If means-to-goal alignment itself is materially mismatched or uncertain, run one bounded goal/alternative escape pass.
5. Operational uncertainty alone does not trigger latent-goal reconstruction.
6. Explicit current instructions are strong evidence; do not invent hidden motives or silently replace an explicitly requested feasible method merely because another seems preferable.
7. Apply only controls needed by the actual boundary: Worker routing/Stage-1, dependency join, Mutation Lock, and independent hard-commitment review.

For proposal/solution evaluation, if the means-independent comparison is materially aligned with the proposed method, stop the comparison and continue. If it reveals a conclusion-changing difference, surface or account for that difference before commitment/operational controls. After explicit user approval, ordinary execution does not reopen the chosen method without new material evidence, uncertainty, or tradeoff.

Do not run a separate post-BRAIN reconsideration pass merely to satisfy `CALLER.md`.

## Independent review gate

Escalate to the production Reasoning Brake only when the pending commitment has at least one hard effect:

- **A** — changes/promotes durable production, canonical architecture, or control semantics;
- **B** — changes actor authority, safety/privacy/security boundaries, or dependency enforcement;
- **C** — creates material external impact not fully neutralized by rollback;
- **D** — is otherwise costly or hard to reverse;
- **E** — retains material evidence conflict or decision-controlling uncertainty after the goal/alternative pass.

Caller confidence does not waive A-E.

Ordinary reversible exploration, research acceptance, prioritization, tentative/no-change recommendations and local reversible work do not require external review unless their actual effect independently meets A-E.

## Results

Return only the minimum next-step guidance needed, such as:

- `CONTINUE`
- `REVISE`
- `VERIFY`
- `WAIT`
- `USE_W` — caller `O` only
- `RETURN_TO_O` — caller `W`
- `ESCALATE_REVIEW`

If no BRAIN invocation boundary actually exists, remain O Direct rather than manufacturing ceremony.

BRAIN never grants authority, executes bounded work, creates Workers, accepts evidence, or owns final commitments.

## Release-consistent detailed contracts

When a detailed control contract is required, load it from the same `CONTROL_RELEASE` selected by `BOOTSTRAP.md`:

- caller cognition / caller route: `chat-dev/CALLER.md`;
- detailed BRAIN semantics: `chat-dev-control-plane-v0/BRAIN-AUTO-PILOT.md` during compatibility phase;
- Mutation Lock: `chat-dev-control-plane-v0/MUTATION-LOCK.md`;
- Reasoning Brake: `reasoning-brake-v0/RUNTIME.md`;
- Stage-1: `reasoning-brake-v0/STAGE1-PILOT.md` only when its narrow condition is actually met.

`CALLER.md` owns caller-entry semantics. The detailed BRAIN contract must not reintroduce an independent caller route or a competing bootstrap authority.

Do not resolve these from a different mutable revision during the same epoch.