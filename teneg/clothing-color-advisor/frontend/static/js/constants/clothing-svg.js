/* Clothing silhouette SVGs — returns SVG markup tinted with the given hex. */
export const CLOTHING_SVG = {
    tops: (c) => `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="tG${c.replace('#','')}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${c}" stop-opacity="0.78"/>
            </linearGradient>
        </defs>
        <path d="M10,18 L0,36 L14,40 L14,82 L66,82 L66,40 L80,36 L70,18 L54,28 Q40,34 26,28 Z" fill="url(#tG${c.replace('#','')})" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <path d="M26,28 Q34,38 40,36 Q46,38 54,28 Q48,22 40,24 Q32,22 26,28Z" fill="${c}" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/>
        <path d="M14,40 L14,82" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
        <path d="M16,28 Q22,50 20,75" stroke="rgba(255,255,255,0.12)" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    bottoms: (c) => `<svg viewBox="0 0 76 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bG${c.replace('#','')}" x1="0" y1="0" x2="0.3" y2="1">
                <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${c}" stop-opacity="0.8"/>
            </linearGradient>
        </defs>
        <rect x="4" y="4" width="68" height="12" rx="4" fill="${c}" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
        <path d="M4,16 L4,92 Q16,96 26,92 L38,52 L38,16 Z" fill="url(#bG${c.replace('#','')})" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
        <path d="M72,16 L72,92 Q60,96 50,92 L38,52 L38,16 Z" fill="url(#bG${c.replace('#','')})" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
        <line x1="38" y1="16" x2="38" y2="52" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <path d="M8,20 Q10,55 12,88" stroke="rgba(255,255,255,0.18)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    dresses: (c) => `<svg viewBox="0 0 80 110" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="dG${c.replace('#','')}" x1="0" y1="0" x2="0.4" y2="1">
                <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${c}" stop-opacity="0.82"/>
            </linearGradient>
        </defs>
        <path d="M22,8 L8,28 L18,32 L18,54 L62,54 L62,32 L72,28 L58,8 Q46,16 40,14 Q34,16 22,8Z" fill="url(#dG${c.replace('#','')})" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <path d="M18,54 L4,106 L76,106 L62,54 Z" fill="url(#dG${c.replace('#','')})" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
        <path d="M28,10 Q34,20 40,18 Q46,20 52,10" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/>
        <line x1="18" y1="54" x2="62" y2="54" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <path d="M20,30 Q22,58 14,100" stroke="rgba(255,255,255,0.15)" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

    outerwear: (c) => `<svg viewBox="0 0 88 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="oG${c.replace('#','')}" x1="0" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${c}" stop-opacity="0.8"/>
            </linearGradient>
        </defs>
        <path d="M12,20 L0,44 L16,48 L16,92 L72,92 L72,48 L88,44 L76,20 L58,30 Q44,38 30,30 Z" fill="url(#oG${c.replace('#','')})" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <path d="M30,30 L28,50 L44,44 L44,20 Q38,24 30,30Z" fill="${c}" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/>
        <path d="M58,30 L60,50 L44,44 L44,20 Q50,24 58,30Z" fill="${c}" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/>
        <line x1="44" y1="50" x2="44" y2="90" stroke="rgba(0,0,0,0.12)" stroke-width="1" stroke-dasharray="2 4"/>
        <path d="M16,50 Q18,68 18,88" stroke="rgba(255,255,255,0.18)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    shoes: (c) => `<svg viewBox="0 0 90 60" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="sG${c.replace('#','')}" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${c}" stop-opacity="0.82"/>
            </linearGradient>
        </defs>
        <rect x="62" y="36" width="10" height="18" rx="2" fill="${c}" stroke="rgba(0,0,0,0.15)" stroke-width="1"/>
        <path d="M4,50 Q44,56 72,54 L72,54 L62,54 L62,54 Q58,56 4,54 Z" fill="rgba(0,0,0,0.22)" rx="3"/>
        <path d="M4,48 Q8,28 28,24 Q48,20 62,28 L72,36 L62,36 Q50,32 34,34 Q16,36 12,48 Z" fill="url(#sG${c.replace('#','')})" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <path d="M8,42 Q18,30 32,28" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,

    accessories: (c) => `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="aG${c.replace('#','')}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${c}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${c}" stop-opacity="0.8"/>
            </linearGradient>
        </defs>
        <rect x="8" y="28" width="64" height="46" rx="6" fill="url(#aG${c.replace('#','')})" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <path d="M8,28 Q8,18 40,16 Q72,18 72,28 L72,44 Q56,38 40,38 Q24,38 8,44 Z" fill="${c}" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
        <path d="M24,28 Q24,10 40,8 Q56,10 56,28" fill="none" stroke="${c}" stroke-width="4" stroke-linecap="round"/>
        <path d="M24,28 Q24,10 40,8 Q56,10 56,28" fill="none" stroke="rgba(0,0,0,0.15)" stroke-width="4" stroke-linecap="round"/>
        <rect x="34" y="38" width="12" height="8" rx="3" fill="rgba(255,255,255,0.35)" stroke="rgba(0,0,0,0.12)" stroke-width="0.8"/>
        <path d="M12,32 Q14,52 14,68" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
};
