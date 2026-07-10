#!/usr/bin/env python3
"""Insert Channel Talk scripts before main.js on all site HTML pages."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP_NAMES = {
    "googled61fab189a7245f7.html",
    "naverb40d5257ed7fb03bad8a1cc6b5bde8e6.html",
    "list-card.html",
}

CHANNEL_SCRIPTS = """    <script src="{prefix}channel-config.js" defer></script>
    <script src="{prefix}channel-talk-loader.js" defer></script>
"""

INLINE_LOADER_START = '    <script>\n      (function () {\n        var w = window;\n        if (w.ChannelIO) {'
INLINE_LOADER_END = "    </script>\n    <script src=\"js/main.js\" defer></script>"


def js_prefix(html_path: Path) -> str:
    depth = len(html_path.relative_to(ROOT).parts) - 1
    return ("../" * depth) + "js/"


def should_skip(path: Path) -> bool:
    parts = path.parts
    if "node_modules" in parts or ".git" in parts:
        return True
    return path.name in SKIP_NAMES or "_template" in parts


def patch_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "channel-talk-loader.js" in text:
        return False

    prefix = js_prefix(path)

    if path.name == "index.html" and path.parent == ROOT:
        if INLINE_LOADER_START in text and INLINE_LOADER_END in text:
            start = text.index(INLINE_LOADER_START)
            end = text.index(INLINE_LOADER_END) + len(INLINE_LOADER_END)
            replacement = (
                f'    <script src="js/channel-talk-loader.js" defer></script>\n'
                f'    <script src="js/main.js" defer></script>'
            )
            text = text[:start] + replacement + text[end:]
            path.write_text(text, encoding="utf-8", newline="\n")
            return True

    marker = '<script src="'
    needle = f'{prefix}main.js"'
    idx = text.rfind(needle)
    if idx == -1:
        raise ValueError(f"main.js script not found in {path}")

    insert_at = text.rfind(marker, 0, idx)
    if insert_at == -1:
        raise ValueError(f"Could not locate insertion point in {path}")

    text = text[:insert_at] + CHANNEL_SCRIPTS.format(prefix=prefix) + text[insert_at:]
    path.write_text(text, encoding="utf-8", newline="\n")
    return True


def main() -> None:
    changed = []
    for path in sorted(ROOT.rglob("*.html")):
        if should_skip(path):
            continue
        if patch_file(path):
            changed.append(path.relative_to(ROOT).as_posix())

    print(f"Updated {len(changed)} files:")
    for name in changed:
        print(name)


if __name__ == "__main__":
    main()
