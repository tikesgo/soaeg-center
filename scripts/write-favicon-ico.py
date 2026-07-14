#!/usr/bin/env python3
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "images" / "favicon"
images = [Image.open(OUT / "favicon-16.png").convert("RGBA"), Image.open(OUT / "favicon-32.png").convert("RGBA")]
images[0].save(
    OUT / "favicon.ico",
    format="ICO",
    sizes=[(img.width, img.height) for img in images],
    append_images=images[1:],
)
print("wrote favicon.ico")
