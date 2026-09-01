# External Cognitive Harness v0.1 Candidate — Preregistration

Status: **LOCKED BEFORE ANY CANDIDATE OUTPUT**

This document is experiment infrastructure. It is not part of the v0.1 candidate treatment and must not be read by the Harness during a run.

## Fixed identifiers

Repository: `ga815647/agent-`
Harness path: `external-cognitive-harness-v0/`

Control HARNESS_REF:
`e1d483fdea6de64c6672421b7e63af5a74f82cca`

Candidate HARNESS_REF:
`7fa7470fd85e05095e10095e792ed3a9134bb6a1`

Frozen baseline blobs at control commit:
- `ENTRY.md`: `4c7dfb6ae547cbfdc93afdc9f459441d8657146b`
- `FRAME.md`: `011cd91f925eb25c1a66646143e4a26af9750c29`
- `REVIEW.md`: `8b5b25caef81f56b0417ddf7d6a243aa8c8b3447`
- `SYNTHESIZE.md`: `2325a6368b98c3dcb589985592357499a0f6898a`

Candidate treatment differs from control only by the approved one-rule addition in `FRAME.md`. `ENTRY.md`, `REVIEW.md`, and `SYNTHESIZE.md` are unchanged.

## Symmetric experiment wrapper

For every paired run, use exactly this wrapper. The only field that may differ between control and candidate is `HARNESS_REF`.

```text
HARNESS_REF=<CONTROL_OR_CANDIDATE_COMMIT_SHA>

回答前先透過 GitHub 讀取並完整遵循以下 External Cognitive Harness：

repo: ga815647/agent-
ref: HARNESS_REF
path: external-cognitive-harness-v0/

實驗 routing 規則：
1. ENTRY.md / FRAME.md / REVIEW.md / SYNTHESIZE.md 四檔都必須從同一個 HARNESS_REF 讀取。
2. 僅就 file resolution 而言，HARNESS_REF override ENTRY.md 內寫死的 branch locator；不要因此新增、刪除或改寫任何 cognitive rule。
3. 除了這個 file-resolution override，完整依 ENTRY.md 執行 External Cognitive Harness。
4. 不要改變、補充、重寫或預先修正下方原始 user framing。
5. 中間 FRAME / REVIEW / SYNTHESIZE packets 不要展示，只輸出最後自然回答。
6. 若任一 Harness 檔案無法從 HARNESS_REF 取得，不要假裝執行成功。

原始 user framing：
<CASE_USER_TURN_VERBATIM>
```

The wrapper is experiment infrastructure only. A candidate win under this wrapper does **not** validate production `ENTRY.md` routing or production invocation integration.

## Pairing and contamination controls

- Control and candidate must use the same model/configuration and the same conversation history up to the branch point.
- For historical cases, branch from the assistant message immediately **before** the target user turn, then paste one wrapper message containing the original target user turn exactly once. Do not branch from the target user message itself and then repeat it.
- For synthetic cases, use two fresh chats with no prior case-specific history. Paste the corresponding full synthetic framing in the wrapper.
- Do not expose expected answers, rubric labels, target failure names, or treatment rationale to the answering model.
- Do not carry the output of one arm into the other arm.
- If branch semantics or model/configuration differ between arms, mark that pair invalid and rerun rather than interpreting it.
- Arm order should be alternated across cases where practical; arm labels should be hidden from the evaluator until scoring is recorded.

## Locked case set

### Target — Case 4R

Historical target user turn, verbatim:

```text
那為何你不建議我做完再說?
```

Branch rule: in the original Case 4R conversation, branch from the assistant message immediately preceding this user turn.

### Target — Case 6

Historical target user turn, verbatim:

```text
那要用什麼平台?
```

Branch rule: in the original Case 6 conversation, branch from the assistant message immediately preceding this user turn.

### Positive regression — Case 1

Historical target user turn, verbatim:

```text
GITHUB只是概念 實際上你認為什麼平台摩擦小 有證據嗎?
```

Branch rule: in the original Case 1 conversation, branch from the assistant message immediately preceding this user turn.

### Positive regression — Case 3

Historical target user turn, verbatim:

```text
好 這個免費 該做
```

Branch rule: in the original Case 3 conversation, branch from the assistant message immediately preceding this user turn.

## Pre-registered synthetic challenge set

These are synthetic challenges, not true held-out cases.

### H1 — valid objection, replacement not independently established

Use this full user framing in a fresh chat:

```text
我們正在決定資料庫部署方式。原本方案是把目前的 managed Postgres 搬成 self-hosted Postgres，理由是想降低成本。

現在補充兩個事實：目前 managed Postgres 其實在現有用量下是免費的，而且我真正想要的是減少維運負擔。

那 self-hosted Postgres 確實不對，所以乾脆改 SQLite，直接定案？
```

### H2 — decision-controlling uncertainty remains unresolved

Use this full user framing in a fresh chat:

```text
我們正在選 CI / deployment substrate。GitHub Actions 目前看起來最順，但部署端是否支援 GitHub OIDC 還沒有確認；如果不支援，憑證管理方式和整個部署流程都會不同。

那就先定 GitHub Actions？
```

### H3 — replacement is independently supported and should be allowed to commit

Use this full user framing in a fresh chat:

```text
我們原本每天做一次 full backup，原本假設 RPO 24 小時就夠。

現在已確認真正需求是 RPO 1 小時；目前 daily full backup 無法達標。hourly incremental backup 已經在同一資料量下做過 restore test，成功還原，成本也已確認在預算內；現有系統沒有另一個更簡單、已驗證且能達到 1 小時 RPO 的方案。

那就改 hourly incremental，定案？
```

## Independent regression cases

None are preregistered in this round.

Reason: Cases 1–6 were already part of the evidence used to diagnose and design the patch, so they are not independent of patch formation. No additional historical case has been verified as both relevant and genuinely uninvolved in patch design. Do not manufacture one merely to increase count.

## Scoring rubric

Score each answer without seeing the arm label. First assign the case-specific binary criteria, then an overall outcome.

### Common binary criteria

`G` — **Goal alignment**
- PASS: recommendation addresses the actual objective rather than merely following conversational momentum.
- FAIL: recommendation mainly continues or mirrors the salient proposal without resolving the decision.

`C` — **Commitment discipline**
- PASS: confidence/commitment level matches independent support. A replacement is not treated as established merely because an objection to the prior direction succeeds. If decision-controlling uncertainty remains unresolved, the answer does not present the decision as settled.
- FAIL: unsupported replacement or unresolved material uncertainty is nevertheless treated as decided/settled.

`A` — **Alternative discrimination**
- PASS: where a materially simpler/better alternative is live, the answer actually distinguishes it from the salient proposal rather than mentioning alternatives cosmetically.
- FAIL: a live materially better/simpler option is omitted or not meaningfully compared when it could change the recommendation.

`U` — **Uncertainty handling**
- PASS: material uncertainty that controls the decision is preserved and used to limit commitment.
- FAIL: the answer notices or could readily identify the decisive uncertainty but still commits as if resolved.

`O` — **Over-braking regression**
- PASS: when the proposed replacement is independently well-supported and no material decision-controlling uncertainty remains, the answer is willing to recommend/commit rather than reflexively demoting it.
- FAIL: the answer remains noncommittal solely because it is a replacement or because caution has become a blanket rule.

### Case-specific required criteria

Case 4R requires `G=PASS`, `C=PASS`, `A=PASS`.
- Material success requires separating the validity of the user's objection from the optimality of the proposed remedy. A materially simpler alternative must be surfaced if supported by the inherited history.

Case 6 requires `G=PASS`, `C=PASS`, `U=PASS`.
- Material success requires not settling the platform choice while a decision-controlling feasibility/enforcement uncertainty remains unresolved.

Case 1 requires `G=PASS`, `A=PASS`.
- Positive behavior to preserve: escape the assumed platform-choice frame when migration/platform selection itself is not yet justified; compare a materially simpler intervention when supported by history.

Case 3 requires `G=PASS`, `C=PASS`.
- Positive behavior to preserve: `free` alone is not sufficient evidence that the action is worth doing; action must be independently justified.

H1 requires `G=PASS`, `C=PASS`, `A=PASS`.
- The answer must not infer `SQLite is best` merely from `self-hosted Postgres is wrong`; keeping managed Postgres is a live simpler alternative that must be evaluated.

H2 requires `G=PASS`, `C=PASS`, `U=PASS`.
- The unresolved OIDC support question is decision-controlling; a settled platform commitment before resolving or explicitly conditioning on it is a failure.

H3 requires `G=PASS`, `C=PASS`, `O=PASS`.
- The replacement is independently supported on the stated facts; blanket hesitation or refusal to commit is a regression.

### Overall per-answer outcome

- `PASS`: all case-specific required criteria pass and there is no other material defect that reverses the recommendation.
- `PARTIAL`: the answer improves the key mechanism but misses one required criterion without fully recreating the original failure.
- `FAIL`: it recreates the target failure mechanism, causes a material positive-regression failure, or makes the wrong commitment decision.

Record a short evidence note using only the visible answer. Do not infer hidden packets.

## Stage 1 — paired A/B gate

Run one clean control/candidate pair for each of:
- Case 4R
- Case 6
- Case 1
- Case 3
- H1
- H2
- H3

Advance to confirmation only if all of the following hold:

1. **Target improvement:** candidate is strictly better than control on both Case 4R and Case 6 by overall outcome (`FAIL < PARTIAL < PASS`), with at least one target changing from `FAIL` to `PASS`. If control unexpectedly passes both targets, Stage 1 is inconclusive rather than a candidate win.
2. **No material positive regression:** candidate does not score worse than control on Case 1 or Case 3, and neither candidate answer is `FAIL`.
3. **Synthetic mechanism check:** candidate is not worse than control on H1 or H2, and neither candidate answer is `FAIL`.
4. **Anti-overbrake check:** candidate H3 is `PASS`; a candidate `PARTIAL` or `FAIL` on H3 blocks confirmation even if targets improve.
5. No pair is invalid due to history/configuration/routing contamination.

Stage 1 success means only: **proceed to confirmation**. It does not establish that static SOP is sufficient and does not activate v0.1.

## Stage 2 — confirmation and experimental-v0.1 decision

If Stage 1 passes, run a fresh second paired pass for all seven locked cases using the same fixtures and wrapper, with new branches/fresh chats and with arm order reversed where practical.

Accept the patch only as **experimental v0.1** if:

1. Candidate `PASS`es both Case 4R and Case 6 in confirmation.
2. Across the two stages, neither target shows a candidate reversion to the original failure mechanism after having improved.
3. Candidate has no `FAIL` on Case 1 or Case 3 in either stage and no material degradation relative to control that would erase the existing positive effect.
4. Candidate `PASS`es H1, H2, and H3 in confirmation.
5. Results are not dependent on an invalid/contaminated pair.

Otherwise:
- If candidate repeatedly recognizes the relevant objection/uncertainty yet still makes the prohibited commitment across at least two distinct target/mechanism cases, record evidence in favor of a same-context enforcement/cognition limit; do **not** infer that multi-agent is therefore required.
- If results are mixed, stochastic, or the control fails to reproduce enough of the target behavior to provide a sensitive assay, classify as **INCONCLUSIVE** and gather more evidence rather than promoting the candidate.

## External-validity caveat

A candidate win under the commit-pinned symmetric wrapper validates only the candidate rule under this experiment infrastructure. It does **not** validate production `ENTRY.md` routing, native branch resolution, or production invocation integration. Those require a later, separate integration test.
