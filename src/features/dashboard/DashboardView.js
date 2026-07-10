import { state } from '../../app/state.js';
import { $ } from '../../ui/dom.js';
import { formatDate } from '../../utils/date.js';
import { escapeHTML } from '../../utils/html.js';
import { buildTagIndex } from '../search/searchService.js';

export function renderDashboard(app) {
  const active = state.snippets.filter((item) => !item.archived);
  const favorites = active.filter((item) => item.favorite);
  const notes = state.notes.length;
  const tags = buildTagIndex(state.snippets).slice(0, 8);
  const recent = [...state.snippets].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
  const activity = [...state.activity].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);

  $('#dashboardView').innerHTML = `
    <div class="hero">
      <section class="card hero__panel">
        <div>
          <p class="eyebrow">Developer Knowledge Base</p>
          <h2>Build, save, test, and reuse code faster.</h2>
          <p class="muted">CodeSnap V4 combines snippets, notes, collections, version history, and a live playground in one local-first workspace.</p>
        </div>
        <div class="actions">
          <button class="btn btn--primary" data-action="new-snippet">Create Snippet</button>
          <button class="btn" data-view="playground">Open Playground</button>
          <button class="btn" data-action="new-note">New Note</button>
        </div>
      </section>
      <section class="grid grid--2">
        ${metric('Snippets', active.length)}
        ${metric('Collections', state.collections.length)}
        ${metric('Notes', notes)}
        ${metric('Favorites', favorites.length)}
      </section>
    </div>

    <div class="grid grid--3">
      <section class="card">
        <div class="card__head"><h3>Recently edited</h3><button class="btn btn--ghost" data-view="snippets">View all</button></div>
        <div class="timeline">
          ${recent.map((item) => `<button class="folder-chip" data-action="view-snippet" data-snippet-id="${item.id}"><span>${escapeHTML(item.title)}</span><strong>${item.language}</strong></button>`).join('') || '<div class="empty">No snippets yet.</div>'}
        </div>
      </section>
      <section class="card">
        <div class="card__head"><h3>Top tags</h3><button class="btn btn--ghost" data-view="tags">Manage</button></div>
        <div class="tags">${tags.map((tag) => `<button class="tag-pill" data-action="filter-tag" data-tag="${tag.name}">#${escapeHTML(tag.name)} · ${tag.count}</button>`).join('') || '<span class="muted">No tags yet.</span>'}</div>
      </section>
      <section class="card">
        <div class="card__head"><h3>Activity timeline</h3><span class="badge">Live</span></div>
        <div class="timeline">
          ${activity.map((item) => `<div class="timeline-item"><span>${formatDate(item.createdAt)}</span><strong>${escapeHTML(item.message)}</strong></div>`).join('') || '<div class="empty">No activity yet.</div>'}
        </div>
      </section>
    </div>
  `;
}

function metric(label, value) {
  return `<article class="card metric"><strong>${value}</strong><span>${label}</span></article>`;
}
