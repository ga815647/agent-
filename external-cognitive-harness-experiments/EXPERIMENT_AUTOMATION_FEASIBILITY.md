# External Cognitive Harness — Experiment Automation Feasibility

Status: FEASIBILITY NOTE — DOES NOT MODIFY LOCKED V0.1 PREREGISTRATION

Date: 2026-09-01

## Conclusion

There are two distinct automation targets and they should not be conflated.

### 1. Locked historical Stage-1 experiment

Current status remains `MANUAL_ISOLATION_REQUIRED`.

The locked preregistration requires historical ChatGPT branch semantics from exact branch points. The currently available orchestration connector cannot create those ChatGPT branches directly.

ChatGPT product supports branching conversations, but product support alone does not establish that an automated runner can reliably select the exact historical branch point, keep model/config fixed, prevent cross-arm contamination, and retrieve outputs without introducing additional treatment differences.

ChatGPT Work cloud browser is a plausible UI-automation path because it can operate signed-in websites, but it requires a separate validation experiment before being trusted for benchmark execution.

Therefore: do not use unvalidated browser automation to reinterpret the already-locked Stage-1 results.

### 2. Future replayable benchmark runner

The OpenAI Responses API supports explicit conversation lineage with `previous_response_id`; official documentation also describes fork-like lineage behavior in WebSocket lanes.

This is a substantially better substrate for future automated A/B experiments because a runner can:

- materialize a fixed input history;
- fork two independent response lineages from the same parent state;
- vary only the treatment payload;
- collect visible outputs programmatically;
- repeat runs consistently;
- randomize or blind arm labels for scoring.

However, an API-created lineage is not automatically equivalent to historical ChatGPT product context. It does not inherently reproduce Project context, ChatGPT memory, product-specific hidden instructions, connector state, or the exact model/configuration used in a historical UI chat.

Therefore it cannot substitute for the currently locked historical cases without changing the experiment.

## Recommended automation program

### A. Preserve current Stage-1 preregistration

Do not rewrite it merely to gain automation convenience.

### B. Build a future `ECH_REPLAY_BENCH`

For new cases, capture a replayable fixture at case creation time rather than relying on later UI branching.

Minimum fixture:

- model identifier/configuration;
- ordered visible message history required for the case;
- Harness ref / treatment variable;
- tool-access contract needed by both arms;
- target user turn verbatim;
- scoring rubric stored separately from the answering context;
- random arm identifier not revealing treatment.

The runner should instantiate two independent lineages from the same fixture and vary only the treatment field.

### C. Separately test Work/browser automation

A bounded proof can test whether ChatGPT Work can reliably:

1. open a known ChatGPT conversation;
2. branch from an exact selected message;
3. create two branches from the same point;
4. keep the requested model/configuration invariant;
5. paste symmetric wrappers differing in one field only;
6. collect both visible outputs;
7. avoid exposing one arm to the other.

If any of these cannot be verified, Work/browser automation should not be used for historical benchmark authority.

## Strategic implication

The current experiment friction is partly a fixture-design problem, not only a Harness problem.

Future Harness experiments should be born replayable: record enough explicit input state at the time a case is registered so later A/B work does not depend on manual ChatGPT branch operations.

This automation track remains independent from `HARNESS_LIGHTWEIGHTING` and from the frozen v0.1 efficacy preregistration.
