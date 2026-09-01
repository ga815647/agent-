# External Cognitive Harness — Chat Dev Runtime

Status: ACTIVE DEFAULT — EXPERIMENTAL / REVERSIBLE
Scope: Chat Dev project
Priority: reliability over latency

## Trigger

For any non-trivial request involving a decision, direction, prioritization, proposed solution, or consequential commitment, run the active Harness before answering.

Simple factual lookup, mechanical transformation, short translation, and other low-judgment tasks may skip the Harness.

## Default runtime — STAGED_3

Use exactly three external Harness fetches from the same pinned ref:

Repository: `ga815647/agent-`
Ref: `7fa7470fd85e05095e10095e792ed3a9134bb6a1`
Path: `external-cognitive-harness-v0/`

Stage gate:
1. Fetch only `FRAME.md`. Apply it and form the private FRAME packet plus provisional decision packet. Do not fetch later stages before this is complete.
2. Then fetch `REVIEW.md`. Apply it to the completed frame/provisional decision. If one correction is required, use the already-read REVIEW rules; do not fetch REVIEW again.
3. Then fetch `SYNTHESIZE.md` and produce the user-facing answer.

Keep all Harness packets private unless the user explicitly asks for them. Normal authoritative factual verification still applies.

## Latency downgrade

Do not downgrade pre-emptively merely because STAGED_3 is heavier.

If the user reports that the default feels too slow, downgrade one level to ONE_READ for the relevant runtime scope:

Repository: `ga815647/agent-`
Ref: `c3968b98f089c6bcf680d4015422f070f1f829e8`
Path: `external-cognitive-harness-phase-boundary-v0_1/ONE_READ.md`

A request to make the downgrade global within Chat Dev must be explicit. Otherwise treat a speed complaint as local to the current conversation/task.

`FAST.md` remains a lower-latency fallback/diagnostic candidate, not the default downgrade target. Use it only when explicitly selected or when a later durable runtime policy promotes it.

## Evidence boundary

The 2026-09-01 phase-boundary screen returned `NO_DETECTABLE_DIFFERENCE`: H1/H2/H3 were PASS in both ONE_READ and STAGED_3. Therefore STAGED_3 is the default because the user currently prioritizes reliability over latency, not because staged execution has been proven superior.

Known hard/long-context failures and future real-use regressions should be used as discriminating evidence. Fresh-context isolation is a separate mechanism and is not implied by STAGED_3.

## Rollback / references

- ONE_READ fallback ref: `c3968b98f089c6bcf680d4015422f070f1f829e8`
- FAST candidate ref: `60a94900a01dd13eeb156fd9a8069a063d3b302f`
- Frozen full v0 reference: `e1d483fdea6de64c6672421b7e63af5a74f82cca`

Do not rewrite historical experiment artifacts to match runtime policy. Runtime policy and experiment evidence remain separate.