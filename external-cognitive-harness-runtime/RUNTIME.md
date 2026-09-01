# External Cognitive Harness — Chat Dev Runtime

Status: ACTIVE DEFAULT — EXPERIMENTAL / REVERSIBLE
Scope: Chat Dev project
Priority: reliability over latency

## Mandatory ingress

Every Chat Dev user request must enter the active Harness before answering. Do not decide outside the Harness that a request is too simple to need it.

Default ingress starts by fetching only `FRAME.md` from the pinned ref below.

After reading FRAME, `EARLY_EXIT_SAFE` is allowed only when the request is clearly low-judgment (for example: simple factual lookup, mechanical transformation, short translation, or straightforward status confirmation) and there is no material decision, direction, prioritization, proposed solution, commitment, framing risk, decision-controlling uncertainty, or conversation-momentum risk.

If `EARLY_EXIT_SAFE`, answer normally without fetching REVIEW or SYNTHESIZE. If there is any material doubt about whether early exit is safe, continue the full staged path.

## Default runtime — STAGED_3 with early exit

Repository: `ga815647/agent-`
Ref: `7fa7470fd85e05095e10095e792ed3a9134bb6a1`
Path: `external-cognitive-harness-v0/`

Stage gate:
1. Always fetch only `FRAME.md` first. Before fetching later stages, either:
   - declare `EARLY_EXIT_SAFE` privately and answer directly; or
   - apply FRAME fully and form the private FRAME packet plus provisional decision packet.
2. If not early-exiting, then fetch `REVIEW.md`. Apply it to the completed frame/provisional decision. If one correction is required, use the already-read REVIEW rules; do not fetch REVIEW again.
3. Then fetch `SYNTHESIZE.md` and produce the user-facing answer.

Never prefetch REVIEW or SYNTHESIZE before the FRAME-stage decision is complete. Keep all Harness packets and ingress decisions private unless the user explicitly asks for them. Normal authoritative factual verification still applies.

## Conversation-local Harness latch — real-use probe

Every Chat Dev assistant final response must end with this exact line:

`[CHAT_DEV_HARNESS_LATCH｜NEXT TURN: run active Chat Dev Harness before any substantive response. BEFORE FINAL: verify this-turn Harness ingress completed + re-append this latch.]`

Purpose: keep both the next-turn ingress requirement and the current-turn pre-final self-check at the freshest edge of the conversation context, reducing long-context / conversation-momentum misses.

The latch is a reminder and self-check instruction only. Its presence never proves that the current turn completed Harness ingress. On each new user turn, ingress must still occur before substantive answering. Before final output, verify that this-turn Harness ingress actually completed and re-append the exact latch. Do not omit the latch for short answers, early exits, status confirmations, long conversations, or because the previous turn already used the Harness.

This is an experimental, reversible real-use probe. A future durable decision may retain, modify, or remove it based on observed misses and interaction cost.

## Latency downgrade

Do not downgrade pre-emptively merely because STAGED_3 is heavier.

If the user reports that the default feels too slow, downgrade one level to ONE_READ for the relevant runtime scope:

Repository: `ga815647/agent-`
Ref: `c3968b98f089c6bcf680d4015422f070f1f829e8`
Path: `external-cognitive-harness-phase-boundary-v0_1/ONE_READ.md`

Mandatory ingress still applies after downgrade: every request must enter the selected Harness. Low-judgment requests may early-exit internally; do not restore an outside-the-Harness skip classifier.

A request to make the downgrade global within Chat Dev must be explicit. Otherwise treat a speed complaint as local to the current conversation/task.

`FAST.md` remains a lower-latency fallback/diagnostic candidate, not the default downgrade target. Use it only when explicitly selected or when a later durable runtime policy promotes it.

## Evidence boundary

The 2026-09-01 phase-boundary screen returned `NO_DETECTABLE_DIFFERENCE`: H1/H2/H3 were PASS in both ONE_READ and STAGED_3. Therefore STAGED_3 is the default because the user currently prioritizes reliability over latency, not because staged execution has been proven superior.

Mandatory ingress + early exit is a runtime policy choice intended to reduce false-negative routing at the Harness boundary. It has not yet been separately validated as an efficacy improvement.

Known hard/long-context failures and future real-use regressions should be used as discriminating evidence. Fresh-context isolation is a separate mechanism and is not implied by STAGED_3.

## Rollback / references

- ONE_READ fallback ref: `c3968b98f089c6bcf680d4015422f070f1f829e8`
- FAST candidate ref: `60a94900a01dd13eeb156fd9a8069a063d3b302f`
- Frozen full v0 reference: `e1d483fdea6de64c6672421b7e63af5a74f82cca`

Do not rewrite historical experiment artifacts to match runtime policy. Runtime policy and experiment evidence remain separate.