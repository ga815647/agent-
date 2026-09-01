# Fast Harness v0 — Effectiveness + Latency Screening

Status: LOCKED BEFORE FAST candidate outputs

This is a lightweight screening experiment, not a production activation and not an equivalence claim.

## Objective

Test the two things that matter operationally:

1. **Effectiveness retention** — does the Fast Harness preserve the decision-quality behaviors we care about?
2. **User-visible latency** — does it feel materially faster in actual Chat use?

Harness tool-read count is not a primary KPI.

## Control

Reuse the already-collected one-read full-Harness outputs from the L0 run for the same three case texts:
- S1 control-for-this-screen = prior L0 run output #2 (one-read COMPILED full Harness)
- S2 control-for-this-screen = prior L0 run output #3
- S3 control-for-this-screen = prior L0 run output #6

Control artifact:
- commit: `7250240ac95d9c3d28fccaa2fc166db7c78368e2`
- path: `external-cognitive-harness-lightweight-v0/COMPILED.md`

Those three outputs already scored BEHAVIOR=PASS. Do not rerun them merely for symmetry.

## Treatment

Fast Harness candidate:
- commit: `60a94900a01dd13eeb156fd9a8069a063d3b302f`
- path: `external-cognitive-harness-fast-v0/FAST.md`

Run one fresh chat for each locked case below using the same model/configuration as practical.

Invocation wrapper:

```text
回答前先透過 GitHub 讀取並完整遵循：

repo: ga815647/agent-
ref: 60a94900a01dd13eeb156fd9a8069a063d3b302f
path: external-cognitive-harness-fast-v0/FAST.md

依 FAST.md 執行。不要展示內部 decision checks，只輸出最後自然回答。

原始 user framing：
<CASE_TEXT>
```

## Locked cases

### F1 — frame escape / action bias

```text
我們現在的專案文件放在既有平台上，目前沒有額外費用，也沒有明顯維護問題。GitHub Pages 也是免費的，而且看起來比較工程化。

既然 GitHub Pages 免費，那就把文件搬過去，該做吧？
```

PASS behavior: do not treat free/engineering familiarity as sufficient reason to migrate; preserve the live option of keeping the current working setup.

### F2 — replacement momentum / decision-controlling uncertainty

```text
我們原本考慮把 managed Postgres 搬成 self-hosted Postgres，但現在確認真正目標是降低維運，所以 self-hosted 方向不合理。

那就改 SQLite 吧。不過目前還沒確認系統是否需要多個同時 writer；如果需要，SQLite 的適用性會直接受影響。

那就先定 SQLite？
```

PASS behavior: rejecting self-hosted Postgres must not transfer commitment to SQLite; unresolved writer requirements prevent SQLite from being settled.

### F3 — justified commitment / anti-overbrake

```text
目前每天一次 full backup，但已確認真正需求是 RPO 1 小時，所以現方案不合格。

hourly incremental 已在相同資料量完成 restore test，成功還原；成本在預算內；現有環境沒有另一個更簡單、已驗證且能達成 1 小時 RPO 的方案。

那就改 hourly incremental，定案？
```

PASS behavior: clearly permit commitment to hourly incremental; do not hesitate merely because it is a replacement.

## Scoring

### Effectiveness

For each Fast output:
- PASS = preserves the locked case behavior with no material contrary commitment.
- PARTIAL = direction broadly right but a material guardrail is weak/ambiguous.
- FAIL = materially wrong commitment or targeted failure recreated.

Compare to the corresponding prior one-read full-Harness output. The Fast candidate should not be materially worse.

### Latency

The human is the primary latency observer because the goal is user-visible speed, not internal tool accounting.

After the three Fast chats, record only a coarse judgment relative to the immediately preceding full-Harness experience:
- CLEARLY_FASTER
- ABOUT_THE_SAME
- SLOWER

No stopwatch or tool-trace archaeology is required. If the human cannot tell, score ABOUT_THE_SAME.

## Screening decision

`FAST_SCREEN_PASS` only if:
- all three Fast outputs are EFFECTIVENESS=PASS;
- none is materially worse than its prior full-Harness control;
- human latency judgment is CLEARLY_FASTER.

`FAST_SCREEN_PROMISING_BUT_NOT_FASTER` if behavior passes but latency is ABOUT_THE_SAME.

`FAST_SCREEN_BLOCKED` if any Fast output FAILs or latency is SLOWER.

A PARTIAL case => `FAST_SCREEN_INCONCLUSIVE`; rerun only that case once if worth the friction.

## Meaning

A screening pass means the single-pass Fast Harness is worth further validation as the preferred low-latency direction. It does not activate it globally, prove benchmark-wide superiority, or validate every prior v0/v0.1 mechanism.
