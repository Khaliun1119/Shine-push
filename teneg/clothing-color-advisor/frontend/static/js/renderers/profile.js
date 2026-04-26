import { state } from '../state.js';
import { rgbToHex, getColorNameMN } from '../utils/color.js';
import {
    UNDERTONE_MN, UNDERTONE_EN,
    FITZPATRICK_MN, FITZPATRICK_EN,
    UNDERTONE_DESC_MN,
} from '../constants/skin.js';

export function renderProfile(data, previewSrc) {
    const { classification, detection } = data;

    renderAnalyzedPhoto(previewSrc);
    const skinHex = classification.skin_color.hex;
    renderOrb('skinOrb', 'skinHex', 'skinColorName', skinHex, 'skin');

    const hairHex = detection?.hair_rgb && (detection.hair_rgb[0] || detection.hair_rgb[1] || detection.hair_rgb[2])
        ? rgbToHex(detection.hair_rgb)
        : '#2C1810';
    renderOrb('hairOrb', 'hairHex', 'hairColorName', hairHex, 'hair');

    const eyeHex = detection?.eye_rgb && (detection.eye_rgb[0] || detection.eye_rgb[1] || detection.eye_rgb[2])
        ? rgbToHex(detection.eye_rgb)
        : '#6B4226';
    renderEyeOrb(eyeHex);

    renderDetails(classification, skinHex);
}

function renderAnalyzedPhoto(previewSrc) {
    const wrap = document.getElementById('analyzedPhotoWrap');
    const img = document.getElementById('analyzedPhoto');
    if (!wrap || !img || !previewSrc) return;
    img.src = previewSrc;
    wrap.style.display = 'block';
    wrap.querySelector('.photo-badge')?.remove();
    const badge = document.createElement('div');
    badge.className = 'photo-badge';
    badge.textContent = state.lang === 'mn' ? '✓ Шинжилгээ дууслаа' : '✓ Analysis Complete';
    wrap.appendChild(badge);
}

function renderOrb(orbId, hexId, nameId, hex, type) {
    const orb = document.getElementById(orbId);
    if (orb) orb.style.background = hex;
    document.getElementById(hexId).textContent = hex.toUpperCase();
    document.getElementById(nameId).textContent = getColorNameMN(type, hex);
}

function renderEyeOrb(eyeHex) {
    const irisBg = document.getElementById('irisBg');
    if (irisBg) irisBg.style.background = eyeHex;
    const svgIris = document.getElementById('eyeIrisSvg');
    if (svgIris) svgIris.setAttribute('fill', eyeHex);
    document.getElementById('eyeHex').textContent = eyeHex.toUpperCase();
    document.getElementById('eyeColorName').textContent = getColorNameMN('eye', eyeHex);
}

function renderDetails(classification, skinHex) {
    document.getElementById('toneName').textContent = classification.tone_name;

    const fitzMap = state.lang === 'mn' ? FITZPATRICK_MN : FITZPATRICK_EN;
    document.getElementById('fitzpatrickType').textContent =
        fitzMap[classification.fitzpatrick.type]
        || `${classification.fitzpatrick.type} — ${classification.fitzpatrick.label}`;

    const undertoneMap = state.lang === 'mn' ? UNDERTONE_MN : UNDERTONE_EN;
    document.getElementById('undertoneType').textContent =
        undertoneMap[classification.undertone.type] || classification.undertone.type;

    document.getElementById('itaAngle').textContent = `${classification.ita_angle}°`;

    const skinType = classification.undertone.type;
    if (state.lang === 'mn') {
        document.getElementById('toneDescription').textContent =
            `${getColorNameMN('skin', skinHex)} арьстай таны нүүр ${UNDERTONE_MN[skinType] || skinType} дотоод өнгөтэй.`;
        document.getElementById('undertoneDescription').textContent =
            UNDERTONE_DESC_MN[skinType] || classification.undertone.description || '';
    } else {
        document.getElementById('toneDescription').textContent = classification.tone_description || '';
        document.getElementById('undertoneDescription').textContent = classification.undertone.description || '';
    }
}
