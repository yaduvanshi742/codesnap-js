import { state } from '../../app/state.js';
import { $ } from '../../ui/dom.js';
import { Modal } from '../../ui/modal.js';
import { escapeHTML } from '../../utils/html.js';

export function renderFolders(app) {
  $('#foldersView').innerHTML = `
    <div class="card card__head"><div><h3>Folders</h3><p class="muted">Use folders for simple snippet organization.</p></div><button class="btn btn--primary" data-action="new-folder">New Folder</button></div>
    <div class="collection-grid" style="margin-top:1rem">
      ${state.folders.map((folder) => {
        const count = state.snippets.filter((snippet) => snippet.folderId === folder.id).length;
        return `<article class="card"><div class="card__head"><div><h3>${escapeHTML(folder.name)}</h3><p class="muted">${escapeHTML(folder.description || 'No description.')}</p></div><span class="badge">${count}</span></div><div class="actions"><button class="btn" data-action="open-folder" data-folder-id="${folder.id}">Open</button><button class="btn" data-action="edit-folder" data-folder-id="${folder.id}">Edit</button><button class="btn btn--danger" data-action="delete-folder" data-folder-id="${folder.id}">Delete</button></div></article>`;
      }).join('')}
    </div>`;
}

export function openFolderEditor(app, id = null) {
  const folder = state.folders.find((item) => item.id === id);
  Modal.open({
    title: folder ? 'Edit folder' : 'Create folder',
    body: `<form id="folderForm" class="form-grid"><div class="form-row"><label>Name</label><input class="input" name="name" value="${escapeHTML(folder?.name || '')}" required /></div><div class="form-row"><label>Description</label><textarea class="textarea" name="description">${escapeHTML(folder?.description || '')}</textarea></div><div class="actions"><button class="btn btn--primary" type="submit">Save</button><button class="btn" type="button" data-action="close-modal">Cancel</button></div></form>`,
    onMount(root) {
      root.querySelector('#folderForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());
        if (folder) await app.updateFolder(folder.id, data); else await app.createFolder(data);
        Modal.close();
      });
    }
  });
}
