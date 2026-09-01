# External Cognitive Harness v0.1 Candidate — Stage 1 execution status

Date: 2026-09-01
Preregistration authority: `f6724fcb72c0e2420c35f0651c7fad65f4b54d11:external-cognitive-harness-experiments/V0_1_PREREGISTRATION.md`

STATE=`MANUAL_ISOLATION_REQUIRED`

EXECUTION_VALIDITY=`invalid — experiment not run`

Reason: the available execution environment cannot create or control the preregistered isolated ChatGPT conversation branches/fresh chats. In particular, it cannot branch historical cases from the assistant message immediately preceding the locked target user turn, create 14 mutually isolated answering contexts, and retrieve all outputs while preserving identical model/config and preventing cross-arm/cross-case history contamination. Existing repository Codex workflows do not reproduce the preregistered historical branch semantics or exact symmetric invocation contract, so they were not used as a substitute.

No Stage-1 arm was executed. No output was scored. No Stage-1 efficacy conclusion was drawn.

## Minimum manual execution path

Use one fixed model/config for all 14 arms.

Historical cases: `4R`, `6`, `1`, `3`.
- Open the original conversation for each case.
- Branch from the assistant message immediately preceding the locked target user turn.
- Create two independent branches from that same point.
- In each branch paste exactly one preregistered symmetric wrapper message; only `HARNESS_REF` differs.
- Alternate arm order across cases where practical.

Synthetic cases: `H1`, `H2`, `H3`.
- Create two fresh chats per case with no case-specific prior history.
- Paste the exact preregistered wrapper using the locked synthetic text verbatim; only `HARNESS_REF` differs.

Do not expose rubric, expected answer, failure label, or candidate rationale to any answering context. Do not carry one arm/case output into another.

After all 14 outputs exist, collect them into a single scoring batch with arm labels hidden until scoring is recorded. Preserve visible outputs verbatim for evaluation and durable result recording.

## Follow-up workstream — recorded only, not executed

`HARNESS_LIGHTWEIGHTING`

Goal: reduce Harness file reads, token use, steps, and interaction friction without materially losing anti-framing / anti-momentum effect.

This is a separate experiment and must not be mixed into the v0.1 efficacy test.
