"""
Skin tone classification module.

Classifies skin color using scientifically validated methods:
- CIE LAB color space analysis
- Individual Typology Angle (ITA) — Chardon et al., 1991
- Fitzpatrick Scale mapping (I-VI)
- Seasonal color analysis (12-season model)
- Warm/Cool/Neutral undertone detection
- Detailed skin tone naming (21 descriptive names)
"""

import math
import numpy as np
from typing import Tuple


# ITA thresholds for Fitzpatrick classification (Chardon et al., 1991)
FITZPATRICK_THRESHOLDS = [
    (55, "I", "Very Light", "Burns easily, rarely tans"),
    (41, "II", "Light", "Burns easily, tans minimally"),
    (28, "III", "Intermediate", "Burns moderately, tans gradually"),
    (10, "IV", "Tan", "Burns minimally, tans well"),
    (-30, "V", "Brown", "Rarely burns, tans profusely"),
    (float("-inf"), "VI", "Dark", "Never burns, deeply pigmented"),
]

# Detailed skin tone names: (depth_key, undertone) -> (name, description)
TONE_NAMES = {
    ("very_light", "warm"): ("Porcelain Warm", "Very fair skin with golden or peachy undertones"),
    ("very_light", "cool"): ("Porcelain Cool", "Very fair skin with pink or rosy undertones"),
    ("very_light", "neutral"): ("Porcelain", "Very fair skin with balanced undertones"),
    ("light", "warm"): ("Ivory", "Light skin with warm, yellow-golden undertones"),
    ("light", "cool"): ("Rose Beige", "Light skin with pink, rosy undertones"),
    ("light", "neutral"): ("Light Beige", "Light skin with balanced, subtle undertones"),
    ("light_medium", "warm"): ("Peach", "Light-medium skin with warm, peachy glow"),
    ("light_medium", "cool"): ("Cool Sand", "Light-medium skin with cool, pinkish cast"),
    ("light_medium", "neutral"): ("Natural Beige", "Light-medium skin with neutral undertones"),
    ("medium", "warm"): ("Honey", "Medium skin with warm, golden-yellow undertones"),
    ("medium", "cool"): ("Rose Tan", "Medium skin with cool, rosy-pink undertones"),
    ("medium", "neutral"): ("Sand", "Medium skin with balanced, olive-neutral undertones"),
    ("medium_deep", "warm"): ("Caramel", "Medium-deep skin with rich, warm golden tones"),
    ("medium_deep", "cool"): ("Toffee", "Medium-deep skin with cool, reddish-brown tones"),
    ("medium_deep", "neutral"): ("Warm Tan", "Medium-deep skin with balanced warm-neutral tones"),
    ("deep", "warm"): ("Chestnut", "Deep skin with warm, reddish-golden undertones"),
    ("deep", "cool"): ("Mahogany", "Deep skin with cool, blue-red undertones"),
    ("deep", "neutral"): ("Cocoa", "Deep skin with balanced, rich undertones"),
    ("very_deep", "warm"): ("Espresso", "Very deep skin with warm, bronze undertones"),
    ("very_deep", "cool"): ("Ebony", "Very deep skin with cool, blue-black undertones"),
    ("very_deep", "neutral"): ("Dark Cocoa", "Very deep skin with neutral, deep brown tones"),
}

# 12-season color type definitions
SEASON_TYPES = {
    "Light Spring": {
        "description": "Your coloring is delicate and warm with a sun-kissed glow. "
        "You look best in light, warm, and clear colors that echo your natural radiance. "
        "Think of a bright spring morning with soft golden sunlight.",
        "characteristics": "Light overall appearance with warm undertones. Low to medium contrast between skin, hair, and eyes.",
    },
    "Warm Spring": {
        "description": "Your coloring is rich and golden with noticeable warmth. "
        "You shine in warm, saturated colors that complement your golden undertones. "
        "Your palette is inspired by tropical warmth and sunlit meadows.",
        "characteristics": "Medium depth with strong warm undertones. Golden or peachy complexion with warm eyes.",
    },
    "Clear Spring": {
        "description": "Your coloring combines warmth with striking clarity and contrast. "
        "Bright, clear, warm colors bring out your natural vibrancy. "
        "You can wear bolder colors that would overpower softer types.",
        "characteristics": "Medium to high contrast with warm undertones. Bright, clear complexion with vivid eye color.",
    },
    "Light Summer": {
        "description": "Your coloring is soft and cool with a gentle luminosity. "
        "Muted, cool, and light colors harmonize beautifully with your delicate tones. "
        "Think of a hazy summer sky with soft pastel clouds.",
        "characteristics": "Light overall appearance with cool undertones. Soft, low contrast between features.",
    },
    "Cool Summer": {
        "description": "Your coloring is distinctly cool with a rosy or bluish cast. "
        "True cool colors with medium depth bring out your natural elegance. "
        "Your palette draws from cool ocean waters and twilight skies.",
        "characteristics": "Medium depth with obvious cool undertones. Pink or rosy complexion with blue or gray-toned eyes.",
    },
    "Soft Summer": {
        "description": "Your coloring is muted and gently cool, without sharp contrasts. "
        "Soft, dusty, and slightly cool colors create a harmonious look. "
        "Your palette is like a watercolor painting — blended and gentle.",
        "characteristics": "Medium depth, low contrast, slightly cool. Muted, soft appearance with ash-toned features.",
    },
    "Soft Autumn": {
        "description": "Your coloring is warm but muted, like a hazy autumn day. "
        "Earthy, soft, and warm colors complement your understated warmth. "
        "Think of sun-faded terracotta and dried wildflowers.",
        "characteristics": "Medium depth, low contrast, warm and muted. Soft golden tones with hazel or warm-toned eyes.",
    },
    "Warm Autumn": {
        "description": "Your coloring is rich and deeply warm, like autumn foliage. "
        "Deep warm colors and earth tones highlight your natural warmth. "
        "Your palette is inspired by harvest fields and amber sunsets.",
        "characteristics": "Medium to deep with strong warm undertones. Rich, golden complexion with warm brown or hazel eyes.",
    },
    "Deep Autumn": {
        "description": "Your coloring combines depth with warmth and richness. "
        "Deep, warm, saturated colors complement your striking appearance. "
        "Think of rich mahogany wood and burnished gold.",
        "characteristics": "Deep overall appearance with warm undertones. High contrast with rich, warm coloring.",
    },
    "Deep Winter": {
        "description": "Your coloring is deep and cool with dramatic contrast. "
        "Bold, deep, cool colors enhance your powerful natural contrast. "
        "Your palette is like a starlit winter night — deep and striking.",
        "characteristics": "Deep overall appearance with cool undertones. High contrast between dark hair and lighter skin.",
    },
    "Cool Winter": {
        "description": "Your coloring is distinctly cool with icy clarity. "
        "Pure cool colors and sharp contrasts mirror your striking coloring. "
        "Think of crisp winter air and frost-covered landscapes.",
        "characteristics": "Medium to deep with strong cool undertones. Clear, icy appearance with blue or gray eyes.",
    },
    "Clear Winter": {
        "description": "Your coloring has brilliant contrast and cool clarity. "
        "Vivid, clear, and cool colors match your high-contrast natural palette. "
        "You wear pure, saturated colors that others cannot carry.",
        "characteristics": "High contrast with cool undertones. Bright, clear complexion with striking eye color.",
    },
}


class SkinClassifier:
    """Classifies skin tone and determines seasonal color type."""

    def classify(self, skin_rgb: list) -> dict:
        """
        Perform full skin tone classification.

        Args:
            skin_rgb: [R, G, B] values of detected skin color.

        Returns:
            Complete classification result dictionary.
        """
        r, g, b = skin_rgb

        # Convert to CIE LAB color space
        lab_l, lab_a, lab_b = self._rgb_to_lab(r, g, b)

        # Calculate ITA (Individual Typology Angle)
        ita = self._calculate_ita(lab_l, lab_b)

        # Fitzpatrick classification
        fitzpatrick = self._classify_fitzpatrick(ita)

        # Undertone detection
        undertone, undertone_score = self._detect_undertone(lab_a, lab_b, r, g, b)

        # Seasonal color type
        season, sub_season = self._determine_season(lab_l, lab_a, lab_b, ita, undertone)

        # Detailed skin tone name
        tone_name, tone_description = self._get_tone_name(lab_l, undertone)

        # Depth category for extra recommendations
        depth = self._get_depth(lab_l)

        season_info = SEASON_TYPES.get(sub_season, {})

        return {
            "skin_color": {
                "rgb": skin_rgb,
                "hex": f"#{r:02x}{g:02x}{b:02x}",
                "lab": {"L": round(lab_l, 2), "a": round(lab_a, 2), "b": round(lab_b, 2)},
            },
            "ita_angle": round(ita, 2),
            "fitzpatrick": {
                "type": fitzpatrick["type"],
                "label": fitzpatrick["label"],
                "description": fitzpatrick["description"],
            },
            "undertone": {
                "type": undertone,
                "score": round(undertone_score, 2),
                "description": self._get_undertone_description(undertone),
            },
            "tone_name": tone_name,
            "tone_description": tone_description,
            "depth": depth,
            "season": {
                "primary": season,
                "sub_season": sub_season,
                "description": season_info.get("description", ""),
                "characteristics": season_info.get("characteristics", ""),
            },
        }

    @staticmethod
    def _rgb_to_lab(r: int, g: int, b: int) -> Tuple[float, float, float]:
        """Convert RGB to CIE LAB color space via XYZ."""
        rgb = np.array([r, g, b]) / 255.0

        linear = np.where(
            rgb > 0.04045,
            ((rgb + 0.055) / 1.055) ** 2.4,
            rgb / 12.92,
        )

        matrix = np.array([
            [0.4124564, 0.3575761, 0.1804375],
            [0.2126729, 0.7151522, 0.0721750],
            [0.0193339, 0.1191920, 0.9503041],
        ])
        xyz = matrix @ linear

        xyz_ref = np.array([0.95047, 1.0, 1.08883])
        xyz_norm = xyz / xyz_ref

        epsilon = 0.008856
        kappa = 903.3

        f = np.where(
            xyz_norm > epsilon,
            np.cbrt(xyz_norm),
            (kappa * xyz_norm + 16) / 116,
        )

        lab_l = 116 * f[1] - 16
        lab_a = 500 * (f[0] - f[1])
        lab_b = 200 * (f[1] - f[2])

        return float(lab_l), float(lab_a), float(lab_b)

    @staticmethod
    def _calculate_ita(lab_l: float, lab_b: float) -> float:
        """
        Calculate Individual Typology Angle (ITA).
        Reference: Chardon, Cretois & Hourseau, 1991
        """
        if abs(lab_b) < 0.001:
            lab_b = 0.001
        ita = math.atan2(lab_l - 50, lab_b) * (180 / math.pi)
        return ita

    @staticmethod
    def _classify_fitzpatrick(ita: float) -> dict:
        """Classify skin type on the Fitzpatrick Scale based on ITA."""
        for threshold, ftype, label, desc in FITZPATRICK_THRESHOLDS:
            if ita > threshold:
                return {"type": ftype, "label": label, "description": desc}
        return {
            "type": "VI",
            "label": "Dark",
            "description": "Never burns, deeply pigmented",
        }

    @staticmethod
    def _detect_undertone(
        lab_a: float, lab_b: float, r: int, g: int, b: int
    ) -> Tuple[str, float]:
        """
        Detect skin undertone (warm, cool, or neutral).
        """
        warmth_score = lab_b - lab_a * 0.5

        if r > 0 and g > 0:
            rg_ratio = r / g
            gb_ratio = g / max(b, 1)
            rgb_warmth = (rg_ratio * 0.4 + gb_ratio * 0.3) - 1.0
        else:
            rgb_warmth = 0

        combined = warmth_score * 0.7 + rgb_warmth * 10 * 0.3

        if combined > 5:
            return "warm", combined
        elif combined < -2:
            return "cool", combined
        else:
            return "neutral", combined

    @staticmethod
    def _get_undertone_description(undertone: str) -> str:
        """Return detailed description for the undertone type."""
        descriptions = {
            "warm": "Your skin has golden, yellow, or peachy undertones. "
                    "Veins on your wrist appear greenish. Gold jewelry naturally "
                    "complements your skin.",
            "cool": "Your skin has pink, red, or bluish undertones. "
                    "Veins on your wrist appear blue or purple. Silver jewelry "
                    "naturally complements your skin.",
            "neutral": "Your skin has a balanced mix of warm and cool undertones. "
                       "Veins on your wrist appear blue-green. Both gold and silver "
                       "jewelry look good on you.",
        }
        return descriptions.get(undertone, "")

    def _determine_season(
        self,
        lab_l: float,
        lab_a: float,
        lab_b: float,
        ita: float,
        undertone: str,
    ) -> Tuple[str, str]:
        """
        Determine seasonal color type using the 12-season model.
        """
        is_light = ita > 35
        is_deep = ita < 15

        chroma = math.sqrt(lab_a ** 2 + lab_b ** 2)
        is_clear = chroma > 22
        is_muted = chroma < 16

        if undertone == "warm":
            primary = "Spring" if is_light else "Autumn"

            if primary == "Spring":
                if is_light and is_muted:
                    sub = "Light Spring"
                elif is_clear:
                    sub = "Clear Spring"
                else:
                    sub = "Warm Spring"
            else:
                if is_deep:
                    sub = "Deep Autumn"
                elif is_muted:
                    sub = "Soft Autumn"
                else:
                    sub = "Warm Autumn"

        elif undertone == "cool":
            primary = "Summer" if is_light else "Winter"

            if primary == "Summer":
                if is_light and is_muted:
                    sub = "Light Summer"
                elif is_muted:
                    sub = "Soft Summer"
                else:
                    sub = "Cool Summer"
            else:
                if is_deep:
                    sub = "Deep Winter"
                elif is_clear:
                    sub = "Clear Winter"
                else:
                    sub = "Cool Winter"

        else:
            if is_light:
                if lab_b > lab_a:
                    primary = "Spring"
                    sub = "Light Spring"
                else:
                    primary = "Summer"
                    sub = "Light Summer"
            elif is_deep:
                if lab_b > lab_a:
                    primary = "Autumn"
                    sub = "Deep Autumn"
                else:
                    primary = "Winter"
                    sub = "Deep Winter"
            else:
                if lab_b > lab_a:
                    primary = "Autumn"
                    sub = "Soft Autumn"
                else:
                    primary = "Summer"
                    sub = "Soft Summer"

        return primary, sub

    @staticmethod
    def _get_depth(lab_l: float) -> str:
        """Get skin depth category."""
        if lab_l > 75:
            return "very_light"
        elif lab_l > 65:
            return "light"
        elif lab_l > 55:
            return "light_medium"
        elif lab_l > 45:
            return "medium"
        elif lab_l > 35:
            return "medium_deep"
        elif lab_l > 25:
            return "deep"
        else:
            return "very_deep"

    @staticmethod
    def _get_tone_name(lab_l: float, undertone: str) -> Tuple[str, str]:
        """Generate a detailed descriptive name for the skin tone."""
        if lab_l > 75:
            depth_key = "very_light"
        elif lab_l > 65:
            depth_key = "light"
        elif lab_l > 55:
            depth_key = "light_medium"
        elif lab_l > 45:
            depth_key = "medium"
        elif lab_l > 35:
            depth_key = "medium_deep"
        elif lab_l > 25:
            depth_key = "deep"
        else:
            depth_key = "very_deep"

        tone_data = TONE_NAMES.get((depth_key, undertone))
        if tone_data:
            return tone_data
        return f"{depth_key.replace('_', ' ').title()} with {undertone.title()} Undertone", ""
