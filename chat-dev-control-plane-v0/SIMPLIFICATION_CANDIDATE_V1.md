# Chat Dev Simplification Candidate v1

Status: PROMOTED WITH BACKEND SUBSTITUTION / HISTORICAL CANDIDATE
Date staged: 2026-09-02
Promotion date: 2026-09-03

This file records the candidate that drove the production simplification. The active truth is now `chat-dev-control-plane-v0/ARCHITECTURE.md`, `reasoning-brake-v0/RUNTIME.md`, and `Chat Dev｜Current`.

## Promoted parts

The following candidate semantics were promoted:

- `new task / new Orchestrator epoch → THIN FRAME before execution routing`;
- no stateful Harness latch and no mandatory per-return FRAME ceremony;
- Worker transport is manual human-mediated handoff by default;
- O emits a ready-to-paste bounded Worker prompt and the user pastes the complete Worker result back;
- Worker result remains evidence only; O alone accepts it;
- normal runtime no longer depends on local Windows/Chrome/Playwright/persistent-host Worker automation;
- one automatic Reviewer lane remains for trigger-qualified consequential commitments;
- model/effort are policy-controlled so ordinary changes do not require desktop/VPS edits.

## Backend substitution

The staged candidate proposed:

`GitHub-hosted Ubuntu → OpenAI Responses API → Sol-low`

That path was not promoted. The API PoC reached `BLOCKED_AUTH` because `OPENAI_API_KEY` was absent, and the user preferred the ChatGPT subscription pool rather than separate API billing.

The proven production backend is instead:

```text
ChatGPT Orchestrator
  ↓
private ga815647/chatdev-exec Issue
  ↓
repo-scoped VPS self-hosted runner
  ↓
persistent chatdev-sol ChatGPT subscription identity
  ↓
model / effort from reviewer-policy.json
  ↓
private result comment
  ↓
Orchestrator
```

No `OPENAI_API_KEY`, copied `auth.json`, desktop runtime, or public-repo persistent runner is required.

## Promotion evidence

Private `ga815647/chatdev-exec` validation included:

- subscription-backed Sol-low local VPS canary PASS;
- known PASS / CHALLENGE workflow canaries;
- GitHub-side model/effort mutability;
- runner service restart/reconnect and post-restart canary;
- ChatGPT connector private read/write;
- ChatGPT-originated E2E Issue #13 PASS;
- ChatGPT-originated E2E Issue #14 materially correct CHALLENGE;
- promotion review Issue #15 CHALLENGE on untested full-host reboot recovery.

Issue #15 was accepted by narrowing the production claim: full VPS host reboot recovery remains unverified, and reviewer unavailability uses the O-local minimum falsification fallback. It does not reactivate the retired Windows lane.

## Historical non-production paths

Remain evidence only:
- automated Worker browser/persistent-host transport;
- public Windows Reasoning Brake workflow;
- copied subscription auth on ephemeral runners;
- API-key-backed remote Sol candidate.
