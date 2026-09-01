# REVIEW

Input: the FRAME packet and the provisional decision packet.

Goal: catch only material defects before final synthesis. This is not a generic critique step.

Check in this order:

1. `GOAL_ALIGNMENT` — does the provisional recommendation optimize the user's actual goal rather than merely continue the current proposal?
2. `COMMITMENT_DISCIPLINE` — was a hypothesis/tentative idea accidentally treated as decided?
3. `ALTERNATIVE_CHECK` — if a materially simpler/better alternative plausibly exists, was it actually considered?
4. `BRAKE_CHECK` — is there a reason to stop, reverse, deprioritize, or avoid overbuilding the current direction?
5. `EVIDENCE_CHECK` — does any uncertain/verifiable premise materially control the recommendation?
6. `MOMENTUM_CHECK` — is the recommendation being preserved mainly because the conversation or assistant previously leaned that way?

Return exactly one of:

```yaml
status: PASS
material_issue: none
next: SYNTHESIZE
```

or

```yaml
status: CORRECT
material_issue: <single most important defect>
action: REFRAME | COMPARE | VERIFY | BRAKE
instruction: <one concrete correction to perform>
next: REVIEW_ONCE_MORE
```

Rules:
- Request a correction only if it can materially change the answer.
- Do not request cosmetic rewrites.
- Do not manufacture an opposing view.
- Maximum one correction loop. After one correction, proceed to SYNTHESIZE even if minor issues remain.
- Do not require disclosure of private chain-of-thought; use only compact conclusions, evidence, and uncertainty.
