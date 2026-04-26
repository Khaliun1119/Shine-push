import { state } from '../state.js';
import { JEWELRY_SVGS, resolveMetalColor } from '../constants/jewelry.js';

const JEWELRY_LABELS = {
    mn: { ring: 'Бөгж', necklace: 'Зүүлт', earring: 'Ээмэг', bracelet: 'Бугуйн' },
    en: { ring: 'Ring', necklace: 'Necklace', earring: 'Earring', bracelet: 'Bracelet' },
};

export function renderJewelry(metals) {
    const showcase = document.getElementById('jewelryShowcase');
    if (!showcase) return;
    showcase.innerHTML = '';

    const resolved = (metals.length ? metals : ['Gold', 'Silver']).map(name => ({
        name,
        color: resolveMetalColor(name),
    }));

    showcase.appendChild(buildMetalsRow(resolved));
    showcase.appendChild(buildTypeGrid(resolved));
}

function buildMetalsRow(metals) {
    const row = document.createElement('div');
    row.className = 'jewelry-metals-row';
    row.innerHTML = metals.map(({ name, color }) => `
        <div class="jewelry-metal-chip">
            <div class="jewelry-metal-dot" style="background:${color};box-shadow:0 2px 8px ${color}55"></div>
            <span class="jewelry-metal-name">${name}</span>
        </div>`).join('');
    return row;
}

function buildTypeGrid(metals) {
    const grid = document.createElement('div');
    grid.className = 'jewelry-type-grid';
    const labels = JEWELRY_LABELS[state.lang] || JEWELRY_LABELS.mn;
    const primary = metals[0] || { color: '#D4AF37', name: 'Gold' };

    grid.innerHTML = Object.keys(JEWELRY_SVGS).map((key, idx) => {
        const metal = metals[idx % metals.length] || primary;
        const svg = JEWELRY_SVGS[key](metal.color, `${key}_${idx}`);
        return `
            <div class="jewelry-type-item">
                <div class="jewelry-type-icon">${svg}</div>
                <div class="jewelry-type-label">${labels[key]}</div>
                <div class="jewelry-metal-badge" style="color:${metal.color}">${metal.name}</div>
            </div>`;
    }).join('');
    return grid;
}
