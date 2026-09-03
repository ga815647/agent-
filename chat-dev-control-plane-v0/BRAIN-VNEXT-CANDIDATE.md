# Chat Dev BRAIN vNext — Goal-Aligned Control Gateway

Status: CANDIDATE ONLY — NOT PRODUCTION
Scope: caller-facing cognitive/control protocol. This candidate does not change the current `main` baseline until separately reviewed and promoted.

## Goal

BRAIN exists to interrupt control-boundary momentum and make the caller reason from the user's likely goal rather than merely execute the latest proposed means.

BRAIN is not a second Orchestrator. It is a soft forcing protocol that makes the caller use the context already available to that caller, then applies only the operational controls needed for the pending boundary.

It is not a deterministic runtime tool, service, state machine, sandbox, output gate, or hard latch.

## Authority

- `O` remains the sole authority for routing, Worker-result acceptance, formal state transitions, commitments, and final synthesis.
- `W` remains bounded by the scope and authority supplied by `O`.
- BRAIN never grants authority, executes bounded work, creates actors, accepts evidence, or owns a final decision.
- `USE_W` is valid only when caller = `O`.
- When caller = `W`, any need for wider scope, new authority, or additional Worker execution resolves to `RETURN_TO_O`.

## Invocation boundary

Use BRAIN before the existing Chat Dev control boundaries:

- delegation / Worker handoff;
- external mutation;
- release of a commitment that has a required pending dependency;
- consequential commitment.

Ordinary direct reasoning that does not approach one of these boundaries stays direct and pays no BRAIN tax.

The caller does not pre-classify downstream control families before entering BRAIN.

## Input

BRAIN uses:

- caller role (`O` or `W`);
- pending action / transition / commitment;
- caller scope and authority;
- relevant known dependency state;
- the conversational/project context already available to the caller.

For `O`, full conversation context is the primary source for goal inference. BRAIN should not replace that context with a smaller reviewer packet.

## 1. Cheap alignment gate

First ask:

> Is the pending action obviously consistent with the user's stated or already-established goal and the current project state?

If yes, do **not** reconstruct latent intent. Continue to the operational control pass.

If materially mismatched or uncertain, run the Goal Pass.

Guardrails:

- Explicit current instructions are strong evidence.
- Do not invent hidden motives.
- Do not silently replace an explicit requested method merely because another method appears preferable.
- A goal hypothesis may justify `REVISE`, comparison, or surfacing a materially better path; it is not new authority.

## 2. Goal Pass — only on mismatch / uncertainty

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

### Delegation

`O` chooses direct work or `W` under canonical Worker semantics.

Stage-1 remains narrow: only when the proposed Worker delegation/decomposition is both materially consequential if wrong and genuinely uncertain at dispatch time.

### Dependency

A required Reviewer or Worker dependency blocks only the dependent acceptance / final / handoff until terminal, rerouted, cancelled, or otherwise cleared under canonical semantics.

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

These are protocol outcomes, not new authorities or runtime-enforced states.

## Relationship to existing controls

This candidate changes the caller-facing mental model from a taxonomy-first router to goal-first forcing:

```text
control boundary
    ↓
BRAIN
    ↓
cheap alignment gate
    ├─ clear → operational controls
    └─ mismatch / uncertain
          ↓
       Goal Pass by caller
          ↓
       operational controls
          ↓
       hard review only if A-E
```

Existing Worker authority, Stage-1, dependency join, Mutation Lock, and reviewer execution semantics remain underneath until separately changed by a reviewed promotion.

## Stop / revise rule

Reject or revise this candidate if natural use shows that it:

- causes repeated latent-goal over-inference on explicit/simple requests;
- recreates per-turn ceremony;
- makes operational controls easier to skip;
- lets `W` gain authority or recursively route Workers;
- weakens independent review on material hard-boundary commitments;
- becomes another hidden Orchestrator rather than a forcing protocol.
