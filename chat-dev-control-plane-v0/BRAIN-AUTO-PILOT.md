# Chat Dev BRAIN — Goal-Aligned Control Handler

Status: ACTIVE DEFAULT — REVERSIBLE
Promotion date: 2026-09-03
Scope: goal-aligned cognitive/control handler entered only from the release-pinned caller interface. Historical filename retained for durable-pointer compatibility.

## Goal

BRAIN interrupts control-boundary momentum and makes the caller reason from the user's established goal rather than merely execute the latest proposed means.

BRAIN is not the caller sentinel and is not a second Orchestrator. Caller entry, grounding, primary DIRECT/BRAIN selection, and caller-level reconsideration are owned by `chat-dev/CALLER.md` from the same `CONTROL_RELEASE`. Once entered, BRAIN uses the caller's existing context and applies only the goal/alignment work and operational controls needed for the pending boundary.

It is not a deterministic runtime tool, model call, service, MCP, state machine, sandbox, output gate, or hard latch.

## Authority

- `O` remains the sole authority for Worker-result acceptance, formal state transitions, commitments, and final synthesis.
- `CALLER.md` defines `O`'s normal primary route-selection procedure; this does not create another actor or independent authority.
- `W` remains bounded by the scope and authority supplied by `O`.
- BRAIN never grants authority, executes bounded work, creates actors, accepts evidence, or owns a final decision.
- `USE_W` is valid only when caller = `O`.
- When caller = `W`, any need for wider scope, new authority, or additional Worker execution resolves to `RETURN_TO_O`.

## Caller entry / invocation boundary

Fresh-epoch runtime entry is:

```text
Project Instructions shim
  -> chat-dev/BOOTSTRAP.md
  -> CONTROL_RELEASE
  -> chat-dev/CALLER.md from that release
```

`CALLER.md` owns the binary caller route and first-visible-line contract. BRAIN does not independently select or redefine the caller route.

BRAIN is entered only after the caller interface selects `ROUTE=BRAIN`. Dependency blocking and Worker selection remain BRAIN/downstream semantics; there is no caller-facing `WAIT` or `W_CANDIDATE` route.

A short confirmation and other caller-grounding rules are handled before BRAIN entry by `CALLER.md`.

## Input

BRAIN uses:

- caller role (`O` or `W`);
- pending action / transition / commitment;
- caller scope and authority;
- relevant known dependency state;
- the conversational/project context already available to the caller.

For `O`, full conversation context is the primary source for goal inference. BRAIN does not replace that context with a smaller reviewer packet.

## 1. Proposal / solution de-anchoring branch

If the BRAIN-routed turn is itself evaluating or deciding a proposed method/solution, use the existing single bounded goal/alternative slot once before operational controls:

1. hold the established user goal fixed;
2. ask what the caller would independently recommend if the currently proposed means had not been supplied;
3. compare that recommendation with the proposed means;
4. if materially aligned, stop the comparison and continue;
5. if materially different in a conclusion-changing way, surface or account for the difference before commitment/operational controls.

This consumes BRAIN's bounded alternative slot for the turn. Do not run a second Goal Pass or a post-BRAIN reconsideration merely because `CALLER.md` has a reconsideration contract.

Explicit feasible user instructions remain strong evidence. This branch does not authorize silently replacing a requested method. After explicit approval, ordinary execution does not reopen the chosen method unless new material evidence, uncertainty, or tradeoff appears.

## 2. Cheap goal/means alignment gate

When the proposal/solution branch above is not active, first ask:

> Is the pending means/action obviously consistent with the user's stated or already-established goal and the current project state?

If yes, do **not** reconstruct latent intent. Continue to the operational control pass.

Run the Goal Pass only when the **means-to-goal alignment itself** is materially mismatched or materially uncertain.

Operational uncertainty alone — for example uncertainty about Worker decomposition, action selection, dependency state, or implementation details while the user's desired outcome is clear — does **not** trigger the Goal Pass. Handle that uncertainty in the relevant operational control instead.

Guardrails:

- Explicit current instructions are strong evidence and can make goal/means alignment clear even when they differ from an earlier preference.
- Do not invent hidden motives.
- Do not silently replace an explicit requested method merely because another method appears preferable.
- A goal hypothesis may justify `REVISE`, comparison, or surfacing a materially better path; it is not new authority.

## 3. Goal Pass — only on goal/means mismatch or uncertainty

Make the caller, especially `O`, use its available context to:

1. infer the outcome the user is most likely trying to achieve;
2. distinguish that outcome from the latest proposed means;
3. use conversation history, timing, wording, established preferences, constraints, and current project state as evidence;
4. compare the pending means against that goal;
5. run one brief escape pass for a materially better framing or path;
6. stop when no materially better path appears.

For consequential reasoning, the escape pass is the default spare cycle: one bounded attempt to leave the first framing, not repeated self-reflection.

## 4. Operational control pass

After the proposal comparison, alignment gate, or Goal Pass as applicable, apply only the controls required by the pending boundary.

### Worker routing

For substantial bounded work, `O` chooses direct execution or `W` under canonical Worker semantics after BRAIN entry. `W` may be proactively discovered only through the caller interface's `ROUTE=BRAIN` entry; no caller-facing `W_CANDIDATE` classification is required.

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
E. retains unresolved evidence conflict or decision-controlling uncertainty after the caller's bounded goal/alternative work.

Reversible exploration, research acceptance, ordinary prioritization, tentative/no-change recommendations, and local reversible work do not require external review unless they independently meet A-E.

Caller confidence never waives A-E.

## 5. Results

BRAIN returns the minimum action-oriented guidance needed, such as:

- `CONTINUE`
- `REVISE`
- `VERIFY`
- `WAIT`
- `USE_W` — caller `O` only
- `RETURN_TO_O` — caller `W`
- `ESCALATE_REVIEW`

These are protocol outcomes, not new authorities or runtime-enforced states.

## Runtime shape

```text
fresh O epoch
    ↓
BOOTSTRAP -> pinned CALLER
    ↓
GROUND -> ROUTE -> RECONSIDER
    ├─ DIRECT -> O work
    └─ BRAIN
         ↓
       proposal comparison if applicable
         OR
       cheap goal/means alignment gate
         ├─ clear -> operational controls
         └─ goal/means mismatch or uncertainty
                ↓
             one Goal Pass
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
- frozen v0/v1 representative traces showing no authority, join, mutation, or hard-review invariant regressions after correcting one real goal-vs-operational uncertainty ambiguity;
- v30 live-canaried caller grounding, primary route ownership, bounded DIRECT reconsideration, and proposal de-anchoring stop rules, consolidated by `CALLER.md` rather than duplicated here.

This supports a reversible production semantic design, not a claim of deterministic enforcement or statistically proven natural long-context reliability.

## Stop / revise rule

Revise or roll back if natural use shows that caller/BRAIN interaction:

- causes repeated missed Worker opportunities that materially consume O context;
- makes required dependency release easier to cross;
- causes repeated latent-goal over-inference on explicit/simple requests;
- recreates per-turn ceremony;
- makes operational controls easier to skip;
- repeatedly reopens already-approved methods without new evidence;
- lets `W` gain authority or recursively route Workers;
- weakens independent review on material hard-boundary commitments;
- turns BRAIN into another hidden Orchestrator rather than a forcing protocol.

Hard enforcement still requires a runtime surface that actually owns dispatch/output/action release; the caller latch and BRAIN do not provide one.
