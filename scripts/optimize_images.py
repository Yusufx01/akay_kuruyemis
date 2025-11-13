#!/usr/bin/env python3
"""
Optimize images in the images/ folder and emit resized WebP and JPEG versions.
Usage: python scripts/optimize_images.py
Requires: Pillow (pip install pillow)
"""
from PIL import Image
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / 'images'
OUT = SRC / 'optimized'
OUT.mkdir(exist_ok=True)

SIZES = [1600, 1200, 800, 480]

def process(imgp: Path):
    try:
        im = Image.open(imgp)
        im = im.convert('RGB')
        name = imgp.stem
        for w in SIZES:
            ratio = w / im.width
            h = int(im.height * ratio)
            outp = OUT / f"{name}-{w}.webp"
            im.resize((w,h), Image.LANCZOS).save(outp, 'WEBP', quality=85, method=6)
        # also write a medium jpeg fallback
        outp_jpeg = OUT / f"{name}-800.jpg"
        im.resize((800, int(im.height * (800/im.width))), Image.LANCZOS).save(outp_jpeg, 'JPEG', quality=82)
        print(f"Optimized {imgp.name}")
    except Exception as e:
        print(f"Failed {imgp}: {e}")

def main():
    for p in SRC.glob('*.*'):
        if p.suffix.lower() in ('.jpg', '.jpeg', '.png'):
            process(p)

if __name__ == '__main__':
    main()
