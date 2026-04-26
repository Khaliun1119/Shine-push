"""
Machine Learning skin tone classifier — Real Image Dataset Edition.

Training data flow:
  1. Real face images → dataset_builder.py → dataset.csv
  2. This module loads the CSV and trains on real image features

Feature engineering (42 features total):
  - Skin color: 18 features (LAB, ITA, chroma, hue, RGB ratios, HSV)
  - Hair color:  9 features (LAB, lightness, warmth, darkness, RGB ratios)
  - Eye color:   6 features (LAB, hue, saturation)
  - Contrast:    9 features (skin-hair / skin-eye lightness, chroma diff, etc.)

Models compared (for diploma model comparison table):
  - Random Forest
  - Gradient Boosting
  - SVM (RBF kernel)
  - MLP Neural Network
  - KNN
  - Ensemble Voting (best two → final model)

Fallback: if no CSV found, falls back to synthetic RGB generation
          based on ITA angle distributions per season.
"""

import os
import csv
import math
import numpy as np
from sklearn.ensemble import (
    GradientBoostingClassifier,
    RandomForestClassifier,
    VotingClassifier,
)
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score, StratifiedKFold, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix
import joblib

MODEL_PATH   = os.path.join(os.path.dirname(__file__), "..", "ml_model.joblib")
DATASET_CSV  = os.path.join(os.path.dirname(__file__), "..", "dataset.csv")

SEASONS = [
    "Light Spring", "Warm Spring", "Clear Spring",
    "Light Summer", "Cool Summer", "Soft Summer",
    "Soft Autumn",  "Warm Autumn", "Deep Autumn",
    "Deep Winter",  "Cool Winter", "Clear Winter",
]

# ---------------------------------------------------------------------------
# ITA-based synthetic data — used when no real CSV dataset is present
# Params: (mean_ITA, std_ITA, mean_b_star, std_b_star, undertone_offset)
# ---------------------------------------------------------------------------
_SEASON_SYNTH_PARAMS = {
    "Light Spring":  dict(ita_mean=55, ita_std=8,  b_mean=18, b_std=4,  a_offset=-2),
    "Warm Spring":   dict(ita_mean=42, ita_std=7,  b_mean=22, b_std=5,  a_offset=-3),
    "Clear Spring":  dict(ita_mean=38, ita_std=6,  b_mean=20, b_std=4,  a_offset=-2),
    "Light Summer":  dict(ita_mean=52, ita_std=8,  b_mean= 8, b_std=3,  a_offset= 5),
    "Cool Summer":   dict(ita_mean=38, ita_std=7,  b_mean= 6, b_std=3,  a_offset= 6),
    "Soft Summer":   dict(ita_mean=35, ita_std=6,  b_mean= 9, b_std=3,  a_offset= 3),
    "Soft Autumn":   dict(ita_mean=28, ita_std=6,  b_mean=14, b_std=4,  a_offset= 0),
    "Warm Autumn":   dict(ita_mean=20, ita_std=6,  b_mean=20, b_std=5,  a_offset=-2),
    "Deep Autumn":   dict(ita_mean= 8, ita_std=6,  b_mean=18, b_std=5,  a_offset=-1),
    "Deep Winter":   dict(ita_mean= 5, ita_std=6,  b_mean= 5, b_std=3,  a_offset= 7),
    "Cool Winter":   dict(ita_mean=18, ita_std=6,  b_mean= 4, b_std=3,  a_offset= 8),
    "Clear Winter":  dict(ita_mean=22, ita_std=6,  b_mean= 6, b_std=3,  a_offset= 6),
}


# ===========================================================================
# FEATURE EXTRACTION
# ===========================================================================

def _rgb_to_lab(r: float, g: float, b: float) -> tuple:
    """Convert RGB (0-255) to CIE LAB."""
    rgb_norm = np.array([r, g, b]) / 255.0
    linear = np.where(
        rgb_norm > 0.04045,
        ((rgb_norm + 0.055) / 1.055) ** 2.4,
        rgb_norm / 12.92,
    )
    matrix = np.array([
        [0.4124564, 0.3575761, 0.1804375],
        [0.2126729, 0.7151522, 0.0721750],
        [0.0193339, 0.1191920, 0.9503041],
    ])
    xyz = matrix @ linear
    xyz_ref = np.array([0.95047, 1.0, 1.08883])
    xyz_norm = xyz / xyz_ref
    f = np.where(
        xyz_norm > 0.008856,
        np.cbrt(xyz_norm),
        (903.3 * xyz_norm + 16) / 116,
    )
    lab_l = float(116 * f[1] - 16)
    lab_a = float(500 * (f[0] - f[1]))
    lab_b = float(200 * (f[1] - f[2]))
    return lab_l, lab_a, lab_b


def extract_skin_features(r: int, g: int, b: int) -> list:
    """
    18-dimensional feature vector from skin RGB.
    Same as the original classifier for backward compatibility.
    """
    lab_l, lab_a, lab_b = _rgb_to_lab(r, g, b)

    b_safe = lab_b if abs(lab_b) > 0.001 else 0.001
    ita    = math.atan2(lab_l - 50, b_safe) * (180 / math.pi)
    chroma = math.sqrt(lab_a ** 2 + lab_b ** 2)
    hue    = math.atan2(lab_b, lab_a) * (180 / math.pi)

    rg_ratio  = r / max(g, 1)
    gb_ratio  = g / max(b, 1)
    rb_diff   = (r - b) / 255.0
    rg_diff   = (r - g) / 255.0
    gb_diff   = (g - b) / 255.0
    luminance = 0.299 * r + 0.587 * g + 0.114 * b
    max_c     = max(r, g, b)
    min_c     = min(r, g, b)
    saturation = (max_c - min_c) / max(max_c, 1)
    hsv_value  = max_c / 255.0
    r_ratio    = r / max(max_c, 1)
    ba_ratio   = lab_b / max(abs(lab_a), 0.001)
    depth      = lab_l - 50
    chroma_sq  = lab_a ** 2 + lab_b ** 2

    return [
        lab_l, lab_a, lab_b, ita, chroma, hue,
        rg_ratio, gb_ratio, rb_diff, luminance,
        saturation, r_ratio, ba_ratio, depth,
        chroma_sq, hsv_value, rg_diff, gb_diff,
    ]


def extract_hair_features(r: int, g: int, b: int) -> list:
    """
    9-dimensional feature vector from hair RGB.
    Captures lightness, warmth, darkness, and key ratios.
    """
    if r == 0 and g == 0 and b == 0:
        return [0.0] * 9  # unknown hair

    lab_l, lab_a, lab_b = _rgb_to_lab(r, g, b)
    chroma    = math.sqrt(lab_a ** 2 + lab_b ** 2)
    luminance = 0.299 * r + 0.587 * g + 0.114 * b
    warmth    = lab_b - lab_a * 0.5        # high = warm brown/blonde
    darkness  = 100.0 - lab_l             # high = dark hair
    rg_ratio  = r / max(g, 1)
    gb_ratio  = g / max(b, 1)

    return [lab_l, lab_a, lab_b, chroma, luminance, warmth, darkness, rg_ratio, gb_ratio]


def extract_eye_features(r: int, g: int, b: int) -> list:
    """
    6-dimensional feature vector from eye/iris RGB.
    Captures hue and saturation which distinguish eye colors.
    """
    if r == 0 and g == 0 and b == 0:
        return [0.0] * 6  # unknown eye

    lab_l, lab_a, lab_b = _rgb_to_lab(r, g, b)
    hue    = math.atan2(lab_b, lab_a) * (180 / math.pi)
    chroma = math.sqrt(lab_a ** 2 + lab_b ** 2)
    # HSV saturation
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    sat   = (max_c - min_c) / max(max_c, 1)

    return [lab_l, lab_a, lab_b, hue, chroma, sat]


def extract_contrast_features(
    skin_l: float, skin_chroma: float,
    hair_l: float, hair_chroma: float,
    eye_l: float,
) -> list:
    """
    9-dimensional contrast feature vector.
    Captures relationships between skin / hair / eye.
    """
    skin_hair_l_diff   = skin_l - hair_l
    skin_eye_l_diff    = skin_l - eye_l
    hair_eye_l_diff    = hair_l - eye_l
    skin_hair_chroma   = skin_chroma - hair_chroma
    overall_contrast   = abs(skin_l - hair_l) + abs(skin_l - eye_l)
    skin_hair_ratio    = skin_l / max(hair_l, 1)
    # Is hair darker than skin? (common in most people)
    hair_darker        = 1.0 if hair_l < skin_l else 0.0
    # Depth category encoded: very_light=6 … very_deep=0
    depth_score        = skin_l / 16.67  # normalize 0-100 → 0-6
    contrast_category  = min(overall_contrast / 50.0, 1.0)  # 0-1

    return [
        skin_hair_l_diff, skin_eye_l_diff, hair_eye_l_diff,
        skin_hair_chroma, overall_contrast, skin_hair_ratio,
        hair_darker, depth_score, contrast_category,
    ]


def extract_all_features(
    skin_rgb: list,
    hair_rgb: list = None,
    eye_rgb:  list = None,
) -> list:
    """
    Combined 42-dimensional feature vector.
    skin(18) + hair(9) + eye(6) + contrast(9) = 42
    """
    if hair_rgb is None:
        hair_rgb = [0, 0, 0]
    if eye_rgb is None:
        eye_rgb = [0, 0, 0]

    sr, sg, sb = skin_rgb
    hr, hg, hb = hair_rgb
    er, eg, eb = eye_rgb

    skin_feat = extract_skin_features(sr, sg, sb)
    hair_feat = extract_hair_features(hr, hg, hb)
    eye_feat  = extract_eye_features(er, eg, eb)

    # For contrast we need L* and chroma of each
    skin_l, skin_a, skin_b_val = _rgb_to_lab(sr, sg, sb)
    hair_l, _, _               = _rgb_to_lab(hr, hg, hb) if any([hr, hg, hb]) else (skin_l, 0, 0)
    eye_l, _, _                = _rgb_to_lab(er, eg, eb) if any([er, eg, eb]) else (skin_l, 0, 0)
    skin_chroma = math.sqrt(skin_a ** 2 + skin_b_val ** 2)
    hair_chroma = math.sqrt(hair_feat[1] ** 2 + hair_feat[2] ** 2)

    contrast_feat = extract_contrast_features(
        skin_l, skin_chroma, hair_l, hair_chroma, eye_l
    )

    return skin_feat + hair_feat + eye_feat + contrast_feat  # 42 total


# ===========================================================================
# SYNTHETIC DATA FALLBACK
# ===========================================================================

def _lab_to_rgb_approx(L: float, a: float, b: float) -> tuple:
    """Approximate inverse LAB→RGB conversion (D65 illuminant)."""
    fy = (L + 16) / 116
    fx = a / 500 + fy
    fz = fy - b / 200

    def f_inv(t):
        return t ** 3 if t > 0.20689 else (t - 16 / 116) / 7.787

    xyz = np.array([f_inv(fx), f_inv(fy), f_inv(fz)])
    xyz_ref = np.array([0.95047, 1.0, 1.08883])
    xyz = xyz * xyz_ref

    m_inv = np.array([
        [ 3.2404542, -1.5371385, -0.4985314],
        [-0.9692660,  1.8760108,  0.0415560],
        [ 0.0556434, -0.2040259,  1.0572252],
    ])
    linear = m_inv @ xyz
    linear = np.clip(linear, 0, 1)

    srgb = np.where(
        linear > 0.0031308,
        1.055 * linear ** (1 / 2.4) - 0.055,
        12.92 * linear,
    )
    srgb = np.clip(srgb, 0, 1)
    return tuple((srgb * 255).astype(int))


def _generate_synthetic_dataset(n_per_season: int = 200) -> tuple:
    """
    Generate synthetic training data from ITA-based season parameters.
    Used as fallback when no real image CSV is available.
    n_per_season=200 gives 2400 base samples (vs 600 in original).
    """
    rng = np.random.RandomState(42)
    X, y = [], []

    for season, p in _SEASON_SYNTH_PARAMS.items():
        ita_samples = rng.normal(p["ita_mean"], p["ita_std"], n_per_season)
        b_samples   = rng.normal(p["b_mean"],   p["b_std"],   n_per_season)
        a_base      = p["a_offset"]

        for ita, b_val in zip(ita_samples, b_samples):
            # ITA = atan2(L-50, b) → L from ITA and b
            L = 50 + b_val * math.tan(math.radians(ita))
            L = float(np.clip(L, 20, 98))
            a_val = float(a_base + rng.normal(0, 1.5))
            b_val = float(np.clip(b_val, 0, 35))

            r, g, b = _lab_to_rgb_approx(L, a_val, b_val)
            r = int(np.clip(r, 60, 255))
            g = int(np.clip(g, 40, 240))
            b = int(np.clip(b, 30, 230))

            features = extract_all_features([r, g, b])
            X.append(features)
            y.append(season)

    return np.array(X), np.array(y)


# ===========================================================================
# DATASET LOADING
# ===========================================================================

def _load_csv_dataset(csv_path: str) -> tuple:
    """Load real-image dataset from CSV produced by dataset_builder.py."""
    X, y = [], []
    with open(csv_path, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                skin_rgb = [int(row["skin_r"]), int(row["skin_g"]), int(row["skin_b"])]
                hair_rgb = [int(row["hair_r"]), int(row["hair_g"]), int(row["hair_b"])]
                eye_rgb  = [int(row["eye_r"]),  int(row["eye_g"]),  int(row["eye_b"])]
                season   = row["season"].strip()
                if season not in SEASONS:
                    continue
                features = extract_all_features(skin_rgb, hair_rgb, eye_rgb)
                X.append(features)
                y.append(season)
            except (KeyError, ValueError):
                continue

    return np.array(X), np.array(y)


def _augment_data(X: np.ndarray, y: np.ndarray, n_augments: int = 2) -> tuple:
    """Add Gaussian noise augmentation to training data."""
    rng = np.random.RandomState(42)
    X_aug, y_aug = [X], [y]
    for _ in range(n_augments):
        noise = rng.normal(0, 0.4, X.shape)
        X_aug.append(X + noise)
        y_aug.append(y)
    return np.vstack(X_aug), np.concatenate(y_aug)


def _build_training_set() -> tuple:
    """
    Load real CSV dataset if available; otherwise fall back to synthetic data.
    Returns (X_base, y_base) BEFORE augmentation for proper train/test split.
    """
    if os.path.exists(DATASET_CSV):
        X, y = _load_csv_dataset(DATASET_CSV)
        if len(X) >= 100:
            print(f"[ML] Loaded real dataset: {len(X)} samples from {DATASET_CSV}")
            return X, y
        print(f"[ML] CSV too small ({len(X)} rows), adding synthetic fallback data.")
        X_synth, y_synth = _generate_synthetic_dataset(n_per_season=100)
        X = np.vstack([X, X_synth])
        y = np.concatenate([y, y_synth])
        return X, y

    print("[ML] No dataset.csv found — using synthetic ITA-based data.")
    return _generate_synthetic_dataset(n_per_season=200)


# ===========================================================================
# MODEL COMPARISON (for diploma)
# ===========================================================================

def compare_models(X: np.ndarray, y: np.ndarray) -> dict:
    """
    Train and cross-validate multiple models.
    Returns a dict of {model_name: cv_accuracy_mean}.

    Дипломд: загваруудыг харьцуулах хүснэгт гаргахад ашиглана.
    """
    candidates = {
        "Random Forest": RandomForestClassifier(
            n_estimators=200, max_depth=12, random_state=42, n_jobs=-1
        ),
        "Gradient Boosting": GradientBoostingClassifier(
            n_estimators=200, max_depth=5, learning_rate=0.1, random_state=42
        ),
        "SVM (RBF)": SVC(
            kernel="rbf", C=10, gamma="scale", probability=True, random_state=42
        ),
        "MLP Neural Network": MLPClassifier(
            hidden_layer_sizes=(128, 64, 32),
            activation="relu",
            max_iter=500,
            random_state=42,
        ),
        "KNN (k=7)": KNeighborsClassifier(n_neighbors=7, weights="distance"),
    }

    cv      = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    results = {}

    print("\n[ML] === Model Comparison (5-fold CV) ===")
    for name, model in candidates.items():
        pipe = Pipeline([("scaler", StandardScaler()), ("clf", model)])
        scores = cross_val_score(pipe, X, y, cv=cv, scoring="accuracy", n_jobs=-1)
        results[name] = {"mean": scores.mean(), "std": scores.std()}
        print(f"  {name:<22}  accuracy={scores.mean():.1%}  ±{scores.std():.1%}")

    return results


# ===========================================================================
# MAIN CLASSIFIER CLASS
# ===========================================================================

class MLSkinClassifier:
    """
    Ensemble ML classifier — skin + hair + eye features, real image data.

    Architecture:
    - StandardScaler normalization
    - Soft Voting: GradientBoosting + RandomForest
    - 42 engineered features
    - Trained on real image dataset (dataset.csv) or synthetic fallback
    """

    def __init__(self):
        self.pipeline = None
        self._load_or_train()

    def _load_or_train(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.pipeline = joblib.load(MODEL_PATH)
                return
            except Exception:
                pass
        self._train()

    def _train(self):
        # Load base dataset (no augmentation yet)
        X_base, y_base = _build_training_set()

        # Merge rare classes (<5 samples) with synthetic data so every season
        # has enough samples for a stratified split
        from collections import Counter
        counts = Counter(y_base)
        rare = [s for s, n in counts.items() if n < 5]
        if rare:
            X_synth, y_synth = _generate_synthetic_dataset(n_per_season=20)
            mask = np.isin(y_synth, rare)
            X_base = np.vstack([X_base, X_synth[mask]])
            y_base = np.concatenate([y_base, y_synth[mask]])

        # Proper train / test split BEFORE augmentation (prevents data leakage)
        X_train, X_test, y_train, y_test = train_test_split(
            X_base, y_base, test_size=0.2, random_state=42, stratify=y_base
        )

        # Augment only the training portion
        X_train_aug, y_train_aug = _augment_data(X_train, y_train, n_augments=2)

        # Build ensemble
        gb = GradientBoostingClassifier(
            n_estimators=150,
            max_depth=5,
            learning_rate=0.1,
            subsample=0.85,
            min_samples_leaf=3,
            random_state=42,
        )
        rf = RandomForestClassifier(
            n_estimators=150,
            max_depth=10,
            min_samples_leaf=2,
            class_weight='balanced',
            random_state=42,
            n_jobs=-1,
        )
        ensemble = VotingClassifier(
            estimators=[("gb", gb), ("rf", rf)],
            voting="soft",
            weights=[1.2, 1.0],
        )
        self.pipeline = Pipeline([
            ("scaler", StandardScaler()),
            ("clf", ensemble),
        ])
        self.pipeline.fit(X_train_aug, y_train_aug)

        # Evaluate on held-out test set
        test_acc = self.pipeline.score(X_test, y_test)
        print(f"\n[ML] Training summary:")
        print(f"     Base samples      : {len(X_base)} ({len(X_base)//12} per season)")
        print(f"     Train (augmented) : {len(X_train_aug)}")
        print(f"     Test (held-out)   : {len(X_test)}")
        print(f"     Test accuracy     : {test_acc:.1%}")
        print(f"     Features          : 42  (skin 18 + hair 9 + eye 6 + contrast 9)")
        print(f"     Model             : Ensemble (GradientBoosting + RandomForest)")

        joblib.dump(self.pipeline, MODEL_PATH)
        print(f"[ML] Model saved: {MODEL_PATH}")

        # Save stats for diploma/API display
        import json
        stats_path = os.path.join(os.path.dirname(MODEL_PATH), "model_stats.json")
        stats = {
            "test_accuracy": round(float(test_acc), 4),
            "dataset_size": len(X_base),
            "train_size": len(X_train_aug),
            "test_size": len(X_test),
            "n_features": 42,
            "n_classes": 12,
            "model": "Ensemble (GradientBoosting + RandomForest)",
            "feature_groups": {"skin": 18, "hair": 9, "eye": 6, "contrast": 9},
            "dataset_source": "UTKFace (Kaggle)",
        }
        with open(stats_path, "w") as f:
            json.dump(stats, f, indent=2)
        print(f"[ML] Stats saved: {stats_path}")

    def predict(self, skin_rgb: list, hair_rgb: list = None, eye_rgb: list = None) -> dict:
        """
        Predict seasonal color type.

        Args:
            skin_rgb: [R, G, B] skin color.
            hair_rgb: [R, G, B] hair color (optional).
            eye_rgb:  [R, G, B] eye/iris color (optional).

        Returns:
            dict with predicted season, confidence, and top matches.
        """
        features = np.array([extract_all_features(skin_rgb, hair_rgb, eye_rgb)])
        prediction    = self.pipeline.predict(features)[0]
        probabilities = self.pipeline.predict_proba(features)[0]
        classes       = self.pipeline.classes_

        prob_map = sorted(
            zip(classes, probabilities),
            key=lambda x: x[1],
            reverse=True,
        )

        return {
            "predicted_season": prediction,
            "primary": prediction.split()[-1],
            "confidence": float(max(probabilities)),
            "top_matches": [
                {"season": s, "confidence": round(float(p) * 100, 1)}
                for s, p in prob_map[:5]
            ],
        }

    def retrain(self):
        """Force retrain the model (e.g. after new dataset.csv is built)."""
        if os.path.exists(MODEL_PATH):
            os.remove(MODEL_PATH)
        self._train()

    def get_stats(self) -> dict:
        X, y = _build_training_set()
        return {
            "total_base_samples": len(X),
            "samples_per_season": len(X) // 12,
            "num_features": 42,
            "feature_breakdown": "skin(18) + hair(9) + eye(6) + contrast(9)",
            "num_seasons": 12,
            "model_type": "Ensemble (GradientBoosting + RandomForest)",
            "dataset_source": "Real images (dataset.csv)" if os.path.exists(DATASET_CSV)
                              else "Synthetic ITA-based",
        }

    def run_model_comparison(self) -> dict:
        """
        Compare multiple ML models with cross-validation.
        Use this for the diploma model comparison table.
        """
        X, y = _build_training_set()
        return compare_models(X, y)
