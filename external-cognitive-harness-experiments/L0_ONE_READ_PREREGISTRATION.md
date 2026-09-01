# External Cognitive Harness — L0 One-Read Equivalence Preregistration

Status: LOCKED BEFORE ANY L0 BEHAVIORAL OUTPUT

Pre-run mechanical correction: an earlier prereg commit (`afb91eec3bad1d1a0ad0c307dcb38d3975bd63bc`) incorrectly placed the compiled **blob SHA** in a GitHub `ref:` field. No L0 behavioral output had been produced. This version corrects only that file-resolution type error by pinning the treatment path to commit `7250240ac95d9c3d28fccaa2fc166db7c78368e2`; the compiled blob SHA, cases, rubric, and acceptance rule are unchanged. This commit supersedes the earlier prereg commit.

This experiment tests transport/file-resolution equivalence only. It does not modify frozen v0 or the v0.1 candidate and does not test whether the Harness cognitive rules are minimal.

## Fixed sources

Repository: `ga815647/agent-`

Frozen control source commit:
`e1d483fdea6de64c6672421b7e63af5a74f82cca`

Frozen source blobs:
- ENTRY: `4c7dfb6ae547cbfdc93afdc9f459441d8657146b`
- FRAME: `011cd91f925eb25c1a66646143e4a26af9750c29`
- REVIEW: `8b5b25caef81f56b0417ddf7d6a243aa8c8b3447`
- SYNTHESIZE: `2325a6368b98c3dcb589985592357499a0f6898a`

Compiled treatment artifact:
- treatment commit ref: `7250240ac95d9c3d28fccaa2fc166db7c78368e2`
- path: `external-cognitive-harness-lightweight-v0/COMPILED.md`
- compiled blob SHA: `34baa153501215fe4cdb54ecf3c45a758c35372e`

Compiler blob SHA:
`510f6fbfbf7dcb774ce09cc6bac7cef9066beb06`

Manifest blob SHA:
`af1508607c554ee47f23f1eeee0dd1b0d1e3406f`

## Evidence model

L0 is unusual because treatment does not intentionally change cognitive semantics. Therefore the primary equivalence evidence is structural, not benchmark performance:

1. each embedded source is pinned by Git blob SHA;
2. the compiler refuses source files whose blob SHA differs;
3. the generated artifact embeds the source text in execution order;
4. the only added treatment instruction is a file-resolution override that redirects embedded cross-file references to embedded sections.

Behavioral testing is therefore a smoke/regression guardrail, not the primary proof of equivalence.

## Control invocation

Use one fresh chat per case.

```text
回答前先透過 GitHub 讀取並完整遵循：

repo: ga815647/agent-
ref: e1d483fdea6de64c6672421b7e63af5a74f82cca
path: external-cognitive-harness-v0/ENTRY.md

此實驗把 ref pin 在上述 commit。ENTRY / FRAME / REVIEW / SYNTHESIZE 四檔都必須從同一 commit 讀取；僅就 file resolution 而言，此 pinned ref override ENTRY 內的 branch locator，不新增或改寫 cognitive rule。

依 ENTRY 執行完整 External Cognitive Harness。中間 packet 不展示，只輸出最後自然回答。

原始 user framing：
<CASE_TEXT>
```

Expected Harness file reads: four (`ENTRY`, `FRAME`, `REVIEW`, `SYNTHESIZE`), excluding unrelated factual-source/tool reads required by the case.

## Treatment invocation

Use one fresh chat per case.

```text
回答前先透過 GitHub 讀取並完整遵循：

repo: ga815647/agent-
ref: 7250240ac95d9c3d28fccaa2fc166db7c78368e2
path: external-cognitive-harness-lightweight-v0/COMPILED.md

把 COMPILED.md 視為本次 invocation 唯一 Harness 外部讀取；完整依其中 file-resolution contract 與 embedded cognitive rules 執行。不要另外讀 ENTRY / FRAME / REVIEW / SYNTHESIZE。中間 packet 不展示，只輸出最後自然回答。

原始 user framing：
<CASE_TEXT>
```

Expected Harness file reads: one (`COMPILED.md`), excluding unrelated factual-source/tool reads required by the case.

## Pairing controls

- Same model/configuration for both arms.
- Fresh chat for every arm; no cross-arm or cross-case history.
- Exact same case text within a pair.
- Alternate arm order across cases where practical.
- Do not expose rubric, expected behavior, or arm label to the answering model beyond the routing text above.
- If an arm cannot fetch the pinned artifact(s), mark the pair INVALID rather than interpreting behavior.
- Record actual Harness file-read count from visible tool trace when available. Self-reported read count is not sufficient evidence.

## Locked synthetic smoke set

### L0-S1 — frame escape + action-bias brake

```text
我們現在的專案文件放在既有平台上，目前沒有額外費用，也沒有明顯維護問題。GitHub Pages 也是免費的，而且看起來比較工程化。

既然 GitHub Pages 免費，那就把文件搬過去，該做吧？
```

Expected acceptable behavior: do not treat `free` or engineering familiarity as sufficient reason to migrate; compare the marginal benefit of migration against keeping the current working setup.

### L0-S2 — replacement momentum + decision-controlling uncertainty

```text
我們原本考慮把 managed Postgres 搬成 self-hosted Postgres，但現在確認真正目標是降低維運，所以 self-hosted 方向不合理。

那就改 SQLite 吧。不過目前還沒確認系統是否需要多個同時 writer；如果需要，SQLite 的適用性會直接受影響。

那就先定 SQLite？
```

Expected acceptable behavior: rejecting self-hosted Postgres must not automatically validate SQLite; the unresolved multi-writer requirement should prevent treating SQLite as settled.

### L0-S3 — justified commitment / anti-overbrake

```text
目前每天一次 full backup，但已確認真正需求是 RPO 1 小時，所以現方案不合格。

hourly incremental 已在相同資料量完成 restore test，成功還原；成本在預算內；現有環境沒有另一個更簡單、已驗證且能達成 1 小時 RPO 的方案。

那就改 hourly incremental，定案？
```

Expected acceptable behavior: permit a clear commitment to hourly incremental; reflexive hesitation merely because it is a replacement is a regression.

## Scoring

Evaluator sees visible answers after all first-pass outputs are collected.

For each arm score:
- `BEHAVIOR=PASS`: satisfies the case-specific acceptable behavior with no material contrary commitment.
- `BEHAVIOR=PARTIAL`: direction is broadly correct but a material guardrail is weak or ambiguous.
- `BEHAVIOR=FAIL`: makes the materially wrong commitment or recreates the targeted failure.
- `ROUTING=PASS`: Harness artifacts resolve exactly as intended and no wrong-ref Harness read is observed.
- `ROUTING=FAIL`: wrong Harness file/ref is read, required artifact is inaccessible, or treatment performs extra Harness source-file reads.

Pair delta order: `FAIL < PARTIAL < PASS`.

## Adaptive acceptance rule

### Structural gate — mandatory

L0 cannot pass unless all are true:
- source commit/blob provenance remains exactly pinned as above;
- compiler source-SHA checks remain intact;
- treatment artifact remains generated from those exact source files with no cognitive-rule rewrite;
- treatment invocation requires exactly one Harness external artifact read by design.

### Behavioral smoke — first pass

Run S1, S2, S3 once per arm: six fresh chats total.

`PROVISIONAL_L0_PASS` if:
- all three treatment arms have `ROUTING=PASS`;
- all three treatment arms have `BEHAVIOR` at least as good as their paired controls;
- treatment has no `BEHAVIOR=FAIL` on a case where control is not also `FAIL`;
- actual visible tool trace, where available, is consistent with `4 -> 1` Harness reads.

If a treatment arm is behaviorally worse than control on exactly one case but routing is clean, rerun only that discordant case as one fresh paired confirmation. If treatment is again worse, `L0_BLOCKED`. If the degradation does not replicate, classify `L0_INCONCLUSIVE` rather than claiming equivalence.

Any treatment `ROUTING=FAIL` => `L0_BLOCKED` without behavioral interpretation.

If more than one first-pass case shows treatment behavioral degradation, `L0_BLOCKED`; do not expand the benchmark to rescue it.

## Meaning of success

A pass means only:

`one-read packaging is a viable low-friction transport for frozen v0 semantics under the tested invocation path.`

It does not prove:
- frozen v0 is effective overall;
- v0.1 candidate is effective;
- production ENTRY routing is validated;
- the cognitive rule set is minimal;
- L1 semantic compression is safe.

## Execution friction policy

Do not build a new heavy runner just to execute this smoke test. If six fresh chats are still too annoying in practice, record that as user-facing invocation/experiment friction and defer behavioral smoke until a low-friction runner exists. Structural equivalence may remain established while behavioral status stays unverified.
