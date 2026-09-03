# Chat Dev Reasoning Brake — Stage-1 Delegation-Contract Live Pilot

Status: TEMPORARY EVALUATION OVERLAY — ACTIVE / REVERSIBLE
Start date: 2026-09-03
Scope: Worker-backed consequential tasks only. This overlay does not replace `RUNTIME.md`, change Worker transport, or promote a universal pre-Worker gate.

## Goal

Test whether a bounded pre-Worker falsifier catches material delegation/decomposition defects before they propagate through the fixed Chat-high Worker, while measuring review tax and trigger misses.

The pilot separates two failure surfaces:
- Stage-1: O may send the Worker a materially wrong delegation/decomposition contract.
- Existing post-Worker Reasoning Brake: O may be pulled by Worker evidence selection, narrative, or momentum when forming the final consequential commitment.

## Authority

O retains all routing authority.

Stage-1 is a delegation-contract verifier, never a router or Worker. It may return `PASS` or one evidence-backed `CHALLENGE`, but it cannot dispatch, cancel, reroute, or accept a Worker result.

After every blocking Stage-1 result, O must explicitly re-decide the route: `O DIRECT`, `revised WORKER`, or `WORKER as proposed`.

Worker remains the existing manual fresh-Chat **Chat high** Worker. Worker model/mode is held fixed during this pilot and is not a benchmark variable.

## Blocking Stage-1 trigger

Do not review every Worker assignment.

Run one blocking Stage-1 review only when the proposed delegation/decomposition is both:
1. materially consequential if wrong; and
2. genuinely uncertain at dispatch time.

Ordinary reversible routing and straightforward bounded Worker prompts continue without a blocking Stage-1 review.

Use the existing private production reviewer lane and policy (`gpt-5.6-sol / low`). The existing Luna-max shadow may observe the same blocking packet as non-authoritative comparative evidence under `RUNTIME.md`.

## Delegation contract under review

The minimum packet should represent the proposed Worker contract, not the full conversation. Review material defects in at most these areas:
- objective / problem framing;
- hidden conclusion or user-framing adoption;
- scope and out-of-scope;
- durable authority / read order;
- decomposition and dependency ordering;
- evidence and validation requirements;
- stop / boundary-conflict behavior;
- judgment or authority that must remain with O rather than be delegated.

A challenge may conclude that delegation itself is inappropriate, but that is an objection only. O still makes the explicit dispatch/no-dispatch decision.

## Runtime sequence

```text
O / THIN FRAME
  ↓
proposed Worker delegation
  ↓
blocking Stage-1 only if consequential + uncertain
  ↓
O explicitly re-decides route
  ↓
Chat-high Worker
  ↓
O validates returned evidence and reconstructs its own provisional decision
  ↓
existing post-Worker Reasoning Brake if the final commitment is trigger-qualified
  ↓
O final
```

Do not send a Worker-written conclusion as the post-Worker reviewer packet merely for convenience. O should reconstruct the minimum decisive evidence, uncertainty, and provisional commitment first so the final brake does not simply inherit Worker framing.

## Confident-route sampling

The blocking trigger alone cannot estimate confident-but-wrong routing recall.

For a bounded sample of consequential Worker delegations that O rates confident:
1. freeze the pre-Worker delegation packet before Worker execution;
2. do not delay Worker execution for review;
3. later replay only the frozen pre-Worker packet through the non-authoritative benchmark/evaluation lane;
4. do not add later Worker results, final outcomes, or hindsight facts to the replay packet;
5. record whether retrospective review finds a material delegation defect that the blocking trigger missed.

This sample is evaluation evidence only and creates no retroactive dependency on the completed Worker execution.

## Model evaluation

Normal pilot runtime:
- Stage-1 blocking baseline: `gpt-5.6-sol / low`;
- Worker: Chat high, fixed;
- post-Worker production Brake: unchanged `gpt-5.6-sol / low`;
- Luna-max: shadow evidence only under the existing evaluation overlay.

Do not add Sol-medium or Terra-xhigh to every live path. Replay them selectively on disagreements, discovered failures, or other high-information cases to compare role-specific error correction without multiplying normal review tax.

Do not infer independence from model-family labels or aggregate intelligence scores. Prefer actual disagreement, accepted correction, harmful challenge, stability, latency, and later evidence.

## Pilot evidence to record

For blocking Stage-1 cases:
- O confidence / why the trigger fired;
- PASS vs CHALLENGE;
- whether O accepted, narrowed, or rejected the challenge;
- whether the route/contract changed materially;
- whether later evidence supports the intervention;
- false-positive / unnecessary-delay signal;
- elapsed time / unavailability.

For confident sampled cases:
- frozen pre-Worker packet;
- retrospective reviewer result;
- whether the sample exposes a material trigger miss.

For post-Worker review:
- whether the reviewer changes/narrows/rejects O's reconstructed commitment;
- whether the issue traces to Worker framing/evidence selection versus an unrelated defect.

## Interpretation / stop rule

This pilot is hypothesis-generating and does not itself promote a new permanent control layer or reviewer model.

Do not promote universal Stage-1 review merely because challenges occur. Look for marginal decision value relative to O/THIN FRAME and for harmful false challenges/review tax.

If natural evidence shows little unique value or material operational harm, stop the pilot. If it shows repeatable material delegation defects, confident-route trigger misses, or role-specific model differences, use those failures to define the next targeted benchmark or production decision.

Any permanent trigger expansion, reviewer-model promotion, or second production adjudicator requires a fresh O judgment and normal Reasoning Brake.