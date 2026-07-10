import { state } from '../../app/state.js';
import { $ } from '../../ui/dom.js';
import { getCategoryStats, getCollectionStats, getLanguageStats } from './analyticsService.js';
import { escapeHTML } from '../../utils/html.js';

export function renderAnalytics(app) {
  const active = state.snippets.filter((item) => !item.archived);
  $('#analyticsView').innerHTML = `
    <div class="grid grid--4">
      ${metric('Active snippets', active.length)}${metric('Archived', state.snippets.length - active.length)}${metric('Versions saved', state.versions.length)}${metric('Total copies', state.snippets.reduce((sum, item) => sum + (item.copyCount || 0), 0))}
    </div>
    <div class="grid grid--3" style="margin-top:1rem">
      ${chartCard('Languages', getLanguageStats(active))}
      ${chartCard('Categories', getCategoryStats(active))}
      ${chartCard('Collections', getCollectionStats(active, state.collections))}
    </div>`;
}

function metric(label, value) { return `<article class="card metric"><strong>${value}</strong><span>${label}</span></article>`; }
function chartCard(title, rows) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  return `<section class="card"><h3>${title}</h3><div class="analytics-bars">${rows.map((row) => `<div class="bar-row"><span>${escapeHTML(row.name)}</span><div class="progress"><span style="width:${(row.count / max) * 100}%"></span></div><strong>${row.count}</strong></div>`).join('') || '<p class="muted">No data yet.</p>'}</div></section>`;
}
