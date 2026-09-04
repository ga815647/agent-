# Chat Dev BRAIN — Stable Interface Shadow Candidate

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

1. Run a cheap means-to-goal alignment check.
2. If alignment is clear, do not reconstruct latent intent; continue only to needed operational controls.
3. If means-to-goal alignment itself is materially mismatched or uncertain, run one bounded goal/alternative escape pass.
4. Operational uncertainty alone does not trigger latent-goal reconstruction.
5. Explicit current instructions are strong evidence; do not invent hidden motives or silently replace an explicitly requested method merely because another seems preferable.
6. Apply only controls needed by the actual boundary: Worker routing/Stage-1, dependency join, Mutation Lock, and independent hard-commitment review.

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

- detailed BRAIN semantics: `chat-dev-control-plane-v0/BRAIN-AUTO-PILOT.md` during compatibility phase;
- Mutation Lock: `chat-dev-control-plane-v0/MUTATION-LOCK.md`;
- Reasoning Brake: `reasoning-brake-v0/RUNTIME.md`;
- Stage-1: `reasoning-brake-v0/STAGE1-PILOT.md` only when its narrow condition is actually met.

Do not resolve these from a different mutable revision during the same epoch.