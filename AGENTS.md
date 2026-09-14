# AGENTS.md — ga815647/agent-（公開：語義與控制源）

- 本 repo 是 Chat Dev 公開語義與控制源。真相＝BOOTSTRAP 釘住的 CONTROL_RELEASE（immutable SHA），**不是** working tree（它可能是舊的）。
- 必讀集合＝本檔唯一。行為契約看已載入的 control release；其他一律按確切地址抓，不搜尋、不重推導。
- 佈局：`chat-dev/` 是現行控制；帶 `-v0`／`poc` 的目錄是歷史／PoC，只讀參考，不當現行，不新增頂層。
- 禁：從 working tree 推斷現行語義；未授權開分支／PR；把秘密寫進任何檔。
