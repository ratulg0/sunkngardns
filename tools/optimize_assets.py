#!/usr/bin/env python3
"""Generate optimized derivatives for the static SUNKNGARDNS site.

Original artwork is never overwritten. All browser-facing derivatives are placed
under assets/optimized/ and regenerated deterministically from assets/.
"""
from pathlib import Path
import re

from PIL import Image, ImageChops, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
OUT = ASSETS / "optimized"
OUT.mkdir(parents=True, exist_ok=True)
RESAMPLE = Image.Resampling.LANCZOS


def open_copy(path: Path) -> Image.Image:
    with Image.open(path) as source:
        return ImageOps.exif_transpose(source).copy()


def save_webp(image: Image.Image, name: str, quality: int = 84, lossless: bool = False) -> Path:
    path = OUT / name
    path.parent.mkdir(parents=True, exist_ok=True)
    if image.mode not in ("RGB", "RGBA"):
        image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
    image.save(
        path,
        "WEBP",
        quality=quality,
        method=6,
        lossless=lossless,
        exact=True,
    )
    print(f"{path.relative_to(ROOT)}: {path.stat().st_size / 1024:.1f} KB")
    return path


def resized(source_name: str, width: int) -> Image.Image:
    image = open_copy(ASSETS / source_name)
    if "A" in image.getbands():
        image = image.convert("RGBA")
    else:
        image = image.convert("RGB")
    if image.width > width:
        height = max(1, round(image.height * width / image.width))
        image = image.resize((width, height), RESAMPLE)
    return image


def save_variant(source_name: str, output_name: str, width: int, quality: int = 84) -> None:
    save_webp(resized(source_name, width), output_name, quality=quality)


def save_video_poster(source_name: str, output_name: str, width: int, quality: int = 83) -> None:
    image = open_copy(ASSETS / source_name)
    height = round(width * 9 / 16)
    image = ImageOps.fit(image, (width, height), method=RESAMPLE, centering=(0.5, 0.5))
    save_webp(image.convert("RGB"), output_name, quality=quality)


def make_wordmark() -> tuple[int, int]:
    image = open_copy(ASSETS / "Gemini_Generated_Image_gadfxbgadfxbgadf.png").convert("RGBA")
    luminance = ImageOps.grayscale(image)
    ink = luminance.point(lambda value: 255 if value < 72 else 0)
    bounds = ink.getbbox()
    if not bounds:
        raise RuntimeError("Could not find the black wordmark in its source image.")

    left, top, right, bottom = bounds
    padding = 8
    bounds = (
        max(0, left - padding),
        max(0, top - padding),
        min(image.width, right + padding),
        min(image.height, bottom + padding),
    )
    crop = image.crop(bounds)
    gray = ImageOps.grayscale(crop)
    alpha_from_luminance = gray.point(
        lambda value: max(0, min(255, round(((190 - value) / 190) * 255)))
    )
    alpha = ImageChops.darker(crop.getchannel("A"), alpha_from_luminance)
    cleaned = Image.new("RGBA", crop.size, (0, 0, 0, 0))
    cleaned.putalpha(alpha)
    output_width = 800
    output_height = max(1, round(cleaned.height * output_width / cleaned.width))
    cleaned = cleaned.resize((output_width, output_height), RESAMPLE)
    save_webp(cleaned, "brand-wordmark.webp", quality=100, lossless=True)

    index_path = ROOT / "index.html"
    markup = index_path.read_text(encoding="utf-8")
    markup, count = re.subn(
        r'(<img class="brand-english" id="english-wordmark" src="assets/optimized/brand-wordmark\.webp" alt="sunkngardns" width="800" height=")\d+(")',
        rf'\g<1>{output_height}\g<2>',
        markup,
        count=1,
    )
    if count != 1:
        raise RuntimeError("Could not set the optimized wordmark's intrinsic height in index.html.")
    index_path.write_text(markup, encoding="utf-8")
    print(f"Wordmark dimensions: {output_width} × {output_height}")
    return output_width, output_height


def save_logo_png(source_name: str, output_name: str, size: int) -> None:
    logo = open_copy(ASSETS / source_name).convert("RGBA")
    fitted = ImageOps.contain(logo, (size, size), method=RESAMPLE)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    canvas.alpha_composite(fitted, ((size - fitted.width) // 2, (size - fitted.height) // 2))
    path = OUT / output_name
    canvas.save(path, "PNG", optimize=True)
    print(f"{path.relative_to(ROOT)}: {path.stat().st_size / 1024:.1f} KB")


def main() -> None:
    make_wordmark()

    save_variant("logo_sunkngardns.png", "band-logo.webp", 512, 90)
    save_variant("Frame_137-1_transparent.png", "hindi-wordmark.webp", 1200, 90)
    save_variant("Ink Tree Cluster on Transparent Background.png", "tree-cluster.webp", 1448, 89)
    save_variant("Hot Pink Brushstroke Bird Flock.png", "bird-flock.webp", 900, 89)
    save_variant("art_spotify.jpg", "about-art.webp", 1000, 82)

    save_variant("1000114676.jpeg", "latife-cover-640.webp", 640, 82)
    save_variant("1000114676.jpeg", "latife-cover-960.webp", 960, 82)

    save_video_poster("coverart_rukhsar.png", "video-rukhsar-640.webp", 640)
    save_video_poster("coverart_rukhsar.png", "video-rukhsar-960.webp", 960)
    save_video_poster("coverart_sarhadein.jpg", "video-sarhadein-640.webp", 640)
    save_video_poster("coverart_sarhadein.jpg", "video-sarhadein-960.webp", 960)

    save_variant("donkey_transparent.png", "donkey-320.webp", 320, 88)
    save_variant("donkey_transparent.png", "donkey-640.webp", 640, 88)

    save_logo_png("logo_sunkngardns.png", "favicon-64.png", 64)
    save_logo_png("logo_sunkngardns.png", "apple-touch-icon.png", 180)


if __name__ == "__main__":
    main()
