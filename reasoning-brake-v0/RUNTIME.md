# Chat Dev Reasoning Brake v0 — Runtime

Status: CANDIDATE until live canaries pass and Chat Dev｜Current activates this path.
Scope: Chat Dev consequential decision / commitment braking only. Execution routing and Worker policy remain separate.
Goal: cheaply interrupt conversation momentum before consequential commitment without turning every answer into staged self-review.

## Trigger

Low-judgment factual lookup, translation, mechanical transformation, simple status, and routine execution do not need this brake.

Use the brake when the current turn contains a material recommendation, prioritization, architecture direction, proposal acceptance/rejection, irreversible or costly action, or other consequential commitment where a missed framing/assumption/evidence problem could change the answer.

## Sequence

1. The Orchestrator reasons normally and forms a compact provisional decision. Do not pre-run a full FRAME/REVIEW/SYNTHESIZE ceremony.
2. Build the minimum decision packet below. Do not send the full conversation.
3. If the packet is safe for this repository's public GitHub surface and the Codex substrate is usable, dispatch exactly one external falsifier through `.github/workflows/codex-reasoning-brake-v0.yml` using Sol with low reasoning.
4. If dispatched, treat the brake as a bounded decision dependency until it returns `PASS`, `CHALLENGE`, or `UNAVAILABLE`, or until the 8-minute brake budget expires. This is not a Worker/subchat join and does not create Worker authority.
5. `PASS`: continue normally. `CHALLENGE`: the Orchestrator must explicitly resolve, verify, or reject the material issue before commitment. `UNAVAILABLE`/timeout: fail open; do not spawn a fresh subchat merely to replace the brake.
6. If the decision is high-cost or hard to reverse and the external brake is unavailable or unsafe to dispatch, run one local minimum falsification check: identify the strongest material reason the provisional decision could be wrong and resolve it before commitment.

The external falsifier is evidence only. The Orchestrator remains the sole decision and acceptance authority.

## Decision packet

Only dispatch a packet after the Orchestrator has established `packet_class: PUBLIC_SAFE`.

Never put secrets, credentials, private connector contents, private artifact IDs/URLs, personal sensitive data, or other non-public material into the GitHub issue. If there is material doubt, do not externalize it; skip the external brake.

Issue title prefix:

`CODEX-BRAKE-V0|`

Issue body contract:

```text
packet_class: PUBLIC_SAFE
decision_id: <short correlation id>
provisional_decision: <one concise sentence>
material_assumptions:
- <up to 3 assumptions, or none>
evidence_pointers:
- <up to 3 public-safe labels/pointers, or none>
known_uncertainty:
- <material uncertainty, or none>
```

The packet should normally stay under 2,000 characters; the workflow rejects bodies above 8,000 characters.

## External falsifier contract

Canonical role prompt: `reasoning-brake-v0/FALSIFIER.md`.

Execution profile:
- model: `gpt-5.6-sol`
- reasoning effort: `low`
- one falsifier only
- Codex CLI with existing ChatGPT subscription auth (`CODEX_AUTH_JSON`)
- empty temporary working directory after prompt preparation
- read-only sandbox
- no repo inspection or web research
- workflow timeout: 8 minutes
- global workflow concurrency: one active brake at a time

Canonical result:

```text
CODEX_BRAKE_V0_COMPLETE
status: PASS | CHALLENGE
model: gpt-5.6-sol
reasoning: low
elapsed_seconds: <integer>
material_issue: <none or one issue>
why_decision_changing: <none or concise reason>
check_needed: <none or one check>
```

Failure / capacity result:

```text
CODEX_BRAKE_V0_UNAVAILABLE
status: UNAVAILABLE
reason: <BLOCKED_AUTH | INVALID_PACKET | CODEX_EXIT | INVALID_RESULT>
```

`UNAVAILABLE` is terminal for this brake attempt. Do not retry automatically and do not bypass capacity by opening another Codex/subchat job.

## Relationship to Workers

The reasoning brake is a Reviewer lane, not a Worker lane.

- It does not receive Worker authority.
- It does not perform implementation or research.
- It does not recursively dispatch.
- It does not satisfy or alter Subchat join rules.
- A substantial execution task may still be routed by the existing Chat Dev dispatch rules independently of this brake.

## Rollback

Activation is reversible by changing `Chat Dev｜Current` back to the prior staged Harness pointer:
`ga815647/agent-` branch `exp/ech-runtime-staged3-default` → `external-cognitive-harness-runtime/RUNTIME.md`.

Do not rewrite historical Harness experiment artifacts when activating or rolling back this runtime.
