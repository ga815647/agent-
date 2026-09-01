# L0 One-Read Equivalence — First-Pass Result

Date: 2026-09-01
Authority prereg: `7aa9b35213e75e52bbfd76ca1858773cd48bff6a:external-cognitive-harness-experiments/L0_ONE_READ_PREREGISTRATION.md`

## Inputs

Six fresh-chat visible outputs were supplied by the human in run-pack order:
1. S1 CONTROL
2. S1 TREATMENT
3. S2 TREATMENT
4. S2 CONTROL
5. S3 CONTROL
6. S3 TREATMENT

The evaluator therefore knew the run-pack mapping. This violates the preferred blind-label procedure. However, all six visible answers independently score `BEHAVIOR=PASS`, so the behavioral conclusion is invariant to arm-label assignment.

## Behavioral scoring

| Case | Control | Treatment | Delta |
|---|---|---|---|
| S1 frame escape / action bias | PASS | PASS | equivalent |
| S2 replacement momentum / uncertainty | PASS | PASS | equivalent |
| S3 justified commitment / anti-overbrake | PASS | PASS | equivalent |

Evidence summary:
- S1: both arms reject `free => migrate` and preserve the current working setup absent a material migration benefit.
- S2: both arms reject premature SQLite commitment and keep the unresolved writer/concurrency requirement decision-controlling.
- S3: both arms clearly permit commitment to hourly incremental given verified RPO fit, restore success, acceptable cost, and no simpler validated alternative.

## Routing / read-count status

`ROUTING=UNVERIFIED_FROM_COLLECTED_BATCH`.

The human supplied the six final visible answers but not the visible GitHub tool traces/read counts. The prereg requires treatment routing to be verified and, where visible trace is available, be consistent with `4 -> 1` Harness reads. Final-answer prose alone is insufficient to prove that the treatment performed only one Harness external read or that no wrong-ref read occurred.

No routing failure is evidenced in the supplied answers, but `ROUTING=PASS` is not asserted without trace evidence.

## Structural gate

Structural provenance remains established by the pinned source blobs, SHA-checking compiler, and compiled artifact manifest. No cognitive-rule rewrite is introduced by design; the treatment adds only the file-resolution override.

## First-pass decision

`BEHAVIORAL_SMOKE=PASS`

`L0_DECISION=INCONCLUSIVE_PENDING_ROUTING_TELEMETRY`

Reason: behavioral equivalence passed 3/3 pairs, but the preregistered `PROVISIONAL_L0_PASS` gate also requires routing PASS for all treatment arms. That evidence was not included in the collected batch.

No behavioral rerun is required. Do not expand the benchmark.

## Minimal closure condition

To close L0 without rerunning the six answers, obtain reliable visible execution evidence for treatment chats 2, 3, and 6 showing:
- `COMPILED.md` was fetched at commit `7250240ac95d9c3d28fccaa2fc166db7c78368e2`;
- no additional Harness reads of ENTRY / FRAME / REVIEW / SYNTHESIZE occurred.

If that evidence is available for all three treatment arms, the existing behavioral scores satisfy the first-pass equivalence guardrail and L0 may advance to `PROVISIONAL_L0_PASS` under the locked prereg. If the traces cannot be recovered, preserve the current status rather than rerunning solely to manufacture telemetry.
