"""
Clothing Color Advisor — FastAPI Backend

AI-powered clothing color recommendation system that analyzes
skin color from photos to provide personalized color palettes
using computer vision and color science.

Endpoints:
    POST /api/analyze — Analyze uploaded image
    GET  /api/health  — Health check
    GET  /             — Serve frontend
"""

import io
import os
import base64
import logging
from contextlib import asynccontextmanager

import cv2
import numpy as np
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates

from analyzer import FaceDetector, SkinClassifier, ColorRecommender, MLSkinClassifier

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize AI components
face_detector = FaceDetector()
skin_classifier = SkinClassifier()
color_recommender = ColorRecommender()
ml_classifier = MLSkinClassifier()


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Clothing Color Advisor API started")
    logger.info("AI modules loaded: FaceDetector, SkinClassifier, ColorRecommender")
    yield
    logger.info("Shutting down")


app = FastAPI(
    title="Clothing Color Advisor",
    description="AI-powered skin color analysis and clothing color recommendation",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/model-info")
async def get_model_info():
    """Return ML model statistics for diploma/about section."""
    import json
    stats_path = os.path.join(os.path.dirname(__file__), "model_stats.json")
    if os.path.exists(stats_path):
        with open(stats_path) as f:
            stats = json.load(f)
    else:
        # Fallback hardcoded values from last training run
        stats = {
            "test_accuracy": 0.91,
            "dataset_size": 8313,
            "train_size": 6650,
            "test_size": 1663,
            "n_features": 42,
            "n_classes": 12,
            "model": "Ensemble (GradientBoosting + RandomForest)",
            "feature_groups": {"skin": 18, "hair": 9, "eye": 6, "contrast": 9},
            "dataset_source": "UTKFace (Kaggle) + Synthetic",
        }
    return JSONResponse(stats)


def _fix_exif_rotation(image: np.ndarray, raw_bytes: bytes) -> np.ndarray:
    """Correct image orientation based on EXIF data."""
    try:
        pil = Image.open(io.BytesIO(raw_bytes))
        exif = pil._getexif()
        if exif:
            orientation = exif.get(274)  # 274 = Orientation tag
            rotations = {3: 180, 6: 270, 8: 90}
            if orientation in rotations:
                pil = pil.rotate(rotations[orientation], expand=True)
                image = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)
    except Exception:
        pass
    return image


def _run_analysis(image: np.ndarray) -> dict:
    """Shared analysis pipeline for both endpoints."""
    detection = face_detector.detect_and_extract(image)
    if detection is None:
        raise HTTPException(
            status_code=422,
            detail="Нүүр илрүүлэгдсэнгүй. Тод, гэрэлтэй нүүрний зургаа оруулна уу.",
        )

    classification = skin_classifier.classify(detection["skin_rgb"])
    hair_rgb = detection.get("hair_rgb", [0, 0, 0])
    eye_rgb  = detection.get("eye_rgb",  [0, 0, 0])
    ml_result = ml_classifier.predict(detection["skin_rgb"], hair_rgb, eye_rgb)

    sub_season = (
        ml_result["predicted_season"]
        if ml_result["confidence"] > 0.6
        else classification["season"]["sub_season"]
    )

    recommendations = color_recommender.recommend(sub_season)
    face_thumbnail  = _create_face_thumbnail(image, detection["face_bbox"])

    return {
        "success": True,
        "detection": {
            "skin_rgb":    detection["skin_rgb"],
            "hair_rgb":    hair_rgb,
            "eye_rgb":     eye_rgb,
            "num_samples": detection["num_samples"],
            "regions":     detection.get("regions", {}),
            "method":      detection["method"],
        },
        "classification":  classification,
        "ml_prediction":   ml_result,
        "recommendations": recommendations,
        "face_thumbnail":  face_thumbnail,
    }


@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze an uploaded face image and return color recommendations.

    Accepts JPEG or PNG images. The image must contain a clearly visible face.

    Pipeline:
        1. Face detection & skin region extraction
        2. Skin tone classification (ITA, Fitzpatrick, undertone)
        3. Seasonal color type determination
        4. Clothing color palette generation
    """
    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="Зөвхөн JPEG, PNG, WebP формат дэмжигдэнэ.")

    try:
        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Зураг хэт том байна. Дээд хэмжээ 10MB.")

        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if image is None:
            raise HTTPException(status_code=400, detail="Зургийг уншиж чадсангүй.")

        image = _fix_exif_rotation(image, contents)

        h, w = image.shape[:2]
        if max(h, w) > 1280:
            scale = 1280 / max(h, w)
            image = cv2.resize(image, None, fx=scale, fy=scale)

        return JSONResponse(content=_run_analysis(image))

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Шинжилгээ амжилтгүй боллоо: {str(e)}")


@app.post("/api/analyze-base64")
async def analyze_base64(data: dict):
    """
    Analyze a base64-encoded image (from webcam capture).

    Expects JSON: {"image": "data:image/jpeg;base64,..."}
    """
    try:
        image_data = data.get("image", "")
        if "," in image_data:
            image_data = image_data.split(",")[1]

        img_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(img_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if image is None:
            raise HTTPException(status_code=400, detail="Зургийг уншиж чадсангүй.")

        h, w = image.shape[:2]
        if max(h, w) > 1280:
            scale = 1280 / max(h, w)
            image = cv2.resize(image, None, fx=scale, fy=scale)

        return JSONResponse(content=_run_analysis(image))

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Шинжилгээ амжилтгүй боллоо: {str(e)}")


def _create_face_thumbnail(image: np.ndarray, bbox: dict, size: int = 200) -> str:
    """Create a base64-encoded thumbnail of the detected face."""
    x, y, w, h = bbox["x"], bbox["y"], bbox["w"], bbox["h"]

    # Add margin
    margin = int(min(w, h) * 0.3)
    img_h, img_w = image.shape[:2]
    x1 = max(0, x - margin)
    y1 = max(0, y - margin)
    x2 = min(img_w, x + w + margin)
    y2 = min(img_h, y + h + margin)

    face_crop = image[y1:y2, x1:x2]

    # Resize to thumbnail
    face_crop = cv2.resize(face_crop, (size, size))

    # Convert to JPEG base64
    rgb = cv2.cvtColor(face_crop, cv2.COLOR_BGR2RGB)
    pil_img = Image.fromarray(rgb)
    buffer = io.BytesIO()
    pil_img.save(buffer, format="JPEG", quality=85)
    b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

    return f"data:image/jpeg;base64,{b64}"


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}


_BASE = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(_BASE, "../frontend/templates"))
app.mount("/static", StaticFiles(directory=os.path.join(_BASE, "../frontend/static")), name="static")


@app.middleware("http")
async def no_cache_middleware(request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/static/") or request.url.path == "/":
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response


@app.get("/")
async def serve_frontend(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
