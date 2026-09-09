# Chat Dev Runtime Entry — Receipt Interface

Authority: this interface is active only when loaded from the exact `CONTROL_RELEASE` selected by the active `chat-dev/BOOTSTRAP.md` for the current Project/epoch.

Role: provide one observable, backend-derived turn receipt without making the Runtime Wrapper a new actor, authority, semantic router, or approval gate.

This is a soft caller protocol backed by a private execution substrate. It does not create a deterministic platform interceptor.

## Turn contract

For every `O` user turn:

1. **Early cue, not first-action requirement.** If substantial context-expanding tool work is about to begin and the turn does not yet have a validated Runtime Entry result, prefer to obtain one first. Missing this early cue is recoverable; it is not itself a correctness failure.
2. **Fresh-epoch overlap.** After stable bootstrap and the exact pinned `CALLER.md` are known, initiate the current turn's Runtime Entry as soon as the turn envelope is available. While the backend is pending, `O` should continue independent read-only bootstrap/rollover rehydration that does not depend on the receipt, then join the receipt before consequential effect or final delivery. Do not serialize harmless rehydration behind receipt latency merely for ceremony.
3. **Explicit pending state.** After a current-turn request is successfully initiated and the immediate observed state is non-terminal, `O` explicitly treats the current delivery state as `DELIVERY_STATE=PENDING`. This acknowledgement is control state, not a requirement to add user-visible ceremony. A non-terminal `REQUEST` / `PENDING` observation is latency evidence only; it is not `NO-RECEIPT` evidence.
4. **Before consequential external effect.** A consequential external mutation/commitment must not execute before the current turn has a validated terminal Runtime Entry result plus every other required BRAIN / Mutation Lock / Reviewer / dependency control.
5. **Before final delivery.** Before a final user-visible response, enter the `DELIVERY_GATE` below. If the result changes relevant control state, discard or recompute affected provisional pre-receipt reasoning before delivery.
6. **Absolute-final marker.** The Runtime Entry marker is the final line of the assistant response. Nothing user-visible follows it.

Runtime Entry does not replace DIRECT/BRAIN route selection, Worker routing, Reviewer adjudication, Mutation Lock, or O authority.

## DELIVERY_GATE

`DELIVERY_GATE` is a narrow finalization-state guard, not another reasoning pass, actor, router, reviewer, approval gate, or platform-level hard latch.

Immediately before final delivery, classify only the current turn's Runtime Entry state:

- `TERMINAL_OK` — final delivery is eligible; emit the exact current-turn backend OK marker.
- `TERMINAL_ERROR` — harmless final delivery is eligible with the exact current-turn backend ERROR marker; consequential external effects/commitments remain blocked.
- `PENDING` / `REQUEST` — final delivery is not yet eligible. Continue bounded JOIN / retrieval. Do not select `NO-RECEIPT` merely because one or several early reads remain non-terminal.
- `NOT_STARTED` — initiate the current-turn Runtime Entry request; final delivery is not yet eligible.
- `TERMINAL_RETRIEVAL_UNAVAILABLE` — harmless final delivery may use `NO-RECEIPT`; consequential external effects/commitments remain blocked.

Conceptually:

```text
FINALIZE?
  -> current-turn terminal OK/ERROR? -> FINAL with exact terminal marker
  -> current-turn REQUEST/PENDING? -> JOIN, then re-enter DELIVERY_GATE
  -> current-turn NOT_STARTED? -> INITIATE, then JOIN
  -> terminal retrieval unavailable? -> harmless FINAL with NO-RECEIPT
```

### Bounded liveness

`PENDING` must not become an infinite wait.

The current public delivery budget is **6 minutes from successful current-turn Runtime Entry initiation**.

- While the request remains `REQUEST` / `PENDING` inside that budget, keep final delivery ineligible and continue bounded JOIN / retrieval when needed.
- When that budget is exhausted without a validated terminal result, perform one final current-turn retrieval attempt.
- If that final retrieval still shows a non-terminal request, or the retrieval itself is unavailable, classify the current turn as `TERMINAL_RETRIEVAL_UNAVAILABLE` and use the `NO-RECEIPT` rules below.
- A terminal result that appears only after the turn has already been delivered as `NO-RECEIPT` is stale historical evidence for that delivered turn. It must not retroactively change the delivered marker and must never be reused as the receipt for a later turn. A later user turn requires its own fresh Runtime Entry request.

The delivery budget is a liveness bound, not a claim that the backend normally takes six minutes. Ordinary non-terminal reads before the bound remain latency observations, not failure evidence.

## Success

A compliant successful turn requires the exact backend-generated current-turn marker:

`[CHATDEV｜OK｜ID=<receipt>]`

Rules:

- `<receipt>` must come from the validated terminal Runtime Entry result for the current turn;
- `O` must never invent, reuse from another turn, or rewrite an OK receipt;
- the marker proves Runtime Entry execution only; it does not prove semantic route correctness or grant approval.

## Backend terminal error

If Runtime Entry itself returns a validated terminal error, use the exact backend-generated failure marker:

`[CHATDEV｜ERROR｜ID=<failure_receipt>]`

A backend ERROR is trusted evidence that the turn-entry backend terminated in error, but it is **not** compliant success. Consequential external effects/commitments remain blocked for that turn unless a separately valid current-turn success result is later obtained before delivery.

## No terminal receipt

If `DELIVERY_GATE` reaches `TERMINAL_RETRIEVAL_UNAVAILABLE`, a harmless ordinary reply may continue only with:

`[CHATDEV｜NO-RECEIPT]`

`NO-RECEIPT` is an observable soft-latch failure. It is not proof of general backend unavailability, not degraded success, and not permission to bypass the Runtime Entry contract.

Under `NO-RECEIPT`:

- do not claim Wrapper success or general availability state;
- consequential external effects/commitments remain blocked;
- ordinary harmless conversation may continue so Chat Dev does not fail closed for all chat during execution-plane outage or an exhausted current-turn delivery budget;
- any later result from that delivered turn remains stale and cannot be reused.

## Authority and transport ownership

`O` retains sole evidence acceptance, formal state-transition, commitment, and final-synthesis authority.

The private Chat Dev execution plane owns mutable Runtime Entry transport/implementation details. Public control documents define semantics only and must not duplicate mutable mailbox IDs, workflow names, provider/runtime configuration, or other execution-local state as current truth.

A backend receipt is execution evidence, not authority transfer.
