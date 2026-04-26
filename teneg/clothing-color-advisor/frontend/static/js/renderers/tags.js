import { getPatternSvg } from '../constants/fabric-patterns.js';

export function renderTags(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'texture-card';
        card.innerHTML = `
            <div class="texture-preview">${getPatternSvg(item, index)}</div>
            <div class="texture-name">${item}</div>`;
        container.appendChild(card);
    });
}
