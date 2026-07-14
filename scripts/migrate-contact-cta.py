#!/usr/bin/env python3
"""Migrate #open-contact hrefs to href=\"#\" data-contact-modal."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HREF_PATTERN = re.compile(
    r'href="(?:\.\./)*(?:index\.html#open-contact|#open-contact)"'
)
REPLACEMENT = 'href="#" data-contact-modal'

def is_target(p: Path) -> bool:
    s = str(p).replace("\\", "/")
    if "node_modules" in s:
        return False
    if p.name.lower().startswith("googled") or p.name.lower().startswith("naverb"):
        return False
    return p.suffix.lower() == ".html"


def main():
    total = 0
    files = 0
    for p in sorted(ROOT.rglob("*.html")):
        if not is_target(p):
            continue
        content = p.read_text(encoding="utf-8")
        new_content, n = HREF_PATTERN.subn(REPLACEMENT, content)
        if n:
            p.write_text(new_content, encoding="utf-8")
            total += n
            files += 1
            print(f"{p.relative_to(ROOT)}: {n}")
    print(f"\nDone: {total} hrefs in {files} files")


if __name__ == "__main__":
    main()
