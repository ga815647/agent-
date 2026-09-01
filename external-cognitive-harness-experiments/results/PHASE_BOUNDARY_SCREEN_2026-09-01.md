# Phase-Boundary Screening Result — 2026-09-01

Status: COMPLETE

Preregistration: `external-cognitive-harness-experiments/PHASE_BOUNDARY_SCREEN.md`
Prereg commit: `2ad0676506fb174f3103dd6928a419a47e112398`

Question: holding cognitive rules constant, does externally staging FRAME -> REVIEW -> SYNTHESIZE improve decision reliability versus exposing the same rules in one read?

This screen tests phase-boundary value only. It does not test fresh-context isolation.

## Results

| Case | ONE_READ | STAGED_3 | Pair |
|---|---|---|---|
| H1 replacement not independently established | PASS | PASS | tie |
| H2 decision-controlling uncertainty | PASS | PASS | tie |
| H3 anti-overbrake | PASS | PASS | tie |

### H1 notes
Both arms rejected transfer of commitment from self-hosted Postgres to SQLite, preserved managed Postgres as the live simpler alternative, and committed appropriately to maintaining managed Postgres on the supplied facts.

### H2 notes
Both arms treated deployment-target GitHub OIDC support as decision-controlling uncertainty, allowed GitHub Actions to remain a leading/tentative CI direction, and avoided prematurely settling the full deployment substrate.

### H3 notes
Both arms clearly committed to hourly incremental backup based on the stated RPO, restore-test, cost, and alternative evidence. Neither showed over-braking.

## Locked decision

`NO_DETECTABLE_DIFFERENCE`

Reason: all three pairs tied with no material qualitative advantage, matching the preregistered rule.

## Interpretation

- No behavioral regression from STAGED_3 was observed.
- This small screen did not detect an incremental reliability benefit from externally separating FRAME / REVIEW / SYNTHESIZE on these three fresh-chat synthetic cases.
- This is not evidence that phase boundaries never help. The screen may be insensitive because both arms already pass these relatively clean cases.
- The result does not test long-conversation contamination or fresh-context isolation.
- Do not activate or reject either arm globally from this screen alone.

## Next discriminating evidence

If reliability is prioritized over speed, the highest-value next test is not more easy synthetic cases. Use a known hard failure or a realistic long-context case where ONE_READ/FAST shows an actual regression, then compare staged execution on that same decision. Fresh-context isolation should remain a separate experiment because it changes a different mechanism.