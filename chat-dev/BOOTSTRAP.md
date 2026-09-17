# Chat Dev Bootstrap

Role: stable model-facing bootstrap. The Chat Dev runtime control plane is retired;
this file does not route into CALLER, CONTROL_RELEASE, BRAIN, or W.

Authority: this entry is active for a Project only when that Project's active Project Instructions bootstrap points to this stable repo path.

`CHAT_DEV_VERSION=46`
`CONTROL_RELEASE=` retired (none).

## What to do instead

1. Durable profile truth (Notion) overrides chat memory and old prompts.
2. Load the project profile from Notion: https://www.notion.so/Chat-Dev-Current-3ac39f3fa67c810b8a12e3e9b76fd419 ("Chat Dev｜Current", section "Chat Dev Profile（開發入口）"; dev-facing only).
   If the Project Instructions shim supplies `PROJECT_PROFILE=<exact pointer>`, use that pointer.
3. Default actor is `O` unless explicitly assigned another role. `O` retains final
   acceptance for consequential actions. There is no Worker/Reviewer mailbox or
   Runtime Entry machinery anymore; work happens in ordinary single sessions.
4. Do NOT load `chat-dev/CALLER.md`, `RUNTIME-ENTRY.md`, `BRAIN.md`, `W.md`, or any
   `CONTROL_RELEASE` snapshot. Do not reconstruct runtime control semantics from memory.
5. External mutations default to read-only until the user authorizes the exact effect/target.

## Degraded bootstrap

If the Notion profile cannot be loaded, do not invent profile content from memory
for consequential/external actions. Harmless ordinary conversation may continue
only when it does not depend on profile truth.
