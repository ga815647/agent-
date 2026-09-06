# Chat Dev Control Release Contract

Role: defines coherent release selection. It applies whenever a Project uses repo-centered Chat Dev bootstrap.

## Goal

Guarantee that one Chat Dev epoch reads one coherent control snapshot while preserving a centrally updateable bootstrap pointer.

## Stable pointer + immutable release

Project Instructions point only to the stable repo `chat-dev/BOOTSTRAP.md` location.

That file contains:

```text
CHAT_DEV_VERSION=<human-readable version>
CONTROL_RELEASE=<exact 40-character commit SHA>
```

After `BOOTSTRAP.md` is loaded, it must load `chat-dev/CALLER.md` from the exact selected `CONTROL_RELEASE` before normal `O` response/task execution. Every other downstream Chat Dev repo document required by that epoch must use the same `CONTROL_RELEASE`.

Do not independently resolve caller/BRAIN/W/control files from mutable `main`.

## Exact SHA is authoritative

An exact commit SHA provides the strongest simple coherence property available in normal Git usage and does not depend on a tag remaining unmodified.

A human-friendly tag such as `chatdev-v31` may point to the same release commit, but runtime release identity remains the exact SHA unless immutable-tag enforcement is separately proven.

## Release construction

Build a production release in two stages:

1. Create/merge the complete candidate control snapshot, including the release-pinned caller interface and all changed downstream contracts, and obtain its immutable commit SHA.
2. Update the stable `chat-dev/BOOTSTRAP.md` pointer to select that SHA and human-readable version.

This avoids self-referential commit construction and makes the bootstrap-selector update the explicit release-selector event.

Changing a selector used by active Projects is a durable production control change and requires the normal BRAIN / hard-commitment review path.

## Epoch consistency

Once an epoch has loaded a valid `BOOTSTRAP.md`, selected `CONTROL_RELEASE`, and loaded `CALLER.md` from that release, that epoch keeps using the selected SHA even if the stable bootstrap pointer changes later.

A later fresh epoch loads the then-current stable bootstrap pointer and may select a newer release.

## Rollback

Rollback changes only the stable bootstrap selector to a previously accepted release SHA, or restores the prior Notion-centered Project Instructions path where needed.

Project operational state must not need reverse migration because it stays in project-local durable sources.

## Stable-pointer protection

The stable bootstrap pointer has high blast radius. Use the strongest practical repo protection available for the selected branch/path and preserve reviewable Git history.

Do not claim that ordinary mutable Git branches provide deterministic or fail-closed enforcement.
