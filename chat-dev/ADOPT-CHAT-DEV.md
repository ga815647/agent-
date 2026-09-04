# Adopt Chat Dev

Status: SHADOW CANDIDATE / HUMAN-FACING / NON-AUTHORITATIVE

This is the **human/new-repo adoption and initialization entry**. It is not the model runtime bootstrap.

Use it when bringing a new ChatGPT Project or repository into Chat Dev.

## 1. Understand the split

Global Chat Dev control semantics live in the Chat Dev control-plane repo.

Project-local routing/authority overrides, operational/research state and structured human-maintained state stay in the project-local durable source best suited to them.

Product/technical truth stays in the project's own canonical repo/source.

Do not copy global Chat Dev mechanics into project-local documents.

## 2. Install the minimal Project Instructions shim

Start from `PROJECT-INSTRUCTIONS-SHIM.md`.

Set:

- `CHAT_DEV_BOOTSTRAP` to the approved stable public repo `chat-dev/BOOTSTRAP.md` pointer;
- `PROJECT_PROFILE` to the exact project-local durable pointer when the Project has one.

Do not paste BRAIN internals, Worker mechanics, Reviewer rules, Mutation Lock, transport history or implementation detail into Project Instructions.

## 3. Confirm repo access

A fresh Chat must be able to read the configured `CHAT_DEV_BOOTSTRAP` path through an actually available repository-reading capability.

Do not assume generic web/raw GitHub access is universally available merely because the repository is public.

If repo access is unavailable in the intended environment, adoption is incomplete until an approved bootstrap transport/fallback exists.

## 4. Create or normalize the Project Profile

A Project Profile should hold only genuinely project-local routing/authority/capability overrides and pointers needed to reach project durable truth.

Avoid duplicate product facts, operational checkpoints, research conclusions or generic Chat Dev semantics when canonical pointers exist.

## 5. Repo-local execution guidance

A project repo may contain `AGENTS.md` or an equivalent file for repository-local execution guidance.

That file owns repository-local truth only. It must not fork global Chat Dev control semantics.

## 6. Release behavior

The stable runtime `BOOTSTRAP.md` selects one exact immutable `CONTROL_RELEASE` commit SHA.

A fresh epoch uses that selected SHA for downstream Chat Dev public control documents. See `RELEASE-CONTRACT.md`.

Humans may use version tags for readability, but runtime release identity remains the exact accepted commit SHA unless stronger immutable-tag enforcement is separately proven.

## 7. Lightweight adoption check

Before calling a new adoption complete, perform enough fresh-epoch checking to prove the actual configured chain can start:

Project Instructions shim → repo `BOOTSTRAP.md` → caller route → relevant Project Profile/project truth when applicable.

Also exercise a BRAIN path when practical.

This is a lightweight adoption smoke check, not a requirement to run a heavy standalone canary program during ordinary refactor work.

## 8. Failure behavior

If the runtime entry cannot be loaded, do not reconstruct current Chat Dev control semantics from memory for consequential/external actions.

Surface degraded state and use only an explicitly approved fallback/reroute.

## Naming rule

Reserve **bootstrap** for runtime entry mechanics:

- Project Instructions bootstrap shim/kernel;
- runtime bootstrap/control entry.

Call this human-facing process **adoption** or **initialization**, not bootstrap.