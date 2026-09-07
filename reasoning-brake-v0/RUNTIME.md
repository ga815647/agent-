# Chat Dev Reasoning Brake — Runtime

Status: ACTIVE DEFAULT — REVERSIBLE
Promotion date: 2026-09-03
Scope: independent hard-commitment review after BRAIN goal/alignment reasoning. Worker routing remains separate.

Goal: preserve independent protection against correlated Orchestrator blind spots without making falsification the default personality of Chat Dev reasoning or making every consequential judgment pay an external-review tax.

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

Judge by effect, not by labels such as `experiment`, `proposal`, `reversible`, or `temporary`. A technically rollbackable action can still meet C when the external consequence cannot be fully undone.

Ordinary Worker routing/decomposition remains separate. One pre-execution production Reviewer is allowed only when the route/decomposition itself is both materially consequential if wrong and genuinely uncertain.

## Relationship to BRAIN

BRAIN is the caller-facing forcing protocol.

Before this external lane is considered, BRAIN has already:

1. run its cheap goal/means alignment gate;
2. forced an O Goal Pass only when the means-to-goal alignment itself was materially mismatched or uncertain;
3. applied relevant routing/dependency/mutation controls;
4. classified whether the pending commitment meets A-E.

Operational uncertainty alone does not imply a Goal Pass. For example, uncertain Worker decomposition with a clear user goal is handled by the narrow Stage-1 routing control rather than by latent-goal reconstruction.

`ESCALATE_REVIEW` means the pending commitment meets this external-review gate. BRAIN does not itself perform the independent review.

## Sequence

1. `O` reasons normally and, when needed, performs BRAIN goal/alignment reasoning using the fuller conversation/project context available to O.
2. `O` forms the minimum provisional hard commitment and decisive evidence.
3. If no A-E condition applies, continue without an external review.
4. If any A-E condition applies, build the minimum reviewer packet below and dispatch exactly one qualifying production review.
5. Treat the production Reviewer selected by the live private reviewer policy as a bounded decision dependency for at most 8 minutes from dispatch.
6. **Reviewer join:** once the qualifying production review is dispatched, it is a required dependency of the specific reviewed commitment until a validated terminal production result, explicit reviewer unavailability, explicit user reroute/cancel, or expiry of the bounded review budget followed by the defined O-local fallback. While that dependency is pending, O may report progress and may answer unrelated requests, but must not communicate, rely on, accept, hand off, or finalize the reviewed commitment. Unrelated replies must not embed or transfer the pending commitment. Any auxiliary non-authoritative review/evaluation lane is non-blocking unless public control semantics explicitly promote it.
7. `PASS`: continue. `CHALLENGE`: O must explicitly resolve, verify, narrow, or reject the material issue before commitment.
8. If the production reviewer is unsafe to use, returns unavailable, or has no terminal result within the O budget, do not retry automatically and do not fall back to a retired lane. Run one O-local minimum falsification check instead: identify the strongest material reason the provisional commitment could be wrong and resolve it once.
9. For high-cost/hard-to-reverse commitments, unresolved decision-controlling uncertainty after that check means verify first or keep the decision tentative/blocked.

The production external falsifier is evidence only. O remains the sole decision/acceptance authority.

## Private reviewer request

Repository:

`ga815647/chatdev-exec` (PRIVATE)

Issue title prefix:

`CODEX-BRAKE|PRIVATE-`

Issue body contract:

```text
execution_id: <letters, digits, dot, underscore, or hyphen>
packet_class: PRIVATE_OPERATIONAL
decision_under_review: <one bounded provisional decision>
decisive_evidence:
- <minimum sufficient established evidence>
known_uncertainty:
- <material unresolved uncertainty, or none>
required_falsification: <identify at most one decision-changing defect/check>
```

Normal packet target is under 2,000 characters; the execution gate rejects bodies over 8,000 characters.

The private plane allows bounded private operational context needed for the review, but minimum disclosure still applies. Never put credentials, reusable tokens, auth files, private keys, session cookies, or other reusable authentication material into Issues/results. Avoid storing sensitive personal material when it is not decision-necessary; use O-local falsification when GitHub storage would be inappropriate.

GitHub Secrets are not packet/result transport.

## Operational-state ownership

Public Chat Dev owns Reviewer semantics. The private `ga815647/chatdev-exec` repository owns the mutable execution substrate and reviewer policy.

For **current** production reviewer model and reasoning effort, fresh-read:

`ga815647/chatdev-exec/reviewer-policy.json`

That file is the live authority because the production workflow consumes it directly. Do not infer the current model/effort from this public document, promotion prose, validation history, old Issues, memory, or a compatibility dashboard.

Likewise, current runner/provider/auth implementation details and the presence or absence of auxiliary shadow/evaluation lanes are operational state derived from the active private implementing artifacts. This public semantic contract intentionally does not duplicate them as current state.

Historical operational values may appear in the evidence section only when tied to a dated promotion/canary/benchmark and must not be treated as current configuration.

Policy mutation is GitHub-side when the selected execution substrate supports the requested policy. Unsupported policy values fail closed; there is no silent model fallback.

Execution constraints remain:
- exactly one production-authoritative falsifier;
- Reviewer lane only;
- isolated bounded execution context;
- no browser/web research unless a future public semantic change explicitly allows it;
- no general repo research;
- no recursive Worker/delegation;
- bounded reviewer concurrency;
- bounded workflow/reviewer timeout.

The private workflow mirrors the minimum machine-facing falsifier contract needed to execute this public runtime. Public `ga815647/agent-` remains the semantic authority.

## Result contract

Validated terminal production result is written to the same private Issue. Current semantic envelope requires at least:

```text
PRIVATE_CODEX_BRAKE_COMPLETE
execution_id: <id>
status: PASS | CHALLENGE
material_issue: <none or one issue>
why_decision_changing: <none or concise reason>
check_needed: <none or one check>
model: <live policy model>
reasoning_effort: <live policy effort>
runner_name: <execution runner identifier>
runner_os: <runner OS>
runner_user: <runner user>
login_mode: <authentication mode>
api_key_used: <yes | no>
desktop_runtime_used: <yes | no>
exit_code: 0
contract_parse: PASS
elapsed_seconds: <integer>
terminal_status: COMPLETE
```

Private workflow implementations may add telemetry fields without changing the public decision semantics, provided the required terminal result remains unambiguous and validated.

Unavailability/failure fails closed at the production external lane. O then applies the local fallback above; it does not silently route to another external reviewer.

## Auxiliary reviewer / evaluation overlays

Auxiliary shadow or benchmark reviewers are operational/evaluation overlays, not production authority unless a future explicit public control change promotes them.

When such an overlay exists:
- it must not become a blocking dependency of the production commitment merely by existing;
- it must not vote or override O;
- it must remain independent of the production reviewer result when the evaluation requires independence;
- its active/inactive state and model policy are read from the private implementing artifacts, not from a copied statement in this public runtime document.

Historical shadow evidence remains valid as historical evidence after the overlay is retired.

## Relationship to Workers

The brake is Reviewer, never Worker.
- It has no Worker authority.
- It does not perform implementation/research.
- It does not recursively dispatch.
- The Reviewer never decides Worker routing.
- Stage-1 delegation review remains separate and narrow under `STAGE1-PILOT.md`: only when Worker delegation/decomposition is materially consequential if wrong **and** genuinely uncertain; Reviewer never routes or dispatches; `O` explicitly re-decides after a blocking Stage-1 result.
- If a post-decision challenge exposes a material execution/evidence gap, O may issue a manual bounded Worker prompt, accept the returned evidence, and rebuild the decision.
- Do not automatically run another production Reviewer after Worker return. Post-Worker independent review uses the A-E effect gate on O's rebuilt commitment; Worker use alone does not trigger review.
- Worker/reviewer return does not automatically rerun the caller route; re-enter only on material routing-state change/reroute need.

## Availability boundary

Validated before the original external-lane promotion:
- VPS subscription Codex canary: PASS;
- known PASS and CHALLENGE reviewer canaries: PASS;
- GitHub-side model/effort mutability: PASS;
- runner service restart/reconnect: PASS;
- post-service-restart canary: PASS;
- ChatGPT connector private read/write: PASS;
- repeated ChatGPT-originated full E2E reviewer path: PASS and CHALLENGE.

Not live-validated at original promotion:
- full VPS host reboot recovery.

This is historical promotion evidence, not a claim about current implementation details. Current availability is determined by the active private execution plane. If the production reviewer is unavailable, apply the O-local fallback; never silently restore a retired lane.

## Validation evidence

Private `ga815647/chatdev-exec`:
- Issue #13: ChatGPT-created E2E PASS → VPS subscription reviewer → private result → ChatGPT readback.
- Issue #14: ChatGPT-created E2E CHALLENGE; correctly identified an untested rollback prerequisite.
- Issue #15: original promotion review CHALLENGE identified untested full-host reboot recovery; O accepted the challenge by narrowing the production claim and retaining safe unavailability fallback.
- Issue #25: historical dual-review canary; Sol-low primary and Luna-max shadow both completed independently on the same packet.
- Issues #27–#31: natural durable control/authority decisions where production CHALLENGEs materially narrowed the commitment.
- Issues #16, #18, #19: reversible exploration/no-change-type decisions that the then-production reviewer passed.
- Issue #77: rejected O-confidence as a reviewer self-waiver.
- Issue #78: identified technically reversible but externally non-reversible impact as a required hard class.
- Issue #79: the then-production reviewer PASSed the resulting A-E effect gate design.
- Issue #82: frozen BRAIN vNext v0 trace run; 17/17 available, 14/17 exact, zero control-invariant failures; later adjudication separated one real ambiguity from two rubric defects.
- Issue #83: independent v0 failure adjudication.
- Issue #85: frozen v1 trace run after minimum correction; 17/17 available, 16/17 exact, zero unnecessary/missed Goal Pass, zero unnecessary/missed external review, zero control-invariant failures.
- Issue #86: the then-production reviewer PASSed adjudication of the sole v1 exact-action mismatch as having no material issue.
- Issue #87: the then-production reviewer PASSed promotion review for the narrow goal-first + A-E production semantic promotion.
- Issue #107: dated post-policy-mutation canary executed with the then-current policy and no shadow result.
- Issue #143: anti-drift promotion review PASSed the rule that mutable reviewer state has one live owning source and narrative docs remain pointer-only.

Historical public evidence remains in `ga815647/agent-` Issues #49, #51–#55, #58, #65–#66, #69. Historical Issue #48 remains evidence against copied subscription auth on ephemeral runners.

## Retired paths

Retired paths are not normal-runtime fallback. Historical examples include:
- public `CODEX-BRAKE-V0|` → Windows self-hosted runner;
- copied `CODEX_AUTH_JSON` on ephemeral runners;
- API-key-backed remote candidates that were not promoted;
- automatic replacement subchat/Worker for a failed brake.

## Rollback

The goal-first/effect-gated semantic change is reversible independently of reviewer infrastructure. If natural use shows missed hard commitments or excessive goal inference, restore the prior broad consequential-decision trigger / prior caller entry while keeping the proven private reviewer lane available.

Rollback the private external lane itself by disabling its production use under the active public control path and using the O-local minimum falsification path. Do **not** silently re-enable a historical reviewer substrate. Re-activating any retired external substrate requires an explicit new change and validation.

Rollback any auxiliary shadow/evaluation overlay independently by disabling/removing its private implementing workflow/policy; this must not change the production Reviewer lane unless a separate explicit production change says so.
