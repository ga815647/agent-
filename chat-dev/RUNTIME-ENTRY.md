# Chat Dev Runtime Entry — Receipt Interface

Authority: this interface is active only when loaded from the exact `CONTROL_RELEASE` selected by the active `chat-dev/BOOTSTRAP.md` for the current Project/epoch.

Role: require one observable, backend-derived current-turn receipt without making any runtime substrate a new actor, semantic router, approval authority, or final-commitment authority.

This is a soft caller protocol backed by private execution substrates. It does not create a deterministic platform interceptor.

## Eligible current-turn receipt paths

A turn may obtain its receipt from either:

1. a validated current-turn terminal from release-pinned Unified RUN (`chat-dev/RUN.md`) that contains the backend-derived receipt required by this interface; or
2. the compatibility Runtime Entry path when RUN is not used or cannot provide a validated current-turn receipt.

Do not invoke both merely for ceremony. One validated current-turn terminal receipt is sufficient.

A receipt proves execution/entry only. It never transfers user-intent, Worker/Reviewer evidence-acceptance, mutation-authorization, or final-commitment authority from `O`.

## Turn contract

For every `O` user turn:

1. **Early cue, not first-action requirement.** Establish an eligible current-turn receipt path before substantial execution when practical. Harmless independent read-only bootstrap/rollover rehydration may overlap receipt latency.
2. **RUN preference when execution is needed.** If the turn is expected to use Unified RUN, bind the current semantic envelope and use that same durable RUN episode as the preferred execution/receipt path. Do not create a second logical run merely to obtain a receipt.
3. **Compatibility path when RUN is absent.** If RUN is not used, or its eventual terminal cannot supply a validated current-turn receipt, initiate/join the compatibility Runtime Entry path.
4. **Explicit pending state.** After successful initiation, any non-terminal `REQUEST` / `PENDING` observation means `DELIVERY_STATE=PENDING`. It is latency evidence, not `NO-RECEIPT` evidence and not a runtime-failure terminal.
5. **Before consequential external effect.** A consequential mutation/commitment must not execute before the current turn has a validated terminal OK receipt plus every other required BRAIN / Mutation Lock / Reviewer / dependency control.
6. **Before final delivery.** Enter `DELIVERY_GATE`. Final delivery remains ineligible while the current receipt path is non-terminal inside the active liveness budget.
7. **Absolute-final marker.** The receipt marker is the final line of the assistant response. Nothing user-visible follows it.

Runtime Entry does not replace DIRECT/BRAIN route selection, Worker routing, Reviewer adjudication, Mutation Lock, or O authority.

## Unified RUN pending / rejoin

For Unified RUN, bounded synchronous transport wait and runtime execution deadline are different facts.

If a RUN call reaches its private transport's bounded synchronous-wait ceiling before terminal execution completes, it may return `PENDING` with stable same-episode identity. Caller then rejoins the same episode using the same run nonce / durable identity. This may repeat until terminal or until the public delivery-liveness budget is exhausted.

Conceptually:

```text
RUN -> bounded wait -> PENDING
    -> REJOIN same episode -> PENDING
    -> REJOIN same episode -> TERMINAL
```

Rules:

- `PENDING` never authorizes redispatch of a second logical run;
- transport timeout/disconnect is not itself a runtime `FAILED` terminal;
- if transport drops before `PENDING` is delivered, same-nonce lookup/rejoin is still the correct recovery path when the backend claims durable identity;
- process/PID identity may be implementation observability but is not canonical run identity;
- the private execution plane owns actual transport wait thresholds and polling cadence; public control does not hard-code provider names, ports, hosts, or timeout values.

## DELIVERY_GATE

`DELIVERY_GATE` is a narrow finalization-state guard, not another reasoning pass, actor, router, reviewer, approval gate, or platform-level hard latch.

Immediately before final delivery, classify only the current turn's validated receipt state:

- `TERMINAL_OK` — final delivery is eligible; emit the exact current-turn backend OK marker.
- `TERMINAL_ERROR` — harmless final delivery is eligible with the exact current-turn backend ERROR marker; consequential effects/commitments remain blocked.
- `PENDING` / `REQUEST` — final delivery is not yet eligible. Continue bounded same-episode JOIN / retrieval. Do not select `NO-RECEIPT` merely because one or several bounded reads remain non-terminal.
- `NOT_STARTED` — initiate an eligible current-turn receipt path; final delivery is not yet eligible.
- `TERMINAL_RETRIEVAL_UNAVAILABLE` — harmless final delivery may use `NO-RECEIPT`; consequential effects/commitments remain blocked.

Conceptually:

```text
FINALIZE?
  -> current-turn terminal OK/ERROR? -> FINAL with exact terminal marker
  -> current-turn REQUEST/PENDING? -> JOIN / REJOIN same episode -> DELIVERY_GATE
  -> current-turn NOT_STARTED? -> INITIATE eligible path -> JOIN
  -> terminal retrieval unavailable after liveness bound? -> harmless FINAL with NO-RECEIPT
```

## Bounded liveness

`PENDING` must not become infinite waiting.

The public delivery budget remains **6 minutes from successful current-turn receipt-path initiation**.

- The budget applies to the overall delivery episode, not to one transport call.
- A sequence of bounded synchronous RUN/REJOIN or compatibility retrieval calls may occur inside the same budget.
- While the episode remains non-terminal inside that budget, final delivery stays ineligible and caller continues bounded same-episode retrieval when needed.
- When the budget is exhausted without a validated terminal result, perform one final current-turn retrieval attempt.
- If final retrieval still shows non-terminal state, or retrieval itself is unavailable, classify `TERMINAL_RETRIEVAL_UNAVAILABLE` and use the `NO-RECEIPT` rules below.
- A terminal result appearing only after a turn was already delivered as `NO-RECEIPT` is stale historical evidence for that delivered turn. It cannot retroactively change the marker and cannot be reused for a later turn.

The delivery budget is a liveness bound, not a runtime job deadline and not a claim that one transport invocation remains open for six minutes.

## Success

A compliant successful turn requires the exact backend-generated current-turn marker:

`[CHATDEV｜OK｜ID=<receipt>]`

Rules:

- `<receipt>` comes from a validated terminal receipt for the current turn;
- O never invents, rewrites, or reuses an OK receipt from another turn;
- a validated Unified RUN terminal may supply this marker when it is backend-derived and bound to the current turn under this release;
- the marker proves receipt execution only, not semantic route correctness or approval.

## Backend terminal error

If the active receipt path returns a validated terminal error, use the exact backend-generated failure marker:

`[CHATDEV｜ERROR｜ID=<failure_receipt>]`

A backend ERROR is terminal execution evidence but is not compliant success. Consequential external effects/commitments remain blocked unless a separately valid current-turn success result is obtained before delivery under the same release rules.

## No terminal receipt

If `DELIVERY_GATE` reaches `TERMINAL_RETRIEVAL_UNAVAILABLE`, a harmless ordinary reply may continue only with:

`[CHATDEV｜NO-RECEIPT]`

`NO-RECEIPT` is an observable soft-latch failure. It is not proof of general backend unavailability, not degraded success, and not permission to bypass the receipt contract.

Under `NO-RECEIPT`:

- do not claim runtime/Wrapper success or general availability state;
- consequential external effects/commitments remain blocked;
- harmless ordinary conversation may continue;
- any later terminal from that delivered turn remains stale and cannot be reused.

## Authority and transport ownership

`O` retains sole evidence acceptance, formal state-transition, commitment, and final-synthesis authority.

The private Chat Dev execution plane owns mutable transport/deployment implementation, actual synchronous-wait thresholds, runtime host/process state, credentials, durable execution state and evidence plumbing. Public control defines semantics only and must not duplicate mutable mailbox IDs, workflow names, provider/runtime configuration, runner identity, ports, or other execution-local state as current truth.

A backend receipt is execution evidence, not authority transfer.
