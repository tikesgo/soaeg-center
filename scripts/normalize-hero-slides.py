"""Analyze and normalize hero slides to 1536x1024."""
from __future__ import annotations

import shutil
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
IMAGES = ROOT / "images"
BACKUP = IMAGES / "backup"
TARGET_W, TARGET_H = 1536, 1024
BG_SAMPLE = (245, 248, 255)
TOLERANCE = 18


def load_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def content_bounds(img: Image.Image) -> dict:
    rgba = img.convert("RGBA")
    w, h = rgba.size
    pixels = rgba.load()

    min_x, min_y = w, h
    max_x, max_y = 0, 0
    found = False

    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a < 250:
                continue
            diff = abs(r - BG_SAMPLE[0]) + abs(g - BG_SAMPLE[1]) + abs(b - BG_SAMPLE[2])
            if diff > TOLERANCE:
                found = True
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)

    if not found:
        return {
            "left": 0,
            "top": 0,
            "right": w,
            "bottom": h,
            "content_width": w,
            "content_height": h,
            "top_margin": 0,
            "bottom_margin": 0,
            "left_margin": 0,
            "right_margin": 0,
            "image_width": w,
            "image_height": h,
        }

    left, top = min_x, min_y
    right, bottom = max_x + 1, max_y + 1
    return {
        "left": left,
        "top": top,
        "right": right,
        "bottom": bottom,
        "content_width": right - left,
        "content_height": bottom - top,
        "top_margin": top,
        "bottom_margin": h - bottom,
        "left_margin": left,
        "right_margin": w - right,
        "image_width": w,
        "image_height": h,
    }


def report(path: Path) -> dict:
    img = load_rgba(path)
    w, h = img.size
    b = content_bounds(img)
    return {
        "file": path.name,
        "width": w,
        "height": h,
        "aspect_ratio": round(w / h, 4),
        "top_margin_px": b["top_margin"],
        "bottom_margin_px": b["bottom_margin"],
        "left_margin_px": b["left_margin"],
        "right_margin_px": b["right_margin"],
        "content_box": {
            "top": b["top"],
            "bottom": b["bottom"],
            "left": b["left"],
            "right": b["right"],
            "width": b["content_width"],
            "height": b["content_height"],
        },
    }


def normalize(img: Image.Image, content_pad: int = 24) -> Image.Image:
    b = content_bounds(img)
    cropped = img.crop((b["left"], b["top"], b["right"], b["bottom"]))
    cw, ch = cropped.size

    inner_w = TARGET_W - content_pad * 2
    inner_h = TARGET_H - content_pad * 2
    scale = min(inner_w / cw, inner_h / ch)
    new_w = max(1, int(round(cw * scale)))
    new_h = max(1, int(round(ch * scale)))

    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (*BG_SAMPLE, 255))
    x = (TARGET_W - new_w) // 2
    y = (TARGET_H - new_h) // 2
    canvas.paste(resized, (x, y), resized)
    return canvas.convert("RGB")


def main() -> None:
    BACKUP.mkdir(parents=True, exist_ok=True)

    slides = ["hero-slide-1.png", "hero-slide-2.png"]
    reports = []

    for name in slides:
        src = IMAGES / name
        backup = BACKUP / name.replace(".png", "-before-normalize.png")
        shutil.copy2(src, backup)

        info = report(src)
        reports.append(info)
        print(f"=== {name} (original) ===")
        for k, v in info.items():
            print(f"  {k}: {v}")

        out = normalize(load_rgba(src))
        out.save(src, optimize=True)
        print(f"  -> normalized: {out.size[0]}x{out.size[1]}")

    print("\n=== Summary ===")
    for r in reports:
        print(
            f"{r['file']}: {r['width']}x{r['height']} ({r['aspect_ratio']}) "
            f"top={r['top_margin_px']}px bottom={r['bottom_margin_px']}px"
        )
    print(f"Output: {TARGET_W}x{TARGET_H} for both")


if __name__ == "__main__":
    main()
