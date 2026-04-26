import { API_BASE, state } from '../state.js';
import { t } from '../i18n.js';
import { LOADING_STEPS_MN, LOADING_STEPS_EN } from '../constants/skin.js';
import { displayResults } from '../renderers/results.js';
import { showError } from './ui.js';

const dom = {
    preview: null,
    previewImage: null,
    loading: null,
    loadingStep: null,
};

export function bindApiElements(refs) {
    Object.assign(dom, refs);
}

export async function loadModelInfo() {
    try {
        const res = await fetch(`${API_BASE}/api/model-info`);
        if (!res.ok) return;
        const stats = await res.json();

        const pct = Math.round((stats.test_accuracy || 0.89) * 100);
        setText('metricAccuracy', pct + '%');
        setText('algoAccVal', pct + '%');
        setText('ensembleAccVal', pct + '%');

        const circle = document.getElementById('accuracyCircle');
        if (circle) {
            const offset = 201 * (1 - pct / 100);
            setTimeout(() => { circle.style.strokeDashoffset = offset; }, 300);
        }
        const ensembleBar = document.querySelector('.accent-bar');
        if (ensembleBar) setTimeout(() => { ensembleBar.style.width = pct + '%'; }, 400);

        if (stats.dataset_size) setText('metricDataset', stats.dataset_size.toLocaleString());
        if (stats.train_size) setText('dsTrain', stats.train_size.toLocaleString());
        if (stats.test_size) setText('dsTest', stats.test_size.toLocaleString());
    } catch {
        /* silently fall back to hardcoded HTML defaults */
    }
}

export async function analyzeImage() {
    dom.preview.style.display = 'none';
    dom.loading.style.display = 'block';

    const steps = state.lang === 'mn' ? LOADING_STEPS_MN : LOADING_STEPS_EN;
    let stepIndex = 0;
    dom.loadingStep.textContent = steps[0];
    const stepInterval = setInterval(() => {
        stepIndex++;
        if (stepIndex < steps.length) dom.loadingStep.textContent = steps[stepIndex];
    }, 500);

    try {
        const response = state.file === 'webcam'
            ? await fetch(`${API_BASE}/api/analyze-base64`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: dom.previewImage.src }),
            })
            : await fetch(`${API_BASE}/api/analyze`, {
                method: 'POST',
                body: buildFormData(state.file),
            });

        clearInterval(stepInterval);
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || t('error.title'));
        dom.loading.style.display = 'none';
        displayResults(data);
    } catch (err) {
        clearInterval(stepInterval);
        dom.loading.style.display = 'none';
        showError(t('error.title'), err.message);
    }
}

function buildFormData(file) {
    const fd = new FormData();
    fd.append('file', file);
    return fd;
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}
