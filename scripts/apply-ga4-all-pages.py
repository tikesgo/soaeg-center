#!/usr/bin/env python3
"""Insert Google Analytics 4 gtag snippet into <head> on all site HTML pages."""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MEASUREMENT_ID = "G-V1SHB55W4C"
SKIP_NAMES = {
    "googled61fab189a7245f7.html",
    "naverb40d5257ed7fb03bad8a1cc6b5bde8e6.html",
    "list-card.html",
}

GA_SNIPPET = f"""    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id={MEASUREMENT_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){{dataLayer.push(arguments);}}
      gtag('js', new Date());

      gtag('config', '{MEASUREMENT_ID}');
    </script>
"""

VIEWPORT_LINE = '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />'


def should_skip(path: Path) -> bool:
    parts = path.parts
    if "node_modules" in parts or ".git" in parts:
        return True
    return path.name in SKIP_NAMES


def patch_file(path: Path) -> str:
    text = path.read_text(encoding="utf-8")

    if MEASUREMENT_ID in text:
        return "skipped"

    if VIEWPORT_LINE not in text:
        raise ValueError(f"viewport meta not found in {path}")

    text = text.replace(VIEWPORT_LINE, VIEWPORT_LINE + "\n" + GA_SNIPPET, 1)
    path.write_text(text, encoding="utf-8", newline="\n")
    return "updated"


def main() -> None:
    updated = []
    skipped = []

    for path in sorted(ROOT.rglob("*.html")):
        if should_skip(path):
            continue

        result = patch_file(path)
        rel = path.relative_to(ROOT).as_posix()
        if result == "updated":
            updated.append(rel)
        else:
            skipped.append(rel)

    print(f"Updated {len(updated)} files")
    print(f"Skipped {len(skipped)} files (already present)")


if __name__ == "__main__":
    main()
