import { state } from '../state.js';

const WHY_MAP = {
    warm: {
        mn: (ita) => `Таны арьс <strong>дулаан дотоод өнгөтэй</strong> (ITA ${ita}°) тул дулаан улаан-шар аясын өнгүүд — терракота, мөр, хуурай ногоон, зэс шар — арьсны байгалийн гялалзлыг нэмэгдүүлж, нүүрийг гэрэлтүүлнэ. Хүйтэн цэнхэр-ягаан өнгүүд арьсны ширхэгийг хүйтэн харагдуулна.`,
        en: (ita) => `Your skin has a <strong>warm undertone</strong> (ITA ${ita}°), so warm red-yellow tones — terracotta, coral, olive, amber — amplify your natural luminosity. Cool blue-pinks can make skin appear ashy.`,
    },
    cool: {
        mn: (ita) => `Таны арьс <strong>хүйтэн дотоод өнгөтэй</strong> (ITA ${ita}°) тул хүйтэн цэнхэр-ягаан аясын өнгүүд — нил, нэмрэн цэнхэр, хувцасны улаан, мөнгөлиг — арьсны байгалийн мэнгэрэмжийг тодотгоно. Улбар ба зэс аясын өнгүүд тулгарсан харагдуулж болно.`,
        en: (ita) => `Your skin has a <strong>cool undertone</strong> (ITA ${ita}°), so cool blue-pink tones — lavender, periwinkle, jewel tones, silver — enhance your natural clarity. Oranges and warm coppers can clash.`,
    },
    neutral: {
        mn: () => `Таны арьс <strong>саармаг дотоод өнгөтэй</strong> бөгөөд хүйтэн болон дулаан өнгийн аль аль нь таны арьстай зохицно. Энэ нь өнгийн сонголтын хувьд хамгийн уян хатан хэлбэр юм.`,
        en: () => `Your skin has a <strong>neutral undertone</strong>, meaning both warm and cool colors tend to harmonize beautifully. You have the most flexibility in color choices.`,
    },
};

export function populateWhyColorSection(classification, mlResult) {
    const section = document.getElementById('whyColorSection');
    const textEl = document.getElementById('whyColorText');
    const chipsEl = document.getElementById('floatChipsWrap');
    if (!section || !textEl) return;

    const undertone = classification?.undertone?.type || '';
    const ita = Math.round(classification?.ita_angle || 0);
    const fitz = classification?.fitzpatrick || '';
    const lang = state.lang;

    const key = undertone.toLowerCase().includes('warm') ? 'warm'
        : undertone.toLowerCase().includes('cool') ? 'cool'
        : 'neutral';

    const whyText = WHY_MAP[key]?.[lang]?.(ita) || WHY_MAP.neutral[lang]();
    textEl.innerHTML = whyText;
    section.style.display = 'block';

    if (!chipsEl) return;
    chipsEl.innerHTML = '';
    const chips = [
        { label: lang === 'mn' ? `Дотоод өнгө: ${undertone}` : `Undertone: ${undertone}`, color: '#C13B6E' },
        { label: `Fitzpatrick: ${fitz}`, color: '#D4847A' },
        { label: `ITA: ${ita}°`, color: '#9B7AD4' },
    ];
    chips.forEach(c => {
        if (c.label.includes('undefined') || c.label.includes('null')) return;
        const chip = document.createElement('div');
        chip.className = 'float-chip';
        chip.innerHTML = `<span class="float-chip-dot" style="background:${c.color}"></span>${c.label}`;
        chipsEl.appendChild(chip);
    });
}
