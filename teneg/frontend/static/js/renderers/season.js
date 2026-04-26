import { state } from '../state.js';
import {
    SEASON_ICONS, SEASON_GRADIENTS,
    SEASON_MN, SEASON_EN, SEASON_DETAILS_MN,
} from '../constants/seasons.js';

export function renderSeason(data) {
    const { classification, recommendations, ml_prediction } = data;
    const season = classification.season;
    const primary = season.primary;
    const subSeason = season.sub_season;

    renderHeroBadge(primary, subSeason, season);
    renderPalette(recommendations.clothing?.tops || []);
    renderMlConfidence(ml_prediction);
}

function renderHeroBadge(primary, subSeason, season) {
    const badge = document.getElementById('seasonBadge');
    badge.style.background = SEASON_GRADIENTS[primary]
        || 'linear-gradient(135deg, var(--accent), var(--accent-dk))';

    document.getElementById('seasonEmoji').textContent = SEASON_ICONS[primary] || '✨';

    const nameMap = state.lang === 'mn' ? SEASON_MN : SEASON_EN;
    document.getElementById('seasonName').textContent = nameMap[subSeason] || subSeason;
    document.getElementById('seasonEnName').textContent = subSeason;

    const detailsMN = SEASON_DETAILS_MN[subSeason];
    if (state.lang === 'mn' && detailsMN) {
        document.getElementById('seasonDescription').textContent = detailsMN.desc;
        document.getElementById('seasonCharacteristics').textContent = detailsMN.chars;
    } else {
        document.getElementById('seasonDescription').textContent = season.description;
        document.getElementById('seasonCharacteristics').textContent = season.characteristics;
    }
}

function renderPalette(tops) {
    const el = document.getElementById('seasonPalette');
    if (!el) return;
    el.innerHTML = tops.slice(0, 7).map(
        c => `<div class="sp-chip" style="background:${c.hex}" title="${c.name}"></div>`
    ).join('');
}

function renderMlConfidence(prediction) {
    if (!prediction?.top_matches?.length) return;
    const wrap = document.getElementById('mlConfidence');
    const barsEl = document.getElementById('confidenceBars');
    barsEl.innerHTML = '';

    /* Scale bars relative to the top match so low-confidence predictions stay readable. */
    const maxConf = Math.max(...prediction.top_matches.map(m => m.confidence), 0.1);
    const nameMap = state.lang === 'mn' ? SEASON_MN : SEASON_EN;

    prediction.top_matches.forEach((match, idx) => {
        const row = document.createElement('div');
        row.className = 'confidence-row' + (idx === 0 ? ' top-match' : '');
        const label = nameMap[match.season] || match.season;
        const fillPct = Math.max((match.confidence / maxConf) * 100, 4);
        row.innerHTML = `
            <span class="conf-label" title="${label}">${label}</span>
            <div class="conf-bar-bg"><div class="conf-bar-fill" style="width:${fillPct}%"></div></div>
            <span class="conf-value">${match.confidence}%</span>`;
        barsEl.appendChild(row);
    });
    wrap.style.display = 'block';
}
