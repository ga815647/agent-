# Conversational assistance — release-controlled optional interface

Status: release-controlled optional interface. Repository presence or source merge alone does not activate it; it is active only when referenced by the selected `CONTROL_RELEASE`. This supersedes the mobile-Codex product target in the Remote Studio proposal; useful existing task mechanics remain available.

The current goal is better conversational understanding and useful execution within available capability: less waiting, less reflexive agreement, and less attachment to the assistant's own previous framing. A complete remote development platform, autonomous reviewer, new phone UI, and general-purpose background worker are not prerequisites for incremental conversational improvement.

## Caller integration

Use the existing CALLER GROUND / RECONSIDER opportunity, not an additional mandatory pass on every turn. Resolve simple questions, clear confirmations and corrections directly. Seek one remote second opinion when a consequential interpretation remains uncertain, the user points out a misunderstanding, or the assistant appears stuck defending its prior plan. Never outsource an already obvious correction just for ceremony.

Send the current verbatim message, the preceding proposal needed to resolve references such as "好", and only the relevant original user/assistant messages. Label any prior goal as a hypothesis. Preserve message roles. Do not replace original evidence with an assistant-written conclusion about what the user must mean. If decisive context is missing, say so; retrieval and context completeness are not guaranteed by this packet format.

The remote adviser returns an interpretation, current goal, evidence IDs and one of ANSWER, CONTINUE, REVISE or CLARIFY. CLARIFY requires a decision-changing unresolved question. Explicit goal corrections replace obsolete success criteria. Confirmations of concrete authorized work mean continue the work, not another acknowledgement loop. Suggestions do not automatically expand scope. A remote answer is fallible advice; contradictory explicit user evidence wins. Advice cannot authorize tools, change permissions or claim actions occurred.

## Existing transport and waiting

The public-safe `chat-dev-runtime-v0/conversation_assist.py` exports the existing Runtime Wrapper `spark_run` request shape. This does not add a new service or change the old transport's data eligibility. Private execution can also run a bounded direct model probe with its owner policy. Transport adapters and credentials remain private.

Use acknowledged existing job identity for long work. Perform independent useful work while pending. Do not start another identical request because a chat wait expired. If a second opinion misses the caller's interaction budget, state that it is pending/unavailable and give only a provisional answer supported by available evidence; unresolved consequential actions remain paused. Do not pretend a remote review completed. Existing Runtime Entry receipt obligations remain independently effective until O accepts a separate change; this interface cannot promise to remove that source of waiting.

Bind advice to the exact conversation identity, revision and content hash. A newer message invalidates the older advice; a late result is historical evidence, not the answer to the latest message. Use one bounded answer, not recursive advisers or repeated polling until agreement.

## Evaluation

Evaluate actual interpretations and responses for tentative suggestions, explicit goal replacement, corrections to assistant claims, short confirmations, real ambiguity, and clearly settled decisions. Record latency and unavailable results. Structural validation is not proof of understanding; a few live examples are evidence for those examples only. No challenge-count or reasoning-length target.

Activation is selected by `CONTROL_RELEASE` after O acceptance. A source merge alone does not select this protocol.
