# Chat Dev Runtime Control Entry

Role: stable model-facing runtime entry and immutable release selector.

Authority: this entry is active for a Project only when that Project's active Project Instructions bootstrap points to this stable repo path.

`CHAT_DEV_VERSION=38`
`CONTROL_RELEASE=242d5c1e71e4827bb5801edf44e195c4662167ec`

This is the **model runtime control entry / manifest**. It is not the Project Instructions kernel and not the human adoption guide.

The selected `CONTROL_RELEASE` is the immutable control snapshot for the current Chat Dev epoch.

## Fresh-epoch entry

After the Project Instructions bootstrap shim loads this file:

1. durable bootstrap truth overrides chat memory and old prompts;
2. default actor is `O` unless explicitly assigned another role;
3. before normal assistant-visible response or task execution, load `chat-dev/CALLER.md` from the exact selected `CONTROL_RELEASE` and obey its caller-entry contract;
4. `O` alone owns Worker/Reviewer evidence acceptance, formal state transitions, commitments and final synthesis;
5. BRAIN and W are lazy capabilities; load them only when selected by the caller/BRAIN path and always from the same `CONTROL_RELEASE`;
6. external mutations default to read-only until exact authorized effect/target binding is satisfied;
7. required Worker/production Reviewer dependencies block only their dependent acceptance/final/handoff.

Do not independently reconstruct caller-entry semantics from this manifest. `chat-dev/CALLER.md` is the release-pinned caller cognition / route interface.

## Release-consistent pointers

All required Chat Dev public repo reads for the current epoch use the exact selected `CONTROL_RELEASE`:

- `chat-dev/CALLER.md` — required fresh-epoch caller interface;
- `chat-dev/RUNTIME-ENTRY.md` — required turn receipt / consequential-effect interface when called by CALLER;
- `chat-dev/ARCHITECTURE.md`;
- `chat-dev/BRAIN.md` when selected;
- `chat-dev/W.md` when selected;
- `chat-dev-control-plane-v0/MUTATION-LOCK.md` when required;
- `reasoning-brake-v0/RUNTIME.md` when required;
- `reasoning-brake-v0/STAGE1-PILOT.md` only when its narrow condition is actually met.

Do not independently re-resolve those files from mutable `main` during the same epoch.

## Project-local route

Load the relevant Project Profile/project-local durable source only when the task requires it. Project-local state is not copied into this global runtime entry.

If a Project Instructions shim supplies `PROJECT_PROFILE=<exact pointer>`, use that pointer as the project-local entry unless current durable truth explicitly supersedes it.

## Degraded bootstrap

If this runtime entry cannot be loaded, or `chat-dev/CALLER.md` / another required control document cannot be loaded from the exact selected `CONTROL_RELEASE`, do not reconstruct current Chat Dev control semantics from memory for consequential/external actions.

Harmless ordinary conversation may continue only when it does not depend on current Chat Dev control truth. Do not commit control-plane changes, external mutations, dependency releases, or other consequential actions until the approved path is available or the user explicitly reroutes under an approved fallback.

This is a behavioral rule, not deterministic or fail-closed enforcement.

## Activation boundary

Repository presence alone does not activate this entry for a Project. Activation occurs when that Project's Project Instructions bootstrap loads this stable path.

Changing this stable release selector, changing a Project bootstrap kernel, or otherwise promoting canonical/control semantics is a hard-effect transition and uses the normal BRAIN / independent-review path.
