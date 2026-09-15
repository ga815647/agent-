"""Public acceptance fixture: tag normalization probe."""

import re


def normalize_tag(value):
    """Return input text stripped, lowercased, internal whitespace runs to one hyphen."""
    text = str(value)
    text = text.strip().lower()
    return re.sub(r"\s+", "-", text)
