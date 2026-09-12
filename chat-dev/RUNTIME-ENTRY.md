# Chat Dev Runtime Entry — Receipt Interface

Authority: this interface is active only when loaded from the exact `CONTROL_RELEASE` selected by the active `chat-dev/BOOTSTRAP.md` for the current Project/epoch.

Role: provide backend-derived execution evidence for consequential effects and explicitly requested Runtime Entry tests. It is a soft caller protocol, not a platform interceptor, semantic router, or source of authorization.

## Applicability

Runtime Entry is required before a consequential external effect/commitment and when the user explicitly requests a Runtime Entry test. It is not a prerequisite for ordinary questions, clarification, read-only findings, or status/blocker delivery. Do not create a mailbox request merely to permit an ordinary reply.

This exemption applies to delivery only. It does not exempt Worker dispatch, required Worker/Reviewer dependency acceptance, canonical promotion, or any effect previously requiring Runtime Entry. A status response cannot claim completion, release a dependency, accept evidence, or make a commitment under the guise of ordinary conversation.

DIRECT/BRAIN routing, Worker routing, BRAIN, Mutation Lock, Reviewer adjudication, dependency controls and O authority remain unchanged. If ordinary discussion later leads to an effect, obtain the required current-turn receipt and satisfy those controls before executing it.

## Required attempt

1. Initiate once when the effect-bound turn envelope is known, using the authorized execution-plane interface. Continue independent harmless work while pending.
2. Bind the attempt and any terminal result to the current turn. Validate backend identity and the existing result contract; never invent or reuse a receipt.
3. Execute a consequential effect only after a validated current-turn `TERMINAL_OK` and all other required controls. An error or pending state does not release the effect.
4. If the transport denies an operation before dispatch, report that denial. Do not retry through a different payload, identity, tool, release selector or transport to accomplish the denied operation. Do not call a denial a pending backend job when no acknowledgement exists.
5. A delivery timeout does not authorize a duplicate submission. Continue status retrieval using the acknowledged identity only.

## Delivery and bounded waiting

Before delivery, distinguish these states:

- `NOT_REQUIRED`: ordinary reply, no attempt made or needed. Deliver without a Runtime Entry marker. This is not backend success or failure.
- `TERMINAL_OK`: report the validated current-turn backend OK receipt. It proves Runtime Entry execution only.
- `TERMINAL_ERROR`: report the exact current-turn backend ERROR receipt; dependent effects remain blocked.
- `PENDING`: an acknowledged attempt is non-terminal. A truthful ordinary status response may be delivered immediately with `NO-RECEIPT`, explicitly saying the attempt is pending. Do not claim completion or release dependent work.
- `UNAVAILABLE`: initiation was denied, failed, or terminal retrieval is unavailable. Report the observed cause with `NO-RECEIPT`; dependent effects remain blocked.
- `NOT_STARTED` but required: initiate before the effect, or deliver a truthful explanation that it has not started. Never imply that unattempted work is acknowledged or complete.

There is **no mandatory six-minute wait before ordinary delivery**. When waiting for a requested result is useful, use a foreground retrieval budget of at most **30 seconds from acknowledgement**, then report pending/unavailable unless a validated terminal result is already available. This is a caller waiting budget, not a provider deadline or a guarantee of end-to-end Chat latency. Do not start another wait window in the same turn to postpone the status response indefinitely.

Terminal results arriving after a delivered `NO-RECEIPT` remain historical evidence for that attempt. They cannot retroactively change the delivered marker or serve as another turn's effect receipt. Later work retrieves its existing acknowledged job instead of silently repeating it; any new consequential effect still requires the current turn's own valid controls.

## Receipt markers

When reporting an attempted Runtime Entry, use the absolute final line:

- validated current-turn success: `[CHATDEV｜OK｜ID=<receipt>]`;
- validated current-turn terminal error: `[CHATDEV｜ERROR｜ID=<failure_receipt>]`;
- no validated current-turn terminal receipt at delivery: `[CHATDEV｜NO-RECEIPT]`.

Nothing user-visible follows that marker. For `NO-RECEIPT`, explain the observed pending/denied/unavailable state in the response. It is not degraded success, proof of a general outage, or permission for an effect. Do not fabricate a `PENDING` receipt or a new backend status.

An ordinary response in `NOT_REQUIRED` has no marker. Omitting a marker in that case is intentional, not a compliance failure. When a required attempt was not started, state that fact without claiming an attempt or inventing a receipt; the dependent effect remains blocked.

## Ownership

O retains evidence acceptance, formal state transitions, commitments and final synthesis. The private execution plane owns mutable transport details, mailbox identities, provider configuration and deployment state. Public control documents do not duplicate those values as current truth.

A backend receipt remains execution evidence, not authority transfer. This interface does not repair or bypass platform safety decisions and does not select a new transport.
