# Mutation Prepare — public runtime source candidate

Status: Phase F candidate / non-authoritative until promoted through the normal Chat Dev acceptance path.

This directory owns the public-safe pure mutation-intent preparation logic for the Runtime Wrapper candidate:

- bind semantic mutation effect;
- bind resource type and target;
- select/verify a compatible action contract;
- return `READY` or explicit rejection without executing an external effect.

It intentionally contains **no** GitHub token, private endpoint, runtime policy value, execution evidence, live mutation transport, or project-private state.

Private `chatdev-exec` may consume this source only by an exact immutable public source SHA. Mutable deployment pointers/policy and private execution evidence remain privately owned.

This module is preparation/binding logic, not a universal mutation interceptor and not external-effect authorization. Runtime Entry, Mutation Lock/hard gate, Reviewer/dependency gates, and actual mutator capability remain separate controls where applicable.
