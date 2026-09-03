# Chat Dev Reasoning Brake v0 — Runtime

Status: ACTIVE DEFAULT — REVERSIBLE
Promotion date: 2026-09-03
Scope: consequential decision / commitment braking only. Worker routing remains separate.

Goal: interrupt conversation momentum before consequential commitment without making every answer pay a review tax.

## Trigger

Do not trigger merely for lookup, translation, mechanical transformation, simple status, deterministic acceptance, or ordinary reversible routing.

Trigger when O is about to make a material recommendation, prioritization, architecture direction, proposal acceptance/rejection, irreversible/costly action, or another consequential commitment where a missed framing, assumption, alternative, or evidence defect could materially change the decision.

Ordinary Worker routing/decomposition is separate. One pre-execution Sol review is allowed only when the route/decomposition itself is both materially consequential if wrong and genuinely uncertain.

## Sequence

1. O reasons normally and forms a compact provisional decision.
2. Build the minimum reviewer packet below. Never send the full conversation when a smaller packet is sufficient.
3. If the packet is appropriate for private GitHub storage, open exactly one qualifying Issue in private `ga815647/chatdev-exec`.
4. Treat the production Sol-low reviewer as a bounded decision dependency for at most 8 minutes from dispatch.
5. **Reviewer join:** once the qualifying production review is dispatched, it is a required dependency of the specific reviewed commitment until a validated terminal production result, explicit reviewer unavailability, explicit user reroute/cancel, or expiry of the bounded review budget followed by the defined O-local fallback. While that dependency is pending, O may report progress and may answer unrelated requests, but must not communicate, rely on, accept, hand off, or finalize the reviewed commitment. Unrelated replies must not embed or transfer the pending commitment. The temporary shadow review is never a blocking dependency.
6. `PASS`: continue. `CHALLENGE`: O must explicitly resolve, verify, narrow, or reject the material issue before commitment.
7. If the production reviewer is unsafe to use, returns unavailable, or has no terminal result within the O budget, do not retry automatically and do not fall back to the retired Windows lane. Run one O-local minimum falsification check instead: identify the strongest material reason the provisional decision could be wrong and resolve it once.
8. For high-cost/hard-to-reverse commitments, unresolved decision-controlling uncertainty after that check means verify first or keep the decision tentative/blocked.

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

## External execution profile

Execution substrate:
- private repo-scoped self-hosted runner `chatdev-sol-vps`;
- runner user `chatdev-sol`;
- persistent Codex identity authenticated with ChatGPT subscription on the VPS;
- no copied `auth.json`;
- no production `OPENAI_API_KEY` dependency;
- no desktop/Windows runtime dependency.

Reviewer model and reasoning effort come from private `ga815647/chatdev-exec/reviewer-policy.json`.

Current production policy at promotion:

```json
{
  "model": "gpt-5.6-sol",
  "reasoning_effort": "low"
}
```

Policy mutation is GitHub-side. Changing supported model/effort does not require desktop access, SSH, systemd edits, or Codex re-login. Unsupported policy values fail closed; there is no silent model fallback.

Execution constraints:
- exactly one production-authoritative falsifier;
- Reviewer lane only;
- temporary isolated working directory;
- read-only Codex sandbox;
- no browser/web research;
- no general repo research;
- no recursive Worker/delegation;
- global reviewer concurrency bounded by the private workflow;
- workflow/reviewer timeout bounded at 8 minutes.

The private workflow mirrors the minimum machine-facing falsifier contract needed to execute this public runtime. Public `ga815647/agent-` remains the semantic authority.

## Result contract

Validated terminal production result is written to the same private Issue. Current envelope:

```text
PRIVATE_CODEX_BRAKE_COMPLETE
execution_id: <id>
status: PASS | CHALLENGE
material_issue: <none or one issue>
why_decision_changing: <none or concise reason>
check_needed: <none or one check>
model: <policy model>
reasoning_effort: <policy effort>
runner_name: chatdev-sol-vps
runner_os: Linux
runner_user: chatdev-sol
login_mode: ChatGPT
api_key_used: no
desktop_runtime_used: no
exit_code: 0
contract_parse: PASS
elapsed_seconds: <integer>
terminal_status: COMPLETE
```

Unavailability/failure fails closed at the production external lane. O then applies the local fallback above; it does not silently route to another external reviewer.

## Temporary Luna-max shadow evaluation

A bounded, non-authoritative shadow overlay is active for evidence collection. It does **not** change the production Decision Brake policy or authority.

For each qualifying private Reasoning Brake Issue:
- the unchanged production lane runs `gpt-5.6-sol / low` and remains the only external decision dependency;
- an independent shadow workflow receives the same packet and same `FALSIFIER.md` contract with fixed `gpt-5.6-luna / max`;
- primary and shadow do not see each other's result;
- shadow failure or delay must not make the production lane unavailable or alter its fallback semantics;
- shadow results are marked `PRIVATE_CODEX_BRAKE_SHADOW_COMPLETE` / `review_role: SHADOW` and are comparative evidence only, never voting authority.

During the shadow window O records at least:
- unique useful challenge: shadow finds a material issue not supplied by the production review and O accepts it as decision-relevant;
- duplicate challenge;
- harmful / spurious challenge rejected by O;
- whether the incremental challenge actually changes, narrows, verifies, or blocks the decision;
- primary and shadow elapsed time / unavailability;
- reviewer-call count and observable subscription-pool / rate-limit pressure.

The first 10 natural trigger-qualified cases are an **initial checkpoint, not a statistically sufficient permanent-role sample**. Do not promote Luna-max, permanent dual review, or any new model policy from case count alone. After the checkpoint, stop the shadow if it shows no useful incremental signal or material operational harm; otherwise continue only until evidence is sufficient to justify a targeted benchmark or narrower selective-escalation hypothesis. Any permanent architecture/model change requires a fresh Orchestrator judgment.

Validated live canary: private Issue #25 returned an independent Sol-low primary result and Luna-max shadow result from the same packet without policy mutation or desktop runtime.

## Relationship to Workers

The brake is Reviewer, never Worker.
- It has no Worker authority.
- It does not perform implementation/research.
- It does not recursively dispatch.
- Sol never decides Worker routing.
- If a post-decision challenge exposes a material execution/evidence gap, O may issue a manual bounded Worker prompt, accept the returned evidence, and rebuild the decision.
- Do not automatically run another production Sol after Worker return. Re-run only if the rebuilt commitment independently remains trigger-qualified.
- Worker/reviewer return does not automatically rerun THIN FRAME; re-enter only on material routing-state change/reroute need.

## Availability boundary

Validated before promotion:
- VPS subscription Codex canary: PASS;
- known PASS and CHALLENGE reviewer canaries: PASS;
- GitHub-side model/effort mutability: PASS;
- runner service restart/reconnect: PASS;
- post-service-restart canary: PASS;
- ChatGPT connector private read/write: PASS;
- repeated ChatGPT-originated full E2E reviewer path: PASS and CHALLENGE.

Not live-validated at promotion:
- full VPS host reboot recovery.

This is explicitly an availability uncertainty. If a host reboot leaves the reviewer unavailable, apply the O-local fallback; never silently restore the retired Windows lane.

## Validation evidence

Private `ga815647/chatdev-exec`:
- Issue #13: ChatGPT-created E2E PASS → VPS subscription reviewer → private result → ChatGPT readback.
- Issue #14: ChatGPT-created E2E CHALLENGE; correctly identified an untested rollback prerequisite.
- Issue #15: promotion review CHALLENGE identified untested full-host reboot recovery; O accepted the challenge by narrowing the production claim and retaining safe unavailability fallback.
- Issue #25: live dual-review canary; Sol-low primary and Luna-max shadow both completed independently on the same packet.

Historical public evidence remains in `ga815647/agent-` Issues #49, #51–#55, #58, #65–#66, #69. Historical Issue #48 remains evidence against copied subscription auth on ephemeral runners.

## Retired paths

The following are not normal-runtime fallback:
- public `CODEX-BRAKE-V0|` → Windows self-hosted runner;
- copied `CODEX_AUTH_JSON` on ephemeral runners;
- API-key-backed remote Sol candidate;
- automatic replacement subchat/Worker for a failed brake.

## Rollback

Rollback the private external lane by disabling its use in Current/RUNTIME and using the O-local minimum falsification path. Do **not** silently re-enable the historical Windows reviewer. Re-activating any retired external substrate requires an explicit new change and validation.

Rollback the temporary shadow overlay independently by disabling/removing the private shadow workflow and shadow policy files; this must not change the production Sol-low lane.
