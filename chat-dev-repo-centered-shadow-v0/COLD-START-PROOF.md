# Repo-Centered Cold-Start Proof — Shadow v0

Status: SHADOW / NON-AUTHORITATIVE

Promotion requires evidence that repo-centered bootstrap is at least as reliable as the current v29 Notion-centered path for fresh Chat execution.

## Required chains

### A. Direct path
fresh Project / fresh Chat
→ Project Instructions bootstrap shim
→ repo runtime control entry
→ `ROUTE=DIRECT`
→ correct simple task execution

### B. BRAIN path
fresh Chat
→ shim
→ runtime control entry
→ `ROUTE=BRAIN`
→ load `BRAIN.md`
→ correct downstream result

### C. Worker-selection path
fresh Chat
→ shim
→ runtime entry
→ BRAIN
→ W selected only when warranted
→ load `W.md`
→ correct bounded handoff semantics

### D. Mutation path
fresh Chat
→ shim
→ runtime entry
→ BRAIN
→ exact mutation target/effect binding before write

### E. Project-local route
fresh project-specific Chat
→ shim
→ runtime entry
→ current caller route
→ exact Project Profile
→ task-relevant project durable truth

## Failure injections

Test at least:
- repo connector/read unavailable;
- runtime entry available but downstream BRAIN/W read fails;
- project-local profile unavailable;
- stale chat memory conflicts with bootstrap truth;
- short confirmation (`go`, `做`, `可以`) inherits a BRAIN-boundary action;
- runtime entry changes upstream while one Chat is already active.

## Acceptance criteria

Promotion requires:
- no material authority/routing/dependency regression versus v29 baseline;
- no need to preload BRAIN/W during direct work;
- exact separation of global control truth from project-local operational state;
- understandable degraded-mode behavior when repo bootstrap cannot be loaded;
- one coherent release snapshot per cold start rather than mixed mutable-main reads;
- rollback can restore the prior v29 Notion bootstrap without reconstructing moved operational state.

## Release pinning

Do not promote a design that resolves `BOOTSTRAP@main` and then independently reads downstream control files from a later `main` state. Promotion must select one coherent immutable release snapshot (for example an exact commit or immutable release/tag) before downstream reads.

## Rollback

Until promotion, production remains unchanged.

After any future canary promotion, rollback means repoint the affected Project Instructions shim to the approved v29 Notion Current path (or other explicitly approved prior production bootstrap) and leave project operational state in place. No reverse migration of project state should be required.
