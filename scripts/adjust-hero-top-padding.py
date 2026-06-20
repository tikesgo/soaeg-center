"""Shift hero slide content down within 1536x1024 canvas."""
from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "images"
BACKUP = IMAGES / "backup"
TARGET_W, TARGET_H = 1536, 1024
BG = (245, 248, 255)
OFFSET_Y = 60
SCALE = 0.94


def adjust(path: Path) -> None:
    img = Image.open(path).convert("RGB")
    new_w = int(round(img.width * SCALE))
    new_h = int(round(img.height * SCALE))
    resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGB", (TARGET_W, TARGET_H), BG)
    x = (TARGET_W - new_w) // 2
    y = OFFSET_Y
    canvas.paste(resized, (x, y))
    canvas.save(path, optimize=True)

    bottom_margin = TARGET_H - (y + new_h)
    print(
        f"{path.name}: scale={SCALE}, offset_y={y}, "
        f"content={new_w}x{new_h}, bottom_margin={bottom_margin}px"
    )


def main() -> None:
    BACKUP.mkdir(parents=True, exist_ok=True)
    for name in ("hero-slide-1.png", "hero-slide-2.png"):
        src = IMAGES / name
        backup = BACKUP / name.replace(".png", "-before-top-padding.png")
        shutil.copy2(src, backup)
        adjust(src)


if __name__ == "__main__":
    main()
