# Chat Dev Reasoning Brake v0 — Runtime

Status: ACTIVE DEFAULT — EXPERIMENTAL / REVERSIBLE
Scope: Chat Dev consequential decision / commitment braking only. Execution routing and Worker policy remain separate.
Goal: cheaply interrupt conversation momentum before consequential commitment without turning every answer into staged self-review.

## Trigger

Low-judgment factual lookup, translation, mechanical transformation, simple status, routine execution, and ordinary reversible control-plane choices do not need this brake merely because they involve judgment.

Use the brake when the current turn contains a material recommendation, prioritization, architecture direction, proposal acceptance/rejection, irreversible or costly action, or other consequential commitment where a missed framing/assumption/evidence problem could change the answer.

Ordinary Worker routing/decomposition does not trigger Sol-low merely because it involves judgment. A narrow pre-execution exception exists only when the proposed execution route/decomposition is itself both materially consequential if wrong and genuinely uncertain. In that case one Sol-low review may run before Worker dispatch; Sol still returns to the Orchestrator and has no dispatch authority.

## Sequence

Default decision path:
1. The Orchestrator reasons normally and forms a compact provisional decision. Do not pre-run a full FRAME/REVIEW/SYNTHESIZE ceremony.
2. Build the minimum decision packet below. Do not send the full conversation.
3. If the packet is safe for this repository's public GitHub surface, open exactly one `CODEX-BRAKE-V0|...` issue to trigger `.github/workflows/codex-reasoning-brake-v0.yml`.
4. Treat a dispatched external brake as a bounded decision dependency for at most 8 minutes from dispatch. This is not a Worker/subchat join and creates no Worker authority.
5. `PASS`: continue normally. `CHALLENGE`: the Orchestrator must explicitly resolve, verify, or reject the material issue before commitment.
6. If the external brake is unsafe to dispatch, returns `UNAVAILABLE`, or has no terminal result by the 8-minute Orchestrator budget, fail open only with respect to the external dependency: do not retry automatically and do not spawn a fresh subchat merely to replace the brake. Before commitment, run one local minimum falsification check: identify the strongest material reason the provisional decision could be wrong and resolve it once.
7. For high-cost or hard-to-reverse decisions, if that local check exposes unresolved decision-controlling uncertainty, verify it before commitment or keep the decision tentative / blocked rather than forcing closure.

Narrow pre-execution route-review exception:
1. Before Worker dispatch, the Orchestrator may build one compact routing/decomposition decision packet only when the route is materially consequential if wrong and genuinely uncertain.
2. Run the same single Sol-low falsifier under the same privacy, timeout, and fallback rules.
3. Sol returns to the Orchestrator. The Orchestrator resolves the result and alone decides whether/how to dispatch Worker.
4. This pre-execution review does not automatically satisfy or suppress a later Reasoning Brake on a distinct consequential final commitment; a later Sol-low call occurs only if that rebuilt/final commitment independently remains trigger-qualified.

The external falsifier is evidence only. The Orchestrator remains the sole decision and acceptance authority.

## Decision packet

Only dispatch a packet after the Orchestrator has established `packet_class: PUBLIC_SAFE`.

Never put secrets, credentials, private connector contents, private artifact IDs/URLs, personal sensitive data, or other non-public material into the GitHub issue. If there is material doubt, do not externalize it; use the local minimum falsification fallback instead.

Issue title prefix:

`CODEX-BRAKE-V0|`

Issue body contract:

```text
packet_class: PUBLIC_SAFE
decision_id: <short correlation id>
goal: <established user goal>
provisional_decision: <one concise sentence>
established_facts:
- <up to 4 facts established by conversation or durable evidence, or none>
material_assumptions:
- <up to 3 unverified assumptions, or none>
evidence_pointers:
- <up to 3 public-safe labels/pointers, or none>
known_uncertainty:
- <material unresolved uncertainty, or none>
```

`goal` and `established_facts` are asserted as established for the falsifier invocation; `material_assumptions` are explicitly challengeable. This separation prevents the reviewer from wasting its single challenge on re-proving already-established context.

Keep the packet compact; it should normally stay under 2,000 characters. The workflow rejects issue bodies above 8,000 characters.

## External falsifier contract

Canonical role prompt: `reasoning-brake-v0/FALSIFIER.md`.

Execution profile:
- model: `gpt-5.6-sol`;
- reasoning effort: `low`;
- exactly one falsifier;
- substrate: persistent Windows runner `[self-hosted, windows, chatgpt-host]`;
- authentication: the runner's persistent Codex ChatGPT-subscription session; do not copy `auth.json` into ephemeral GitHub-hosted runners;
- canonical `FALSIFIER.md` is fetched at the triggering commit SHA and passed to the host; the host does not checkout the repository;
- model executes from an isolated temporary directory;
- read-only sandbox, user config ignored, no repository inspection or web research;
- workflow job timeout: 8 minutes once started;
- global workflow concurrency: one active brake;
- if a queued brake starts at age >=6 minutes, return `EXPIRED_IN_QUEUE` without spending a model call;
- regardless of GitHub queue state, the Orchestrator stops waiting at 8 minutes from dispatch and falls back locally.

Canonical result:

```text
CODEX_BRAKE_V0_COMPLETE
status: PASS | CHALLENGE
material_issue: <none or one issue>
why_decision_changing: <none or concise reason>
check_needed: <none or one check>
model: gpt-5.6-sol
reasoning: low
elapsed_seconds: <integer>
```

Workflow failure / capacity results may use:

```text
CODEX_BRAKE_V0_UNAVAILABLE
status: UNAVAILABLE
reason: <INVALID_PACKET | EXPIRED_IN_QUEUE | CODEX_EXIT | INVALID_RESULT>
```

If the self-hosted runner is offline or remains queued, no workflow comment may arrive; the Orchestrator's 8-minute budget terminates the external dependency. `UNAVAILABLE` is terminal for that external attempt. Do not retry automatically and do not bypass capacity by opening another Codex or subchat job; use the local minimum falsification fallback.

## Relationship to Workers

The reasoning brake is a Reviewer lane, not a Worker lane.

- It does not receive Worker authority.
- It does not perform implementation or research.
- It does not recursively dispatch.
- It does not satisfy or alter Subchat join rules.
- A substantial execution task may still be routed by the existing Chat Dev dispatch rules independently of this brake.
- Sol never directly dispatches a Worker; Sol returns to O and O alone decides execution routing.
- If a post-decision Sol challenge exposes a hidden material evidence gap, O may dispatch a bounded Worker, accept the returned evidence, and rebuild the provisional decision.
- Do not automatically run a second Sol after that Worker return. Re-run Sol only if the rebuilt commitment independently remains trigger-qualified.
- Re-enter the Orchestrator's THIN FRAME only when a return materially changes routing-relevant state or otherwise requires rerouting; the mere fact that Worker/Sol returned is not itself a trigger.

## Validation evidence

Live validation on 2026-09-02:
- Issue #49: persistent Windows Codex host smoke PASS using `gpt-5.6-sol` low.
- Issue #51: initial CHALLENGE canary correctly caught a maintenance-goal contradiction; 14 s.
- Issue #52: initial PASS canary produced no manufactured objection; 11 s.
- Issue #53: canonical-contract canary exposed a packet-design flaw by challenging a goal incorrectly labeled as an assumption; packet schema was corrected rather than suppressing the challenge.
- Issue #54: packet-v2 PASS canary PASS; established goal/facts preserved; 11 s.
- Issue #55: packet-v2 CHALLENGE canary CHALLENGE; goal contradiction correctly identified; 23 s.
- Issue #58: architecture-freeze review CHALLENGE exposed a gap where an external failure could leave a trigger-qualified consequential decision with no falsification; v0 was corrected to require one local minimum fallback for every trigger-qualified decision.
- Issue #65: control-loop review CHALLENGE rejected mandatory per-return FRAME and led to a fixed evidence-first main path plus a narrow pre-execution review exception.
- Issue #66: representative-trace promotion review CHALLENGE forced an adversarial unchanged-objective reroute trace; the candidate passed with wording hardened to conditional re-entry on material routing-state change / reroute need.

Rejected production path: copying `CODEX_AUTH_JSON` to ephemeral GitHub-hosted runners. Live issue #48 exposed refresh-token rotation/reuse failure. The persistent host session is the accepted v0 authentication substrate.

This proves substrate execution plus basic PASS/CHALLENGE discrimination and the minimal orchestration interaction needed by the control-plane candidate; it does not prove long-run falsifier recall or false-positive rate. Collect natural real-use cases before tuning model/effort or widening trigger scope.

## Rollback

To roll back, restore `Chat Dev｜Current` to the previous staged Harness pointer:
`ga815647/agent-` branch `exp/ech-runtime-staged3-default` → `external-cognitive-harness-runtime/RUNTIME.md`.

Do not rewrite historical Harness experiment artifacts when activating or rolling back this runtime.
