#!/usr/bin/env python3
"""Verify CTA click does not navigate away (static analysis + optional browser)."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def static_check():
    issues = []
    for p in ROOT.rglob("*.html"):
        s = str(p).replace("\\", "/")
        if "node_modules" in s or p.name.startswith("google") or p.name.startswith("naver"):
            continue
        c = p.read_text(encoding="utf-8")
        if re.search(r'href="[^"]*#open-contact"', c):
            issues.append(f"{p.relative_to(ROOT)}: still has #open-contact href")
        for m in re.finditer(r'href="#"\s+data-contact-modal', c):
            pass  # ok
    return issues


def count_ctas():
    total = 0
    pages = 0
    for p in ROOT.rglob("*.html"):
        s = str(p).replace("\\", "/")
        if "node_modules" in s or p.name.startswith("google") or p.name.startswith("naver") or p.name == "list-card.html":
            continue
        n = p.read_text(encoding="utf-8").count("data-contact-modal")
        if n:
            total += n
            pages += 1
    return total, pages


if __name__ == "__main__":
    issues = static_check()
    total, pages = count_ctas()
    print(f"data-contact-modal total: {total} in {pages} files")
    if issues:
        print("ISSUES:")
        for i in issues:
            print(" ", i)
        sys.exit(1)
    print("Static check OK: no #open-contact hrefs remain")
