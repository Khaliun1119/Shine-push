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
            "test_accuracy": 0.89,
            "dataset_size": 4967,
            "train_size": 3973,
            "test_size": 994,
            "n_features": 42,
            "n_classes": 12,
            "model": "Ensemble (GradientBoosting + RandomForest)",
            "feature_groups": {"skin": 18, "hair": 9, "eye": 6, "contrast": 9},
            "dataset_source": "UTKFace (Kaggle)",
        }
    return JSONResponse(stats)


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
    # Validate file type
    if file.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(
            status_code=400,
            detail="Unsupported image format. Please upload JPEG, PNG, or WebP.",
        )

    try:
        contents = await file.read()

        # Limit file size (10MB)
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image too large. Max 10MB.")

        # Decode image
        nparr = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(status_code=400, detail="Could not decode image.")

        # Resize if too large (preserve aspect ratio)
        max_dim = 1280
        h, w = image.shape[:2]
        if max(h, w) > max_dim:
            scale = max_dim / max(h, w)
            image = cv2.resize(image, None, fx=scale, fy=scale)

        # Step 1: Detect face and extract skin color
        detection = face_detector.detect_and_extract(image)

        if detection is None:
            raise HTTPException(
                status_code=422,
                detail="No face detected. Please upload a clear, well-lit photo of your face.",
            )

        # Step 2: Classify skin tone (rule-based)
        classification = skin_classifier.classify(detection["skin_rgb"])

        # Step 2b: ML classification — skin + hair + eye features
        hair_rgb = detection.get("hair_rgb", [0, 0, 0])
        eye_rgb  = detection.get("eye_rgb",  [0, 0, 0])
        ml_result = ml_classifier.predict(
            detection["skin_rgb"], hair_rgb, eye_rgb
        )

        # Step 3: Generate color recommendations
        # Use ML prediction if confidence is high, otherwise use rule-based
        if ml_result["confidence"] > 0.6:
            sub_season = ml_result["predicted_season"]
        else:
            sub_season = classification["season"]["sub_season"]

        recommendations = color_recommender.recommend(sub_season)

        # Generate annotated face thumbnail (base64)
        face_thumbnail = _create_face_thumbnail(image, detection["face_bbox"])

        return JSONResponse(
            content={
                "success": True,
                "detection": {
                    "skin_rgb": detection["skin_rgb"],
                    "hair_rgb": hair_rgb,
                    "eye_rgb":  eye_rgb,
                    "num_samples": detection["num_samples"],
                    "regions": detection.get("regions", {}),
                    "method": detection["method"],
                },
                "classification": classification,
                "ml_prediction": ml_result,
                "recommendations": recommendations,
                "face_thumbnail": face_thumbnail,
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


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
            raise HTTPException(status_code=400, detail="Could not decode image.")

        # Resize if needed
        max_dim = 1280
        h, w = image.shape[:2]
        if max(h, w) > max_dim:
            scale = max_dim / max(h, w)
            image = cv2.resize(image, None, fx=scale, fy=scale)

        detection = face_detector.detect_and_extract(image)

        if detection is None:
            raise HTTPException(
                status_code=422,
                detail="No face detected. Please ensure your face is clearly visible and well-lit.",
            )

        classification = skin_classifier.classify(detection["skin_rgb"])
        hair_rgb = detection.get("hair_rgb", [0, 0, 0])
        eye_rgb  = detection.get("eye_rgb",  [0, 0, 0])
        ml_result = ml_classifier.predict(
            detection["skin_rgb"], hair_rgb, eye_rgb
        )

        if ml_result["confidence"] > 0.6:
            sub_season = ml_result["predicted_season"]
        else:
            sub_season = classification["season"]["sub_season"]

        recommendations = color_recommender.recommend(sub_season)
        face_thumbnail = _create_face_thumbnail(image, detection["face_bbox"])

        return JSONResponse(
            content={
                "success": True,
                "detection": {
                    "skin_rgb": detection["skin_rgb"],
                    "hair_rgb": hair_rgb,
                    "eye_rgb":  eye_rgb,
                    "num_samples": detection["num_samples"],
                    "regions": detection.get("regions", {}),
                    "method": detection["method"],
                },
                "classification": classification,
                "ml_prediction": ml_result,
                "recommendations": recommendations,
                "face_thumbnail": face_thumbnail,
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Analysis error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


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


templates = Jinja2Templates(directory="../frontend/templates")

# Serve frontend static files (no-cache for development)
app.mount("/static", StaticFiles(directory="../frontend/static"), name="static")


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
