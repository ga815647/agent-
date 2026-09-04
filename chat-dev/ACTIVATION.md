# Chat Dev Repo-Centered Activation Contract

Status: SHADOW CANDIDATE / NON-AUTHORITATIVE

This file defines the smallest safe production cutover sequence after the repo-centered candidate is accepted.

## Principle

Publishing the candidate files to `main` is preparation. A Project changes runtime authority only when its Project Instructions bootstrap is changed to load repo `chat-dev/BOOTSTRAP.md`.

This enables mixed-mode staged migration with an intact v29 rollback path.

## Preconditions

Before the first Project bootstrap changes:

- `chat-dev/` is present at the final production repo path;
- static parity has no known material regression;
- one exact immutable candidate release SHA is selected;
- production `chat-dev/BOOTSTRAP.md` selects that SHA;
- the selected SHA contains every downstream control/module file required by the candidate;
- the exact candidate Project Instructions shim is frozen;
- v29 Notion `Current/BRAIN/W` remain intact;
- rollback instructions are explicit;
- the production activation commitment passes the normal hard A-E review.

A heavy standalone new-Project canary is not required. A lightweight fresh-epoch smoke proof may be performed before or during first low-risk activation when useful.

## Activation sequence

### Step 1 — Publish candidate repo structure

Merge/publish `chat-dev/` to production `main` at its final paths.

Do not change any Project Instructions yet.

Effect: repo candidate is available, but existing Projects still use their prior bootstrap authority.

### Step 2 — Freeze release snapshot

Choose the exact immutable commit SHA containing the accepted runtime snapshot.

Record it as `CONTROL_RELEASE`.

All downstream Chat Dev repo reads for an epoch resolve from that exact SHA.

### Step 3 — Set stable repo selector

Update production `chat-dev/BOOTSTRAP.md` on the stable pointer to select the accepted `CONTROL_RELEASE`.

This prepares the repo entry for activation. Existing Projects that still point to Notion remain on v29.

### Step 4 — Migrate Projects one by one

For each Project:

1. preserve the previous Project Instructions text as the immediate rollback payload;
2. replace only the generic Chat Dev bootstrap block with the approved minimal repo shim;
3. preserve genuinely project-local instructions and the exact `PROJECT_PROFILE` pointer;
4. on the next fresh Chat/O epoch, confirm the Project enters through repo BOOTSTRAP and resolves the selected release;
5. if a material bootstrap/control regression appears, restore the prior v29 Project Instructions for that Project.

Do not rewrite Project Profiles as part of this step unless a separate project-local cleanup is independently warranted.

### Step 5 — Complete mixed-mode rollout

Repeat Project migration only as desired. There is no need for an all-at-once global switch.

While any Project remains on v29, Notion `Current/BRAIN/W` remain live production sources for those Projects and must not be demoted.

### Step 6 — Close rollback window

Only after all intended Projects are repo-bootstrapped and stable enough that ordinary rollback no longer needs live v29 Current:

- preserve a clear v29 rollback/history snapshot if desired;
- demote Notion Current/BRAIN/W to compatibility-pointer roles;
- update Chat Dev Durable to the human dashboard/index role;
- mark legacy repo architecture as compatibility/historical rather than competing current authority.

## Exact rollback

### Per-Project rollback during mixed mode

Restore that Project's previous v29 Project Instructions bootstrap. No project operational state migration is reversed because project state never moved.

### Global repo release rollback

Change the stable repo `BOOTSTRAP.md` selector back to a previously accepted `CONTROL_RELEASE` SHA.

A fresh epoch then enters the prior release. Already-running epochs keep their selected release unless explicitly restarted/re-hydrated.

### Full architecture rollback

If repo-centered bootstrap itself proves unsuitable, restore affected Projects to the v29 Notion bootstrap while keeping repo candidate/history available for diagnosis.

## Things activation must not do

- do not delete Project Profiles;
- do not move operational/research state into the global repo;
- do not make Notion Current and repo BOOTSTRAP co-equal runtime authorities inside one Project;
- do not resolve BRAIN/W/module contracts from mutable `main` after a release has been selected;
- do not retire v29 rollback sources before the rollback window closes;
- do not claim deterministic or fail-closed enforcement.
