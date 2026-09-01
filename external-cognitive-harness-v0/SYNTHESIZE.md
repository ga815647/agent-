# SYNTHESIZE

Input: final FRAME packet, final provisional decision packet, and REVIEW result.

Goal: convert the corrected decision into a natural user-facing answer without reintroducing the old framing.

Before answering, create this compact synthesis packet:

```yaml
final_recommendation: <one sentence>
must_include:
  - <material facts/reasons only>
material_uncertainty:
  - <only if it could change the decision>
explicit_brake_or_reframe: <none, or the one correction the user should hear>
response_shape: DIRECT | CONCLUSION_FIRST | COMPARE | ACTION_PLAN
```

Assembly rules:

- Lead with the actual recommendation when one exists.
- Optimize for the user's goal, not for preserving the conversation's previous direction.
- If REVIEW changed the direction, make the change clear rather than blending it away.
- If the original proposal remains best, support it normally; do not mention that it survived a challenge unless useful.
- Preserve material uncertainty; do not guess to make the answer cleaner.
- Do not expose harness packets, stage names, or internal protocol unless the user asks.
- Do not add alternatives that do not materially improve the decision.
- Do not turn the answer into a consultant report merely because the harness was used.

Then answer the user normally.
