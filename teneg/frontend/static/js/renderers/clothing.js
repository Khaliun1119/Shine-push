import { state } from '../state.js';
import { CLOTHING_SVG } from '../constants/clothing-svg.js';
import { copyColor } from '../utils/dom.js';

export function renderClothingType(type) {
    const grid = document.getElementById('clothingGrid');
    grid.innerHTML = '';
    const svgFn = CLOTHING_SVG[type] || CLOTHING_SVG.tops;

    (state.clothing[type] || []).forEach((color, index) => {
        const el = document.createElement('div');
        el.className = 'color-swatch clothing-swatch';
        el.style.animationDelay = `${index * 0.05}s`;
        el.innerHTML = `
            <div class="clothing-silhouette">${svgFn(color.hex)}</div>
            <div class="swatch-name">${color.name}</div>
            <div class="swatch-hex">${color.hex}</div>`;
        el.addEventListener('click', () => copyColor(color.hex));
        grid.appendChild(el);
    });
}

export function renderAvoid(avoidColors) {
    const avoidGrid = document.getElementById('avoidGrid');
    avoidGrid.innerHTML = '<div class="avoid-tiles" id="avoidTiles"></div>';
    const tiles = document.getElementById('avoidTiles');
    avoidColors.forEach(color => {
        const el = document.createElement('div');
        el.className = 'avoid-tile';
        el.title = color.reason || color.name;
        el.innerHTML = `
            <div class="avoid-tile-bg" style="background:${color.hex}"></div>
            <div class="avoid-tile-x">✕</div>
            <div class="avoid-tile-name">${color.name}</div>`;
        tiles.appendChild(el);
    });
}
