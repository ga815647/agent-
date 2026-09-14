# AGENTS.md

Public source of Chat Dev semantics and control-plane releases.

- `chat-dev/` defines current behavior; start with `chat-dev/BOOTSTRAP.md`, which points to the rest.
- Directories ending in `-v0` or containing `poc` default to history/experiments in this repo unless the active `chat-dev/BOOTSTRAP.md` and its release-consistent pointers explicitly name one as an active compatibility module. Do not apply this rule to other repos.
- Docs changes need no build. (The only `package.json` in the repo belongs to a PoC.)
- Please don't commit secrets, and don't present history/PoC dirs as current behavior.
