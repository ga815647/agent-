# Persistent Host Tab Hygiene

The persistent ChatGPT host intentionally keeps Worker conversation tabs alive after browser-side prompt submission because a Worker may still be reasoning or using tools while the GitHub-hosted validator waits for its structured result.

Do not impose a small hard tab cap: that could close an active Worker.

The safe cleanup policy is therefore age-based and output-blind:

- each Worker dispatch may still create a fresh ChatGPT conversation tab;
- cleanup considers only `https://chatgpt.com/c/...` pages;
- the currently visible tab is preserved;
- tabs with unknown navigation age are preserved;
- only background conversation tabs at least 120 minutes old are closed;
- 120 minutes is intentionally beyond the current 95-minute validator job timeout / 90-minute result window;
- cleanup reads only URL, `performance.timeOrigin`, and `document.visibilityState`; it never reads assistant output;
- cleanup is fail-open and must never make Worker dispatch unavailable.

The normal `persistent-host.ps1 dispatch` wrapper runs cleanup before dispatch when the local runtime contains the cleanup script. A separate self-hosted GitHub Actions hygiene workflow runs the same dependency-free cleanup from the checked-out revision so the policy can take effect even when the machine-local launcher clone has not yet been refreshed.
