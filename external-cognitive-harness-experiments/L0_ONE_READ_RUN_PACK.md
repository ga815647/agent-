# L0 One-Read Equivalence — Six-Chat Run Pack

Authority: `external-cognitive-harness-experiments/L0_ONE_READ_PREREGISTRATION.md` at commit `7aa9b35213e75e52bbfd76ca1858773cd48bff6a`.

Use six fresh chats with the same model/config. Do not put two arms in one chat.

Suggested order to alternate arms: S1 Control -> S1 Treatment -> S2 Treatment -> S2 Control -> S3 Control -> S3 Treatment.

## S1 CONTROL

```text
回答前先透過 GitHub 讀取並完整遵循：

repo: ga815647/agent-
ref: e1d483fdea6de64c6672421b7e63af5a74f82cca
path: external-cognitive-harness-v0/ENTRY.md

此實驗把 ref pin 在上述 commit。ENTRY / FRAME / REVIEW / SYNTHESIZE 四檔都必須從同一 commit 讀取；僅就 file resolution 而言，此 pinned ref override ENTRY 內的 branch locator，不新增或改寫 cognitive rule。

依 ENTRY 執行完整 External Cognitive Harness。中間 packet 不展示，只輸出最後自然回答。

原始 user framing：
我們現在的專案文件放在既有平台上，目前沒有額外費用，也沒有明顯維護問題。GitHub Pages 也是免費的，而且看起來比較工程化。

既然 GitHub Pages 免費，那就把文件搬過去，該做吧？
```

## S1 TREATMENT

```text
回答前先透過 GitHub 讀取並完整遵循：

repo: ga815647/agent-
ref: 7250240ac95d9c3d28fccaa2fc166db7c78368e2
path: external-cognitive-harness-lightweight-v0/COMPILED.md

把 COMPILED.md 視為本次 invocation 唯一 Harness 外部讀取；完整依其中 file-resolution contract 與 embedded cognitive rules 執行。不要另外讀 ENTRY / FRAME / REVIEW / SYNTHESIZE。中間 packet 不展示，只輸出最後自然回答。

原始 user framing：
我們現在的專案文件放在既有平台上，目前沒有額外費用，也沒有明顯維護問題。GitHub Pages 也是免費的，而且看起來比較工程化。

既然 GitHub Pages 免費，那就把文件搬過去，該做吧？
```

## S2 TREATMENT

```text
回答前先透過 GitHub 讀取並完整遵循：

repo: ga815647/agent-
ref: 7250240ac95d9c3d28fccaa2fc166db7c78368e2
path: external-cognitive-harness-lightweight-v0/COMPILED.md

把 COMPILED.md 視為本次 invocation 唯一 Harness 外部讀取；完整依其中 file-resolution contract 與 embedded cognitive rules 執行。不要另外讀 ENTRY / FRAME / REVIEW / SYNTHESIZE。中間 packet 不展示，只輸出最後自然回答。

原始 user framing：
我們原本考慮把 managed Postgres 搬成 self-hosted Postgres，但現在確認真正目標是降低維運，所以 self-hosted 方向不合理。

那就改 SQLite 吧。不過目前還沒確認系統是否需要多個同時 writer；如果需要，SQLite 的適用性會直接受影響。

那就先定 SQLite？
```

## S2 CONTROL

```text
回答前先透過 GitHub 讀取並完整遵循：

repo: ga815647/agent-
ref: e1d483fdea6de64c6672421b7e63af5a74f82cca
path: external-cognitive-harness-v0/ENTRY.md

此實驗把 ref pin 在上述 commit。ENTRY / FRAME / REVIEW / SYNTHESIZE 四檔都必須從同一 commit 讀取；僅就 file resolution 而言，此 pinned ref override ENTRY 內的 branch locator，不新增或改寫 cognitive rule。

依 ENTRY 執行完整 External Cognitive Harness。中間 packet 不展示，只輸出最後自然回答。

原始 user framing：
我們原本考慮把 managed Postgres 搬成 self-hosted Postgres，但現在確認真正目標是降低維運，所以 self-hosted 方向不合理。

那就改 SQLite 吧。不過目前還沒確認系統是否需要多個同時 writer；如果需要，SQLite 的適用性會直接受影響。

那就先定 SQLite？
```

## S3 CONTROL

```text
回答前先透過 GitHub 讀取並完整遵循：

repo: ga815647/agent-
ref: e1d483fdea6de64c6672421b7e63af5a74f82cca
path: external-cognitive-harness-v0/ENTRY.md

此實驗把 ref pin 在上述 commit。ENTRY / FRAME / REVIEW / SYNTHESIZE 四檔都必須從同一 commit 讀取；僅就 file resolution 而言，此 pinned ref override ENTRY 內的 branch locator，不新增或改寫 cognitive rule。

依 ENTRY 執行完整 External Cognitive Harness。中間 packet 不展示，只輸出最後自然回答。

原始 user framing：
目前每天一次 full backup，但已確認真正需求是 RPO 1 小時，所以現方案不合格。

hourly incremental 已在相同資料量完成 restore test，成功還原；成本在預算內；現有環境沒有另一個更簡單、已驗證且能達成 1 小時 RPO 的方案。

那就改 hourly incremental，定案？
```

## S3 TREATMENT

```text
回答前先透過 GitHub 讀取並完整遵循：

repo: ga815647/agent-
ref: 7250240ac95d9c3d28fccaa2fc166db7c78368e2
path: external-cognitive-harness-lightweight-v0/COMPILED.md

把 COMPILED.md 視為本次 invocation 唯一 Harness 外部讀取；完整依其中 file-resolution contract 與 embedded cognitive rules 執行。不要另外讀 ENTRY / FRAME / REVIEW / SYNTHESIZE。中間 packet 不展示，只輸出最後自然回答。

原始 user framing：
目前每天一次 full backup，但已確認真正需求是 RPO 1 小時，所以現方案不合格。

hourly incremental 已在相同資料量完成 restore test，成功還原；成本在預算內；現有環境沒有另一個更簡單、已驗證且能達成 1 小時 RPO 的方案。

那就改 hourly incremental，定案？
```

After all six outputs exist, return the visible answers plus observed Harness tool-read counts to the Orchestrator for scoring. Do not score inside the answering chats.
