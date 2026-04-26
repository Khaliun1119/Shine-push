import { state } from '../state.js';
import { applyLanguage } from '../i18n.js';
import { renderProfile } from './profile.js';
import { renderSeason } from './season.js';
import { renderClothingType, renderAvoid } from './clothing.js';
import { renderOutfits, filterOutfits } from './outfits.js';
import { renderMakeup } from './makeup.js';
import { renderJewelry } from './jewelry.js';
import { renderTags } from './tags.js';
import { populateWhyColorSection } from './why-color.js';

const dom = {
    results: null,
    previewImage: null,
};

export function bindResultElements(refs) {
    Object.assign(dom, refs);
}

export function displayResults(data) {
    const { classification, recommendations } = data;

    renderProfile(data, dom.previewImage?.src);
    try { populateWhyColorSection(classification, data.ml_prediction); } catch { /* non-critical */ }
    renderSeason(data);

    state.clothing = recommendations.clothing || {};
    activateFirstTab('clothingTabs', 'tops');
    renderClothingType('tops');

    renderAvoid(recommendations.avoid || []);

    state.outfits = recommendations.outfits || [];
    activateFirstTab('outfitTabs', 'all');
    renderOutfits(state.outfits);

    renderMakeup(recommendations.makeup || {});
    renderJewelry(recommendations.metals || []);
    renderTags('fabricTags', recommendations.fabrics || []);
    renderTags('patternTags', recommendations.patterns || []);
    renderTips(recommendations.tips || []);

    /* Re-apply i18n so newly visible data-i18n elements get their translations. */
    applyLanguage(state.lang);
    /* Sidebar SPA: navigate to results view and populate overview/dashboard */
    if (typeof window._afterDisplayResults === 'function') {
        window._afterDisplayResults(data);
    } else {
        dom.results.style.display = 'block';
        dom.results.scrollIntoView({ behavior: 'smooth' });
    }
}

function activateFirstTab(containerId, defaultTab) {
    document.querySelectorAll(`#${containerId} .tab`).forEach(t => t.classList.remove('active'));
    document.querySelector(`#${containerId} .tab[data-tab="${defaultTab}"]`)?.classList.add('active');
}

function renderTips(tips) {
    const list = document.getElementById('tipsList');
    list.innerHTML = '';
    tips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        list.appendChild(li);
    });
}

export { filterOutfits };
