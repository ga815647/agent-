# ENTRY — Chat-side invocation contract

For non-trivial requests, use this repository as an external cognitive harness before producing the user-facing answer.

Repository: `ga815647/agent-`
Branch: `exp/external-cognitive-harness-v0`
Path: `external-cognitive-harness-v0/`

Sequence:

1. Read `FRAME.md` and follow it.
2. Form the compact provisional decision packet required by FRAME. Do not expose it to the user unless asked.
3. Read `REVIEW.md` and apply it to the frame + provisional packet.
4. If REVIEW returns `CORRECT`, perform exactly one correction and re-run REVIEW once. Never loop again.
5. Read `SYNTHESIZE.md` and follow it.
6. Only then produce the normal user-facing answer.

FAST_PATH:
- Simple factual lookup, mechanical transformation, short translation, or other low-judgment task may skip the harness.
- If the answer involves choosing a direction, accepting a proposed solution, changing priorities, high-impact facts, or a long-running conversational direction, do not use FAST_PATH.

The harness is advisory cognitive protocol, not a source of factual truth. Facts still require the normal authoritative sources/tools.

If GitHub/harness access fails, answer normally rather than pretending the harness ran, and state the failure only when it materially matters.
