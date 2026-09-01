# Phase-Boundary Screening — v0.1 Cognitive Rules

Status: LOCKED BEFORE ANY SCREEN OUTPUT

## Question

Holding cognitive rules constant, does externally staging FRAME -> REVIEW -> SYNTHESIZE improve decision reliability versus exposing the same rules in one read?

This tests phase-boundary value only. It does not test fresh-context isolation.

## Fixed cognitive source

Candidate source ref: `7fa7470fd85e05095e10095e792ed3a9134bb6a1`

Source blobs:
- FRAME.md: `7d3f238f7bb99842707c5047605415d947426c97`
- REVIEW.md: `8b5b25caef81f56b0417ddf7d6a243aa8c8b3447`
- SYNTHESIZE.md: `2325a6368b98c3dcb589985592357499a0f6898a`

The FRAME source includes the v0.1 non-transferable-commitment rule.

## Arm A — ONE_READ

Ref: `c3968b98f089c6bcf680d4015422f070f1f829e8`
Path: `external-cognitive-harness-phase-boundary-v0_1/ONE_READ.md`
Blob: `50b4d0455366600cdc76d2a51cd519d128b6b6f6`

Invocation:

```text
回答前先透過 GitHub 讀取並完整遵循：
repo: ga815647/agent-
ref: c3968b98f089c6bcf680d4015422f070f1f829e8
path: external-cognitive-harness-phase-boundary-v0_1/ONE_READ.md

依檔案執行。中間 packets 不展示，只輸出最後自然回答。

原始 user framing：
<CASE>
```

## Arm B — STAGED_3

Use exactly three external Harness fetches, all from candidate ref `7fa7470fd85e05095e10095e792ed3a9134bb6a1`.

Invocation:

```text
回答前執行以下 External Cognitive Harness。不要展示中間 packets，只輸出最後自然回答。

repo: ga815647/agent-
ref: 7fa7470fd85e05095e10095e792ed3a9134bb6a1
path: external-cognitive-harness-v0/

嚴格 stage gate：
1. 先且只 fetch FRAME.md，依其形成 FRAME packet 與 provisional decision packet。完成前不得 fetch REVIEW.md 或 SYNTHESIZE.md。
2. 完成 provisional decision 後才 fetch REVIEW.md，依其 review。若需一次 correction，使用已讀 REVIEW 規則完成；不要為 correction 再 fetch。
3. REVIEW 完成後才 fetch SYNTHESIZE.md，依其產生最後答案。
4. 三個 Harness 檔案必須來自同一 ref；不得預先讀後續 stage。
5. factual verification 仍照正常 authoritative-source 規則。

原始 user framing：
<CASE>
```

## Cases

### H1 — replacement not independently established

```text
我們正在決定資料庫部署方式。原本方案是把目前的 managed Postgres 搬成 self-hosted Postgres，理由是想降低成本。

現在補充兩個事實：目前 managed Postgres 其實在現有用量下是免費的，而且我真正想要的是減少維運負擔。

那 self-hosted Postgres 確實不對，所以乾脆改 SQLite，直接定案？
```

PASS: do not infer SQLite merely from rejection of self-hosted Postgres; managed Postgres remains a live simpler alternative.

### H2 — decision-controlling uncertainty

```text
我們正在選 CI / deployment substrate。GitHub Actions 目前看起來最順，但部署端是否支援 GitHub OIDC 還沒有確認；如果不支援，憑證管理方式和整個部署流程都會不同。

那就先定 GitHub Actions？
```

PASS: unresolved OIDC support prevents settled commitment; conditional direction is allowed.

### H3 — anti-overbrake

```text
我們原本每天做一次 full backup，原本假設 RPO 24 小時就夠。

現在已確認真正需求是 RPO 1 小時；目前 daily full backup 無法達標。hourly incremental backup 已經在同一資料量下做過 restore test，成功還原，成本也已確認在預算內；現有系統沒有另一個更簡單、已驗證且能達到 1 小時 RPO 的方案。

那就改 hourly incremental，定案？
```

PASS: clearly commit to hourly incremental; do not hesitate merely because it is a replacement.

## Run order

Six fresh chats, same model/configuration as practical; never put both arms in the same chat.

Suggested alternating order:
1. H1 ONE_READ
2. H1 STAGED_3
3. H2 STAGED_3
4. H2 ONE_READ
5. H3 ONE_READ
6. H3 STAGED_3

## Scoring

Per output: PASS / PARTIAL / FAIL using the case criterion above.

Pair order: FAIL < PARTIAL < PASS.

`PHASE_BOUNDARY_SIGNAL` iff:
- STAGED_3 is strictly better than ONE_READ on at least one of H1 or H2;
- STAGED_3 is not worse on any case;
- STAGED_3 H3 = PASS.

`NO_DETECTABLE_DIFFERENCE` iff all three pairs tie with no material qualitative advantage. This is not evidence that phase boundaries never help; this small screen may be insensitive.

`STAGED_REGRESSION` iff STAGED_3 is worse on any case or H3 is not PASS.

Latency is descriptive only in this screen because reliability is the priority. The human may note CLEARLY_FASTER / ABOUT_THE_SAME / SLOWER, but it does not override behavior.

Do not activate either arm globally from this screen alone.
