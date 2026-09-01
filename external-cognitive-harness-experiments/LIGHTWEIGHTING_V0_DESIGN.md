# External Cognitive Harness — Lightweighting v0 Design

Status: DESIGN ONLY — NOT ACTIVATED, NOT A CHANGE TO FROZEN v0 OR v0.1 CANDIDATE

Base harness authority for this design: frozen v0 commit `e1d483fdea6de64c6672421b7e63af5a74f82cca`.

## Goal

Reduce normal Harness invocation friction without changing its cognitive semantics.

First target: reduce GitHub Harness reads from four files to one external read.

This is deliberately separate from the v0.1 efficacy experiment. A lightweighting result must not be used as evidence for or against the FRAME commitment patch.

## Key distinction

There are two different costs:

1. **I/O / invocation cost** — ENTRY -> FRAME -> REVIEW -> SYNTHESIZE requires four external file reads and routing across them.
2. **Cognitive/token cost** — the model still has to process the rules themselves.

A one-read compiled artifact directly attacks (1). It may modestly reduce tool-call/context overhead, but it does **not** substantially reduce the semantic rule payload. Real rule/token compression is a later, higher-risk experiment.

## Candidate L0 architecture: one-read compiled Harness

Create one generated artifact, e.g. `COMPILED.md`, containing the complete frozen Harness sections in execution order.

The invocation contract should say:

- fetch `COMPILED.md` once;
- treat its embedded ENTRY / FRAME / REVIEW / SYNTHESIZE sections as the authoritative contents for this invocation;
- when embedded ENTRY refers to another Harness file, resolve that reference to the corresponding embedded section rather than performing another external read;
- do not add, remove, reorder, summarize, or reinterpret any cognitive rule;
- preserve the existing one-correction maximum and FAST_PATH semantics;
- do not expose intermediate packets unless asked.

The compilation layer is file-resolution infrastructure, not a cognitive-rule change.

## Build constraint

`COMPILED.md` should be deterministically generated from pinned source blobs, not hand-maintained as a second source of truth.

A build manifest should record:

- source commit SHA;
- ENTRY blob SHA;
- FRAME blob SHA;
- REVIEW blob SHA;
- SYNTHESIZE blob SHA;
- compiled blob SHA.

If source blobs change, the compiled artifact is stale until regenerated.

## Non-goals for L0

Do not:

- shorten FRAME / REVIEW / SYNTHESIZE rules;
- remove packet fields;
- merge or delete REVIEW;
- increase/decrease correction loops;
- change FAST_PATH;
- add fresh context, second model, state machine, MCP service, or multi-agent architecture;
- fold the v0.1 commitment patch into this experiment.

## Evaluation question

Does one-read file-resolution preserve the behavioral value of frozen v0 while reducing invocation friction?

### Control

Frozen v0 normal four-file execution pinned to commit `e1d483fdea6de64c6672421b7e63af5a74f82cca`.

### Treatment

One-read compiled artifact generated from exactly the same four frozen source blobs.

### Primary friction metrics

- Harness external file reads: target `4 -> 1`.
- Harness routing failures / wrong-ref reads: treatment should not increase them.
- Human invocation steps: target one Harness pointer instead of multi-file resolution.

### Behavioral guardrail

Use a small regression set spanning:

- frame escape / simpler alternative;
- action bias braking;
- replacement momentum;
- decision-controlling uncertainty;
- justified commitment (anti-overbrake).

The L0 experiment is equivalence/regression oriented, not an attempt to improve reasoning quality.

A material behavioral degradation blocks L0 even if read count improves.

## Acceptance semantics

L0 can be called a successful lightweighting transport only if:

1. compiled treatment consistently performs one Harness external read;
2. source provenance is exact and reproducible;
3. no material behavioral regression appears on the locked regression set;
4. invocation is measurably simpler in actual Chat use.

Success would mean only that one-read packaging is viable. It would not show that the Harness rules themselves are minimal.

## Later L1 — semantic compression (not yet designed)

Only after L0 equivalence is established, test actual rule compression.

L1 should ask which rules/packet fields are redundant and whether a shorter single-pass protocol preserves the anti-framing / anti-momentum effect. Because this changes cognitive semantics, it requires its own preregistration and stronger regression testing.

## Experiment automation track

The separate `HARNESS_EXPERIMENT_AUTOMATION` problem remains open.

Current evidence: the available orchestration environment cannot reproduce locked ChatGPT historical branch semantics or create/collect the required isolated Chat contexts automatically. Do not silently replace those semantics with same-context simulation.

Automation feasibility should therefore be evaluated independently from Harness lightweighting. A valid runner must be able to create isolated answering contexts, preserve exact history/branch fixtures where required, vary only the intended treatment field, and collect visible outputs without cross-arm contamination.
