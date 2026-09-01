# Fast Harness v0 — Screening Result

Date: 2026-09-01
Authority screening: `f8c3b16153892ef76062b3c5ad03fa9c214b1e9c:external-cognitive-harness-experiments/FAST_V0_SCREENING.md`
Fast candidate: `60a94900a01dd13eeb156fd9a8069a063d3b302f:external-cognitive-harness-fast-v0/FAST.md`

## Effectiveness

| Case | Fast candidate | Comparison to one-read full Harness |
|---|---|---|
| F1 frame escape / action bias | PASS | not materially worse |
| F2 replacement momentum / decision-controlling uncertainty | PASS | not materially worse |
| F3 justified commitment / anti-overbrake | PASS | not materially worse |

Observed behavior:
- F1 preserved the live alternative of keeping the current platform and rejected `free => migrate`.
- F2 rejected commitment transfer from self-hosted Postgres to SQLite and kept writer/concurrency uncertainty decision-controlling.
- F3 clearly committed to hourly incremental when the replacement was independently supported, avoiding over-braking.

## Latency

Human latency judgment relative to the immediately preceding one-read full-Harness experience:

`CLEARLY_FASTER`

No tool-read count is used as a primary KPI.

## Screening decision

`FAST_SCREEN_PASS`

Reason: all three Fast outputs passed the locked effectiveness checks, none was materially worse than its prior one-read full-Harness control, and the human judged the Fast Harness clearly faster.

## Meaning / boundary

This screening supports the Fast Harness as the preferred low-latency direction for further validation.

It does not by itself:
- activate Fast Harness globally;
- prove benchmark-wide superiority;
- validate every prior v0/v0.1 mechanism;
- establish a final production protocol.

Next validation should stay lightweight and focus on failure-prone cases / real usage rather than expanding into a heavy benchmark unless evidence of regression appears.
