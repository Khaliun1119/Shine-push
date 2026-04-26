"""
Dataset builder — real image-based training data generator.

Pipeline:
  1. Scan an image directory (e.g. UTKFace, Fitzpatrick17k)
  2. For each image: detect face → extract skin / hair / eye RGB
  3. Auto-label using the rule-based SkinClassifier (pseudo-labeling)
  4. Save labeled rows to a CSV file for ML training

Usage (command line):
    python dataset_builder.py --images /path/to/images --output dataset.csv

Supported datasets (download separately):
  - UTKFace   : https://www.kaggle.com/datasets/jangedoo/utkface-new
  - Fitzpatrick17k : https://github.com/mattgroh/fitzpatrick17k
  - Chicago Face DB: https://chicagofaces.org/
  - Any folder of JPEG/PNG face photos

CSV columns produced:
  skin_r, skin_g, skin_b,
  hair_r, hair_g, hair_b,
  eye_r,  eye_g,  eye_b,
  skin_hex, hair_hex, eye_hex,
  fitzpatrick, undertone, depth, season
"""

import os
import sys
import csv
import argparse
import cv2
import numpy as np
from typing import Optional

# Allow running from the analyzer directory directly
sys.path.insert(0, os.path.dirname(__file__))

from face_detector import FaceDetector
from skin_classifier import SkinClassifier

# ---------------------------------------------------------------------------
# Supported image extensions
# ---------------------------------------------------------------------------
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

# Minimum number of skin pixels required to trust the extraction
MIN_SKIN_PIXELS = 50


def _is_valid_color(rgb: list) -> bool:
    """Return True if the RGB value is non-zero and not pure black/white noise."""
    r, g, b = rgb
    luminance = 0.299 * r + 0.587 * g + 0.114 * b
    return luminance > 15 and luminance < 245 and not (r == 0 and g == 0 and b == 0)


def _rgb_to_hex(rgb: list) -> str:
    r, g, b = int(rgb[0]), int(rgb[1]), int(rgb[2])
    return f"#{r:02x}{g:02x}{b:02x}"


def process_image(
    image_path: str,
    detector: FaceDetector,
    classifier: SkinClassifier,
) -> Optional[dict]:
    """
    Process a single image file.

    Returns a labeled data row dict, or None if face detection failed.
    """
    bgr = cv2.imread(image_path)
    if bgr is None:
        return None

    # Resize large images to speed up processing (max 640px wide)
    h, w = bgr.shape[:2]
    if w > 640:
        scale = 640 / w
        bgr = cv2.resize(bgr, (640, int(h * scale)))

    result = detector.detect_and_extract(bgr)
    if result is None:
        return None

    if result.get("num_samples", 0) < MIN_SKIN_PIXELS:
        return None

    skin_rgb = result["skin_rgb"]
    hair_rgb = result.get("hair_rgb", [0, 0, 0])
    eye_rgb  = result.get("eye_rgb",  [0, 0, 0])

    if not _is_valid_color(skin_rgb):
        return None

    # Auto-label with the rule-based classifier
    classification = classifier.classify(skin_rgb)

    return {
        "skin_r": skin_rgb[0],
        "skin_g": skin_rgb[1],
        "skin_b": skin_rgb[2],
        "hair_r": hair_rgb[0],
        "hair_g": hair_rgb[1],
        "hair_b": hair_rgb[2],
        "eye_r":  eye_rgb[0],
        "eye_g":  eye_rgb[1],
        "eye_b":  eye_rgb[2],
        "skin_hex": _rgb_to_hex(skin_rgb),
        "hair_hex": _rgb_to_hex(hair_rgb) if _is_valid_color(hair_rgb) else "",
        "eye_hex":  _rgb_to_hex(eye_rgb)  if _is_valid_color(eye_rgb)  else "",
        "fitzpatrick": classification["fitzpatrick"]["type"],
        "undertone":   classification["undertone"]["type"],
        "depth":       classification["depth"],
        "season":      classification["season"]["sub_season"],
    }


def build_dataset(
    image_dir: str,
    output_csv: str,
    max_images: int = 0,
    verbose: bool = True,
) -> int:
    """
    Process all images in image_dir and write labeled CSV to output_csv.

    Args:
        image_dir:  Path to folder containing face images.
        output_csv: Path for the output CSV file.
        max_images: Stop after this many images (0 = no limit).
        verbose:    Print progress.

    Returns:
        Number of successfully processed samples.
    """
    detector   = FaceDetector()
    classifier = SkinClassifier()

    # Collect image paths (recursive)
    image_paths = []
    for root, _, files in os.walk(image_dir):
        for fname in files:
            if os.path.splitext(fname)[1].lower() in IMAGE_EXTS:
                image_paths.append(os.path.join(root, fname))

    if not image_paths:
        print(f"[dataset_builder] No images found in: {image_dir}")
        return 0

    if max_images > 0:
        image_paths = image_paths[:max_images]

    if verbose:
        print(f"[dataset_builder] Found {len(image_paths)} images in {image_dir}")

    FIELDNAMES = [
        "skin_r", "skin_g", "skin_b",
        "hair_r", "hair_g", "hair_b",
        "eye_r",  "eye_g",  "eye_b",
        "skin_hex", "hair_hex", "eye_hex",
        "fitzpatrick", "undertone", "depth", "season",
    ]

    processed = 0
    failed    = 0

    with open(output_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()

        for i, path in enumerate(image_paths):
            row = process_image(path, detector, classifier)
            if row is not None:
                writer.writerow(row)
                processed += 1
            else:
                failed += 1

            if verbose and (i + 1) % 100 == 0:
                print(
                    f"  [{i+1}/{len(image_paths)}] "
                    f"success={processed}  failed={failed}"
                )

    if verbose:
        print(f"\n[dataset_builder] Done.")
        print(f"  Total processed : {processed}")
        print(f"  Failed/skipped  : {failed}")
        print(f"  Output CSV      : {output_csv}")
        _print_season_distribution(output_csv)

    return processed


def _print_season_distribution(csv_path: str):
    """Print how many samples per season are in the CSV."""
    from collections import Counter
    counts = Counter()
    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            counts[row["season"]] += 1
    print("\n  Season distribution:")
    for season, n in sorted(counts.items()):
        print(f"    {season:<20} {n:>5}")


# ---------------------------------------------------------------------------
# Command-line entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Build a skin-tone training dataset from face images."
    )
    parser.add_argument(
        "--images", required=True,
        help="Path to folder containing face images (JPEG/PNG).",
    )
    parser.add_argument(
        "--output", default="dataset.csv",
        help="Output CSV file path (default: dataset.csv).",
    )
    parser.add_argument(
        "--max", type=int, default=0,
        help="Maximum number of images to process (0 = all).",
    )
    args = parser.parse_args()

    build_dataset(
        image_dir=args.images,
        output_csv=args.output,
        max_images=args.max,
    )
