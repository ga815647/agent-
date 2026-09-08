# Chat Dev Runtime Entry — Receipt Interface

Authority: this interface is active only when loaded from the exact `CONTROL_RELEASE` selected by the active `chat-dev/BOOTSTRAP.md` for the current Project/epoch.

Role: provide one observable, backend-derived turn receipt without making the Runtime Wrapper a new actor, authority, semantic router, or approval gate.

This is a soft caller protocol backed by a private execution substrate. It does not create a deterministic platform interceptor.

## Turn contract

For every `O` user turn:

1. **Early cue, not first-action requirement.** If substantial context-expanding tool work is about to begin and the turn does not yet have a validated Runtime Entry result, prefer to obtain one first. Missing this early cue is recoverable; it is not itself a correctness failure.
2. **Before consequential external effect.** A consequential external mutation/commitment must not execute before the current turn has a validated terminal Runtime Entry result plus every other required BRAIN / Mutation Lock / Reviewer / dependency control.
3. **Before final delivery.** Before a final user-visible response, obtain a validated terminal Runtime Entry result for the current turn. If the result changes relevant control state, discard or recompute affected provisional pre-receipt reasoning before delivery.
4. **Absolute-final marker.** The Runtime Entry marker is the final line of the assistant response. Nothing user-visible follows it.

Runtime Entry does not replace DIRECT/BRAIN route selection, Worker routing, Reviewer adjudication, Mutation Lock, or O authority.

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

A backend ERROR is trusted evidence that the turn-entry backend terminated in error, but it is **not** compliant success. Consequential external effects/commitments remain blocked for that turn unless a separately valid current-turn success result is later obtained.

## No terminal receipt

If no validated backend terminal result can be obtained at all, a harmless ordinary reply may continue only with:

`[CHATDEV｜NO-RECEIPT]`

`NO-RECEIPT` is an observable soft-latch failure. It is not proof of backend unavailability, not degraded success, and not permission to bypass the Runtime Entry contract.

Under `NO-RECEIPT`:

- do not claim Wrapper success or availability state;
- consequential external effects/commitments remain blocked;
- ordinary harmless conversation may continue so Chat Dev does not fail closed for all chat during execution-plane outage.

## Authority and transport ownership

`O` retains sole evidence acceptance, formal state-transition, commitment, and final-synthesis authority.

The private Chat Dev execution plane owns mutable Runtime Entry transport/implementation details. Public control documents define semantics only and must not duplicate mutable mailbox IDs, workflow names, provider/runtime configuration, or other execution-local state as current truth.

A backend receipt is execution evidence, not authority transfer.
