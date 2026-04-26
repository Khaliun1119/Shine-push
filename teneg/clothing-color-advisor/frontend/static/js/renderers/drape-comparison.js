/* ── Color Drape Comparison — Oval Face on Color Background ── */

export function initDrapeComparison(photoSrc, goodColors, avoidColors) {
    const avoid = avoidColors?.length ? avoidColors : [{ hex: '#1a1a1a', name: 'Black' }];
    const good  = goodColors?.length  ? goodColors  : [{ hex: '#8B6914', name: 'Olive' }];

    /* Set face images */
    ['drapeFaceLeft', 'drapeFaceRight'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.src = photoSrc; el.alt = 'Face'; }
    });

    _initPanel({
        bgId:     'drapeBgLeft',
        swatchId: 'drapeLeftSwatch',
        nameId:   'drapeLeftName',
        hexId:    'drapeLeftHex',
        pickerId: 'drapeAvoidPicker',
        colors:   avoid,
        dotClass: 'dc-dot-avoid',
    });

    _initPanel({
        bgId:     'drapeBgRight',
        swatchId: 'drapeRightSwatch',
        nameId:   'drapeRightName',
        hexId:    'drapeRightHex',
        pickerId: 'drapeGoodPicker',
        colors:   good,
        dotClass: 'dc-dot-good',
    });
}

function _initPanel({ bgId, swatchId, nameId, hexId, pickerId, colors, dotClass }) {
    const bg     = document.getElementById(bgId);
    const swatch = document.getElementById(swatchId);
    const nameEl = document.getElementById(nameId);
    const hexEl  = document.getElementById(hexId);
    const picker = document.getElementById(pickerId);

    const apply = (c) => {
        if (bg)     bg.style.background     = c.hex;
        if (swatch) swatch.style.background = c.hex;
        if (nameEl) nameEl.textContent = c.name;
        if (hexEl)  {
            hexEl.textContent = c.hex.toUpperCase();
            hexEl.onclick = () => _copyHex(c.hex);
            hexEl.title = 'Хуулах';
        }
    };

    apply(colors[0]);

    if (!picker) return;
    picker.innerHTML = '';

    colors.slice(0, 10).forEach((c, i) => {
        const dot = document.createElement('div');
        dot.className = `dc-dot ${dotClass}${i === 0 ? ' selected' : ''}`;
        dot.style.background = c.hex;
        dot.title = c.name;
        dot.setAttribute('data-hex', c.hex.toUpperCase());
        dot.addEventListener('click', () => {
            picker.querySelectorAll('.dc-dot').forEach(d => d.classList.remove('selected'));
            dot.classList.add('selected');
            apply(c);
        });
        picker.appendChild(dot);
    });
}

function _copyHex(hex) {
    navigator.clipboard?.writeText(hex.toUpperCase()).catch(() => {});
    _toast(`${hex.toUpperCase()} хуулагдлаа`);
}

function _toast(msg) {
    let el = document.getElementById('dcToast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'dcToast';
        el.className = 'dc-toast';
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('visible');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('visible'), 1800);
}
