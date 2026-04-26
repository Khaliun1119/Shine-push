"""
Face detection and skin color extraction module.

Uses MediaPipe Face Landmarker (Tasks API) to detect facial landmarks
and extract skin color samples from multiple facial regions.
Also extracts hair and eye colors for multi-feature seasonal analysis.
Falls back to OpenCV's Haar cascade if MediaPipe is unavailable.
"""

import os
import cv2
import numpy as np
from typing import Optional

try:
    import mediapipe as mp
    from mediapipe.tasks.python import BaseOptions
    from mediapipe.tasks.python.vision import (
        FaceLandmarker,
        FaceLandmarkerOptions,
        RunningMode,
    )
    MEDIAPIPE_AVAILABLE = True
except ImportError:
    MEDIAPIPE_AVAILABLE = False

# Path to the face landmarker model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "face_landmarker.task")

# Facial landmark indices for skin sampling regions (478-point mesh)
FOREHEAD_LANDMARKS = [10, 67, 69, 104, 108, 109, 151, 299, 337, 338]
LEFT_CHEEK_LANDMARKS = [50, 101, 116, 117, 118, 119, 123, 187, 205, 206]
RIGHT_CHEEK_LANDMARKS = [280, 330, 345, 346, 347, 348, 352, 411, 425, 426]
CHIN_LANDMARKS = [152, 175, 199, 200, 18, 313, 377, 378, 379, 400]

# Top-of-forehead landmarks — used as reference to sample hair above
HAIRLINE_LANDMARKS = [10, 109, 338, 67, 297, 54, 284]

# Iris landmarks (MediaPipe 478-point model includes iris)
LEFT_IRIS_LANDMARKS  = [468, 469, 470, 471, 472]
RIGHT_IRIS_LANDMARKS = [473, 474, 475, 476, 477]


class FaceDetector:
    """Detects faces and extracts skin color from facial regions."""

    def __init__(self):
        self._landmarker = None
        if MEDIAPIPE_AVAILABLE and os.path.exists(MODEL_PATH):
            try:
                options = FaceLandmarkerOptions(
                    base_options=BaseOptions(model_asset_path=MODEL_PATH),
                    running_mode=RunningMode.IMAGE,
                    num_faces=1,
                    min_face_detection_confidence=0.5,
                    min_face_presence_confidence=0.5,
                )
                self._landmarker = FaceLandmarker.create_from_options(options)
            except Exception:
                self._landmarker = None

        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
        )

    def detect_and_extract(self, image: np.ndarray) -> Optional[dict]:
        """
        Detect face in image and extract skin color information.

        Args:
            image: BGR image as numpy array.

        Returns:
            Dictionary with skin color data or None if no face detected.
        """
        if self._landmarker is not None:
            result = self._extract_with_mediapipe(image)
            if result is not None:
                return result

        return self._extract_with_opencv(image)

    def _extract_with_mediapipe(self, bgr_image: np.ndarray) -> Optional[dict]:
        """Extract skin color using MediaPipe Face Landmarker."""
        rgb_image = cv2.cvtColor(bgr_image, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_image)

        results = self._landmarker.detect(mp_image)

        if not results.face_landmarks:
            return None

        face_landmarks = results.face_landmarks[0]
        h, w, _ = bgr_image.shape

        # Collect skin pixels from each region
        all_skin_pixels = []
        regions = {}

        for region_name, landmark_indices in [
            ("forehead", FOREHEAD_LANDMARKS),
            ("left_cheek", LEFT_CHEEK_LANDMARKS),
            ("right_cheek", RIGHT_CHEEK_LANDMARKS),
            ("chin", CHIN_LANDMARKS),
        ]:
            pixels = self._sample_region(
                bgr_image, face_landmarks, landmark_indices, w, h
            )
            if len(pixels) > 0:
                regions[region_name] = np.median(pixels, axis=0).astype(int)
                all_skin_pixels.extend(pixels)

        if len(all_skin_pixels) < 50:
            return None

        all_skin_pixels = np.array(all_skin_pixels)

        # Remove outliers using IQR method
        filtered_pixels = self._remove_outliers(all_skin_pixels)

        if len(filtered_pixels) < 20:
            filtered_pixels = all_skin_pixels

        # Calculate median skin color in BGR
        median_bgr = np.median(filtered_pixels, axis=0).astype(int)
        median_rgb = median_bgr[::-1]  # BGR to RGB

        # Get face bounding box from landmarks
        x_coords = [lm.x * w for lm in face_landmarks]
        y_coords = [lm.y * h for lm in face_landmarks]
        bbox = {
            "x": int(min(x_coords)),
            "y": int(min(y_coords)),
            "w": int(max(x_coords) - min(x_coords)),
            "h": int(max(y_coords) - min(y_coords)),
        }

        # Extract hair color (above hairline landmarks)
        hair_rgb = self._extract_hair_color(bgr_image, face_landmarks, w, h)

        # Extract eye color (iris landmarks 468-477)
        eye_rgb = self._extract_eye_color(bgr_image, face_landmarks, w, h)

        return {
            "skin_rgb": median_rgb.tolist(),
            "skin_bgr": median_bgr.tolist(),
            "regions": {k: v[::-1].tolist() for k, v in regions.items()},  # to RGB
            "num_samples": len(filtered_pixels),
            "face_bbox": bbox,
            "method": "mediapipe",
            "hair_rgb": hair_rgb,
            "eye_rgb": eye_rgb,
        }

    def _extract_hair_color(
        self,
        bgr_image: np.ndarray,
        landmarks,
        width: int,
        height: int,
    ) -> list:
        """
        Extract hair color by sampling the region above the hairline.

        Finds the top-of-forehead landmark points and samples pixels
        10-25% of face height above them, avoiding the sky/background
        by using a narrow vertical band.
        """
        if len(landmarks) < max(HAIRLINE_LANDMARKS) + 1:
            return [0, 0, 0]

        # Get y-coordinate of hairline (top forehead landmarks)
        hairline_ys = [landmarks[i].y * height for i in HAIRLINE_LANDMARKS]
        hairline_xs = [landmarks[i].x * width for i in HAIRLINE_LANDMARKS]

        y_hairline = int(min(hairline_ys))
        x_left = int(min(hairline_xs))
        x_right = int(max(hairline_xs))

        # Face height estimate (from landmark 10 top to landmark 152 chin)
        y_chin = int(landmarks[152].y * height) if len(landmarks) > 152 else y_hairline + 200
        face_h = max(y_chin - y_hairline, 60)

        # Sample a band above the hairline: 5% to 20% of face height above
        y_top = max(0, y_hairline - int(face_h * 0.20))
        y_bot = max(0, y_hairline - int(face_h * 0.05))

        if y_top >= y_bot or x_left >= x_right:
            return [0, 0, 0]

        hair_region = bgr_image[y_top:y_bot, x_left:x_right]
        if hair_region.size == 0:
            return [0, 0, 0]

        pixels = hair_region.reshape(-1, 3).astype(float)

        # Filter out very bright pixels (sky/background) and very dark noise
        luminance = 0.299 * pixels[:, 2] + 0.587 * pixels[:, 1] + 0.114 * pixels[:, 0]
        mask = (luminance > 20) & (luminance < 240)
        pixels = pixels[mask]

        if len(pixels) < 10:
            return [0, 0, 0]

        median_bgr = np.median(pixels, axis=0).astype(int)
        return median_bgr[::-1].tolist()  # BGR → RGB

    def _extract_eye_color(
        self,
        bgr_image: np.ndarray,
        landmarks,
        width: int,
        height: int,
    ) -> list:
        """
        Extract iris color using MediaPipe iris landmarks (468-477).

        Samples a small patch around each iris landmark and returns
        the median RGB color, excluding very dark (pupil) pixels.
        """
        all_iris = LEFT_IRIS_LANDMARKS + RIGHT_IRIS_LANDMARKS

        # Check if iris landmarks are present (requires 478-point model)
        if len(landmarks) < 478:
            return self._extract_eye_color_fallback(bgr_image, landmarks, width, height)

        pixels = []
        for idx in all_iris:
            lm = landmarks[idx]
            cx, cy = int(lm.x * width), int(lm.y * height)
            radius = 3
            patch = bgr_image[
                max(0, cy - radius): min(height, cy + radius),
                max(0, cx - radius): min(width,  cx + radius),
            ]
            if patch.size > 0:
                pixels.extend(patch.reshape(-1, 3).tolist())

        if len(pixels) < 5:
            return [0, 0, 0]

        pixels = np.array(pixels, dtype=float)

        # Exclude pupil (very dark) and sclera (very bright/white) pixels
        luminance = 0.299 * pixels[:, 2] + 0.587 * pixels[:, 1] + 0.114 * pixels[:, 0]
        mask = (luminance > 30) & (luminance < 200)
        pixels = pixels[mask]

        if len(pixels) < 3:
            return [0, 0, 0]

        median_bgr = np.median(pixels, axis=0).astype(int)
        return median_bgr[::-1].tolist()  # BGR → RGB

    def _extract_eye_color_fallback(
        self,
        bgr_image: np.ndarray,
        landmarks,
        width: int,
        height: int,
    ) -> list:
        """
        Fallback eye color extraction using eye corner landmarks
        when iris landmarks are not available.
        """
        # Left eye corners: 33 (outer), 133 (inner)
        # Right eye corners: 362 (inner), 263 (outer)
        eye_indices = [33, 133, 362, 263]
        if len(landmarks) < max(eye_indices) + 1:
            return [0, 0, 0]

        pixels = []
        for idx in eye_indices:
            lm = landmarks[idx]
            cx, cy = int(lm.x * width), int(lm.y * height)
            radius = 5
            patch = bgr_image[
                max(0, cy - radius): min(height, cy + radius),
                max(0, cx - radius): min(width,  cx + radius),
            ]
            if patch.size > 0:
                pixels.extend(patch.reshape(-1, 3).tolist())

        if len(pixels) < 5:
            return [0, 0, 0]

        pixels = np.array(pixels, dtype=float)
        luminance = 0.299 * pixels[:, 2] + 0.587 * pixels[:, 1] + 0.114 * pixels[:, 0]
        mask = (luminance > 25) & (luminance < 220)
        pixels = pixels[mask]

        if len(pixels) < 3:
            return [0, 0, 0]

        return np.median(pixels, axis=0).astype(int)[::-1].tolist()

    def _sample_region(
        self,
        image: np.ndarray,
        landmarks,
        indices: list,
        width: int,
        height: int,
        radius: int = 5,
    ) -> list:
        """Sample pixels around landmark points in a given facial region."""
        pixels = []
        for idx in indices:
            if idx >= len(landmarks):
                continue
            lm = landmarks[idx]
            cx, cy = int(lm.x * width), int(lm.y * height)

            # Sample a small patch around each landmark
            y_start = max(0, cy - radius)
            y_end = min(height, cy + radius)
            x_start = max(0, cx - radius)
            x_end = min(width, cx + radius)

            patch = image[y_start:y_end, x_start:x_end]
            if patch.size > 0:
                pixels.extend(patch.reshape(-1, 3).tolist())

        return pixels

    def _extract_with_opencv(self, image: np.ndarray) -> Optional[dict]:
        """Fallback: extract skin color using OpenCV Haar cascade + HSV filtering."""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(80, 80)
        )

        if len(faces) == 0:
            return None

        # Use the largest detected face
        x, y, w, h = max(faces, key=lambda f: f[2] * f[3])

        # Extract face region with some margin
        margin_x = int(w * 0.1)
        margin_y = int(h * 0.1)
        face_roi = image[
            y + margin_y : y + h - margin_y, x + margin_x : x + w - margin_x
        ]

        # Use HSV-based skin detection within the face region
        hsv = cv2.cvtColor(face_roi, cv2.COLOR_BGR2HSV)

        # Skin color range in HSV
        lower_skin = np.array([0, 20, 70], dtype=np.uint8)
        upper_skin = np.array([30, 255, 255], dtype=np.uint8)
        mask = cv2.inRange(hsv, lower_skin, upper_skin)

        skin_pixels = face_roi[mask > 0]

        if len(skin_pixels) < 30:
            # If HSV filtering is too aggressive, use center region
            ch, cw = face_roi.shape[:2]
            center = face_roi[ch // 4 : 3 * ch // 4, cw // 4 : 3 * cw // 4]
            skin_pixels = center.reshape(-1, 3)

        filtered = self._remove_outliers(skin_pixels)
        if len(filtered) < 10:
            filtered = skin_pixels

        median_bgr = np.median(filtered, axis=0).astype(int)
        median_rgb = median_bgr[::-1]

        # Estimate hair color: sample above the face bounding box
        hair_rgb = [0, 0, 0]
        hair_y_top = max(0, y - int(h * 0.25))
        hair_y_bot = max(0, y - int(h * 0.05))
        hair_x_l = x + int(w * 0.1)
        hair_x_r = x + int(w * 0.9)
        if hair_y_top < hair_y_bot and hair_x_l < hair_x_r:
            hair_region = image[hair_y_top:hair_y_bot, hair_x_l:hair_x_r]
            if hair_region.size > 0:
                hp = hair_region.reshape(-1, 3).astype(float)
                lum = 0.299 * hp[:, 2] + 0.587 * hp[:, 1] + 0.114 * hp[:, 0]
                hp = hp[(lum > 20) & (lum < 240)]
                if len(hp) >= 5:
                    hair_rgb = np.median(hp, axis=0).astype(int)[::-1].tolist()

        return {
            "skin_rgb": median_rgb.tolist(),
            "skin_bgr": median_bgr.tolist(),
            "regions": {},
            "num_samples": len(filtered),
            "face_bbox": {"x": int(x), "y": int(y), "w": int(w), "h": int(h)},
            "method": "opencv_cascade",
            "hair_rgb": hair_rgb,
            "eye_rgb": [0, 0, 0],  # Iris detection requires MediaPipe
        }

    @staticmethod
    def _remove_outliers(pixels: np.ndarray) -> np.ndarray:
        """Remove color outliers using the IQR method on luminance."""
        if len(pixels) < 10:
            return pixels

        # Calculate luminance for each pixel
        luminance = 0.299 * pixels[:, 2] + 0.587 * pixels[:, 1] + 0.114 * pixels[:, 0]

        q1, q3 = np.percentile(luminance, [25, 75])
        iqr = q3 - q1
        lower_bound = q1 - 1.5 * iqr
        upper_bound = q3 + 1.5 * iqr

        mask = (luminance >= lower_bound) & (luminance <= upper_bound)
        return pixels[mask]
