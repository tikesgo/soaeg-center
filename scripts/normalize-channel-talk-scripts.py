#!/usr/bin/env python3
"""Normalize Channel Talk script blocks before </body>."""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP = {"googled61fab189a7245f7.html", "naverb40d5257ed7fb03bad8a1cc6b5bde8e6.html", "list-card.html"}


def js_prefix(html_path: Path) -> str:
    depth = len(html_path.relative_to(ROOT).parts) - 1
    return ("../" * depth) + "js/"


def normalize(path: Path) -> bool:
    if path.name in SKIP or "_template" in path.parts or "node_modules" in path.parts:
        return False

    text = path.read_text(encoding="utf-8")
    if "channel-talk-loader.js" not in text:
        return False

    prefix = js_prefix(path)
    has_cases = f'{prefix}cases-data.js' in text
    has_contact = path.parent == ROOT and path.name == "index.html"

    lines = [
        f'    <script src="{prefix}channel-config.js" defer></script>',
        f'    <script src="{prefix}channel-talk-loader.js" defer></script>',
    ]
    if has_contact:
        lines.insert(0, f'    <script src="{prefix}contact-config.js" defer></script>')
    if has_cases:
        lines.append(f'    <script src="{prefix}cases-data.js" defer></script>')
    lines.append(f'    <script src="{prefix}main.js" defer></script>')
    block = "\n".join(lines)

    pattern = re.compile(
        r"\n(?:[ \t]*<script src=\"[^\"]*(?:channel-config|channel-talk-loader|cases-data|contact-config|main)\.js\"[^>]*></script>\s*)+\n(?=  </body>)",
        re.MULTILINE,
    )
    if not pattern.search(text):
        return False

    new_text = pattern.sub("\n" + block + "\n", text, count=1)
    if new_text == text:
        return False

    path.write_text(new_text, encoding="utf-8", newline="\n")
    return True


def main() -> None:
    changed = []
    for path in sorted(ROOT.rglob("*.html")):
        if normalize(path):
            changed.append(path.relative_to(ROOT).as_posix())
    print(f"Normalized {len(changed)} files")


if __name__ == "__main__":
    main()
