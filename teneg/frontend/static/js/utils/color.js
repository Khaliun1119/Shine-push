import { state } from '../state.js';

export function rgbToHex(rgb) {
    return '#' + rgb.map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
}

export function hexToRgb(hex) {
    return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
    ];
}

/** Derive a Mongolian/English color name for skin/hair/eye based on the hex. */
export function getColorNameMN(type, hex) {
    const [r, g, b] = hexToRgb(hex);
    const max = Math.max(r, g, b) / 255;
    const min = Math.min(r, g, b) / 255;
    const l = (max + min) / 2;
    const mn = state.lang === 'mn';

    if (type === 'skin') {
        if (l > 0.75) return mn ? 'Маш цайвар' : 'Very Fair';
        if (l > 0.65) return mn ? 'Цайвар' : 'Fair';
        if (l > 0.55) return mn ? 'Дунд зэрэг' : 'Medium';
        if (l > 0.45) return mn ? 'Дулаан хүрэн' : 'Warm Tan';
        if (l > 0.32) return mn ? 'Хүрэн' : 'Brown';
        if (l > 0.18) return mn ? 'Гүн хүрэн' : 'Deep Brown';
        return mn ? 'Хар бор' : 'Ebony';
    }
    if (type === 'hair') {
        if (l > 0.72) return mn ? 'Цайвар шаргал' : 'Blonde';
        if (l > 0.55) return mn ? 'Дунд шаргал' : 'Light Brown';
        if (l > 0.38) return mn ? 'Хүрэн' : 'Brown';
        if (l > 0.22) return mn ? 'Хар хүрэн' : 'Dark Brown';
        return mn ? 'Хар' : 'Black';
    }
    if (type === 'eye') {
        const d = max - min;
        let h = 0;
        if (d > 0) {
            if (max === r / 255) h = ((g - b) / (255 * d)) % 6;
            else if (max === g / 255) h = (b - r) / (255 * d) + 2;
            else h = (r - g) / (255 * d) + 4;
            h = h * 60; if (h < 0) h += 360;
        }
        if (l < 0.22) return mn ? 'Хар хүрэн' : 'Dark Brown';
        if (h >= 200 && h < 265 && l > 0.28) return mn ? 'Цэнхэр' : 'Blue';
        if (h >= 90 && h < 185 && l > 0.22) return mn ? 'Ногоон' : 'Green';
        if (h >= 30 && h < 90 && l > 0.35) return mn ? 'Саарал ногоон' : 'Hazel';
        if (r > b && r > g * 0.8) return mn ? 'Хүрэн' : 'Brown';
        if (l > 0.5) return mn ? 'Саарал' : 'Grey';
        return mn ? 'Хар хүрэн' : 'Dark Brown';
    }
    return '';
}
