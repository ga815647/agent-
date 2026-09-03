# Chat Dev BRAIN — Goal-Aligned Control Handler

Status: ACTIVE DEFAULT — REVERSIBLE
Promotion date: 2026-09-03
Scope: goal-aligned cognitive/control handler entered from the binary caller route. Historical filename retained for durable-pointer compatibility.

## Goal

BRAIN interrupts control-boundary momentum and makes the caller reason from the user's likely goal rather than merely execute the latest proposed means.

BRAIN is not the caller sentinel and is not a second Orchestrator. The caller surface is intentionally smaller: `O` chooses only `ROUTE=DIRECT` or `ROUTE=BRAIN`; once entered, BRAIN uses the caller's existing context and applies only the operational controls needed for the pending boundary.

It is not a deterministic runtime tool, model call, service, MCP, state machine, sandbox, output gate, or hard latch.

## Authority

- `O` remains the sole authority for routing, Worker-result acceptance, formal state transitions, commitments, and final synthesis.
- `W` remains bounded by the scope and authority supplied by `O`.
- BRAIN never grants authority, executes bounded work, creates actors, accepts evidence, or owns a final decision.
- `USE_W` is valid only when caller = `O`.
- When caller = `W`, any need for wider scope, new authority, or additional Worker execution resolves to `RETURN_TO_O`.

## Caller entry / invocation boundary

After fresh-epoch bootstrap has loaded `Chat Dev｜Current`, every `O` turn uses only the binary caller route:

- `ROUTE=DIRECT`
- `ROUTE=BRAIN`

Choose `ROUTE=BRAIN` before task execution when the turn approaches any of:

- bounded execution that may qualify for Worker offload under BRAIN's current Worker-eligibility / dispatch-worthiness test;
- delegation / Worker handoff;
- external mutation;
- release of a commitment or transition that has a required pending Worker / production Reviewer dependency;
- consequential commitment.

Ordinary direct reasoning that does not approach one of these boundaries stays `ROUTE=DIRECT` and pays no BRAIN tax.

There is no caller-facing `WAIT` or `W_CANDIDATE` route. Dependency blocking and Worker selection remain BRAIN/downstream semantics. Collapsing the visible route must not weaken either control.

A short confirmation inherits the immediately preceding proposed action for boundary detection. If the inherited action crosses a BRAIN boundary, enter BRAIN; otherwise remain direct.

The caller does not pre-classify downstream control families before entering BRAIN and does not need a magic phrase such as `BRAIN AUTO`.

Fresh-epoch bootstrap is not owned by BRAIN: Project Instructions must fetch `Chat Dev｜Current` before normal assistant-visible response or task execution so the caller can learn the current route semantics without circular dependence.

## Input

BRAIN uses:

- caller role (`O` or `W`);
- pending action / transition / commitment;
- caller scope and authority;
- relevant known dependency state;
- the conversational/project context already available to the caller.

For `O`, full conversation context is the primary source for goal inference. BRAIN does not replace that context with a smaller reviewer packet.

## 1. Cheap goal/means alignment gate

First ask:

> Is the pending means/action obviously consistent with the user's stated or already-established goal and the current project state?

If yes, do **not** reconstruct latent intent. Continue to the operational control pass.

Run the Goal Pass only when the **means-to-goal alignment itself** is materially mismatched or materially uncertain.

Operational uncertainty alone — for example uncertainty about Worker decomposition, action selection, dependency state, or implementation details while the user's desired outcome is clear — does **not** trigger the Goal Pass. Handle that uncertainty in the relevant operational control instead.

Guardrails:

- Explicit current instructions are strong evidence and can make goal/means alignment clear even when they differ from an earlier preference.
- Do not invent hidden motives.
- Do not silently replace an explicit requested method merely because another method appears preferable.
- A goal hypothesis may justify `REVISE`, comparison, or surfacing a materially better path; it is not new authority.

## 2. Goal Pass — only on goal/means mismatch or uncertainty

Make the caller, especially `O`, use its available context to:

1. infer the outcome the user is most likely trying to achieve;
2. distinguish that outcome from the latest proposed means;
3. use conversation history, timing, wording, established preferences, constraints, and current project state as evidence;
4. compare the pending means against that goal;
5. run one brief escape pass for a materially better framing or path;
6. stop when no materially better path appears.

For consequential reasoning, the escape pass is the default spare cycle: one bounded attempt to leave the first framing, not repeated self-reflection.

## 3. Operational control pass

After alignment / Goal Pass, apply only the controls required by the pending boundary.

### Worker routing

**Purpose:** `O` owns trajectory; `W` absorbs bounded execution. Worker use exists to protect O's orchestration state / execution context, not to create an independent decision-maker.

#### Gate A — Worker-eligible

A segment is Worker-eligible only when all are true:

- objective / expected return can be defined before dispatch;
- scope, authority, and out-of-scope boundary can be defined before dispatch;
- stop condition / useful checkpoint can be defined before dispatch;
- `W` can reach that checkpoint without `O` steering project trajectory mid-execution.

Trajectory decisions, final acceptance, Reviewer-challenge resolution, formal commitment, and canonical promotion stay with `O`.

#### Gate B — Dispatch-worthy for the current MANUAL Worker lane

Eligibility alone does not justify manual dispatch. Current manual transport has a real fixed tax: one human dispatch + one human return/join. Use `W` only when that tax is clearly repaid.

For the current manual lane, prefer `USE_W` only when:

- the eligible segment can complete with one dispatch and one return, without mid-course human relay; and
- either it is expected to contain at least **two adaptive execution loops** before the checkpoint, or it is a genuinely broad bounded audit / research / build / migration segment that would otherwise accumulate substantial intermediate repo/source/artifact state inside `O`.

An **adaptive execution loop** is a bounded cycle in which newly acquired evidence can change the next execution action before verification/checkpoint.

Keep the work in `O` when it is a short, tightly coupled single loop that `O` can finish in one compact direct pass. Do **not** infer `USE_W` merely because a task has several mechanical phases or a brief `test → fix → retest` sequence.

Representative routing:

- one-file edit → test → obvious fix/retest: `O`;
- narrow 1–2 source lookup/synthesis: `O`;
- broad repo audit producing an evidence packet: `W` candidate;
- accepted-state reconstruction → staging/build → validation/package: `W` candidate;
- final acceptance / hard-review resolution / canonical promotion: `O`.

If Worker transport later becomes low-friction or automatic, revise Gate B threshold without changing Gate A or O/W authority semantics.

Stage-1 remains narrow: only when the proposed Worker delegation/decomposition is both materially consequential if wrong and genuinely uncertain at dispatch time.

### Dependency

A required Reviewer or Worker dependency blocks only the dependent acceptance / final / handoff until terminal, rerouted, cancelled, or otherwise cleared under canonical semantics. BRAIN may return `WAIT`; no caller-facing `ROUTE=WAIT` is required.

### External mutation

Apply Mutation Lock. Bind mutation effect, target resource type, and target identity/destination before action selection. Do not add a model call merely to approve ordinary mutations.

### Independent review

External Reasoning Brake is not BRAIN's default personality. It is the independent hard-boundary module.

Mandatory independent review applies when the pending commitment has at least one HARD COMMITMENT effect:

A. changes or promotes durable production, canonical architecture, or control semantics;
B. changes actor authority, safety/privacy/security boundaries, or dependency enforcement;
C. creates material external impact or commitment whose consequences extend beyond local reasoning/workspace and are not fully neutralized by technical rollback, including public/third-party communication, money, production/user impact, or destructive/large-scale state change;
D. is otherwise costly or hard to reverse;
E. retains unresolved evidence conflict or decision-controlling uncertainty after the caller's goal/alternative pass.

Reversible exploration, research acceptance, ordinary prioritization, tentative/no-change recommendations, and local reversible work do not require external review unless they independently meet A-E.

Caller confidence never waives A-E.

## 4. Results

BRAIN returns the minimum action-oriented guidance needed, such as:

- `CONTINUE`
- `REVISE`
- `VERIFY`
- `WAIT`
- `USE_W` — caller `O` only
- `RETURN_TO_O` — caller `W`
- `ESCALATE_REVIEW`

If no BRAIN invocation boundary actually exists, remain `O DIRECT`; do not manufacture a `CONTINUE` ceremony merely to pass through BRAIN.

These are protocol outcomes, not new authorities or runtime-enforced states.

## Runtime shape

```text
fresh O epoch
    ↓
Project Instructions bootstrap: fetch Current before normal response/task execution
    ↓
every O turn
    ↓
ROUTE=DIRECT or ROUTE=BRAIN
    ├─ DIRECT → ordinary O work
    └─ BRAIN
         ↓
       cheap goal/means alignment gate
         ├─ clear → operational controls
         └─ goal/means mismatch or uncertainty
                ↓
             Goal Pass by caller
                ↓
             operational controls
                ├─ CONTINUE / REVISE / VERIFY
                ├─ USE_W
                ├─ WAIT
                └─ independent review only if HARD A-E
```

Underlying Worker authority, Stage-1, dependency join, Mutation Lock, and reviewer execution semantics remain canonical in their existing durable sources.

## Evidence / interpretation boundary

Promotion evidence included:

- prior live failures showing distributed Stage-1 / Reviewer-join recall can fail;
- three-arm caller-control proxy showing the thin BRAIN entry was viable with low caller surface, but not proving natural-use superiority over a smaller high-salience sentinel;
- live v28 fresh-epoch evidence showing a Current-only first-visible-line route rule can be missed before Current is fetched, motivating an external bootstrap kernel;
- a natural v28 `W_CANDIDATE` false positive on a small read-only continuation, supporting removal of caller-side downstream pre-classification;
- goal-first design reviews that rejected mandatory latent-goal re-inference and O-confidence reviewer self-waiver;
- frozen v0/v1 representative traces showing no authority, join, mutation, or hard-review invariant regressions after correcting one real goal-vs-operational uncertainty ambiguity.

The binary promotion preserves proactive Worker discovery by making W-worthiness itself a BRAIN-entry trigger and preserves dependency blocking by keeping `WAIT` as a BRAIN/downstream result.

A natural v29 GitHub Pages migration trace later showed correct BRAIN / Reviewer / canonical-hold behavior but also a clear under-delegation signal: `O` absorbed an 8m46s bounded reconstruction/staging/validation segment that could have returned a useful execution checkpoint. A production review of the proposed routing refinement returned `CHALLENGE` against a blanket multi-phase/iterative `USE_W` default; the rule was therefore narrowed so short tightly coupled loops stay in `O`, while the manual lane dispatches only eligible work whose bounded execution clearly repays one human dispatch + one human return/join.

This supports a reversible production semantic promotion, not a claim of deterministic enforcement or statistically proven natural long-context reliability.

## Stop / revise rule

Revise or roll back if natural use shows that the binary caller surface or BRAIN:

- causes repeated missed Worker opportunities that materially consume O context;
- creates repeated manual Worker handoffs whose user scheduling/join friction outweighs the orchestration-state benefit;
- makes required dependency release easier to cross;
- causes repeated latent-goal over-inference on explicit/simple requests;
- recreates per-turn ceremony;
- makes operational controls easier to skip;
- lets `W` gain authority or recursively route Workers;
- weakens independent review on material hard-boundary commitments;
- becomes another hidden Orchestrator rather than a forcing protocol.

Hard enforcement still requires a runtime surface that actually owns dispatch/output/action release; the binary latch and BRAIN do not provide one.
