import { copyColor } from '../utils/dom.js';

export function renderMakeup(makeup) {
    renderMakeupPanel('makeupLips',  makeup.lips  || [], 'lips');
    renderMakeupPanel('makeupEyes',  makeup.eyes  || [], 'eyes');
    renderMakeupPanel('makeupBlush', makeup.blush || [], 'blush');
    renderMakeupPanel('makeupNails', makeup.nails || [], 'nails');
}

function renderMakeupPanel(containerId, colors, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    if (!colors.length) return;

    const firstColor = colors[0][0];

    const feat = document.createElement('div');
    feat.className = 'makeup-feat-wrap';
    feat.innerHTML = featSvg(type, firstColor, colors);
    container.appendChild(feat);

    const dotRow = document.createElement('div');
    dotRow.className = 'makeup-dot-row';
    colors.forEach(([hex, name]) => {
        const d = document.createElement('div');
        d.className = 'makeup-dot';
        d.style.background = hex;
        d.title = name;
        d.addEventListener('click', () => copyColor(hex));
        dotRow.appendChild(d);
    });
    container.appendChild(dotRow);
}

function featSvg(type, firstColor, colors) {
    if (type === 'lips') return lipsSvg(firstColor);
    if (type === 'eyes') return eyesSvg(firstColor);
    if (type === 'nails') return nailsSvg(colors.slice(0, 5));
    if (type === 'blush') return blushSvg(colors);
    return '';
}

function lipsSvg(c) {
    return `
    <svg class="lips-feat-svg" viewBox="0 0 120 68" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="lipGrad" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${c}" stop-opacity="0.75"/>
            </radialGradient>
        </defs>
        <path d="M10,34 Q30,54 60,56 Q90,54 110,34 Q90,42 60,43 Q30,42 10,34Z" fill="url(#lipGrad)"/>
        <path d="M10,34 Q24,18 40,24 Q50,14 60,24 Q70,14 80,24 Q96,18 110,34 Q90,30 60,31 Q30,30 10,34Z" fill="url(#lipGrad)"/>
        <path d="M40,24 Q50,14 60,24 Q70,14 80,24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="1.5" stroke-linecap="round"/>
        <ellipse cx="44" cy="28" rx="10" ry="3.5" fill="rgba(255,255,255,0.22)" transform="rotate(-12 44 28)"/>
        <ellipse cx="60" cy="46" rx="16" ry="5" fill="rgba(255,255,255,0.25)"/>
        <path d="M10,34 Q60,32 110,34" stroke="rgba(0,0,0,0.18)" stroke-width="0.8" fill="none"/>
        <circle cx="10" cy="34" r="3" fill="rgba(0,0,0,0.12)"/>
        <circle cx="110" cy="34" r="3" fill="rgba(0,0,0,0.12)"/>
    </svg>`;
}

function eyesSvg(shadow) {
    return `
    <svg class="eye-feat-svg" viewBox="0 0 120 75" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="shadowGrad_eye" cx="50%" cy="60%" r="60%">
                <stop offset="0%" stop-color="${shadow}" stop-opacity="0.75"/>
                <stop offset="70%" stop-color="${shadow}" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="${shadow}" stop-opacity="0"/>
            </radialGradient>
        </defs>
        <ellipse cx="60" cy="35" rx="52" ry="22" fill="url(#shadowGrad_eye)"/>
        <path d="M12,42 Q36,22 60,22 Q84,22 108,42 Q84,60 60,60 Q36,60 12,42Z" fill="white"/>
        <circle cx="60" cy="42" r="16" fill="#6B4226"/>
        <circle cx="60" cy="42" r="16" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="1.5"/>
        <circle cx="60" cy="42" r="8.5" fill="#0d0808"/>
        <circle cx="60" cy="42" r="12" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <circle cx="67" cy="35" r="5" fill="rgba(255,255,255,0.72)"/>
        <circle cx="65" cy="39" r="2" fill="rgba(255,255,255,0.3)"/>
        <path d="M12,42 Q36,22 60,22 Q84,22 108,42" stroke="#1a0808" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M14,40 L9,32" stroke="#1a0808" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M22,30 L18,22" stroke="#1a0808" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M33,23 L30,14" stroke="#1a0808" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M46,19 L44,10" stroke="#1a0808" stroke-width="2" stroke-linecap="round"/>
        <path d="M60,18 L60,9" stroke="#1a0808" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M74,19 L76,10" stroke="#1a0808" stroke-width="2" stroke-linecap="round"/>
        <path d="M87,23 L90,14" stroke="#1a0808" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M98,30 L102,22" stroke="#1a0808" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M106,40 L111,32" stroke="#1a0808" stroke-width="1.8" stroke-linecap="round"/>
        <path d="M14,44 Q36,58 60,59 Q84,58 106,44" stroke="rgba(26,8,8,0.3)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    </svg>`;
}

function nailsSvg(nailColors) {
    return `<div class="nails-row">
        ${nailColors.map(([hex], i) => `
        <svg class="nail-svg-item" viewBox="0 0 26 44" xmlns="http://www.w3.org/2000/svg"
             onclick="copyColor('${hex}')" title="${hex}">
            <defs>
                <linearGradient id="nailG${i}" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="rgba(0,0,0,0.18)"/>
                    <stop offset="40%" stop-color="rgba(255,255,255,0.0)"/>
                    <stop offset="100%" stop-color="rgba(0,0,0,0.22)"/>
                </linearGradient>
            </defs>
            <rect x="3" y="30" width="20" height="14" rx="4" fill="#F2D9C0"/>
            <path d="M3,32 Q3,14 13,12 Q23,14 23,32 Q23,40 13,42 Q3,40 3,32Z" fill="${hex}"/>
            <path d="M3,32 Q3,14 13,12 Q23,14 23,32 Q23,40 13,42 Q3,40 3,32Z" fill="url(#nailG${i})"/>
            <ellipse cx="13" cy="32" rx="6.5" ry="4" fill="rgba(255,255,255,0.28)"/>
            <ellipse cx="9" cy="22" rx="2.5" ry="6" fill="rgba(255,255,255,0.32)" transform="rotate(-10 9 22)"/>
            <path d="M5,32 Q13,29 21,32" stroke="rgba(0,0,0,0.1)" stroke-width="1" fill="none"/>
        </svg>`).join('')}
    </div>`;
}

function blushSvg(colors) {
    const [c1 = '#D08080', c2] = colors.map(c => c[0]);
    const second = c2 || c1;
    return `
    <svg class="blush-feat-svg" viewBox="0 0 120 78" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="pan1G" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stop-color="${c1}" stop-opacity="0.92"/>
                <stop offset="55%" stop-color="${c1}" stop-opacity="0.58"/>
                <stop offset="100%" stop-color="${c1}" stop-opacity="0.22"/>
            </radialGradient>
            <radialGradient id="pan2G" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stop-color="${second}" stop-opacity="0.92"/>
                <stop offset="55%" stop-color="${second}" stop-opacity="0.58"/>
                <stop offset="100%" stop-color="${second}" stop-opacity="0.22"/>
            </radialGradient>
        </defs>
        <rect x="4" y="6" width="112" height="66" rx="14" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <rect x="8" y="10" width="104" height="58" rx="11" fill="rgba(255,255,255,0.04)"/>
        <circle cx="38" cy="39" r="24" fill="rgba(0,0,0,0.25)"/>
        <circle cx="38" cy="38" r="23" fill="url(#pan1G)"/>
        <circle cx="38" cy="38" r="16" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <circle cx="38" cy="38" r="9" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <ellipse cx="30" cy="28" rx="7" ry="4" fill="rgba(255,255,255,0.18)" transform="rotate(-20 30 28)"/>
        <circle cx="82" cy="39" r="24" fill="rgba(0,0,0,0.25)"/>
        <circle cx="82" cy="38" r="23" fill="url(#pan2G)"/>
        <circle cx="82" cy="38" r="16" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <circle cx="82" cy="38" r="9" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
        <ellipse cx="74" cy="28" rx="7" ry="4" fill="rgba(255,255,255,0.18)" transform="rotate(-20 74 28)"/>
        <line x1="60" y1="12" x2="60" y2="66" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    </svg>`;
}
