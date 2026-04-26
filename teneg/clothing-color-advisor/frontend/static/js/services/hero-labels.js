import { state } from '../state.js';

const CLOTH_COLORS = {
    mn: ['Ягаан', 'Цэнхэр', 'Хадаг', 'Шар', 'Нил', 'Улбар', 'Улаан', 'Хөх'],
    en: ['Pink', 'Sky Blue', 'Mint', 'Yellow', 'Lavender', 'Sandy', 'Red', 'Steel Blue'],
};
const HAIR_COLORS = {
    mn: ['Хүрэн', 'Хар', 'Алтан', 'Улаан', 'Нил', 'Зэс', 'Мөнгөлиг'],
    en: ['Brown', 'Black', 'Blonde', 'Auburn', 'Indigo', 'Copper', 'Silver'],
};
const EAR_COLORS = {
    mn: ['Алт', 'Рубин', 'Зумруд', 'Сапфир', 'Аметист'],
    en: ['Gold', 'Ruby', 'Emerald', 'Sapphire', 'Amethyst'],
};

export function initHeroColorLabels() {
    let clothIdx = 0, hairIdx = 0, earIdx = 0;

    const update = () => {
        const lang = state.lang;
        const set = (id, arr, idx) => {
            const el = document.getElementById(id);
            if (el) el.textContent = arr[lang][idx % arr[lang].length];
        };
        set('clothLabel', CLOTH_COLORS, clothIdx);
        set('hairLabel', HAIR_COLORS, hairIdx);
        set('earLabel', EAR_COLORS, earIdx);
    };

    setInterval(() => { clothIdx++; update(); }, 1200);
    setInterval(() => { hairIdx++; update(); }, 1714);
    setInterval(() => { earIdx++; update(); }, 1000);
    setTimeout(update, 200);
}
