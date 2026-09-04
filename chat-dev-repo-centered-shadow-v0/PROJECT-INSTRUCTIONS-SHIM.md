# Candidate Project Instructions Bootstrap Shim

Status: SHADOW / NON-AUTHORITATIVE

Use only for cold-start evaluation. Production Projects remain unchanged.

```text
This Project uses Chat Dev.

For Chat Dev work, when entering a new Chat / Orchestrator epoch, before any normal assistant-visible response or task execution, load the canonical Chat Dev runtime control entry from the public `ga815647/agent-` repository at the configured stable bootstrap pointer.

Durable bootstrap truth overrides chat memory and old prompts.

Default actor is `O` (Orchestrator) unless explicitly assigned another role.

After the runtime control entry is loaded, follow its current caller-entry route before task execution. Load downstream capabilities only when selected by that runtime entry.

`O` retains final acceptance and commitment authority.

PROJECT_PROFILE=<exact project-local durable pointer, when this Project has one>
```

## Why this remains outside the runtime entry

A runtime entry cannot bootstrap its own load. The Project Instructions kernel therefore retains only the minimum out-of-band instruction necessary to enter the control plane reliably.

Do not duplicate BRAIN internals, Worker mechanics, Reviewer rules, Mutation Lock, transport details, or architecture contracts here.
