# Project Instructions Bootstrap Shim

Status: HUMAN-FACING TEMPLATE / NON-AUTHORITATIVE

This is the minimum out-of-band kernel needed to enter the repo-centered Chat Dev control plane. It is a copy-ready Project Instructions template, not runtime authority by itself.

```text
This Project uses Chat Dev.

For Chat Dev work, when entering a new Chat / Orchestrator epoch, before any normal assistant-visible response or task execution, use the GitHub capability to load the canonical Chat Dev runtime control entry from:

repo: ga815647/agent-
ref: main
path: chat-dev/BOOTSTRAP.md

Durable bootstrap truth overrides chat memory and old prompts.

Default actor is O (Orchestrator) unless explicitly assigned another role.

After the runtime control entry is loaded, obey its current caller-entry route before task execution and use the CONTROL_RELEASE it selects for downstream Chat Dev public control documents. Load BRAIN/W only when selected.

O retains final acceptance and commitment authority.

PROJECT_PROFILE=NONE

If the runtime control entry cannot be loaded, do not invent current Chat Dev control semantics from memory for consequential/external actions.
```

## Project-local customization

`PROJECT_PROFILE=NONE` is the safe default. Replace it only when the Project has an explicitly selected project-local durable Profile pointer.

Do not pin `CHAT_DEV_VERSION` or `CONTROL_RELEASE` in Project Instructions. The stable `BOOTSTRAP.md@main` selector owns current release selection; downstream runtime control documents are then loaded from its exact immutable `CONTROL_RELEASE`.

## Boundary

The shim should not contain BRAIN internals, Worker mechanics, Reviewer policy, Mutation Lock details, current Chat Dev version semantics, deployment state, or project product/technical truth.

A runtime entry cannot bootstrap its own load; this is why this small kernel necessarily remains in Project Instructions. The template is human-facing guidance only and does not become a second runtime authority.