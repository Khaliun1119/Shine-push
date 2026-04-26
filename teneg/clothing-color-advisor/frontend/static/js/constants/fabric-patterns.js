/* SVG pattern tiles for fabric & clothing pattern preview cards. */
export const FABRIC_PATTERNS = {
    'silk': (id) => `<svg viewBox="0 0 60 60"><defs><linearGradient id="silkG${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F8F2EC"/><stop offset="35%" stop-color="#E8D9CE"/><stop offset="65%" stop-color="#F4EDE6"/><stop offset="100%" stop-color="#D8C8BC"/></linearGradient></defs><rect width="60" height="60" rx="8" fill="url(#silkG${id})"/><path d="M0,15 Q15,10 30,15 Q45,20 60,15" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/><path d="M0,30 Q15,25 30,30 Q45,35 60,30" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1"/><path d="M0,45 Q15,40 30,45 Q45,50 60,45" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"/></svg>`,
    'cotton': () => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#F5F0EA"/>${Array.from({length:6},(_,r)=>Array.from({length:6},(_,c)=>`<circle cx="${5+c*10}" cy="${5+r*10}" r="2.5" fill="rgba(180,160,140,0.25)"/>`).join('')).join('')}<line x1="0" y1="0" x2="60" y2="60" stroke="rgba(180,160,140,0.1)" stroke-width="8"/><line x1="60" y1="0" x2="0" y2="60" stroke="rgba(180,160,140,0.1)" stroke-width="8"/></svg>`,
    'velvet': (id) => `<svg viewBox="0 0 60 60"><defs><radialGradient id="velG${id}" cx="40%" cy="35%" r="65%"><stop offset="0%" stop-color="#9B7E6E"/><stop offset="100%" stop-color="#5C3D2E"/></radialGradient></defs><rect width="60" height="60" rx="8" fill="url(#velG${id})"/>${Array.from({length:8},(_,i)=>`<line x1="0" y1="${i*8}" x2="60" y2="${i*8+4}" stroke="rgba(255,255,255,0.06)" stroke-width="3"/>`).join('')}<ellipse cx="22" cy="20" rx="18" ry="10" fill="rgba(255,255,255,0.12)" transform="rotate(-20 22 20)"/></svg>`,
    'linen': () => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#E8DDD0"/>${Array.from({length:10},(_,i)=>`<line x1="0" y1="${i*6}" x2="60" y2="${i*6}" stroke="rgba(150,130,110,0.2)" stroke-width="1"/><line x1="${i*6}" y1="0" x2="${i*6}" y2="60" stroke="rgba(150,130,110,0.15)" stroke-width="0.8"/>`).join('')}</svg>`,
    'wool': () => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#C8B89A"/>${Array.from({length:5},(_,r)=>Array.from({length:5},(_,c)=>`<path d="M${4+c*12},${4+r*12} Q${10+c*12},${-2+r*12} ${16+c*12},${4+r*12} Q${10+c*12},${10+r*12} ${4+c*12},${4+r*12}Z" fill="rgba(100,80,60,0.15)"/>`).join('')).join('')}</svg>`,
    'denim': (id) => `<svg viewBox="0 0 60 60"><defs><linearGradient id="denG${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4A6FA5"/><stop offset="100%" stop-color="#2E4D7A"/></linearGradient></defs><rect width="60" height="60" rx="8" fill="url(#denG${id})"/>${Array.from({length:12},(_,i)=>`<line x1="0" y1="${i*5}" x2="60" y2="${i*5+3}" stroke="rgba(255,255,255,0.08)" stroke-width="2.5"/>`).join('')}${Array.from({length:8},(_,i)=>`<line x1="${i*8}" y1="0" x2="${i*8+4}" y2="60" stroke="rgba(255,255,255,0.04)" stroke-width="1.5"/>`).join('')}</svg>`,
    'satin': (id) => `<svg viewBox="0 0 60 60"><defs><linearGradient id="satG${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#D4C5B8"/><stop offset="40%" stop-color="#F0E8E0"/><stop offset="60%" stop-color="#E8DCd4"/><stop offset="100%" stop-color="#C8B8AA"/></linearGradient></defs><rect width="60" height="60" rx="8" fill="url(#satG${id})"/><path d="M-10,20 Q15,10 40,20 Q55,25 80,18" fill="none" stroke="rgba(255,255,255,0.55)" stroke-width="3"/><path d="M-10,40 Q20,30 45,40 Q55,45 80,38" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"/></svg>`,
    'chiffon': () => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="rgba(240,234,226,0.9)"/>${Array.from({length:6},(_,i)=>`<path d="M0,${i*10} Q15,${i*10-4} 30,${i*10} Q45,${i*10+4} 60,${i*10}" fill="none" stroke="rgba(180,165,150,0.25)" stroke-width="1.5"/>`).join('')}</svg>`,
    'floral': () => {
        const pts = [[15,15],[45,15],[15,45],[45,45],[30,30]];
        const petals = pts.map(([x,y]) => {
            const petalSvg = [0,60,120,180,240,300].map(deg => {
                const r = deg * Math.PI / 180;
                const px = x + Math.cos(r)*7, py = y + Math.sin(r)*7;
                return `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="3" ry="2" fill="rgba(196,149,106,0.4)" transform="rotate(${deg} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
            }).join('');
            return `<circle cx="${x}" cy="${y}" r="7" fill="none" stroke="#C4956A" stroke-width="1.2"/>${petalSvg}<circle cx="${x}" cy="${y}" r="2.5" fill="#C4956A"/>`;
        }).join('');
        return `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#F5EEE8"/>${petals}</svg>`;
    },
    'stripes': () => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#F0E8E0"/>${[0,12,24,36,48].map(x=>`<rect x="${x}" y="0" width="6" height="60" fill="rgba(120,100,85,0.25)"/>`).join('')}</svg>`,
    'plaid': () => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#E8DDD4"/>${[10,30,50].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="60" stroke="rgba(100,75,60,0.35)" stroke-width="4"/>`).join('')}${[10,30,50].map(y=>`<line x1="0" y1="${y}" x2="60" y2="${y}" stroke="rgba(100,75,60,0.35)" stroke-width="4"/>`).join('')}${[10,30,50].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="60" stroke="rgba(150,120,95,0.2)" stroke-width="1.5"/>`).join('')}${[10,30,50].map(y=>`<line x1="0" y1="${y}" x2="60" y2="${y}" stroke="rgba(150,120,95,0.2)" stroke-width="1.5"/>`).join('')}</svg>`,
    'geometric': () => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#F0EBE4"/>${[[0,0],[30,0],[0,30],[30,30]].map(([x,y])=>`<polygon points="${x+15},${y+4} ${x+26},${y+26} ${x+4},${y+26}" fill="none" stroke="rgba(100,80,65,0.35)" stroke-width="1.5"/>`).join('')}</svg>`,
    'animal print': () => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#D4B896"/>${[[10,8],[30,5],[50,10],[8,28],[25,22],[45,25],[55,40],[12,42],[35,38],[50,50],[20,55]].map(([x,y])=>`<path d="M${x},${y} Q${x+5},${y-4} ${x+8},${y+2} Q${x+5},${y+6} ${x},${y+3}Z" fill="rgba(60,40,20,0.5)"/>`).join('')}</svg>`,
    'paisley': () => `<svg viewBox="0 0 60 60"><rect width="60" height="60" rx="8" fill="#EDE0D4"/>${[[15,15],[45,35]].map(([x,y])=>`<path d="M${x},${y} Q${x+10},${y-14} ${x+14},${y-4} Q${x+18},${y+8} ${x+8},${y+14} Q${x-2},${y+12} ${x},${y}Z" fill="rgba(140,100,75,0.3)" stroke="rgba(140,100,75,0.5)" stroke-width="0.8"/><circle cx="${x}" cy="${y}" r="3" fill="rgba(140,100,75,0.5)"/>`).join('')}</svg>`,
    'solid': (id) => `<svg viewBox="0 0 60 60"><defs><linearGradient id="solG${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#E8DDD4"/><stop offset="100%" stop-color="#D4C8BE"/></linearGradient></defs><rect width="60" height="60" rx="8" fill="url(#solG${id})"/><ellipse cx="20" cy="20" rx="18" ry="10" fill="rgba(255,255,255,0.15)" transform="rotate(-20 20 20)"/></svg>`,
};

export function getPatternSvg(name, index) {
    const lower = name.toLowerCase();
    for (const [key, fn] of Object.entries(FABRIC_PATTERNS)) {
        if (lower.includes(key)) return fn(index);
    }
    return FABRIC_PATTERNS['solid'](index);
}
