/**
 * color-comparison.js
 * Before/After + Good vs Bad color comparison panel.
 *
 * Uses the existing API response data — no new backend needed.
 * Requires: state.clothing (good colors), state.avoidColors (bad colors),
 *            and the analyzed photo URL.
 *
 * Integration:
 *   1. Import this in renderers/results.js
 *   2. Call renderColorComparison(data, photoSrc) inside displayResults()
 *   3. Add <div id="colorComparison"></div> in your results HTML
 */

import { state } from '../state.js';

// ── Internal state ────────────────────────────────────────────
let _goodColors  = [];  // [{hex, name}]
let _avoidColors = [];  // [{hex, name, reason}]
let _photoSrc    = '';
let _selectedGood  = null;
let _selectedBad   = null;

// ── Public API ────────────────────────────────────────────────

/**
 * Main entry point. Call from displayResults().
 * @param {object} data     - Full API response
 * @param {string} photoSrc - The analyzed face photo data-URL or URL
 */
export function renderColorComparison(data, photoSrc) {
    const { recommendations } = data;

    // Flatten all clothing colors from every category into one list
    _goodColors = [];
    const clothing = recommendations.clothing || {};
    Object.values(clothing).forEach(colorArr => {
        (colorArr || []).forEach(c => {
            // Avoid duplicates (same hex across categories)
            if (!_goodColors.find(x => x.hex === c.hex)) {
                _goodColors.push({ hex: c.hex, name: c.name });
            }
        });
    });

    _avoidColors = (recommendations.avoid || []).map(c => ({
        hex:    c.hex,
        name:   c.name,
        reason: c.reason || '',
    }));

    _photoSrc = photoSrc || '';

    // Default selections: first good color, first bad color
    _selectedGood = _goodColors[0]  || null;
    _selectedBad  = _avoidColors[0] || null;

    // Also expose on state so other modules can read
    state.avoidColors = _avoidColors;

    _render();
}

// ── Renderer ──────────────────────────────────────────────────

function _render() {
    const container = document.getElementById('colorComparison');
    if (!container) return;

    container.innerHTML = `
        <div class="cc-root">
            <h2 class="cc-title">
                <span class="cc-title-icon">◐</span>
                Before / After харьцуулалт
            </h2>
            <p class="cc-subtitle">Өнгө сонгоод арьсны өнгөтэй хэрхэн зохицохыг харна уу</p>

            <!-- Preview panels -->
            <div class="cc-panels">
                <div class="cc-panel cc-panel--good">
                    <div class="cc-panel-label cc-label--good">✓ Зохих өнгө</div>
                    <div class="cc-photo-wrap" id="ccGoodWrap">
                        <img class="cc-photo" src="${_escHtml(_photoSrc)}" alt="Face">
                        <div class="cc-color-strip" id="ccGoodStrip"></div>
                        <div class="cc-color-badge" id="ccGoodBadge"></div>
                    </div>
                </div>

                <div class="cc-divider">
                    <div class="cc-divider-line"></div>
                    <div class="cc-divider-vs">VS</div>
                    <div class="cc-divider-line"></div>
                </div>

                <div class="cc-panel cc-panel--bad">
                    <div class="cc-panel-label cc-label--bad">✕ Зохихгүй өнгө</div>
                    <div class="cc-photo-wrap" id="ccBadWrap">
                        <img class="cc-photo" src="${_escHtml(_photoSrc)}" alt="Face">
                        <div class="cc-color-strip" id="ccBadStrip"></div>
                        <div class="cc-color-badge" id="ccBadBadge"></div>
                    </div>
                    <div class="cc-reason" id="ccReason"></div>
                </div>
            </div>

            <!-- Color pickers -->
            <div class="cc-pickers">
                <div class="cc-picker-section">
                    <div class="cc-picker-title">Сайн өнгөнүүд</div>
                    <div class="cc-swatch-row" id="ccGoodSwatches"></div>
                </div>
                <div class="cc-picker-section">
                    <div class="cc-picker-title">Зайлсхийх өнгөнүүд</div>
                    <div class="cc-swatch-row" id="ccBadSwatches"></div>
                </div>
            </div>
        </div>
    `;

    _renderSwatches();
    _updatePanels();
    _bindEvents();
}

function _renderSwatches() {
    // Good swatches
    const goodRow = document.getElementById('ccGoodSwatches');
    _goodColors.slice(0, 16).forEach(c => {
        const el = document.createElement('button');
        el.className = 'cc-swatch cc-swatch--good';
        el.dataset.hex = c.hex;
        el.dataset.name = c.name;
        el.title = c.name;
        el.style.background = c.hex;
        if (_selectedGood && c.hex === _selectedGood.hex) el.classList.add('cc-swatch--active');
        goodRow.appendChild(el);
    });

    // Bad swatches
    const badRow = document.getElementById('ccBadSwatches');
    _avoidColors.forEach(c => {
        const el = document.createElement('button');
        el.className = 'cc-swatch cc-swatch--bad';
        el.dataset.hex = c.hex;
        el.dataset.name = c.name;
        el.dataset.reason = c.reason || '';
        el.title = c.reason ? `${c.name}: ${c.reason}` : c.name;
        el.style.background = c.hex;
        if (_selectedBad && c.hex === _selectedBad.hex) el.classList.add('cc-swatch--active');
        badRow.appendChild(el);
    });
}

function _updatePanels() {
    if (_selectedGood) {
        _applyColor('ccGoodStrip', 'ccGoodBadge', _selectedGood.hex, _selectedGood.name);
        _highlightActive('ccGoodSwatches', _selectedGood.hex);
    }
    if (_selectedBad) {
        _applyColor('ccBadStrip', 'ccBadBadge', _selectedBad.hex, _selectedBad.name);
        _highlightActive('ccBadSwatches', _selectedBad.hex);
        const reason = document.getElementById('ccReason');
        if (reason) {
            reason.textContent = _selectedBad.reason
                ? `⚠ ${_selectedBad.reason}`
                : '';
        }
    }
}

function _applyColor(stripId, badgeId, hex, name) {
    const strip = document.getElementById(stripId);
    const badge = document.getElementById(badgeId);
    if (strip) {
        strip.style.background = hex;
        strip.style.opacity = '1';
    }
    if (badge) {
        badge.textContent = `${name}  ${hex.toUpperCase()}`;
        badge.style.display = 'block';
    }
}

function _highlightActive(rowId, hex) {
    const row = document.getElementById(rowId);
    if (!row) return;
    row.querySelectorAll('.cc-swatch').forEach(el => {
        el.classList.toggle('cc-swatch--active', el.dataset.hex === hex);
    });
}

function _bindEvents() {
    document.getElementById('ccGoodSwatches')?.addEventListener('click', e => {
        const btn = e.target.closest('.cc-swatch--good');
        if (!btn) return;
        _selectedGood = { hex: btn.dataset.hex, name: btn.dataset.name };
        _applyColor('ccGoodStrip', 'ccGoodBadge', _selectedGood.hex, _selectedGood.name);
        _highlightActive('ccGoodSwatches', _selectedGood.hex);
    });

    document.getElementById('ccBadSwatches')?.addEventListener('click', e => {
        const btn = e.target.closest('.cc-swatch--bad');
        if (!btn) return;
        _selectedBad = { hex: btn.dataset.hex, name: btn.dataset.name, reason: btn.dataset.reason };
        _applyColor('ccBadStrip', 'ccBadBadge', _selectedBad.hex, _selectedBad.name);
        _highlightActive('ccBadSwatches', _selectedBad.hex);
        const reason = document.getElementById('ccReason');
        if (reason) reason.textContent = _selectedBad.reason ? `⚠ ${_selectedBad.reason}` : '';
    });
}

function _escHtml(str) {
    return (str || '').replace(/"/g, '&quot;');
}
