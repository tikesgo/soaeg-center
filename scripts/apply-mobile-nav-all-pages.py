#!/usr/bin/env python3
"""Insert mobile-nav markup after header on subpages missing data-mobile-nav."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP = {
    "googled61fab189a7245f7.html",
    "naverb40d5257ed7fb03bad8a1cc6b5bde8e6.html",
    "list-card.html",
}


def should_skip(path: Path) -> bool:
    parts = path.parts
    if path.name in SKIP or "node_modules" in parts:
        return True
    if path.name == "index.html" and path.parent == ROOT:
        return True
    return False


def build_mobile_nav(html: str) -> str | None:
    nav_match = re.search(
        r'<nav class="site-nav" aria-label="주요 메뉴">\s*(.*?)\s*</nav>',
        html,
        re.DOTALL,
    )
    if not nav_match:
        return None

    nav_links = nav_match.group(1).strip()
    nav_links = re.sub(r"\n\s{10}", "\n      ", nav_links)

    return (
        "\n    <nav class=\"mobile-nav\" id=\"mobileNav\" data-mobile-nav aria-label=\"모바일 메뉴\">\n"
        f"      {nav_links}\n"
        "    </nav>\n"
    )


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "data-mobile-nav" in text:
        return False

    mobile_nav = build_mobile_nav(text)
    if not mobile_nav:
        raise ValueError(f"Could not build mobile nav for {path}")

    marker = "    </header>\n"
    if marker not in text:
        raise ValueError(f"Header closing tag not found in {path}")

    text = text.replace(marker, marker + mobile_nav, 1)
    path.write_text(text, encoding="utf-8", newline="\n")
    return True


def main() -> None:
    changed = []
    for path in sorted(ROOT.rglob("*.html")):
        if should_skip(path):
            continue
        if patch_file(path):
            changed.append(path.relative_to(ROOT).as_posix())

    print(f"Updated {len(changed)} files")


if __name__ == "__main__":
    main()
