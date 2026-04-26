/* ── Color Fitting Grid — shows all colors with face oval ── */

export function renderFitGrid(photoSrc, goodColors, avoidColors) {
    const goodGrid  = document.getElementById('fitGridGood');
    const avoidGrid = document.getElementById('fitGridAvoid');
    const card      = document.getElementById('fitCard');

    if (!card || (!goodGrid && !avoidGrid)) return;
    if (!photoSrc) { card.style.display = 'none'; return; }

    card.style.display = 'block';

    /* Count badges */
    const goodCount  = document.getElementById('fitCountGood');
    const avoidCount = document.getElementById('fitCountAvoid');
    if (goodCount)  goodCount.textContent  = `${(goodColors  || []).length} өнгө`;
    if (avoidCount) avoidCount.textContent = `${(avoidColors || []).length} өнгө`;

    _fillGrid(goodGrid,  goodColors  || [], photoSrc, false);
    _fillGrid(avoidGrid, avoidColors || [], photoSrc, true);
}

function _fillGrid(container, colors, photoSrc, isAvoid) {
    if (!container) return;
    container.innerHTML = '';

    colors.forEach((color, i) => {
        const cell = document.createElement('div');
        cell.className = `fg-cell${isAvoid ? ' avoid' : ''}`;
        cell.style.animationDelay = `${i * 0.04}s`;
        cell.title = `${color.name}${color.reason ? ' — ' + color.reason : ''}`;

        /* Colored background wrapper */
        const wrap = document.createElement('div');
        wrap.className = 'fg-photo-wrap';
        wrap.style.background = color.hex;

        /* Face image */
        const img = document.createElement('img');
        img.className = 'fg-face';
        img.alt = color.name;
        img.loading = 'lazy';
        img.src = photoSrc;
        img.onerror = () => {
            img.replaceWith(_placeholder());
        };
        wrap.appendChild(img);
        cell.appendChild(wrap);

        /* Label */
        const label = document.createElement('div');
        label.className = 'fg-label';
        label.innerHTML = `
            <span class="fg-label-name">${_escape(color.name)}</span>
            <span class="fg-label-hex">${color.hex.toUpperCase()}</span>`;
        cell.appendChild(label);

        /* Click: copy hex */
        cell.addEventListener('click', () => {
            navigator.clipboard?.writeText(color.hex.toUpperCase()).catch(() => {});
            _showToast(`${color.hex.toUpperCase()} хуулагдлаа`);
            /* highlight */
            container.querySelectorAll('.fg-cell').forEach(c => c.classList.remove('selected'));
            cell.classList.add('selected');
        });

        container.appendChild(cell);
    });
}

function _placeholder() {
    const d = document.createElement('div');
    d.className = 'fg-face-placeholder';
    d.textContent = '👤';
    return d;
}

function _escape(str) {
    return str?.replace(/</g, '&lt;').replace(/>/g, '&gt;') ?? '';
}

function _showToast(msg) {
    let el = document.getElementById('fgToast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'fgToast';
        el.className = 'dc-toast';
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('visible');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('visible'), 1600);
}
