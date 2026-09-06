# Chat Dev Work & Knowledge Placement Guide

Status: **HUMAN GUIDANCE / NON-RUNTIME**  
Published: 2026-09-06

This guide answers one practical question:

> When Chat Dev work produces tasks, research, decisions, code, or durable knowledge, should the authoritative home be GitHub, Notion, or Linear?

This document is intentionally **not** part of the Chat Dev runtime control chain. It does not change `BOOTSTRAP.md`, `CALLER.md`, `BRAIN.md`, `W.md`, actor authority, routing, mutation controls, or Project bootstrap semantics.

## Executive decision

Use a **single authoritative home chosen by the substrate that actually owns execution or durable truth**.

Default split:

- **GitHub** — repo-backed execution and technical truth: code/config/workflows/releases, implementation tasks, bugs, tests, PR-linked work, and engineering workstreams whose completion is demonstrated in the repository.
- **Notion / project-local knowledge substrate** — private or knowledge-centric operational/research state, Project Profiles, research synthesis, travel/operations knowledge, human-maintained structured state, and durable context that is not naturally repo-owned.
- **Linear** — optional work-management overlay only after a demonstrated portfolio/triage/UX bottleneck. It is not a default canonical store and is not currently required for Chat Dev.

The key correction is:

> A task having `TODO -> Doing -> Done` lifecycle is **not enough** reason to put it in GitHub.

The deciding question is where the work's evidence, execution, and durable authority naturally live.

## Why this boundary

### GitHub is already a capable execution tracker

GitHub Issues now supports parent/sub-issue hierarchy and explicit blocked/blocking dependencies. GitHub Projects can span issues and pull requests, provide table/board/roadmap views, custom fields, iterations, charts, automation, and draft items. A Project can include items from multiple repositories.

For repo-backed work this removes most of the functional argument for adding another tracker solely to obtain hierarchy, dependencies, priority, or roadmap views.

### Notion is not merely a weak issue tracker

Notion databases are collections of full pages, and current task databases support status, assignee, due date, sub-items, dependencies, sprints, relations, rollups, multiple views, and database automation.

Its comparative advantage is that a structured item can simultaneously hold substantial human-facing context, research, decisions, tables, media, and related knowledge. This is useful when the work is primarily knowledge/operations rather than repository execution.

### Linear is better optimized for work management, but adds a new system boundary

Linear is explicitly organized around Issues, Projects, Initiatives, workflows, issue relations, parent/sub-issues, cycles, and engineering integrations. Its GitHub integration can link PRs/commits, automate status changes, and perform one-way or two-way GitHub Issues sync.

That convenience is real, but it creates another authoritative-state decision. If GitHub Issues and Linear both hold lifecycle state, synchronization itself becomes infrastructure to understand and maintain.

For Chat Dev today, the expected UX gain is smaller than the added system boundary.

## Placement decision tree

Use the first matching rule.

### 1. Does completion primarily land in a repository?

Examples:

- code or generator change;
- bug fix;
- CI / GitHub Actions change;
- release/deployment work;
- repo architecture/documentation change;
- test or verification whose accepted evidence is a commit, PR, workflow run, issue result, or repository state.

**Authoritative task home: GitHub Issue / GitHub Project.**

Keep the implementation truth in repository files; use the Issue for lifecycle, discussion, evidence links, and closure.

### 2. Is the work primarily private, operational, research-heavy, or knowledge-centric and not naturally repo-owned?

Examples:

- Project Profile;
- travel research and route state;
- private operational planning;
- pharmacy/business planning;
- research synthesis intended to remain readable after the task ends;
- structured human-maintained state with rich page content.

**Authoritative home: Notion or the project's existing local durable source.**

Do not create a GitHub Issue merely because the item has a due date or completion state.

### 3. Is the pain specifically cross-project prioritization / triage / portfolio visibility?

First try the existing substrate:

- GitHub Projects for repo-backed cross-repository work;
- an existing Notion database/view for knowledge/operations work;
- Chat Dev synthesis when the need is occasional rather than continuously human-managed.

Only introduce **Linear** when the recurring management burden remains material after those options.

## Single-home rule

Every active work item should have **one authoritative lifecycle home**.

Allowed:

- GitHub Issue contains a link to a Notion research page;
- Notion Project Profile points to canonical repo files;
- a dashboard previews or links to an authoritative item;
- Chat Dev reads multiple sources and synthesizes them.

Avoid:

- maintaining independent status fields for the same task in GitHub and Notion;
- copying canonical repo architecture into Notion;
- creating a Linear mirror and then treating both Linear and GitHub as independently editable truth;
- synchronizing systems merely to make them look identical.

A pointer is cheap. Two editable truths are expensive.

## Task vs. durable knowledge

Do not force the complete work history into the same object that owns the final knowledge.

For repo-backed work:

1. GitHub Issue owns the active lifecycle.
2. PR/commit/test/run supplies implementation evidence.
3. Close the Issue when the outcome is accepted.
4. Extract only genuinely durable knowledge into the appropriate canonical repo doc or project-local knowledge source.

For knowledge-centric work:

1. Notion/project-local source may own both the active research state and final synthesis when that remains the natural durable object.
2. Do not create a second GitHub lifecycle object unless repo execution actually appears.

This prevents both Issue graveyards full of pseudo-documentation and Notion databases full of stale engineering TODOs.

## Privacy boundary

Placement must also respect visibility.

- A GitHub Project can be private, but access to underlying Issue/PR items still follows the repository's permissions. Do not put sensitive/private content into an Issue in a public repository merely because the Project view is private.
- Notion supports page/workspace access controls and is generally better suited to private human knowledge when repository publication is unnecessary.
- Linear private teams are a paid Business/Enterprise feature. Do not assume a Free workspace provides per-team private isolation.

Sensitive material follows the substrate with the correct access boundary, even if another tool has a nicer workflow UI.

## Linear adoption gate

Do **not** adopt Linear just because it is a better-looking issue tracker.

Adopt only when all of the following are true:

1. there is a recurring, demonstrated problem seeing or prioritizing active work across repositories/projects;
2. GitHub Projects and existing Notion views are materially insufficient or cumbersome in actual use;
3. the expected workflow benefit is worth maintaining another service/integration boundary;
4. one system remains explicitly canonical for lifecycle state, or the sync contract is deliberately accepted and tested;
5. privacy and plan limits fit the intended use.

As of publication, Linear Free lists 2 teams and 250 issues; private teams are documented for Business/Enterprise plans. These are additional reasons not to make Linear a default dependency for a single-user Chat Dev setup.

## Migration policy

**No cleanup migration project.**

Apply the boundary prospectively and opportunistically:

- new repo-backed execution work -> GitHub;
- new knowledge/private/operations work -> Notion or existing local durable source;
- existing items stay where they are unless they are touched for real work;
- when touching duplicated state, choose one authoritative home and reduce the other copy to a pointer or archive;
- do not migrate completed historical material solely for cosmetic consistency.

This avoids paying migration cost before the boundary has proven useful in daily operation.

## Examples for the current portfolio

| Work | Default authoritative home | Reason |
|---|---|---|
| Chat Dev control-plane implementation/test | GitHub | repo-backed execution and evidence |
| Kawai generator audit/fix | GitHub | code, tests, commits, PRs |
| Cheap Flight Radar provider/code work | GitHub | implementation and runtime evidence |
| Phu Quoc food/route research | Notion/project-local durable source | research/operations knowledge, not code |
| Pharmacy banner/business planning | Notion/project-local source | non-repo operational work |
| A site deployment change arising from travel research | GitHub for deployment task; project-local source for travel truth | split by substrate rather than duplicating the same state |
| Evaluate whether Linear should be adopted | whichever substrate owns the resulting change; for Chat Dev architecture work, GitHub is reasonable | evaluation follows the system it may modify |

## Minimal operating rules

1. **One active item, one authoritative lifecycle home.**
2. **Repo-backed execution -> GitHub.**
3. **Knowledge/private/non-repo operations -> Notion or existing project-local durable source.**
4. **Canonical repo truth stays in repo files; Notion may point to it, not duplicate it.**
5. **Extract durable knowledge only when it remains useful after task closure.**
6. **No bulk migration; re-home only when touched.**
7. **Linear remains optional until a demonstrated management bottleneck justifies the extra system.**

## Evidence basis

Primary product documentation reviewed for this decision:

- GitHub Issues / sub-issues / dependencies / Projects / draft items / project visibility: <https://docs.github.com/en/issues>
- GitHub Projects: <https://docs.github.com/en/issues/planning-and-tracking-with-projects>
- Notion databases / task databases / dependencies / export and access controls: <https://www.notion.com/help/category/databases>
- Linear Projects / Initiatives / issue relations / GitHub integration / Notion integration: <https://linear.app/docs>
- Linear pricing and plan limits: <https://linear.app/pricing>

## Relationship to Chat Dev architecture

This guide is consistent with the existing architectural invariant that project-local operational/research state belongs in the substrate that actually owns it.

It does not redefine authority routing, actor roles, bootstrap, release pinning, or mutation semantics. If a future control-plane change needs to make any part of this guide machine-facing or mandatory, that is a separate control change and must follow the active Chat Dev promotion process.
