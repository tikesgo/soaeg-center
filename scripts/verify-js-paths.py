#!/usr/bin/env python3
"""Validate JS script src paths resolve to existing files."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP = {
    "googled61fab189a7245f7.html",
    "naverb40d5257ed7fb03bad8a1cc6b5bde8e6.html",
    "list-card.html",
}
JS_NAMES = {
    "main.js",
    "channel-config.js",
    "channel-talk-loader.js",
    "cases-data.js",
    "contact-config.js",
}


def should_skip(path: Path) -> bool:
    return path.name in SKIP or "node_modules" in path.parts


def resolve_src(html_path: Path, src: str) -> Path:
    return (html_path.parent / src).resolve()


def main() -> None:
    errors = []
    checked = 0
    for path in sorted(ROOT.rglob("*.html")):
        if should_skip(path):
            continue
        text = path.read_text(encoding="utf-8")
        for src in re.findall(r'<script src="([^"]+)"', text):
            if not any(name in src for name in JS_NAMES):
                continue
            checked += 1
            target = resolve_src(path, src)
            if not target.is_file():
                errors.append(f"{path.relative_to(ROOT)} -> {src}")

    print(f"Checked {checked} script references")
    if errors:
        print("Missing files:")
        for item in errors:
            print(item)
        raise SystemExit(1)
    print("All script paths resolve")


if __name__ == "__main__":
    main()
