import { state } from '../state.js';

export function setSvgFill(id, color) {
    const el = document.getElementById(id);
    if (el) el.setAttribute('fill', color);
}

export function showTooltip(text) {
    const tooltip = document.querySelector('.copied-tooltip');
    if (!tooltip) return;
    tooltip.textContent = text;
    tooltip.classList.add('show');
    setTimeout(() => tooltip.classList.remove('show'), 1500);
}

export function copyColor(hex) {
    const msg = `${state.lang === 'mn' ? 'Хуулагдлаа' : 'Copied'} ${hex}`;
    navigator.clipboard.writeText(hex)
        .then(() => showTooltip(msg))
        .catch(() => {
            const input = document.createElement('input');
            input.value = hex;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            showTooltip(msg);
        });
}

/* Expose to window so inline SVG onclick="copyColor(...)" attributes still work. */
window.copyColor = copyColor;
