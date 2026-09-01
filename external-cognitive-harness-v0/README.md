# External Cognitive Harness v0

Purpose: test whether a zero-token, external, deterministic cognitive protocol improves ordinary Chat responses by delaying commitment and forcing explicit frame/review/synthesis checkpoints.

This is an experiment, not production architecture.

## Runtime model

- Chat is the only reasoning model.
- The harness does not call any LLM or API.
- GitHub stores the protocol only.
- Do not store private conversation transcripts, user data, or per-chat state in this public repository.

## Protocol

For non-trivial requests, run:

1. `FRAME.md`
2. form a concise provisional decision packet
3. `REVIEW.md`
4. if REVIEW requests one correction, perform it once
5. `SYNTHESIZE.md`
6. answer the user naturally

Simple factual or mechanical requests may take FAST_PATH and skip the protocol.

Hard limits:
- never manufacture disagreement
- user proposal != user goal
- prior assistant support != evidence
- maximum one correction loop
- do not expose private chain-of-thought; only compact decision artifacts

## What this v0 can test

Whether an externalized staged protocol changes response quality relative to direct Chat.

It does **not** yet prove that GitHub can act as a dynamic controller. These files are static protocol authority; a later runtime can implement the same state machine if the cognitive effect is worth keeping.

## Success signals

The harness should materially improve at least some real cases by catching one or more of:
- wrong or narrow framing
- premature commitment to a newly proposed solution
- a materially simpler/better alternative
- a direction that should be stopped, reversed, or deprioritized
- an unsupported factual assumption that needs verification

Without increasing:
- pointless contrarianism
- ritualistic verbosity
- latency/friction beyond the value gained
