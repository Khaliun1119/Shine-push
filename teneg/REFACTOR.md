# ChromaSense AI — Refactor Тайлбар ба Заавар

**Огноо:** 2026-04-15
**Хамрах хүрээ:** Frontend (JS, HTML, CSS) бүхэлд нь modular бүтэц рүү шилжүүлсэн.

---

## 📋 Агуулга

1. [Юу өөрчилсөн бэ?](#1-юу-өөрчилсөн-бэ)
2. [Төслийн шинэ бүтэц](#2-төслийн-шинэ-бүтэц)
3. [Суулгах шаардлагатай зүйлс](#3-суулгах-шаардлагатай-зүйлс)
4. [Project-ийг яаж асаах вэ](#4-project-ийг-яаж-асаах-вэ)
5. [Файлуудын тайлбар](#5-файлуудын-тайлбар)
6. [Алдаа гарвал яах вэ](#6-алдаа-гарвал-яах-вэ)

---

## 1. Юу өөрчилсөн бэ?

Өмнө нь төсөл дараах 3 том монолит файлтай байсан:

| Файл | Мөр | Асуудал |
|---|---|---|
| `frontend/static/js/app.js` | **1549** | Бүх logic (i18n, upload, camera, API, 6 renderer) нэг файлд холилдсон |
| `frontend/index.html` | **847** | Бүх section (navbar, hero, results, about, footer) нэг файлд |
| `frontend/static/css/style.css` | **1784** | 20+ component-ийн CSS нэг файлд, дубликат selector-тай |

### Нийтдээ хийсэн 3 том өөрчлөлт:

### ✅ 1) JavaScript — ES Modules рүү задалсан (1 файл → 23 модуль)

`app.js`-ийг **23 жижиг ES module** болгон задалсан:
- `state.js`, `i18n.js` — share state, language
- `constants/` — seasons, skin, SVG, jewelry, fabric-patterns
- `utils/` — color manipulation, DOM helpers
- `services/` — api, upload, camera, navbar, hero-labels, ui
- `renderers/` — profile, season, clothing, outfits, makeup, jewelry, why-color гэх мэт

### ✅ 2) HTML — Jinja2 Templates рүү задалсан (1 файл → 16 partial)

FastAPI-ийн `Jinja2Templates` ашиглан `index.html`-ийг **section тус бүрээр** partial файл болгож хуваасан:
- `navbar.html`, `hero.html`, `stats-strip.html`
- `seasons-preview.html`, `how-it-works.html`, `analyze.html`
- `results/` (profile, season, clothing, outfits, makeup, fabrics-jewelry)
- `about.html`, `footer.html`

Гол template `templates/index.html` нь `{% include %}` ашиглан бүгдийг нийлүүлдэг.

### ✅ 3) CSS — Component-based рүү задалсан (1 файл → 20 файл)

`style.css`-ийг функциональ **бүлэг тус бүрээр** хуваасан:
- `base.css` — CSS variable, reset, typography
- `components.css` — товч, tooltip, lang-toggle, tab, chip
- `navbar.css`, `hero.css`, `footer.css` гэх мэт section-уудын CSS
- `results/` — 8 component file (cards, profile, season, clothing, outfits, makeup, jewelry, fabrics-tips)
- `responsive.css` — бүх media query нэг газар

### ✅ 4) Backend өөрчлөлт

- `backend/main.py`-д `Jinja2Templates` нэмсэн
- `GET /` route нь template render хийхээр өөрчилсөн
- `requirements.txt`-д `jinja2==3.1.4` нэмсэн

### ✅ 5) Нэмэлт bug засвар

- Season card дээр ML confidence bar-ын давхардаж харагдаж байсан layout эвдрэлийг зассан (`.season-content` CSS selector-ын дубликат scoping асуудал)
- ML confidence bar-ыг top match-тай харьцуулан scale хийхээр сайжруулсан — бага итгэлцэлтэй үед ч bar харагддаг болсон

---

## 2. Төслийн шинэ бүтэц

```
clothing-color-advisor/
├── backend/
│   ├── main.py                     # FastAPI + Jinja2Templates
│   ├── requirements.txt            # jinja2==3.1.4 нэмэгдсэн
│   ├── analyzer/                   # ML pipeline (өмнөх хэвээрээ)
│   │   ├── face_detector.py
│   │   ├── skin_classifier.py
│   │   ├── ml_classifier.py
│   │   └── color_recommender.py
│   ├── dataset.csv
│   └── ml_model.joblib
│
└── frontend/
    ├── templates/                  # ⭐ ШИНЭ — Jinja2 partials
    │   ├── index.html              # Бүх partial-ийг нэгтгэдэг
    │   └── partials/
    │       ├── navbar.html
    │       ├── hero.html
    │       ├── stats-strip.html
    │       ├── seasons-preview.html
    │       ├── how-it-works.html
    │       ├── analyze.html
    │       ├── about.html
    │       ├── footer.html
    │       └── results/
    │           ├── index.html
    │           ├── profile.html
    │           ├── season.html
    │           ├── clothing.html
    │           ├── outfits.html
    │           ├── makeup.html
    │           └── fabrics-jewelry.html
    │
    └── static/
        ├── css/                    # ⭐ ШИНЭ — component-based CSS
        │   ├── base.css
        │   ├── layout.css
        │   ├── components.css
        │   ├── navbar.css
        │   ├── hero.css
        │   ├── stats-strip.css
        │   ├── seasons-preview.css
        │   ├── how-it-works.css
        │   ├── analyze.css
        │   ├── about.css
        │   ├── footer.css
        │   ├── responsive.css
        │   └── results/
        │       ├── cards.css
        │       ├── profile.css
        │       ├── season.css
        │       ├── clothing.css
        │       ├── outfits.css
        │       ├── makeup.css
        │       ├── jewelry.css
        │       └── fabrics-tips.css
        │
        └── js/                     # ⭐ ШИНЭ — ES modules
            ├── main.js             # Entry point, event wiring
            ├── state.js            # Shared mutable state
            ├── i18n.js             # Орчуулга + applyLanguage
            ├── constants/
            │   ├── seasons.js
            │   ├── skin.js
            │   ├── clothing-svg.js
            │   ├── fabric-patterns.js
            │   └── jewelry.js
            ├── utils/
            │   ├── color.js        # rgbToHex, getColorNameMN
            │   └── dom.js          # copyColor, showTooltip
            ├── services/
            │   ├── api.js          # analyzeImage, loadModelInfo
            │   ├── ui.js           # showError, showUploadArea
            │   ├── upload.js       # File + drag/drop
            │   ├── camera.js       # Webcam
            │   ├── navbar.js       # Scroll effect
            │   └── hero-labels.js  # Cycling labels
            └── renderers/
                ├── results.js      # Orchestrator
                ├── profile.js
                ├── season.js
                ├── clothing.js
                ├── outfits.js
                ├── makeup.js
                ├── jewelry.js
                ├── tags.js
                └── why-color.js
```

---

## 3. Суулгах шаардлагатай зүйлс

### Шаардлагатай software

| Програм | Хувилбар | Тайлбар |
|---|---|---|
| **Python** | 3.10 эсвэл 3.11 | 3.12+ дээр MediaPipe суухгүй байж магадгүй |
| **pip** | (Python-тай хамт орж ирнэ) | Package manager |

### Python dependencies (`requirements.txt`)

```
fastapi==0.115.0
uvicorn==0.30.6
python-multipart==0.0.9
jinja2==3.1.4              ← шинээр нэмэгдсэн
opencv-python-headless==4.10.0.84
mediapipe==0.10.33
numpy==1.26.4
scikit-learn==1.5.2
Pillow==10.4.0
```

**Шинэ dependency:** `jinja2` — FastAPI-аар HTML template render хийхэд хэрэглэнэ.

---

## 4. Project-ийг яаж асаах вэ

### Эхний удаа (setup)

```powershell
# 1. Backend folder руу ор
cd clothing-color-advisor\backend

# 2. Virtual environment үүсгэ (хэрэв байхгүй бол)
python -m venv venv

# 3. Venv-ийг идэвхжүүл
venv\Scripts\activate          # PowerShell / CMD
# эсвэл Git Bash дээр: source venv/Scripts/activate

# 4. Бүх dependency суулга
pip install -r requirements.txt
```

**Тайлбар:** `pip install -r requirements.txt` нь `jinja2`-ыг мөн суулгана. Хэрэв та өмнө нь venv үүсгээд байсан бол дан ганц `pip install jinja2==3.1.4` гэж шинээр нэмэгдсэн dependency-г суулгаж болно.

### Дараагийн бүр асаахад

```powershell
cd clothing-color-advisor\backend
venv\Scripts\activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Browser-оор үзэх

- **Апп:** http://localhost:8000/
- **API docs (Swagger):** http://localhost:8000/docs
- **Health check:** http://localhost:8000/api/health

### ⚠️ Анхаарах зүйл

1. **Заавал `backend/` folder-оос ажиллуулна.** `main.py` нь `../frontend/templates` болон `../frontend/static`-ыг relative path-аар ашигладаг.
2. **Browser-ыг хүчээр refresh хий:** `Ctrl + F5` (эсвэл `Ctrl + Shift + R`) — хуучин CSS/JS cache-ээс болж шинэ өөрчлөлт харагдахгүй байж болно.
3. **`--reload` флаг** нь Python файлд өөрчлөлт орвол server-ийг автоматаар restart хийнэ. Frontend (HTML/CSS/JS) өөрчилсний дараа browser-аа refresh хийхэд хангалттай.

---

## 5. Файлуудын тайлбар

### Frontend JavaScript (`static/js/`)

| Файл | Үүрэг |
|---|---|
| `main.js` | Entry point. DOM ref-ийг цуглуулаад module-ууд руу `bind*Elements()` дамжуулна. Бүх event listener үүнд байна. |
| `state.js` | Хуваалцсан mutable state (`lang`, `file`, `cameraStream`, `clothing`, `outfits`) + `API_BASE`. |
| `i18n.js` | **MN/EN 2 хэлний орчуулга** (`LANG` dict) + `applyLanguage()` + `t()` helper. |
| `constants/seasons.js` | SEASON_MN/EN/DETAILS/ICONS/GRADIENTS. |
| `constants/skin.js` | FITZPATRICK, UNDERTONE, OCCASION орчуулга + loading alhams. |
| `constants/clothing-svg.js` | 6 хувцасны төрлийн SVG silhouette. |
| `constants/fabric-patterns.js` | 15 даавуу/хээний SVG pattern + `getPatternSvg()`. |
| `constants/jewelry.js` | Ring/Necklace/Earring/Bracelet SVG + metal color map. |
| `utils/color.js` | `rgbToHex`, `hexToRgb`, `getColorNameMN` (монгол/англиар өнгө нэрлэх). |
| `utils/dom.js` | `copyColor`, `showTooltip`, `setSvgFill`. `window.copyColor`-ийг set хийдэг (inline onclick-д ашиглах). |
| `services/api.js` | `POST /api/analyze` + `/api/analyze-base64` + `loadModelInfo()`. |
| `services/ui.js` | `showError`, `showUploadArea` — UI state switching. |
| `services/upload.js` | File validation, drag-drop, preview. |
| `services/camera.js` | Webcam access, capture, close. |
| `services/navbar.js` | Scroll дээр navbar-ын background өөрчлөх. |
| `services/hero-labels.js` | Hero-д гүйж байгаа label-уудыг (цамц/үс/ээмэг) солих. |
| `renderers/results.js` | Бүх result renderer-ийг дуудаж оркестрад хийнэ. |
| `renderers/profile.js` | Царай, 3 orb (арьс/үс/нүд), detail row. |
| `renderers/season.js` | Season badge, palette, ML confidence bar. |
| `renderers/clothing.js` | Clothing grid + avoid tiles. |
| `renderers/outfits.js` | Pinterest масоник grid + filter. |
| `renderers/makeup.js` | Lips/eyes/blush/nails SVG + dot row. |
| `renderers/jewelry.js` | Metals row + 4 jewelry type grid. |
| `renderers/tags.js` | Fabric/pattern card. |
| `renderers/why-color.js` | "Яагаад энэ өнгө таарна" тайлбар. |

### Frontend HTML (`templates/`)

| Файл | Үүрэг |
|---|---|
| `index.html` | Gол template. CSS link + бүх partial-ийг include хийнэ. |
| `partials/navbar.html` | Top navigation, lang toggle. |
| `partials/hero.html` | 100vh hero with photo + title. |
| `partials/stats-strip.html` | 4 statistic number (12 seasons, 42 features, гэх мэт). |
| `partials/seasons-preview.html` | 4 улирлын hover-based preview. |
| `partials/how-it-works.html` | Phone mockup + 3 alhamyn list. |
| `partials/analyze.html` | Upload card + camera card + preview + loading + error. |
| `partials/about.html` | Dashboard-маягийн diploma section (ML metric, pipeline, algorithm info). Одоо `display:none` боловч JS үүнд model info set хийдэг тул DOM-д байх хэрэгтэй. |
| `partials/footer.html` | Footer text. |
| `partials/results/index.html` | Results section-ийн shell. Профайл + season + clothing гэх мэт дэд partial-уудыг include. |
| `partials/results/profile.html` | Биометрик trio + detail row + why-color. |
| `partials/results/season.html` | Season hero badge + ML confidence bar. |
| `partials/results/clothing.html` | 6 tab (цамц/өмд/даашинз/гадуур/гутал/гоёл) + avoid. |
| `partials/results/outfits.html` | 5 tab (бүгд/өдөр тутам/ажлын/оройн/ёслолын). |
| `partials/results/makeup.html` | 4 panel (уруул/нүд/хацар/хумс). |
| `partials/results/fabrics-jewelry.html` | Fabric tag + jewelry showcase + tips. |

### Frontend CSS (`static/css/`)

| Файл | Хамрах range |
|---|---|
| `base.css` | CSS custom properties (`--accent`, `--radius-*`), reset, body/heading typography. |
| `layout.css` | `.section-title`, `.section-eyebrow`, `.section-sub` shared styles. |
| `components.css` | `.btn`, `.copied-tooltip`, `.lang-toggle`, `.float-chip`, `.tab`. |
| `navbar.css` | Navbar — transparent → scrolled state. |
| `hero.css` | Hero section (photo, overlay, title, CTA, trust row). |
| `stats-strip.css` | 4-column stat strip below hero. |
| `seasons-preview.css` | 4-улирлын preview card (hover flex грех). |
| `how-it-works.css` | 2-column phone + step list + scan line animation. |
| `analyze.css` | Upload card, camera container, loading spinner, error box. |
| `about.css` | Diploma metric + pipeline + algorithm chart + theory card. |
| `footer.css` | Footer. |
| `responsive.css` | 3 breakpoint (1280/1024/640px) — бүх section-д тусна. |
| `results/cards.css` | `.result-card` base, `.results-grid`, `.card-header`. |
| `results/profile.css` | Photo, biometric orb, detail row, why-color. |
| `results/season.css` | Season hero badge, palette chip, ML confidence bar. |
| `results/clothing.css` | Color grid + silhouette swatch + avoid tile. |
| `results/outfits.css` | Pinterest-style masonry. |
| `results/makeup.css` | Beauty 2x2 grid + SVG-ийн shadow. |
| `results/jewelry.css` | Metal chip row + 4-col type grid. |
| `results/fabrics-tips.css` | Texture card + tag pill + tips list. |

### Backend (`backend/`)

| Файл | Үүрэг |
|---|---|
| `main.py` | FastAPI app, CORS, routes (`/api/analyze`, `/api/analyze-base64`, `/api/health`, `/api/model-info`, `/`), Jinja2 template mount. |
| `analyzer/face_detector.py` | MediaPipe-аар царай илрүүлэх, 478 landmark-аас арьс/үс/нүдний region extract хийх. |
| `analyzer/skin_classifier.py` | CIE LAB, ITA angle, Fitzpatrick, 12-season classification (rule-based). |
| `analyzer/ml_classifier.py` | sklearn ensemble (GradientBoosting + RandomForest), 42 feature, 12 class. |
| `analyzer/color_recommender.py` | Season-оос хувцас/гоо сайхан/ээмэгний палитр гаргах. |
| `ml_model.joblib` | Сургасан ensemble model (pickle). |
| `dataset.csv` | 4,967 мөр, UTKFace-аас гаргасан training data. |

---

## 6. Алдаа гарвал яах вэ

### ❌ `ModuleNotFoundError: No module named 'jinja2'`

**Шалтгаан:** `jinja2` суугаагүй байна.
**Шийдэл:**
```powershell
pip install jinja2==3.1.4
```

### ❌ `uvicorn: The term 'uvicorn' is not recognized`

**Шалтгаан:** `uvicorn` command PATH-д байхгүй (venv идэвхжээгүй эсвэл суугаагүй).
**Шийдэл:**
```powershell
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### ❌ Browser дээр style-гүй хуудас харагдаж байна

**Шалтгаан:** Browser cache хуучин `style.css?v=18`-ыг ашиглаж байна.
**Шийдэл:** `Ctrl + F5` (hard refresh). Эсвэл DevTools → Network → "Disable cache" checkbox-ийг асаа.

### ❌ `TemplateNotFound: index.html`

**Шалтгаан:** `backend/` folder-ээс биш, ЕСР root-оос server-ыг асаасан.
**Шийдэл:** `cd clothing-color-advisor\backend` руу орсныг шалгаад дахин ажиллуул.

### ❌ Console-д `Failed to load module script`

**Шалтгаан:** Хуучин `app.js`-ыг reference хийсэн browser cache.
**Шийдэл:** Hard refresh (`Ctrl + F5`). Эсвэл DevTools-ийг нээгээд Application tab → Clear storage.

### ❌ Царай илрэхгүй байна

**Шалтгаан:** Зургийн гэрэлтэй байдал муу, эсвэл зүсгий царай харагдахгүй.
**Шийдэл:**
- Байгалийн гэрэлд авсан тод зураг ашиглана
- Царай нь зургийн ихээхэн хэсгийг эзэлсэн байх
- Нүүрэнд сүүдэр төрөл бүр унасан бол дахин авна

### ❌ MediaPipe суухгүй (Python 3.12+)

**Шалтгаан:** `mediapipe==0.10.33` нь Python 3.12-г дэмждэггүй.
**Шийдэл:** Python 3.10 эсвэл 3.11 суулгаад тэр дээр venv үүсгэнэ.
```powershell
py -3.11 -m venv venv
```

---

## Хураангуй

Хуучин 3 том файл (нийт **4180 мөр**) 59 жижиг файл болсон. Аль нэг component-ыг олох, өөрчлөх, debug хийх нь эрс хялбар болсон.

**Асаах богино заавар:**
```powershell
cd clothing-color-advisor\backend
venv\Scripts\activate
pip install -r requirements.txt          # эхний удаад л
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Дараа нь **http://localhost:8000/** дээр ор.
