import { state } from '../../app/state.js';
import { $ } from '../../ui/dom.js';
import { Modal } from '../../ui/modal.js';
import { COLLECTION_COLORS } from '../../config/constants.js';
import { escapeHTML } from '../../utils/html.js';

export function renderCollections(app) {
  $('#collectionsView').innerHTML = `
    <div class="card card__head">
      <div><h3>Collections</h3><p class="muted">Group snippets into developer kits, learning paths, or project packs.</p></div>
      <button class="btn btn--primary" data-action="new-collection">New Collection</button>
    </div>
    <div class="collection-grid" style="margin-top:1rem">
      ${state.collections.map((collection) => {
        const count = state.snippets.filter((snippet) => (snippet.collectionIds || []).includes(collection.id)).length;
        return `<article class="card collection-card" style="--accent:${collection.color}">
          <div class="card__head">
            <div><h3>${escapeHTML(collection.name)}</h3><p class="muted">${escapeHTML(collection.description || 'No description.')}</p></div>
            <span class="badge">${count} snippets</span>
          </div>
          <div class="progress"><span style="width:${Math.min(100, count * 18)}%"></span></div>
          <div class="actions" style="margin-top:1rem">
            <button class="btn" data-action="open-collection" data-collection-id="${collection.id}">Open</button>
            <button class="btn" data-action="edit-collection" data-collection-id="${collection.id}">Edit</button>
            <button class="btn btn--danger" data-action="delete-collection" data-collection-id="${collection.id}">Delete</button>
          </div>
        </article>`;
      }).join('') || '<div class="empty">No collections yet.</div>'}
    </div>
  `;
}

export function openCollectionEditor(app, id = null) {
  const collection = state.collections.find((item) => item.id === id);
  Modal.open({
    title: collection ? 'Edit collection' : 'Create collection',
    body: `<form id="collectionForm" class="form-grid">
      <div class="form-row"><label>Name</label><input class="input" name="name" value="${escapeHTML(collection?.name || '')}" required /></div>
      <div class="form-row"><label>Description</label><textarea class="textarea" name="description">${escapeHTML(collection?.description || '')}</textarea></div>
      <div class="form-row"><label>Color</label><select class="select" name="color">${COLLECTION_COLORS.map((color) => `<option value="${color}" ${color === collection?.color ? 'selected' : ''}>${color}</option>`).join('')}</select></div>
      <div class="actions"><button class="btn btn--primary" type="submit">Save</button><button class="btn" type="button" data-action="close-modal">Cancel</button></div>
    </form>`,
    onMount(root) {
      root.querySelector('#collectionForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        if (collection) await app.updateCollection(collection.id, data); else await app.createCollection(data);
        Modal.close();
      });
    }
  });
}
