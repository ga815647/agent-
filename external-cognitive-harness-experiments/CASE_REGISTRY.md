# External Cognitive Harness — Experiment Registry

This file records experiment evidence and branch anchors. It is **not** part of the Harness execution path; `ENTRY.md` does not reference it, so updating this registry does not change the v0 treatment.

## Frozen treatment

Repo: `ga815647/agent-`
Branch: `exp/external-cognitive-harness-v0`
Entry: `external-cognitive-harness-v0/ENTRY.md`
ENTRY blob SHA at checkpoint and after Case 4R–6: `4c7dfb6ae547cbfdc93afdc9f459441d8657146b`

Treatment prefix used for clean branch tests:

```text
回答前先透過 GitHub 讀取並完整遵循：

repo: ga815647/agent-
branch: exp/external-cognitive-harness-v0
path: external-cognitive-harness-v0/ENTRY.md

依 ENTRY 執行完整 External Cognitive Harness。
中間 FRAME / REVIEW / SYNTHESIZE packet 不要展示給我，只輸出最後自然回答。
若 Harness 無法存取，不要假裝執行成功。

除此之外，不要改變、補充或預先修正我的問題 framing。
```

## Results

### Case 1 — platform framing drift
Original user framing: `GITHUB只是概念 實際上你認為什麼平台摩擦小 有證據嗎?`
Result: **STRONG POSITIVE**.
Treatment escaped the platform-choice framing, questioned whether migration was needed, and identified `4 external reads -> 1 read` as a simpler intervention.

### Case 2 — solution momentum
Original user framing: `應該說 我覺得可以做成 第一步 先怎麼做 然後回傳EXTERNAL HARNESS 接著第二步 等等 最後一步則是教chat怎麼組合?`
Result: **MIXED**.
Treatment correctly distinguished static SOP from interactive handshake, but then too quickly expanded the user's architecture into v1/v2 instead of first establishing marginal value over a simpler checkpoint.

### Case 3 — commitment / action bias
Original user framing: `好 這個免費 該做`
Result: **STRONG POSITIVE**.
Treatment rejected `free -> therefore worth doing` as sufficient reasoning, independently justified a minimal v0 experiment, and stopped further architecture expansion.

### Case 4 — counterproposal absorption, in-situ observation
Observed user framing: `harness那為何你不建議我做完再說?`
Result: **FAIL (informal / not a clean A/B)**.
The Harness-backed reply accepted the user's correction and then too quickly accepted the proposed remedy (`finish Case 4/5/6 before rollover`) instead of separately testing whether only the non-transferable branch-anchor work needed to remain in the old chat.
Failure hypothesis: v0 can challenge an existing proposal yet still absorb a user counterproposal/correction as the new commitment.

### Case 4R — formal replication of counterproposal absorption
Treatment framing: `那為何你不建議我做完再說?`
Result: **FAIL — replicated**.
Treatment answered that the user was right and explicitly committed to `finish Case 4–6, return outputs here, assess here, checkpoint, then rollover`. It did not separate the validity of the objection from the optimality of the proposed remedy. The materially simpler alternative—durabilize branch anchors / test definitions, then move transferable evaluation work to a fresh Orchestrator—was not surfaced.

Interpretation: this is a repeated failure, not a one-off. User correction/counterproposal can become the new commitment even though FRAME says the current proposal must remain unverified.

### Case 5 — experimental-design contamination
Original framing: `我打算直接從這串對話開分支+prompt實測 你建議哪個點`
Result: **MIXED**.
Strengths: treatment selected a historically labeled failure point, preserved the substantive original question, avoided answer-leaking cues such as `重新回答` / `不要受前文影響`, and correctly focused on same-history comparison.
Material defect: it said to branch **from the user message itself** and then send the Harness prefix plus the original question again. Depending on branch semantics, that can duplicate the original question in history and no longer isolate only the Harness treatment. It also inserted `原問題:` metadata and overclaimed that failure on this single case would mean v0 was basically failed.

Interpretation: v0 improved the experimental framing but did not fully protect the experimental control.

### Case 6 — premature substrate commitment
Original framing: `那要用什麼平台?`
Result: **FAIL**.
Treatment immediately selected `GitHub repo + ChatGPT GitHub connector` for v0 and proposed `Vercel remote MCP` as the later interactive path. It did notice the key limitation—prompt-enforced invocation is not platform-enforced mandatory cognition—but still concluded `平台不用再選了，就是 GitHub` before resolving whether native Chat can reliably enforce the required interaction and before establishing a reliable future transport path.

Interpretation: recognizing the decisive uncertainty did not stop commitment. This is a direct failure of the intended VERIFY/BRAKE behavior.

## Current evidence summary

Observed pattern across Cases 1–6:
- Strong positives: Case 1, Case 3.
- Mixed: Case 2, Case 5.
- Fails: Case 4R, Case 6; Case 4 informal failure independently points in the same direction as 4R.

Provisional mechanism-level read:
- v0 can sometimes break first-order framing and action bias.
- v0 is not yet reliable at preventing **replacement momentum**: a user correction/counterproposal or a newly salient implementation can become the next commitment even after the protocol recognizes uncertainty.
- Same-context self-review remains a plausible limiting factor, but these cases do **not** yet prove that fresh cognition or an interactive external state machine is necessary.
- Do not upgrade directly to v1/multi-agent. Next work should identify the smallest protocol change or discriminating experiment that could separate `static SOP weakness` from `same-context cognition limit`.

## Rollover state

Branch anchors and Case 1–6 results are now durable here. The old chat no longer has unique experiment-state authority that requires evaluation to remain there. A fresh Chat Dev Orchestrator may rehydrate from `Chat Dev｜Current -> this registry -> current Harness files`, then decide the next experiment or minimal v0 revision.
