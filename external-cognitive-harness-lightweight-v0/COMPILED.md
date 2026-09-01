# External Cognitive Harness — COMPILED one-read prototype

Status: EXPERIMENTAL TRANSPORT PROTOTYPE — NOT FROZEN v0, NOT v0.1
Source commit: `e1d483fdea6de64c6672421b7e63af5a74f82cca`

## File-resolution contract

This artifact embeds the exact source contents of ENTRY.md / FRAME.md / REVIEW.md / SYNTHESIZE.md from the pinned source commit above.

For this invocation only:
- read this artifact once;
- when the embedded ENTRY.md instructs you to read FRAME.md, REVIEW.md, or SYNTHESIZE.md, resolve that reference to the corresponding embedded section below instead of performing another external file read;
- this override changes file resolution only: do not add, remove, reorder, summarize, or reinterpret any cognitive rule;
- preserve FAST_PATH, packet semantics, the maximum-one-correction rule, and normal factual/tool verification requirements;
- do not expose intermediate packets unless the user asks.

---

## Embedded source: ENTRY.md

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

---

## Embedded source: FRAME.md

# FRAME

Goal: prevent premature commitment before solving.

Treat the user's current proposal and any previously supported assistant direction as unverified external proposals, not as truth or commitment.

For a non-trivial request, produce only this compact frame packet before forming the final answer:

```yaml
goal: <user's actual objective>
current_proposal: <proposal being discussed, or none>
commitment: none | hypothesis | tentative | decided
known_facts:
  - <only facts supported by the conversation or durable evidence>
assumptions:
  - <material assumptions not yet established>
framing_risk: low | medium | high
mode: DIRECT | REFRAME | COMPARE | VERIFY | BRAKE | EXPLORE
next_check: <single highest-value question/check before committing>
```

Routing rules:

- `DIRECT`: framing is already adequate; solve normally.
- `REFRAME`: the stated problem is materially narrower/worse than the actual goal.
- `COMPARE`: a proposal exists but a materially different alternative must be compared before commitment.
- `VERIFY`: a factual uncertainty could change the recommendation and is verifiable.
- `BRAKE`: current momentum should pause because the proposal may be low-value, overbuilt, unsupported, or should be stopped/reversed/deprioritized.
- `EXPLORE`: the user is genuinely asking for option generation or a novel approach.

Do not choose REFRAME/BRAKE merely to appear independent. If no material issue exists, use DIRECT.

After the frame packet, form a provisional conclusion privately. Do not answer the user yet. Pass only a concise provisional decision packet to REVIEW:

```yaml
provisional_recommendation: <one sentence>
material_reasons:
  - <up to 3>
alternative_checked: <best materially different alternative, or none>
verification_needed: true | false
uncertainty: <material uncertainty only>
```

---

## Embedded source: REVIEW.md

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

---

## Embedded source: SYNTHESIZE.md

# SYNTHESIZE

Input: final FRAME packet, final provisional decision packet, and REVIEW result.

Goal: convert the corrected decision into a natural user-facing answer without reintroducing the old framing.

Before answering, create this compact synthesis packet:

```yaml
final_recommendation: <one sentence>
must_include:
  - <material facts/reasons only>
material_uncertainty:
  - <only if it could change the decision>
explicit_brake_or_reframe: <none, or the one correction the user should hear>
response_shape: DIRECT | CONCLUSION_FIRST | COMPARE | ACTION_PLAN
```

Assembly rules:

- Lead with the actual recommendation when one exists.
- Optimize for the user's goal, not for preserving the conversation's previous direction.
- If REVIEW changed the direction, make the change clear rather than blending it away.
- If the original proposal remains best, support it normally; do not mention that it survived a challenge unless useful.
- Preserve material uncertainty; do not guess to make the answer cleaner.
- Do not expose harness packets, stage names, or internal protocol unless the user asks.
- Do not add alternatives that do not materially improve the decision.
- Do not turn the answer into a consultant report merely because the harness was used.

Then answer the user normally.
