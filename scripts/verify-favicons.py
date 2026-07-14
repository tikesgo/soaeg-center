#!/usr/bin/env python3
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def is_page(p: Path) -> bool:
    s = str(p).replace("\\", "/")
    if "node_modules" in s or p.name == "list-card.html":
        return False
    if p.name.lower().startswith("googled") or p.name.lower().startswith("naverb"):
        return False
    return p.suffix.lower() == ".html"


def resolve_href(href: str, from_file: Path) -> Path:
    return (from_file.parent / href).resolve()


pages = [p for p in ROOT.rglob("*.html") if is_page(p)]
missing_favicon = []
broken = []
icon_count = 0

for p in pages:
    c = p.read_text(encoding="utf-8")
    icons = re.findall(r'<link\s+[^>]*rel=["\'](?:icon|apple-touch-icon)["\'][^>]*>', c, re.I)
    if len(icons) < 6:
        missing_favicon.append((str(p.relative_to(ROOT)), len(icons)))
    icon_count += len(icons)
    for m in re.finditer(r'href=["\']([^"\']*images/favicon/[^"\']+)["\']', c):
        target = resolve_href(m.group(1), p)
        if not target.exists():
            broken.append((str(p.relative_to(ROOT)), m.group(1)))

required = [
    "favicon.ico",
    "favicon-512.png",
    "favicon-192.png",
    "favicon-32.png",
    "favicon-16.png",
    "apple-touch-icon.png",
]
for name in required:
    fp = ROOT / "images" / "favicon" / name
    print(f"asset {name}: {'OK' if fp.exists() else 'MISSING'} ({fp.stat().st_size if fp.exists() else 0} bytes)")

print(f"\nHTML pages: {len(pages)}")
print(f"Pages with <6 icon links: {len(missing_favicon)}")
for x in missing_favicon[:5]:
    print(" ", x)
print(f"Broken favicon hrefs: {len(broken)}")
for x in broken[:10]:
    print(" ", x)
print(f"Total icon link tags: {icon_count}")
