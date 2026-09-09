from __future__ import annotations

from dataclasses import dataclass, field
from typing import Mapping


@dataclass(frozen=True)
class MutationIntent:
    effect: str
    resource_type: str
    target: str
    expected_observable_effect: str
    preconditions: tuple[str, ...] = ()
    rollback_metadata: Mapping[str, str] = field(default_factory=dict)


@dataclass(frozen=True)
class ActionContract:
    action_name: str
    effect: str
    resource_type: str
    target_prefix: str | None = None


@dataclass(frozen=True)
class PreparedMutation:
    schema_version: str
    status: str
    intent: MutationIntent
    action: ActionContract
    checks: tuple[str, ...]
    rejection_reason: str | None = None


DEFAULT_GITHUB_ACTIONS: dict[str, ActionContract] = {
    "github.create_issue": ActionContract("github.create_issue", "CREATE_GITHUB_ISSUE", "github_issue", "github:"),
    "github.update_issue": ActionContract("github.update_issue", "UPDATE_GITHUB_ISSUE", "github_issue", "github:"),
    "github.add_comment_to_issue": ActionContract(
        "github.add_comment_to_issue", "ADD_GITHUB_ISSUE_COMMENT", "github_issue", "github:"
    ),
    "github.create_file": ActionContract("github.create_file", "CREATE_GITHUB_FILE", "github_file", "github:"),
    "github.update_file": ActionContract("github.update_file", "UPDATE_GITHUB_FILE", "github_file", "github:"),
    "github.delete_file": ActionContract("github.delete_file", "DELETE_GITHUB_FILE", "github_file", "github:"),
}


class MutationPreparer:
    def __init__(self, catalog: Mapping[str, ActionContract] | None = None):
        self._catalog = dict(catalog or DEFAULT_GITHUB_ACTIONS)

    def prepare(self, intent: MutationIntent, action_name: str) -> PreparedMutation:
        action = self._catalog.get(action_name)
        if action is None:
            placeholder = ActionContract(action_name, "UNKNOWN", "UNKNOWN")
            return PreparedMutation(
                schema_version="prepared_mutation_v0",
                status="REJECTED",
                intent=intent,
                action=placeholder,
                checks=("action_known=false",),
                rejection_reason="UNKNOWN_ACTION",
            )

        checks = [
            f"effect_match={str(action.effect == intent.effect).lower()}",
            f"resource_match={str(action.resource_type == intent.resource_type).lower()}",
            f"target_present={str(bool(intent.target.strip())).lower()}",
        ]
        if action.target_prefix is not None:
            target_match = intent.target.startswith(action.target_prefix)
            checks.append(f"target_prefix_match={str(target_match).lower()}")
        else:
            target_match = True

        compatible = (
            action.effect == intent.effect
            and action.resource_type == intent.resource_type
            and bool(intent.target.strip())
            and target_match
        )
        return PreparedMutation(
            schema_version="prepared_mutation_v0",
            status="READY" if compatible else "REJECTED",
            intent=intent,
            action=action,
            checks=tuple(checks),
            rejection_reason=None if compatible else "ACTION_TARGET_MISMATCH",
        )

    def dry_run(self, intent: MutationIntent, action_name: str) -> PreparedMutation:
        return self.prepare(intent, action_name)
