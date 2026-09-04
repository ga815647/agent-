# Chat Dev v29 → Repo-Centered Static Parity Audit

Status: SHADOW CANDIDATE / READ-ONLY AUDIT RESULT
Audit baseline: production Chat Dev v29 Current/BRAIN/W + current public architecture and authoring guide.

## Result

**STATIC PARITY: PASS WITH NON-BLOCKING ACTIVATION PREREQUISITES**

No known v29 control invariant is intentionally dropped by the current `chat-dev/` candidate.

## Responsibility map

| v29 behavior / authority | Repo-centered candidate owner | Status |
| --- | --- | --- |
| fresh epoch must bootstrap before normal response/task execution | Project Instructions shim + `BOOTSTRAP.md` | PASS |
| durable truth overrides memory | `BOOTSTRAP.md` / `ARCHITECTURE.md` | PASS |
| default O / O-only acceptance and commitments | `BOOTSTRAP.md` / `ARCHITECTURE.md` | PASS |
| binary first-visible `ROUTE=DIRECT` / `ROUTE=BRAIN` | `BOOTSTRAP.md` | PASS |
| short confirmation inheritance | `BOOTSTRAP.md` | PASS |
| BRAIN/W lazy loading | `BOOTSTRAP.md` | PASS |
| BRAIN goal/means gate | `BRAIN.md` + detailed contract at release | PASS |
| hard A-E Reasoning Brake gate | `BRAIN.md` + `reasoning-brake-v0/RUNTIME.md` at release | PASS |
| Worker bounded authority / no recursive W | `W.md` | PASS |
| human-mediated production Worker transport | `W.md` / `ARCHITECTURE.md` | PASS |
| required dependency join | `BOOTSTRAP.md` / `ARCHITECTURE.md` | PASS |
| external mutation binding | `BOOTSTRAP.md` + Mutation Lock at release | PASS |
| final control-latch marker | `BOOTSTRAP.md` | PASS |
| ROLLOVER = same-role continuation delta | `ARCHITECTURE.md` / `HANDOFF-AUTHORING.md` | PASS |
| project-local Profiles own project-specific overrides | `ARCHITECTURE.md` + local `PROJECT_PROFILE` pointer | PASS |
| shared durable-term grounding / refresh discipline | `ARCHITECTURE.md` | PASS |
| shortest unambiguous handoff artifacts | `ARCHITECTURE.md` / `HANDOFF-AUTHORING.md` | PASS |
| public architecture vs private reviewer execution split | `ARCHITECTURE.md` | PASS |

## Intentional topology changes, not semantic regressions

### Current/Profile registry

Production `Chat Dev｜Current` currently lists active private Project Profiles. The public repo candidate does **not** copy that private inventory.

Instead:
- each Project carries its exact `PROJECT_PROFILE` pointer locally in Project Instructions;
- `Chat Dev Durable` may remain the private human dashboard/registry.

This preserves project routing without publishing private project inventory.

### Release coherence

v29 frequently points to public `main`. The repo-centered candidate strengthens this by selecting one exact `CONTROL_RELEASE` SHA and requiring downstream Chat Dev public docs to use that same revision for the epoch.

This is an added coherence property, not a v29 semantic requirement being removed.

### Human adoption

Human/new-repo initialization is separated into `ADOPT-CHAT-DEV.md`; it is no longer overloaded onto the runtime bootstrap concept.

## Existing public document disposition

The candidate does not delete currently authoritative production files during shadow work.

At activation:
- `chat-dev/` becomes current entry/interface authority;
- `chat-dev-control-plane-v0/ARCHITECTURE.md` should become compatibility pointer or historical baseline rather than a competing current architecture;
- `BRAIN-AUTO-PILOT.md` may remain detailed BRAIN contract;
- Mutation Lock / Reasoning Brake module docs remain module authorities and are pinned by release SHA.

## Remaining activation prerequisites

These are not blockers to continued shadow refactor:

1. `CONTROL_RELEASE` is intentionally `UNSET_SHADOW`; an immutable candidate SHA must be built before production activation.
2. The actual fresh-Project repository read transport remains environment-dependent and should receive a lightweight smoke check before or during activation when practical.
3. Stable bootstrap pointer protection should be strengthened as practical before it becomes high-blast-radius production authority.
4. Production activation itself requires a fresh hard-commitment decision/review.

## Conclusion

The repo-centered candidate is now structurally suitable for continued cleanup and candidate-release construction without changing production v29.