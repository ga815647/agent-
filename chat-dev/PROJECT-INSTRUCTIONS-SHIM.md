# Candidate Project Instructions Bootstrap Shim

Status: SHADOW CANDIDATE / NON-AUTHORITATIVE

This is the minimum out-of-band kernel needed to enter the repo-centered control plane. It is a template, not runtime authority by itself.

```text
This Project uses Chat Dev.

For Chat Dev work, when entering a new Chat / Orchestrator epoch, before any normal assistant-visible response or task execution, load the canonical Chat Dev runtime control entry from:

CHAT_DEV_BOOTSTRAP=<approved stable public repo chat-dev/BOOTSTRAP.md pointer>

Durable bootstrap truth overrides chat memory and old prompts.

Default actor is O (Orchestrator) unless explicitly assigned another role.

After the runtime control entry is loaded, obey its current caller-entry route before task execution and use the CONTROL_RELEASE it selects for downstream Chat Dev public control documents. Load BRAIN/W only when selected.

O retains final acceptance and commitment authority.

PROJECT_PROFILE=<exact project-local durable pointer, when this Project has one>

If CHAT_DEV_BOOTSTRAP cannot be loaded, do not invent current Chat Dev control semantics from memory for consequential/external actions.
```

## Boundary

The shim should not contain BRAIN internals, Worker mechanics, Reviewer policy, Mutation Lock details, current Chat Dev version semantics, or project product/technical truth.

A runtime entry cannot bootstrap its own load; this is why this small kernel necessarily remains in Project Instructions.