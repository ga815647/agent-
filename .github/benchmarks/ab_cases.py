CASES = {
    "1": r'''CASE 1 — Sequential diagnostic tests

FACTS:
- Disease prevalence in the tested population is 2%.
- Test A sensitivity = 90%; specificity = 95%.
- Only people positive on Test A receive Test B.
- Test B sensitivity = 80%; specificity = 90%.
- Conditional on true disease status, the two tests' errors are independent.

USER HYPOTHESIS — UNVERIFIED:
A person positive on both tests has more than a 90% probability of having the disease, because both tests are fairly accurate.

QUESTION:
Is the hypothesis correct? Calculate the posterior probability of disease after both tests are positive. Show the decisive calculation.''',

    "2": r'''CASE 2 — Project critical path

FACTS:
All durations are days. Tasks start as soon as dependencies allow.
- A: 4, no dependency
- B: 7, no dependency
- C: 5, after A
- D: 6, after A
- E: 4, after B
- F: 3, after both C and E
- G: 2, after D
- H: 1, after both F and G

USER HYPOTHESIS — UNVERIFIED:
A is the bottleneck because the A→D→G branch reaches day 12, which is longer than B→E at day 11. Therefore shortening A by 2 days will shorten the whole project by 2 days.

QUESTION:
Is the hypothesis correct? Compute the original project duration and the duration if A is shortened from 4 to 2 days. Identify the controlling path.''',

    "3": r'''CASE 3 — Channel shift with a threshold fee

FACTS:
- Direct channel contribution after ordinary variable costs = $50 per unit.
- Marketplace contribution after all ordinary variable and percentage fees = $21 per unit.
- Current monthly volume: Direct 100 units; Marketplace 400 units.
- If Direct monthly volume exceeds 150 units, an additional $4,000 warehouse-tier fee is charged for that month.
- The business is not currently paying that tier fee.
- Consider shifting exactly 100 units from Marketplace to Direct. Total units sold do not change. No other costs or revenues change.

USER HYPOTHESIS — UNVERIFIED:
The shift increases monthly profit by $2,900 because Direct contributes $29 more per unit and 100 units are shifted.

QUESTION:
Is the hypothesis correct? Calculate the net monthly profit change caused by the shift.''',

    "4": r'''CASE 4 — Aggregated treatment outcomes

FACTS:
Observed outcomes are:
- Treatment A, low-risk: 81 successes / 87 patients
- Treatment A, high-risk: 192 / 263
- Treatment B, low-risk: 234 / 270
- Treatment B, high-risk: 55 / 80

USER HYPOTHESIS — UNVERIFIED:
Treatment B is intrinsically more effective because its overall success rate is higher: 289/350 versus 273/350 for Treatment A.

QUESTION:
Does the supplied evidence support that intrinsic-effectiveness conclusion? Calculate the relevant within-stratum rates and explain the decisive issue. Do not introduce outside medical assumptions.''',

    "5": r'''CASE 5 — Quorum read/write control case

FACTS:
- A replicated key-value store has N = 3 replicas.
- Every completed write is acknowledged only after W = 2 replicas store it.
- Every subsequent read queries any R = 2 replicas.
- There are no concurrent writes during the scenario.
- Versions increase monotonically, and a read returns the value with the highest version among its two responses.
- Ignore node failures during the completed write and subsequent read.

USER HYPOTHESIS — UNVERIFIED:
Every read that starts after a write has completed must observe that completed write (or a later version), because every size-2 read quorum intersects every size-2 write quorum in a 3-replica system.

QUESTION:
Under exactly these stated assumptions, is the hypothesis correct? Give the decisive quorum argument. Do not invent unstated failure modes.'''
}
