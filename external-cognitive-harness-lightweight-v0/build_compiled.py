from __future__ import annotations

import hashlib
from pathlib import Path

SOURCE_COMMIT = "e1d483fdea6de64c6672421b7e63af5a74f82cca"
SOURCE_DIR = Path("external-cognitive-harness-v0")
OUTPUT = Path("external-cognitive-harness-lightweight-v0/COMPILED.md")
FILES = [
    ("ENTRY.md", "4c7dfb6ae547cbfdc93afdc9f459441d8657146b"),
    ("FRAME.md", "011cd91f925eb25c1a66646143e4a26af9750c29"),
    ("REVIEW.md", "8b5b25caef81f56b0417ddf7d6a243aa8c8b3447"),
    ("SYNTHESIZE.md", "2325a6368b98c3dcb589985592357499a0f6898a"),
]

HEADER = f"""# External Cognitive Harness — COMPILED one-read prototype

Status: EXPERIMENTAL TRANSPORT PROTOTYPE — NOT FROZEN v0, NOT v0.1
Source commit: `{SOURCE_COMMIT}`

## File-resolution contract

This artifact embeds the exact source contents of ENTRY.md / FRAME.md / REVIEW.md / SYNTHESIZE.md from the pinned source commit above.

For this invocation only:
- read this artifact once;
- when the embedded ENTRY.md instructs you to read FRAME.md, REVIEW.md, or SYNTHESIZE.md, resolve that reference to the corresponding embedded section below instead of performing another external file read;
- this override changes file resolution only: do not add, remove, reorder, summarize, or reinterpret any cognitive rule;
- preserve FAST_PATH, packet semantics, the maximum-one-correction rule, and normal factual/tool verification requirements;
- do not expose intermediate packets unless the user asks.

---
"""


def git_blob_sha(data: bytes) -> str:
    header = f"blob {len(data)}\0".encode()
    return hashlib.sha1(header + data).hexdigest()


def main() -> None:
    sections: list[str] = []
    for name, expected_sha in FILES:
        path = SOURCE_DIR / name
        data = path.read_bytes()
        actual_sha = git_blob_sha(data)
        if actual_sha != expected_sha:
            raise SystemExit(
                f"source mismatch for {path}: expected {expected_sha}, got {actual_sha}"
            )
        text = data.decode("utf-8").rstrip("\n")
        sections.append(f"\n## Embedded source: {name}\n\n{text}\n")

    output = HEADER + "\n---\n".join(sections)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(output, encoding="utf-8")


if __name__ == "__main__":
    main()
