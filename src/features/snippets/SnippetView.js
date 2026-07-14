import { state } from '../../app/state.js';
import { $ } from '../../ui/dom.js';
import { LANGUAGES, CATEGORIES } from '../../config/constants.js';
import { filterSnippets, buildTagIndex } from '../search/searchService.js';
import { highlightCode } from '../../utils/highlight.js';
import { formatDate } from '../../utils/date.js';
import { escapeHTML } from '../../utils/html.js';

export function renderSnippets(app) {
  const snippets = filterSnippets(state.snippets, state.filters);
  const tags = buildTagIndex(state.snippets);
  $('#snippetsView').innerHTML = `
    <div class="card">
      <div class="card__head">
        <div><h3>Snippet Studio</h3><p class="muted">Create, version, search, copy, export, and organize developer snippets.</p></div>
        <div class="actions"><button class="btn" data-action="export-gist">Export Gist JSON</button><button class="btn btn--primary" data-action="new-snippet">New Snippet</button></div>
      </div>
      <div class="filters">
        ${select('language', ['all', ...LANGUAGES], state.filters.language)}
        ${select('category', ['all', ...CATEGORIES], state.filters.category)}
        ${select('tag', ['all', ...tags.map((tag) => tag.name)], state.filters.tag)}
        ${select('archived', ['active', 'archived', 'all'], state.filters.archived)}
        ${select('sortBy', ['updatedDesc', 'createdDesc', 'titleAsc', 'copiedDesc'], state.settings.sortBy || 'updatedDesc')}
      </div>
    </div>
    <div class="snippet-grid" style="margin-top:1rem">
      ${snippets.map(renderSnippetCard).join('') || '<div class="empty">No matching snippets found.</div>'}
    </div>
  `;

  $('#snippetsView').querySelectorAll('[data-filter]').forEach((input) => {
    input.addEventListener('change', () => {
      if (input.dataset.filter === 'sortBy') { state.settings.sortBy = input.value; state.filters.sortBy = input.value; }
      else state.filters[input.dataset.filter] = input.value;
      app.render();
    });
  });
}

function select(name, options, value) {
  return `<select class="select" data-filter="${name}">${options.map((item) => `<option value="${item}" ${item === value ? 'selected' : ''}>${label(item)}</option>`).join('')}</select>`;
}

function label(value) {
  return String(value).replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase());
}

function renderSnippetCard(snippet) {
  const folder = state.folders.find((item) => item.id === snippet.folderId)?.name || 'No folder';
  return `
    <article class="card snippet-card ${snippet.archived ? 'is-archived' : ''}" data-snippet-id="${snippet.id}">
      <div class="snippet-title">
        <h3>${escapeHTML(snippet.title)}</h3>
        <button class="icon-btn" data-action="toggle-favorite" data-snippet-id="${snippet.id}">${snippet.favorite ? '★' : '☆'}</button>
      </div>
      <p class="muted">${escapeHTML(snippet.description || 'No description added.')}</p>
      <div class="meta"><span class="badge badge--primary">${snippet.language}</span><span class="badge">${snippet.category}</span><span class="badge">${escapeHTML(folder)}</span><span class="badge">Copied ${snippet.copyCount || 0}</span></div>
      <pre class="code-block"><code>${highlightCode(snippet.code.slice(0, 700), snippet.language)}</code></pre>
      <div class="tags">${(snippet.tags || []).map((tag) => `<button class="tag-pill" data-action="filter-tag" data-tag="${escapeHTML(tag)}">#${escapeHTML(tag)}</button>`).join('')}</div>
      <div class="meta">Updated ${formatDate(snippet.updatedAt)}</div>
      <div class="actions">
        <button class="btn btn--primary" data-action="copy-snippet" data-snippet-id="${snippet.id}">Copy</button>
        <button class="btn" data-action="edit-snippet" data-snippet-id="${snippet.id}">Edit</button>
        <button class="btn" data-action="version-history" data-snippet-id="${snippet.id}">History</button>
        <button class="btn" data-action="export-snippet" data-snippet-id="${snippet.id}">Export</button>
        <button class="btn" data-action="toggle-archive" data-snippet-id="${snippet.id}">${snippet.archived ? 'Unarchive' : 'Archive'}</button>
        <button class="btn btn--danger" data-action="delete-snippet" data-snippet-id="${snippet.id}">Delete</button>
      </div>
    </article>
  `;
}
