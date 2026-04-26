import { state } from '../state.js';
import { OCCASION_MN, OCCASION_EN } from '../constants/skin.js';

export function renderOutfits(outfits) {
    const grid = document.getElementById('outfitsGrid');
    grid.innerHTML = '';
    const labelMap = state.lang === 'mn' ? OCCASION_MN : OCCASION_EN;

    outfits.forEach(outfit => {
        const el = document.createElement('div');
        el.className = 'outfit-card';
        el.dataset.occasion = outfit.occasion || '';
        const occLabel = labelMap[outfit.occasion] || outfit.occasion || '';
        el.innerHTML = `
            <div class="outfit-header">
                <div class="outfit-name">${outfit.name}</div>
                <span class="outfit-occasion">${occLabel}</span>
            </div>
            <div class="outfit-colors">${outfit.colors.map(c => `<div class="outfit-color-circle" style="background:${c}" title="${c}"></div>`).join('')}</div>
            <ul class="outfit-pieces">${outfit.pieces.map(p => `<li>${p}</li>`).join('')}</ul>
            <div class="outfit-color-bar">${outfit.colors.map(c => `<div class="outfit-color-bar-seg" style="background:${c}"></div>`).join('')}</div>`;
        grid.appendChild(el);
    });
}

export function filterOutfits(occasion) {
    const source = occasion === 'all' ? state.outfits : state.outfits.filter(o => o.occasion === occasion);
    renderOutfits(source);
}
