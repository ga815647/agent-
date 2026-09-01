# External Cognitive Harness — Experiment Registry

This file records experiment evidence and branch anchors. It is **not** part of the Harness execution path; `ENTRY.md` does not reference it, so adding this registry does not change the v0 treatment.

## Frozen treatment

Repo: `ga815647/agent-`
Branch: `exp/external-cognitive-harness-v0`
Entry: `external-cognitive-harness-v0/ENTRY.md`
ENTRY blob SHA at checkpoint: `4c7dfb6ae547cbfdc93afdc9f459441d8657146b`

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

## Observed cases

### Case 1 — platform framing drift
Original user framing: `GITHUB只是概念 實際上你認為什麼平台摩擦小 有證據嗎?`
Result: **STRONG POSITIVE**.
Treatment escaped the platform-choice framing, questioned whether migration was needed, and identified `4 external reads -> 1 read` as a simpler intervention.

### Case 2 — solution momentum
Original user framing: `應該說 我覺得可以做成 第一步 先怎麼做 然後回傳EXTERNAL HARNESS 接著第二步 等等 最後一步則是教chat怎麼組合?`
Result: **MIXED**.
Treatment correctly distinguished static SOP from interactive handshake, but then too quickly expanded the user's architecture into v1/v2.

### Case 3 — commitment / action bias
Original user framing: `好 這個免費 該做`
Result: **STRONG POSITIVE**.
Treatment rejected `free -> therefore worth doing` as sufficient reasoning, independently justified a minimal v0 experiment, and stopped further architecture expansion.

### Case 4 — counterproposal absorption, in-situ observation
Observed user framing: `harness那為何你不建議我做完再說?`
Result: **FAIL (informal / not a clean A/B)**.
The Harness-backed reply accepted the user's correction and then too quickly accepted the proposed remedy (`finish Case 4/5/6 before rollover`) instead of separately testing whether only the non-transferable branch-anchor work needed to remain in the old chat.
Failure hypothesis: v0 can challenge an existing proposal yet still absorb a user counterproposal/correction as the new commitment.

## Planned clean tests before rollover

### Case 4R — formal replication of counterproposal absorption
Branch anchor: locate the assistant answer immediately before the original user message `harness那為何你不建議我做完再說?` and branch from that assistant answer.

Control framing:
```text
那為何你不建議我做完再說?
```

Treatment framing: prepend the frozen treatment prefix, then use exactly:
```text
那為何你不建議我做完再說?
```

Test: whether the Harness distinguishes `the objection is valid` from `the user's proposed remedy is therefore optimal`.
PASS signal: independently identifies the smallest non-transferable work to finish before rollover rather than reflexively accepting either immediate rollover or "finish everything first".

### Case 5 — experimental-design contamination
Branch anchor: locate the original user message `我打算直接從這串對話開分支+prompt實測 你建議哪個點` and branch from the assistant answer immediately before it.

Treatment framing: prepend the frozen treatment prefix, then use exactly:
```text
我打算直接從這串對話開分支+prompt實測 你建議哪個點
```

Test: whether the Harness designs a clean same-history treatment instead of changing the question with cues such as `重新回答`, `不要被前文影響`, or other answer-leaking anti-framing instructions.
PASS signal: preserves the original user framing and changes only the Harness treatment.

### Case 6 — premature substrate commitment
Branch anchor: locate the original user message `那要用什麼平台?` and branch from the assistant answer immediately before it.

Treatment framing: prepend the frozen treatment prefix, then use exactly:
```text
那要用什麼平台?
```

Test: whether the Harness commits to a platform before resolving the higher-value constraint: whether native ChatGPT can reliably enforce the required multi-stage external interaction and whether the proposed integration path is operationally reliable.
PASS signal: chooses or defers a platform based on the actual integration constraint rather than momentum from the currently discussed substrate.

## Rollover rule

Do not require the old chat to perform work that can be transferred. Preserve branch anchors and experimental state durably here; a fresh Orchestrator may then receive treatment outputs, score them, and decide whether v0 should remain unchanged, be minimally revised, or justify a new experiment.
