/**
 * Palette Export — generates a branded PNG image of the full color palette
 * and triggers a browser download.
 */

export function exportPalette(data) {
    const { classification, recommendations, detection } = data;
    const colors = recommendations.all_colors || [];
    const avoid  = recommendations.avoid  || [];

    const W        = 900;
    const PAD      = 36;
    const HEADER_H = 140;
    const CHIP_R   = 36;   // circle radius
    const CHIP_GAP = 22;
    const COLS     = 6;
    const CHIP_STEP = (CHIP_R * 2) + CHIP_GAP + 28; // row height per swatch

    const goodRows  = Math.ceil(colors.length / COLS);
    const avoidRows = Math.ceil(avoid.length  / COLS);
    const H = HEADER_H + PAD
            + 28 + goodRows  * CHIP_STEP + PAD
            + 28 + avoidRows * CHIP_STEP + PAD
            + 60; // footer

    const canvas = document.createElement('canvas');
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');

    /* ── Background ── */
    ctx.fillStyle = '#f8f9ff';
    ctx.fillRect(0, 0, W, H);

    /* ── Header band ── */
    const hGrad = ctx.createLinearGradient(0, 0, W, 0);
    hGrad.addColorStop(0, '#1e1b4b');
    hGrad.addColorStop(1, '#312e81');
    ctx.fillStyle = hGrad;
    _roundRect(ctx, 0, 0, W, HEADER_H, { tl: 0, tr: 0, br: 16, bl: 16 });
    ctx.fill();

    /* Skin swatch circle in header */
    const skinHex = classification.skin_color?.hex || '#D4A574';
    ctx.beginPath();
    ctx.arc(PAD + 36, HEADER_H / 2, 36, 0, Math.PI * 2);
    ctx.fillStyle = skinHex;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 3;
    ctx.stroke();

    /* Header text */
    const season = classification.season?.sub_season || classification.season?.primary || 'Color Palette';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(season, PAD + 90, HEADER_H / 2 - 12);

    ctx.font = '14px Inter, Arial, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    const undertone = classification.undertone?.type || '';
    const toneName  = classification.tone_name || '';
    ctx.fillText(`${toneName}  ·  ${undertone} Undertone  ·  Fitzpatrick ${classification.fitzpatrick?.type || '—'}`, PAD + 90, HEADER_H / 2 + 14);

    /* Confidence badge */
    const conf = data.ml_prediction?.confidence;
    if (conf) {
        const pct = Math.round(conf * 100);
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        _roundRect(ctx, W - PAD - 110, HEADER_H / 2 - 22, 110, 44, 8);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Inter, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${pct}%`, W - PAD - 55, HEADER_H / 2 - 1);
        ctx.font = '11px Inter, Arial, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.fillText('ML Accuracy', W - PAD - 55, HEADER_H / 2 + 16);
    }

    let y = HEADER_H + PAD;

    /* ── Good colors section ── */
    y = _drawSection(ctx, colors, y, W, PAD, COLS, CHIP_R, CHIP_STEP, {
        label:      '✓  ТОХИРОХ ӨНГҮҮД',
        labelColor: '#16a34a',
        lineColor:  '#16a34a',
        isAvoid:    false,
    });

    y += PAD;

    /* ── Avoid colors section ── */
    _drawSection(ctx, avoid, y, W, PAD, COLS, CHIP_R, CHIP_STEP, {
        label:      '✕  ЗАЙЛСХИЙХ ӨНГҮҮД',
        labelColor: '#dc2626',
        lineColor:  '#dc2626',
        isAvoid:    true,
    });

    /* ── Footer ── */
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(PAD, H - 48, W - PAD * 2, 1);
    ctx.font = '12px Inter, Arial, sans-serif';
    ctx.fillStyle = '#aaa';
    ctx.textAlign = 'left';
    ctx.fillText('Хувийн өнгө · Хувцаслалт зөвлөгч  —  AI Өнгийн Шинжилгээ', PAD, H - 20);
    ctx.textAlign = 'right';
    ctx.fillText(new Date().toLocaleDateString('mn-MN'), W - PAD, H - 20);

    /* ── Download ── */
    const link = document.createElement('a');
    link.download = `${season.replace(/\s+/g, '-')}-palette.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

/* ── Section renderer ── */
function _drawSection(ctx, colors, startY, W, PAD, COLS, CHIP_R, CHIP_STEP, opts) {
    const { label, labelColor, isAvoid } = opts;

    /* Section label */
    ctx.font = 'bold 13px Inter, Arial, sans-serif';
    ctx.fillStyle = labelColor;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(label, PAD, startY + 16);

    /* Underline */
    ctx.fillStyle = labelColor;
    ctx.globalAlpha = 0.25;
    ctx.fillRect(PAD, startY + 20, 180, 2);
    ctx.globalAlpha = 1;

    let y = startY + 32;

    const availW = W - PAD * 2;
    const cellW  = availW / COLS;

    colors.forEach((c, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const cx  = PAD + col * cellW + cellW / 2;
        const cy  = y + row * CHIP_STEP + CHIP_R;

        /* Soft shadow */
        ctx.shadowColor   = 'rgba(0,0,0,0.14)';
        ctx.shadowBlur    = 8;
        ctx.shadowOffsetY = 3;

        /* Circle */
        ctx.beginPath();
        ctx.arc(cx, cy, CHIP_R, 0, Math.PI * 2);
        ctx.fillStyle = c.hex;
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.shadowBlur  = 0;

        /* Avoid X overlay */
        if (isAvoid) {
            ctx.strokeStyle = 'rgba(220,38,38,0.55)';
            ctx.lineWidth = 2.5;
            const d = CHIP_R * 0.52;
            ctx.beginPath();
            ctx.moveTo(cx - d, cy - d); ctx.lineTo(cx + d, cy + d);
            ctx.moveTo(cx + d, cy - d); ctx.lineTo(cx - d, cy + d);
            ctx.stroke();
        }

        /* Color name */
        ctx.font = '600 10px Inter, Arial, sans-serif';
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        const name = c.name.length > 12 ? c.name.slice(0, 11) + '…' : c.name;
        ctx.fillText(name, cx, cy + CHIP_R + 14);

        /* Hex */
        ctx.font = '9px "Courier New", monospace';
        ctx.fillStyle = '#888';
        ctx.fillText(c.hex.toUpperCase(), cx, cy + CHIP_R + 26);
    });

    const rows = Math.ceil(colors.length / COLS);
    return startY + 32 + rows * CHIP_STEP;
}

/* ── Utility: rounded rectangle path ── */
function _roundRect(ctx, x, y, w, h, r) {
    if (typeof r === 'number') r = { tl: r, tr: r, br: r, bl: r };
    ctx.beginPath();
    ctx.moveTo(x + r.tl, y);
    ctx.lineTo(x + w - r.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
    ctx.lineTo(x + w, y + h - r.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
    ctx.lineTo(x + r.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
    ctx.lineTo(x, y + r.tl);
    ctx.quadraticCurveTo(x, y, x + r.tl, y);
    ctx.closePath();
}
