#!/usr/bin/env python3
"""Remove duplicate consultation buttons from mobile-nav across all HTML pages."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PATTERN = re.compile(r"\n\s*<div class=\"mobile-nav__actions\">.*?</div>", re.DOTALL)


def main() -> None:
    changed = []
    for path in sorted(ROOT.rglob("*.html")):
        if "node_modules" in path.parts:
            continue
        text = path.read_text(encoding="utf-8")
        if "mobile-nav__actions" not in text:
            continue
        new_text, count = PATTERN.subn("", text)
        if count:
            path.write_text(new_text, encoding="utf-8", newline="\n")
            changed.append(path.relative_to(ROOT).as_posix())

    print(f"Updated {len(changed)} files")
    remaining = [
        p.relative_to(ROOT).as_posix()
        for p in ROOT.rglob("*.html")
        if "mobile-nav__actions" in p.read_text(encoding="utf-8")
    ]
    if remaining:
        print("Still contains mobile-nav__actions:")
        for item in remaining:
            print(f"  - {item}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
