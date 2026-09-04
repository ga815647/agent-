# Chat Dev Control Release Contract — Shadow Candidate

Status: SHADOW / NON-AUTHORITATIVE

## Goal

Guarantee that one Chat Dev epoch reads one coherent control snapshot while preserving a centrally updateable bootstrap pointer.

## Stable pointer + immutable release

Project Instructions point to the stable repo bootstrap location only.

`BOOTSTRAP.md` at that stable location contains:

```text
CHAT_DEV_VERSION=<human-readable version>
CONTROL_RELEASE=<exact 40-character commit SHA>
```

After `BOOTSTRAP.md` is loaded, every downstream Chat Dev repo document required by that epoch must be fetched from `CONTROL_RELEASE`.

Examples:

- `BRAIN.md @ CONTROL_RELEASE`
- `W.md @ CONTROL_RELEASE`
- `ARCHITECTURE.md @ CONTROL_RELEASE`
- Mutation Lock / Reasoning Brake module contracts @ `CONTROL_RELEASE`

Do not independently resolve downstream files from mutable `main`.

## Why exact SHA is authoritative

An exact commit SHA gives the strongest simple coherence property available in normal Git usage and does not depend on a tag remaining unmodified.

A human-friendly tag such as `chatdev-v30` may also point to the release commit, but the runtime manifest should treat the exact SHA as authoritative unless immutable-tag enforcement is separately proven.

## Release construction

A production release is built in two stages:

1. Create/merge the complete candidate control snapshot and obtain its immutable commit SHA.
2. Update the stable `BOOTSTRAP.md` pointer to select that SHA.

This avoids self-referential commit construction and makes the bootstrap-pointer update the explicit activation event.

The activation update is a durable production control change and requires the normal BRAIN / hard-commitment review path.

## Epoch consistency

Once an epoch has loaded a valid `BOOTSTRAP.md` and selected `CONTROL_RELEASE`, that epoch keeps using the selected SHA even if the stable bootstrap pointer changes later.

A later fresh epoch loads the then-current stable bootstrap pointer and may select a newer release.

## Rollback

Rollback changes only the stable bootstrap selector to a previously accepted release SHA, or restores the prior Notion-centered Project Instructions path where needed.

Project operational state must not need reverse migration because it remains in project-local durable sources throughout this refactor.

## Stable-pointer protection

The stable bootstrap pointer is high blast-radius. Before production activation, use the strongest practical repo protection available for the selected branch/path and keep reviewable Git history.

Do not claim that ordinary Git hosting makes a mutable branch deterministic or fail-closed.