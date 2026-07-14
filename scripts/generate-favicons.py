#!/usr/bin/env python3
"""Generate favicon PNG/ICO from images/favicon/favicon-source.svg using Playwright."""
import base64
import struct
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "images" / "favicon"
SVG_PATH = OUT_DIR / "favicon-source.svg"

SIZES = [
    ("favicon-512.png", 512),
    ("favicon-192.png", 192),
    ("apple-touch-icon.png", 180),
    ("favicon-32.png", 32),
    ("favicon-16.png", 16),
]


def png_to_ico(png_paths: list[Path], out_path: Path) -> None:
    from PIL import Image

    images = [Image.open(p).convert("RGBA") for p in png_paths]
    images[0].save(
        out_path,
        format="ICO",
        sizes=[(img.width, img.height) for img in images],
        append_images=images[1:],
    )


def main() -> None:
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("Playwright not installed for Python; using node script fallback", file=sys.stderr)
        subprocess.check_call(["node", str(ROOT / "scripts" / "generate-favicons.mjs")], cwd=ROOT)
        return

    svg = SVG_PATH.read_text(encoding="utf-8")
    svg_data = "data:image/svg+xml;base64," + base64.b64encode(svg.encode("utf-8")).decode("ascii")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        for name, size in SIZES:
            page.set_viewport_size({"width": size, "height": size})
            page.set_content(
                f"""<!doctype html><html><head><style>
                html,body{{margin:0;padding:0;background:transparent}}
                img{{width:{size}px;height:{size}px;display:block}}
                </style></head><body><img src="{svg_data}" alt=""></body></html>""",
                wait_until="load",
            )
            page.locator("img").screenshot(path=str(OUT_DIR / name), omit_background=True)
            print(f"wrote {name} {size}x{size}")
        browser.close()

    from PIL import Image

    png_to_ico([OUT_DIR / "favicon-16.png", OUT_DIR / "favicon-32.png"], OUT_DIR / "favicon.ico")
    print("wrote favicon.ico")


if __name__ == "__main__":
    main()
