# Chat Dev Reasoning Brake vNext — Effect-Gated Candidate

Status: CANDIDATE ONLY — NOT PRODUCTION
Scope: independent consequential review after BRAIN goal/alignment reasoning. Current production `RUNTIME.md` remains authoritative until a separate reviewed promotion.

## Goal

Preserve independent protection against correlated Orchestrator blind spots without making falsification the default personality of Chat Dev reasoning.

BRAIN/O should first understand the user's goal, compare means against that goal, and search once for a materially better path. The external reviewer is reserved for hard commitment effects where independent error detection justifies the latency/ceremony.

## Trigger

Do not trigger merely because a response contains judgment, recommendation, prioritization, architecture exploration, research acceptance, or a reversible proposal.

Run one production independent review when the pending commitment meets at least one condition:

A. **Durable/canonical change** — changes or promotes production baseline, canonical architecture, or control semantics.

B. **Authority/safety boundary** — changes actor authority, safety/privacy/security boundaries, or dependency enforcement.

C. **Material external effect** — creates a material external impact or commitment whose consequences extend beyond local reasoning/workspace and cannot be fully neutralized by technical rollback; examples include public/third-party communication, money, production/user impact, or destructive/large-scale state change.

D. **Cost / irreversibility** — is otherwise costly or hard to reverse.

E. **Residual epistemic risk** — after the BRAIN/O goal and alternative pass, material evidence conflict or decision-controlling uncertainty remains.

Caller confidence does not waive A-E.

Do not trigger solely for:

- reversible architecture/research exploration;
- accepting evidence as sufficient to run another bounded experiment;
- ordinary prioritization or sequencing;
- tentative / no-change / do-not-promote-yet recommendations;
- local reversible work;
- ordinary lookup, translation, mechanical transformation, status, or deterministic acceptance;

unless the actual commitment effect independently meets A-E.

Judge by effect, not by labels such as "experiment", "proposal", "reversible", or "temporary". A technically rollbackable action can still meet C when the external consequence cannot be fully undone.

## Relationship to BRAIN

BRAIN is the caller-facing forcing protocol.

Before this external lane is considered, BRAIN has already:

1. run its cheap alignment gate;
2. forced an O Goal Pass only when request/goal alignment was materially mismatched or uncertain;
3. applied relevant routing/dependency/mutation controls;
4. classified whether the pending commitment meets A-E.

`ESCALATE_REVIEW` means the pending commitment meets the external-review gate. BRAIN does not itself perform the independent review.

## Sequence

1. `O` reasons normally and, when needed, performs BRAIN goal/alignment reasoning.
2. `O` forms the minimum provisional hard commitment and decisive evidence.
3. If no A-E condition applies, continue without an external review.
4. If any A-E condition applies, build the minimum reviewer packet and dispatch exactly one qualifying production review.
5. Treat that reviewer as a required dependency of the specific reviewed commitment under existing Reviewer-join semantics.
6. `PASS` -> continue.
7. `CHALLENGE` -> `O` explicitly resolves, verifies, narrows, or rejects the material issue before commitment.
8. If the production reviewer is unsafe/unavailable/timed out, use the existing bounded O-local fallback. For hard-cost/hard-to-reverse effects, unresolved decision-controlling uncertainty remains tentative/blocked.

The production external reviewer remains evidence only. `O` remains the sole decision/acceptance authority.

## Reviewer packet

The existing private reviewer request/result envelope may remain unchanged. The packet is intentionally smaller than the full conversation because goal inference belongs primarily to `O`, which holds the richer context.

The reviewer should test the bounded hard commitment for one decision-changing defect rather than reconstruct the user's entire latent goal from the compressed packet.

## Worker relationship

Stage-1 delegation review remains separate and narrow under `STAGE1-PILOT.md` until separately changed:

- only when Worker delegation/decomposition is materially consequential if wrong **and** genuinely uncertain;
- Reviewer never routes or dispatches;
- `O` explicitly re-decides after a blocking Stage-1 result.

Post-Worker independent review uses this A-E effect gate on `O`'s reconstructed commitment; do not automatically review merely because a Worker was used.

## Evidence basis for this candidate

Natural private cases used during design:

- Issues #27-31: production Sol-low CHALLENGEs were accepted as useful and materially narrowed durable architecture/control/authority decisions.
- Issues #16, #18, #19: production Sol-low returned PASS on soak priority / no-promotion / research-exploration decisions.
- Design #77 rejected allowing `O` to waive review merely because `O` judged evidence adequate.
- Design #78 identified technically reversible but externally non-reversible impact as a missing hard class; condition C was added.
- Design #79 production Sol-low PASSed the resulting effect-based gate.

This is directional architecture evidence, not a statistical review-rate claim.

## Evaluation / rollback

Before promotion, representative traces should show:

- no review on simple/direct or reversible exploration;
- review on durable control/authority changes;
- review on material externally consequential actions even when technically rollbackable;
- review on unresolved evidence conflict;
- no ability to bypass A-E by relabeling a commitment as an experiment;
- no change to Reviewer join or O authority.

If natural use later shows missed hard commitments or excessive review activation, revise the effect taxonomy rather than restoring a generic "review every important judgment" rule by default.
