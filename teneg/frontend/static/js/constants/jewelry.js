export const METAL_COLORS = {
    'gold': '#D4AF37', 'yellow gold': '#D4AF37', 'алт': '#D4AF37',
    'silver': '#B8B8B8', 'мөнгө': '#B8B8B8',
    'rose gold': '#C9806A', 'ягаан алт': '#C9806A',
    'bronze': '#CD7F32', 'хүрэл': '#CD7F32',
    'copper': '#B87333', 'зэс': '#B87333',
    'platinum': '#D4D4D4', 'платин': '#D4D4D4',
    'pewter': '#96A8A1',
};

export const JEWELRY_SVGS = {
    ring: (mc, ml) => `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="ringG_${ml}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${mc}" stop-opacity="1"/>
                <stop offset="30%" stop-color="rgba(255,255,255,0.7)"/>
                <stop offset="60%" stop-color="${mc}" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="${mc}" stop-opacity="0.5"/>
            </linearGradient>
            <radialGradient id="gemG_${ml}" cx="45%" cy="35%" r="55%">
                <stop offset="0%" stop-color="rgba(255,255,255,0.95)"/>
                <stop offset="40%" stop-color="rgba(200,220,255,0.7)"/>
                <stop offset="100%" stop-color="rgba(150,170,220,0.4)"/>
            </radialGradient>
        </defs>
        <path d="M15,55 Q15,30 40,28 Q65,30 65,55" stroke="url(#ringG_${ml})" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M15,55 Q15,62 40,64 Q65,62 65,55" stroke="url(#ringG_${ml})" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M29,32 L28,20 M40,29 L40,17 M51,32 L52,20" stroke="${mc}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>
        <path d="M28,30 L40,18 L52,30 L48,36 L40,38 L32,36 Z" fill="url(#gemG_${ml})" stroke="${mc}" stroke-width="0.8" opacity="0.9"/>
        <line x1="28" y1="30" x2="40" y2="34" stroke="rgba(255,255,255,0.5)" stroke-width="0.6"/>
        <line x1="52" y1="30" x2="40" y2="34" stroke="rgba(255,255,255,0.3)" stroke-width="0.6"/>
        <line x1="40" y1="18" x2="40" y2="34" stroke="rgba(255,255,255,0.4)" stroke-width="0.6"/>
        <circle cx="37" cy="23" r="3" fill="rgba(255,255,255,0.65)"/>
        <path d="M18,52 Q20,38 40,35" stroke="rgba(255,255,255,0.35)" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,

    necklace: (mc, ml) => `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="chainG_${ml}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${mc}"/>
                <stop offset="50%" stop-color="rgba(255,255,255,0.8)"/>
                <stop offset="100%" stop-color="${mc}" stop-opacity="0.7"/>
            </linearGradient>
            <radialGradient id="pendG_${ml}" cx="40%" cy="30%" r="60%">
                <stop offset="0%" stop-color="rgba(255,255,255,0.9)"/>
                <stop offset="100%" stop-color="${mc}" stop-opacity="0.7"/>
            </radialGradient>
        </defs>
        <path d="M8,14 Q40,5 72,14 Q55,32 40,38 Q25,32 8,14Z" fill="none" stroke="url(#chainG_${ml})" stroke-width="2.2" stroke-linecap="round"/>
        ${[0.15,0.3,0.45,0.55,0.7,0.85].map(t=>{
            const x=8+64*t, y=14+Math.sin(Math.PI*t)*18;
            return `<ellipse cx="${x}" cy="${y}" rx="2.8" ry="1.6" stroke="${mc}" stroke-width="1.2" fill="none" transform="rotate(${-30+t*60} ${x} ${y})"/>`;
        }).join('')}
        <line x1="40" y1="38" x2="40" y2="48" stroke="${mc}" stroke-width="1.8"/>
        <path d="M32,58 L40,47 L48,58 L44,64 L40,66 L36,64 Z" fill="url(#pendG_${ml})" stroke="${mc}" stroke-width="1"/>
        <line x1="32" y1="58" x2="40" y2="62" stroke="rgba(255,255,255,0.45)" stroke-width="0.7"/>
        <line x1="48" y1="58" x2="40" y2="62" stroke="rgba(255,255,255,0.25)" stroke-width="0.7"/>
        <circle cx="37" cy="52" r="3" fill="rgba(255,255,255,0.6)"/>
    </svg>`,

    earring: (mc, ml) => `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="earG_${ml}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${mc}"/>
                <stop offset="45%" stop-color="rgba(255,255,255,0.75)"/>
                <stop offset="100%" stop-color="${mc}" stop-opacity="0.7"/>
            </linearGradient>
            <radialGradient id="earGemG_${ml}" cx="40%" cy="30%" r="58%">
                <stop offset="0%" stop-color="rgba(255,255,255,0.95)"/>
                <stop offset="100%" stop-color="${mc}" stop-opacity="0.5"/>
            </radialGradient>
        </defs>
        <path d="M40,6 Q52,6 54,16 Q56,24 50,28" stroke="${mc}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <line x1="40" y1="28" x2="40" y2="38" stroke="${mc}" stroke-width="2"/>
        <path d="M30,50 L40,37 L50,50 L46,60 L40,63 L34,60 Z" fill="url(#earGemG_${ml})" stroke="${mc}" stroke-width="1"/>
        <line x1="30" y1="50" x2="40" y2="58" stroke="rgba(255,255,255,0.5)" stroke-width="0.8"/>
        <line x1="50" y1="50" x2="40" y2="58" stroke="rgba(255,255,255,0.3)" stroke-width="0.8"/>
        <line x1="40" y1="37" x2="40" y2="58" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
        <circle cx="37" cy="43" r="3.5" fill="rgba(255,255,255,0.65)"/>
        <circle cx="40" cy="10" r="4" fill="url(#earG_${ml})" stroke="${mc}" stroke-width="0.8"/>
    </svg>`,

    bracelet: (mc, ml) => `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bracG_${ml}" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="${mc}"/>
                <stop offset="35%" stop-color="rgba(255,255,255,0.75)"/>
                <stop offset="65%" stop-color="${mc}" stop-opacity="0.85"/>
                <stop offset="100%" stop-color="${mc}" stop-opacity="0.55"/>
            </linearGradient>
        </defs>
        <ellipse cx="40" cy="44" rx="30" ry="16" stroke="url(#bracG_${ml})" stroke-width="6" fill="none"/>
        <ellipse cx="40" cy="44" rx="30" ry="16" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" fill="none"/>
        ${[-0.7,-0.3,0,0.3,0.7].map(t=>{
            const a=Math.asin(t)*1;
            const x=40+30*Math.cos(Math.PI/2+a);
            const y=44+16*Math.sin(Math.PI/2+a);
            return `<circle cx="${x}" cy="${y}" r="2.8" fill="${mc}" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>`;
        }).join('')}
        <path d="M31,42 L40,32 L49,42 L46,50 L40,52 L34,50 Z" fill="rgba(220,240,255,0.75)" stroke="${mc}" stroke-width="1.2"/>
        <circle cx="37" cy="38" r="3.2" fill="rgba(255,255,255,0.7)"/>
        <path d="M12,38 Q20,30 40,30" stroke="rgba(255,255,255,0.35)" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
};

export function resolveMetalColor(name) {
    const lower = name.toLowerCase();
    for (const [key, val] of Object.entries(METAL_COLORS)) {
        if (lower.includes(key)) return val;
    }
    return '#D4AF37';
}
