"""Fill hero slides edge-to-edge on 1536x1024 (cover-style crop, no letterbox)."""
from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "images"
BACKUP = IMAGES / "backup"
TARGET_W, TARGET_H = 1536, 1024
BG = (245, 248, 255)
TOLERANCE = 18


def content_bounds(img: Image.Image) -> tuple[int, int, int, int]:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    px = rgba.load()
    min_x, min_y, max_x, max_y = w, h, 0, 0
    found = False

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 250:
                continue
            if abs(r - BG[0]) + abs(g - BG[1]) + abs(b - BG[2]) > TOLERANCE:
                found = True
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)

    if not found:
        return 0, 0, w, h
    return min_x, min_y, max_x + 1, max_y + 1


def fill_cover(path: Path, source: Path) -> None:
    img = Image.open(source).convert("RGB")
    left, top, right, bottom = content_bounds(img)
    content = img.crop((left, top, right, bottom))
    cw, ch = content.size

    scale = max(TARGET_W / cw, TARGET_H / ch)
    new_w = int(round(cw * scale))
    new_h = int(round(ch * scale))
    scaled = content.resize((new_w, new_h), Image.Resampling.LANCZOS)

    crop_x = max(0, (new_w - TARGET_W) // 2)
    crop_y = max(0, (new_h - TARGET_H) // 2)
    filled = scaled.crop((crop_x, crop_y, crop_x + TARGET_W, crop_y + TARGET_H))
    filled.save(path, optimize=True)
    print(
        f"{path.name}: source={source.name}, content={cw}x{ch}, "
        f"scale={scale:.4f}, crop_y={crop_y}px"
    )


def main() -> None:
    BACKUP.mkdir(parents=True, exist_ok=True)
    pairs = [
        ("hero-slide-1.png", "hero-slide-1-before-top-padding.png"),
        ("hero-slide-2.png", "hero-slide-2-before-top-padding.png"),
    ]
    for out_name, backup_name in pairs:
        out = IMAGES / out_name
        backup = BACKUP / backup_name
        if not backup.exists():
            backup = BACKUP / out_name.replace(".png", "-before-normalize.png")
        staged = BACKUP / out_name.replace(".png", "-before-fill.png")
        shutil.copy2(out, staged)
        fill_cover(out, backup)


if __name__ == "__main__":
    main()
