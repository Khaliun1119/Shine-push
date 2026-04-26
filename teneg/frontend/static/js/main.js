import { state } from './state.js';
import { applyLanguage } from './i18n.js';
import { bindApiElements, analyzeImage, loadModelInfo } from './services/api.js';
import { bindUiElements, showUploadArea } from './services/ui.js';
import { bindUploadElements, handleFile, clearPreview } from './services/upload.js';
import { bindCameraElements, openCamera, capturePhoto, closeCamera } from './services/camera.js';
import { bindResultElements } from './renderers/results.js';
import './utils/dom.js';

const $ = (id) => document.getElementById(id);

const SEASON_EMOJI = {
    'Warm Spring':  '🌸', 'Light Spring': '🌼', 'Clear Spring': '✨',
    'Cool Summer':  '🌊', 'Light Summer': '☁️', 'Soft Summer':  '🌸',
    'Soft Autumn':  '🍂', 'Warm Autumn':  '🍁', 'Deep Autumn':  '🎃',
    'Deep Winter':  '❄️', 'Cool Winter':  '🌨️', 'Clear Winter': '💎',
};

const SEASON_TAGS = {
    'Warm Spring':  ['Warm', 'Clear', 'Bright'],
    'Light Spring': ['Light', 'Clear', 'Warm'],
    'Clear Spring': ['Clear', 'Warm', 'Bright'],
    'Cool Summer':  ['Cool', 'Soft', 'Muted'],
    'Light Summer': ['Light', 'Cool', 'Soft'],
    'Soft Summer':  ['Soft', 'Cool', 'Muted'],
    'Soft Autumn':  ['Soft', 'Warm', 'Muted'],
    'Warm Autumn':  ['Warm', 'Soft', 'Deep'],
    'Deep Autumn':  ['Deep', 'Warm', 'Rich'],
    'Deep Winter':  ['Deep', 'Cool', 'Clear'],
    'Cool Winter':  ['Cool', 'Clear', 'Bright'],
    'Clear Winter': ['Clear', 'Cool', 'Contrast'],
};

const SEASON_DESC_SHORT = {
    'Warm Spring':  'Таны өнгийн хослол илт дулаан, алтлаг шинж чанартай.',
    'Light Spring': 'Таны нүд, үс, арьсны өнгө хөнгөн дулаан шинж чанартай.',
    'Clear Spring': 'Таны нүд болон арьсны өнгийн ялгаа тод, гэрэлт.',
    'Cool Summer':  'Таны арьсны өнгө сэрүүн дотоод өнгөтэй.',
    'Light Summer': 'Таны өнгийн хослол зөөлөн, сэрүүн, хөнгөн шинж чанартай.',
    'Soft Summer':  'Таны өнгийн хослол нам гүм, зөөлөн.',
    'Soft Autumn':  'Таны өнгийн хослол зөөлөн дулаан, нам гүм шинж чанартай.',
    'Warm Autumn':  'Таны нүд, үс, арьсны өнгийн хослол дулаан, баялаг, гүн шинж чанартай. Намрын дулаан тонус танд хамгийн тохирно.',
    'Deep Autumn':  'Таны өнгийн хослол гүн, баялаг, хуурай дулаан шинж чанартай.',
    'Deep Winter':  'Таны нүд, үс, арьсны ялгаа маш тод, хурц.',
    'Cool Winter':  'Таны өнгийн хослол сэрүүн, тод шинж чанартай.',
    'Clear Winter': 'Таны нүдний өнгө болон арьсны ялгаа маш тод, хурц.',
};

/* ── DOM refs ── */
const dom = {
    uploadArea:     $('uploadArea'),
    uploadMethods:  document.querySelector('.upload-methods'),
    fileUploadCard: $('fileUploadCard'),
    cameraCard:     $('cameraCard'),
    fileInput:      $('fileInput'),
    preview:        $('previewContainer'),
    previewImage:   $('previewImage'),
    camera:         $('cameraContainer'),
    video:          $('cameraVideo'),
    canvas:         $('cameraCanvas'),
    loading:        $('loadingContainer'),
    loadingStep:    $('loadingStep'),
    error:          $('errorContainer'),
    errorTitle:     $('errorTitle'),
    errorMessage:   $('errorMessage'),
    results:        $('results'),
};

/* ── Service bindings ── */
bindUiElements({
    uploadMethods: dom.uploadMethods,
    preview:       dom.preview,
    loading:       dom.loading,
    error:         dom.error,
    errorTitle:    dom.errorTitle,
    errorMessage:  dom.errorMessage,
});
bindUploadElements({
    uploadMethods: dom.uploadMethods,
    fileInput:     dom.fileInput,
    preview:       dom.preview,
    previewImage:  dom.previewImage,
    camera:        dom.camera,
});
bindCameraElements({
    uploadMethods: dom.uploadMethods,
    camera:        dom.camera,
    video:         dom.video,
    canvas:        dom.canvas,
    previewImage:  dom.previewImage,
});
bindApiElements({
    preview:     dom.preview,
    previewImage: dom.previewImage,
    loading:     dom.loading,
    loadingStep: dom.loadingStep,
});
bindResultElements({
    results:      dom.results,
    previewImage: dom.previewImage,
});

/* ── Upload file card ── */
dom.fileUploadCard.addEventListener('click', () => dom.fileInput.click());
dom.fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFile(e.target.files[0]);
});
dom.fileUploadCard.addEventListener('dragover', (e) => {
    e.preventDefault(); dom.fileUploadCard.classList.add('dragover');
});
dom.fileUploadCard.addEventListener('dragleave', () =>
    dom.fileUploadCard.classList.remove('dragover'));
dom.fileUploadCard.addEventListener('drop', (e) => {
    e.preventDefault(); dom.fileUploadCard.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
});

/* ── Camera ── */
dom.cameraCard.addEventListener('click', openCamera);
$('captureBtn').addEventListener('click', capturePhoto);
$('closeCameraBtn').addEventListener('click', closeCamera);

/* ── Analyze / clear ── */
$('clearBtn').addEventListener('click', clearPreview);
$('analyzeBtn').addEventListener('click', analyzeImage);
$('retryBtn')?.addEventListener('click', showUploadArea);

/* ── Language toggle ── */
$('langToggle')?.addEventListener('click', () => {
    state.lang = state.lang === 'mn' ? 'en' : 'mn';
    applyLanguage(state.lang);
    _updateLangLabel();
    _updateBrandName();
});

function _updateLangLabel() {
    const el = $('langLabel');
    if (el) el.textContent = state.lang === 'mn' ? 'MN | EN' : 'EN | MN';
}

function _updateBrandName() {
    const l1 = document.querySelector('.brand-line1');
    const l2 = document.querySelector('.brand-line2');
    if (!l1 || !l2) return;
    if (state.lang === 'mn') { l1.textContent = 'Хувийн өнгө'; l2.textContent = 'Хувцасалт'; }
    else { l1.textContent = 'Skin & Outfit'; l2.textContent = 'Advisor'; }
}

/* ── Navigation ── */
window.navigateToView = function(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.navbar-link').forEach(n => n.classList.remove('active'));
    $(`view-${viewName}`)?.classList.add('active');
    $(`nav-${viewName}`)?.classList.add('active');
    $(`topnav-${viewName}`)?.classList.add('active');
};

/* ── Result tabs ── */
window.switchResultTab = function(btn) {
    document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.results-tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $(btn.dataset.tab)?.classList.add('active');
};

/* ── Style tab switcher ── */
window.switchStyleTab = function(btn, tabId) {
    document.querySelectorAll('.style-tab-new').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.sc-card').forEach(card => {
        const show = tabId === 'all' || card.dataset.tab === tabId;
        card.style.display = show ? '' : 'none';
    });
};

/* ── New analysis ── */
window.startNewAnalysis = function() {
    window.navigateToView('analyze');
    clearPreview();
};

/* ── Post-results hook (called by renderers/results.js after displayResults) ── */
window._afterDisplayResults = function(data) {
    const { classification, recommendations } = data;
    const skinHex = classification?.skin_color?.hex || '#D08B5B';

    /* Navigate to dashboard view (show results there) */
    window.navigateToView('dashboard');
    $('results')?.style && ($('results').style.display = 'block');
    $('results-empty')?.style && ($('results-empty').style.display = 'none');
    $('analyzeNewBtn')?.style && ($('analyzeNewBtn').style.display = 'flex');

    /* ── New dashboard: season card ── */
    const seasonName = data.ml_prediction?.predicted_season ||
                       data.season ||
                       classification.season?.sub_season ||
                       (typeof classification.season === 'string' ? classification.season : null) ||
                       '—';
    _setText('dashSeason', seasonName);
    _setText('dashSeasonEmoji', SEASON_EMOJI[seasonName] || '🎨');

    const tagsEl = $('dashSeasonTags');
    if (tagsEl) {
        const tags = SEASON_TAGS[seasonName] || [];
        tagsEl.innerHTML = tags.map(t => `<span class="season-tag">${t}</span>`).join('');
    }
    _setText('dashSeasonDesc', SEASON_DESC_SHORT[seasonName] || '');

    /* ── Best color grid (squares) ── */
    const bestList = (recommendations?.clothing?.tops || []).slice(0, 16);
    const bestGrid = $('dashBestColorGrid');
    if (bestGrid) {
        bestGrid.innerHTML = bestList.map(c => {
            const hex = c.hex || c;
            return `<div class="color-sq" style="background:${hex}" title="${hex}" onclick="navigator.clipboard&&navigator.clipboard.writeText('${hex}')"></div>`;
        }).join('');
    }

    /* ── Avoid color grid (circles) ── */
    const avoidList = (recommendations?.avoid || []).slice(0, 16);
    const avoidGrid = $('dashAvoidColorGrid');
    if (avoidGrid) {
        avoidGrid.innerHTML = avoidList.map(c => {
            const hex = c.hex || c;
            return `<div class="color-circ" style="background:${hex}" title="${hex}"></div>`;
        }).join('');
    }

    /* ── Undertone display & slider ── */
    const utRaw = (classification.undertone?.type || '').toLowerCase();
    _setText('dashUndertoneDisplay', classification.undertone?.type || '—');
    const utThumb = $('dashUndertoneThumb');
    if (utThumb) {
        const pos = utRaw.includes('warm') ? '90%' : utRaw.includes('cool') ? '10%' : '50%';
        utThumb.style.left = pos;
        utThumb.className = 'ruc-thumb' + (utRaw.includes('cool') ? ' cool-thumb' : utRaw.includes('neutral') ? ' neutral-thumb' : '');
    }

    /* ── Mini makeup dots ── */
    _fillScDots('dashMakeupEye',       (recommendations?.makeup?.eyes  || []).slice(0, 4));
    _fillScDots('dashMakeupBlush',     (recommendations?.makeup?.blush || []).slice(0, 4));
    _fillScDots('dashMakeupHighlight', (recommendations?.makeup?.nails || []).slice(0, 4));
    _fillLipPills('dashMakeupLip',     (recommendations?.makeup?.lips  || []).slice(0, 4));

    /* ── Jewelry mini card ── */
    const metals = recommendations?.metals || ['Gold', 'Silver'];
    _setText('dashJewelryBest', metals[0] ? `${metals[0]} өнге` : 'Алтан өнге (Gold)');
    _setText('dashJewelryAlt',  metals[1] ? `${metals[1]} өнге` : 'Мөнгөлөг өнге (Silver)');

    /* ── Background mini dots ── */
    _fillScDots('dashBgBest',  (recommendations?.clothing?.tops || []).slice(2, 7));
    _fillScDots('dashBgAvoid', (recommendations?.avoid          || []).slice(0, 5));

    /* ── Avoid mini grid (12 circles) ── */
    const avoidMini = $('dashMiniAvoid');
    if (avoidMini) {
        avoidMini.innerHTML = (recommendations?.avoid || []).slice(0, 12).map(c => {
            const hex = c.hex || c;
            return `<div class="sc-avoid-circ" style="background:${hex}" title="${hex}"></div>`;
        }).join('');
    }

    /* ── Clothing color dots ── */
    const clothingBestEl = $('dashClothingBest');
    if (clothingBestEl) {
        clothingBestEl.innerHTML = (recommendations?.clothing?.tops || []).slice(0, 8).map(c => {
            const hex = c.hex || c;
            return `<div class="css-color-dot" style="background:${hex}" title="${hex}"></div>`;
        }).join('');
    }
    const clothingAvoidEl = $('dashClothingAvoid');
    if (clothingAvoidEl) {
        clothingAvoidEl.innerHTML = (recommendations?.avoid || []).slice(0, 8).map(c => {
            const hex = c.hex || c;
            return `<div class="css-color-dot" style="background:${hex}" title="${hex}"></div>`;
        }).join('');
    }

    /* ── Hair swatches ── */
    const hairEl = $('dashHairSwatches');
    const hairSwatches = [
        { bg: '#1A0A04', label: 'Хар' },
        { bg: '#3B1A0E', label: 'Хүрэн хар' },
        { bg: '#6B3A2A', label: 'Хүрэн' },
        { bg: '#A0522D', label: 'Улаавтар' },
        { bg: '#C49A6C', label: 'Алтлаг' },
        { bg: '#8B7355', label: 'Саарал' },
    ];
    if (hairEl) {
        hairEl.innerHTML = hairSwatches.map(s =>
            `<div class="css-hair-swatch" style="background:${s.bg}">
                <span class="css-hair-swatch-label">${s.label}</span>
            </div>`
        ).join('');
    }

    /* Overview panel */
    _setStyle('overviewSkinSwatch', 'background', skinHex);
    _setText('overviewFitz', classification.fitzpatrick?.type || '—');
    _setText('overviewToneName', classification.tone_name || '—');
    _setText('overviewUndertone', classification.undertone?.type || '—');
    _setText('overviewIta', classification.ita_angle ? `${classification.ita_angle}°` : '—');

    const op = $('overviewPhoto');
    if (op && dom.previewImage?.src) {
        op.src = dom.previewImage.src; op.style.display = 'block';
        $('overviewPhotoPlaceholder')?.style && ($('overviewPhotoPlaceholder').style.display = 'none');
    }

    /* Harmony dots */
    const best  = (recommendations?.clothing?.tops    || []).slice(0, 5);
    const extra = (recommendations?.clothing?.dresses || []).slice(0, 5);
    const avoid = (recommendations?.avoid || []).slice(0, 5);
    _fillHarmony('overviewBestDots',  best);
    _fillHarmony('overviewExtraDots', extra);
    _fillHarmony('overviewAvoidDots', avoid);

    /* Undertone highlight */
    const ut = (classification.undertone?.type || '').toLowerCase();
    document.querySelectorAll('.undertone-card').forEach(c => c.classList.remove('active'));
    if (ut.includes('warm')) $('utWarm')?.classList.add('active');
    else if (ut.includes('cool')) $('utCool')?.classList.add('active');
    else $('utNeutral')?.classList.add('active');
    _setText('undertoneDetailDesc', classification.undertone?.description || '');

    /* Dashboard */
    $('dash-no-results')?.style && ($('dash-no-results').style.display = 'none');
    $('dash-results')?.style && ($('dash-results').style.display = 'block');
    _setText('dashToneName', classification.tone_name || '—');
    _setText('dashFitz', classification.fitzpatrick?.type || '—');
    _setText('dashUndertone', classification.undertone?.type || '—');

    const conf = Math.round(((data.ml_prediction?.[0]?.[1]) || 0) * 100);
    _setText('dashConfScore', conf ? `${conf}%` : '—');
    const bar = $('dashConfBar');
    if (bar) setTimeout(() => { bar.style.width = `${conf}%`; }, 200);

    const dp = $('dashPhoto');
    if (dp && dom.previewImage?.src) {
        dp.src = dom.previewImage.src; dp.style.display = 'block';
        $('dashPhotoPlaceholder')?.style && ($('dashPhotoPlaceholder').style.display = 'none');
    }

    /* Background comparison — use uploaded photo */
    if (dom.previewImage?.src) {
        const bgGood = $('dashBgGoodPhoto');
        const bgBad  = $('dashBgBadPhoto');
        if (bgGood) bgGood.src = dom.previewImage.src;
        if (bgBad)  bgBad.src  = dom.previewImage.src;
    }

    /* Outfit style grid — color from season palette */
    const outfitGrid = $('dashOutfitStyles');
    if (outfitGrid) {
        const topColors = (recommendations?.clothing?.tops || []).slice(0, 4);
        const labels    = ['Casual', 'Офис', 'Гоёл', 'Энгийн'];
        const fallbacks = ['#D4B896', '#8B7355', '#7B8C5A', '#C08050'];
        outfitGrid.innerHTML = labels.map((label, i) => {
            const hex = topColors[i] ? (topColors[i].hex || topColors[i]) : fallbacks[i];
            const hex2 = topColors[(i + 2) % 4] ? (topColors[(i + 2) % 4].hex || topColors[(i + 2) % 4]) : fallbacks[(i + 1) % 4];
            return `<div class="css-outfit-item" style="background:linear-gradient(160deg,${hex},${hex2});">
                <div class="css-outfit-label">${label}</div>
            </div>`;
        }).join('');
    }

    _renderColorDots('dashDetectedDots', [
        skinHex,
        data.detection?.hair_rgb ? _rgb2hex(data.detection.hair_rgb) : '#3B1A0E',
        data.detection?.eye_rgb  ? _rgb2hex(data.detection.eye_rgb)  : '#6B4226',
    ]);
    _renderColorDots('dashRecommendDots',
        (recommendations?.clothing?.tops || []).slice(0, 6).map(c => c.hex || c));

    /* Show content in other views */
    $('colors-content')?.style && ($('colors-content').style.display = 'block');
    $('colors-empty')?.style && ($('colors-empty').style.display = 'none');
    $('outfits-content')?.style && ($('outfits-content').style.display = 'block');
    $('outfits-empty')?.style && ($('outfits-empty').style.display = 'none');
};

function _fillHarmony(id, list) {
    const el = $(id);
    if (!el) return;
    el.innerHTML = list.map(c => {
        const hex = c.hex || c;
        return `<div class="harmony-dot" style="background:${hex}" title="${hex}"></div>`;
    }).join('');
}

function _renderColorDots(id, hexList) {
    const el = $(id);
    if (!el) return;
    el.innerHTML = hexList.filter(Boolean).map(hex =>
        `<div class="dash-color-dot" style="background:${hex}" title="${hex}"></div>`
    ).join('');
}

function _setText(id, text) {
    const el = $(id); if (el) el.textContent = text;
}
function _setStyle(id, prop, val) {
    const el = $(id); if (el) el.style[prop] = val;
}
function _rgb2hex([r, g, b]) {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
function _fillMiniDots(id, colorList) {
    const el = $(id);
    if (!el) return;
    el.innerHTML = colorList.map(c => {
        const hex = Array.isArray(c) ? c[0] : (c.hex || c);
        return `<div class="mini-dot" style="background:${hex}" title="${hex}"></div>`;
    }).join('');
}
function _fillScDots(id, colorList) {
    const el = $(id);
    if (!el) return;
    el.innerHTML = colorList.map(c => {
        const hex = Array.isArray(c) ? c[0] : (c.hex || c);
        return `<div class="sc-dot" style="background:${hex}" title="${hex}"></div>`;
    }).join('');
}
function _fillLipPills(id, colorList) {
    const el = $(id);
    if (!el) return;
    el.innerHTML = colorList.map(c => {
        const hex = Array.isArray(c) ? c[0] : (c.hex || c);
        return `<div class="sc-lip-pill" style="background:${hex}" title="${hex}"></div>`;
    }).join('');
}

/* ── Loading animation ── */
let _loadingAnimTimer = null;

function _startLoadingAnim() {
    ['astep1', 'astep2', 'astep3'].forEach(id => $(`${id}`)?.classList.remove('ast-visible'));
    const fill = $('aprFill'); const pct = $('aprPercent');
    if (fill) fill.style.strokeDashoffset = '628.32';
    if (pct) pct.textContent = '0%';

    [1200, 5000, 10000].forEach((delay, i) => {
        setTimeout(() => { $(`astep${i + 1}`)?.classList.add('ast-visible'); }, delay);
    });

    let progress = 0;
    clearInterval(_loadingAnimTimer);
    _loadingAnimTimer = setInterval(() => {
        if (progress >= 88) return;
        const speed = progress < 40 ? 1.6 : progress < 70 ? 0.8 : 0.28;
        progress = Math.min(progress + speed + Math.random() * 0.6, 88);
        if (fill) fill.style.strokeDashoffset = 628.32 * (1 - progress / 100);
        if (pct) pct.textContent = Math.round(progress) + '%';
    }, 300);
}

function _stopLoadingAnim() {
    clearInterval(_loadingAnimTimer);
}

const _lc = $('loadingContainer');
if (_lc) {
    new MutationObserver(() => {
        _lc.style.display !== 'none' ? _startLoadingAnim() : _stopLoadingAnim();
    }).observe(_lc, { attributes: true, attributeFilter: ['style'] });
}

/* ── Init ── */
applyLanguage(state.lang);
_updateLangLabel();
loadModelInfo();
