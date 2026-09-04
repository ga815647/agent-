# Adopt Chat Dev

Status: SHADOW / HUMAN-FACING / NON-AUTHORITATIVE

This is the **human/new-repo adoption and initialization entry**. It is not the model runtime bootstrap.

Use this guide when bringing a new ChatGPT Project or repository into Chat Dev.

## 1. Choose the durable split

Keep cross-project Chat Dev control semantics in the Chat Dev control-plane repo.
Keep product/technical canonical truth in the project's own repo or other canonical source.
Keep project-local routing, operational/research state, structured databases, and human dashboards in the system best suited to them; Notion is appropriate when those are human-maintained and stateful.

Do not copy global Chat Dev mechanics into project-local documents.

## 2. Install the Project Instructions shim

Use the current approved Project Instructions bootstrap shim. Its job is only to make a fresh Chat load the runtime control entry, establish the default O role, and point to the exact project-local profile when one exists.

Do not place BRAIN internals, Worker mechanics, Reviewer rules, Mutation Lock, or repo implementation details in Project Instructions.

## 3. Create or identify the Project Profile

A Project Profile should contain only genuinely project-local routing/authority/capability overrides and pointers needed to reach project durable truth.

Do not duplicate product facts, current operational checkpoints, research conclusions, or generic Chat Dev control semantics when a canonical pointer is available.

## 4. Repo integration

A project repo may contain its own `AGENTS.md` or equivalent repository-local execution guidance when useful. That file owns repository-local truth only; it must not fork global Chat Dev control semantics.

## 5. Cold-start proof

Before declaring adoption complete, validate:

fresh Project / fresh Chat
→ Project Instructions shim
→ runtime control entry
→ caller route
→ relevant Project Profile when applicable
→ project canonical truth

Also test the BRAIN path and one project-local routing path. Do not infer success from an already-warm Chat.

## 6. Failure behavior

If the runtime control entry cannot be loaded, do not reconstruct current Chat Dev control semantics from memory for consequential/external actions. Surface degraded state and use the currently approved fallback policy.

## Naming rule

Reserve **bootstrap** for runtime entry mechanics:
- Project Instructions bootstrap shim/kernel;
- runtime bootstrap/control entry.

Call this human-facing process **adoption** or **initialization**, not bootstrap.
