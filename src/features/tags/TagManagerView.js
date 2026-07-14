import { state } from '../../app/state.js';
import { $ } from '../../ui/dom.js';
import { Modal } from '../../ui/modal.js';
import { buildTagIndex } from '../search/searchService.js';
import { escapeHTML } from '../../utils/html.js';

export function renderTags(app) {
  const tags = buildTagIndex(state.snippets);
  $('#tagsView').innerHTML = `
    <div class="card"><div class="card__head"><div><h3>Tag Manager</h3><p class="muted">Rename, remove, and filter tags used across snippets.</p></div></div>
      <table class="tag-table"><thead><tr><th>Tag</th><th>Usage</th><th>Actions</th></tr></thead><tbody>
      ${tags.map((tag) => `<tr><td>#${escapeHTML(tag.name)}</td><td>${tag.count}</td><td><div class="actions"><button class="btn" data-action="filter-tag" data-tag="${escapeHTML(tag.name)}">Open</button><button class="btn" data-action="rename-tag" data-tag="${escapeHTML(tag.name)}">Rename</button><button class="btn btn--danger" data-action="delete-tag" data-tag="${escapeHTML(tag.name)}">Remove</button></div></td></tr>`).join('') || '<tr><td colspan="3">No tags yet.</td></tr>'}
      </tbody></table>
    </div>`;
}

export function openTagRename(app, tagName) {
  Modal.open({
    title: `Rename #${escapeHTML(tagName)}`,
    body: `<form id="tagForm" class="form-grid"><div class="form-row"><label>New tag name</label><input class="input" name="name" value="${escapeHTML(tagName)}" required /></div><div class="actions"><button class="btn btn--primary" type="submit">Rename</button><button class="btn" type="button" data-action="close-modal">Cancel</button></div></form>`,
    onMount(root) {
      root.querySelector('#tagForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        await app.renameTag(tagName, event.target.name.value.trim());
        Modal.close();
      });
    }
  });
}
