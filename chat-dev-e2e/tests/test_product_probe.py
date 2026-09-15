"""Unittest coverage for product_probe.normalize_tag."""

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from product_probe import normalize_tag


class TestNormalizeTag(unittest.TestCase):
    def test_collapses_internal_whitespace(self):
        self.assertEqual(normalize_tag("  Alpha   Beta  "), "alpha-beta")

    def test_simple_word(self):
        self.assertEqual(normalize_tag("ready"), "ready")


if __name__ == "__main__":
    unittest.main()
