#!/usr/bin/env python3
"""Insert favicon link tags into all public HTML pages."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FAVICON_BLOCK = """    <link rel="icon" href="{prefix}images/favicon/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="512x512" href="{prefix}images/favicon/favicon-512.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="{prefix}images/favicon/favicon-192.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="{prefix}images/favicon/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="{prefix}images/favicon/favicon-16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="{prefix}images/favicon/apple-touch-icon.png" />"""

REMOVE_OLD = re.compile(
    r"\s*<link\s+[^>]*rel=[\"'](?:shortcut icon|icon|apple-touch-icon)[\"'][^>]*>\s*",
    re.I,
)

MARKER = "<!-- soaeg:favicon -->"


def is_target(path: Path) -> bool:
    s = str(path).replace("\\", "/")
    if "node_modules" in s or path.name == "list-card.html":
        return False
    if path.name.lower().startswith("googled") or path.name.lower().startswith("naverb"):
        return False
    return path.suffix.lower() == ".html" and "<head>" in path.read_text(encoding="utf-8", errors="replace")


def prefix_for(path: Path) -> str:
    rel = path.relative_to(ROOT)
    depth = len(rel.parts) - 1
    return "../" * depth if depth else ""


def apply_file(path: Path) -> bool:
    content = path.read_text(encoding="utf-8")
    if "<head>" not in content:
        return False

    content = REMOVE_OLD.sub("\n", content)
    if MARKER in content:
        content = re.sub(
            rf"{re.escape(MARKER)}.*?<!-- /soaeg:favicon -->",
            "",
            content,
            flags=re.S,
        )

    prefix = prefix_for(path)
    block = f"    {MARKER}\n{FAVICON_BLOCK.format(prefix=prefix)}\n    <!-- /soaeg:favicon -->"

    if 'rel="icon"' in content and MARKER not in content and "images/favicon/" in content:
        return False

    insert_after = re.search(r'(<meta\s+name="viewport"[^>]*>\s*)', content, re.I)
    if not insert_after:
        insert_after = re.search(r"(<meta\s+charset[^>]*>\s*)", content, re.I)
    if not insert_after:
        return False

    pos = insert_after.end()
    new_content = content[:pos] + block + "\n" + content[pos:]
    if new_content == content:
        return False
    path.write_text(new_content, encoding="utf-8")
    return True


def main():
    changed = 0
    for path in sorted(ROOT.rglob("*.html")):
        if not is_target(path):
            continue
        if apply_file(path):
            changed += 1
            print(path.relative_to(ROOT))
    print(f"\nUpdated {changed} HTML files")


if __name__ == "__main__":
    main()
