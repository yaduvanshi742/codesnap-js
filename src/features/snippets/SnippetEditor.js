import { state } from '../../app/state.js';
import { Modal } from '../../ui/modal.js';
import { LANGUAGES, CATEGORIES } from '../../config/constants.js';
import { highlightCode } from '../../utils/highlight.js';
import { escapeHTML } from '../../utils/html.js';

export function openSnippetEditor(app, snippetId = null) {
  const snippet = state.snippets.find((item) => item.id === snippetId);
  const selectedCollections = snippet?.collectionIds || [];
  Modal.open({
    title: snippet ? 'Edit snippet' : 'Create snippet',
    wide: true,
    body: `
      <form id="snippetForm" class="form-grid">
        <div class="editor-split">
          <div class="form-grid">
            <div class="form-row"><label>Title</label><input class="input" name="title" value="${escapeHTML(snippet?.title || '')}" required /></div>
            <div class="form-row"><label>Description</label><textarea class="textarea" name="description">${escapeHTML(snippet?.description || '')}</textarea></div>
            <div class="grid grid--2">
              <div class="form-row"><label>Language</label><select class="select" name="language">${LANGUAGES.map((item) => `<option ${item === (snippet?.language || state.settings.defaultLanguage) ? 'selected' : ''}>${item}</option>`).join('')}</select></div>
              <div class="form-row"><label>Category</label><select class="select" name="category">${CATEGORIES.map((item) => `<option ${item === (snippet?.category || 'Utility') ? 'selected' : ''}>${item}</option>`).join('')}</select></div>
            </div>
            <div class="grid grid--2">
              <div class="form-row"><label>Folder</label><select class="select" name="folderId">${state.folders.map((item) => `<option value="${item.id}" ${item.id === (snippet?.folderId || state.folders[0]?.id) ? 'selected' : ''}>${escapeHTML(item.name)}</option>`).join('')}</select></div>
              <div class="form-row"><label>Tags</label><input class="input" name="tags" value="${escapeHTML((snippet?.tags || []).join(', '))}" placeholder="fetch, api, helper" /></div>
            </div>
            <div class="form-row"><label>Collections</label><div class="tags">${state.collections.map((item) => `<label class="tag-pill"><input type="checkbox" name="collectionIds" value="${item.id}" ${selectedCollections.includes(item.id) ? 'checked' : ''}/> ${escapeHTML(item.name)}</label>`).join('')}</div></div>
            <label class="tag-pill"><input type="checkbox" name="favorite" ${snippet?.favorite ? 'checked' : ''}/> Favorite</label>
          </div>
          <div class="form-grid">
            <div class="form-row"><label>Code</label><textarea class="textarea code-input" name="code" id="snippetCode">${escapeHTML(snippet?.code || '')}</textarea></div>
            <div class="form-row"><label>Preview</label><pre class="code-block"><code id="livePreview">${highlightCode(snippet?.code || '', snippet?.language || 'JavaScript')}</code></pre></div>
          </div>
        </div>
        <div class="actions"><button class="btn btn--primary" type="submit">Save snippet</button><button class="btn" type="button" data-action="close-modal">Cancel</button></div>
      </form>
    `,
    onMount(root) {
      const form = root.querySelector('#snippetForm');
      const code = root.querySelector('#snippetCode');
      const preview = root.querySelector('#livePreview');
      code.addEventListener('input', () => preview.innerHTML = highlightCode(code.value, form.language.value));
      form.language.addEventListener('change', () => preview.innerHTML = highlightCode(code.value, form.language.value));
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        data.collectionIds = [...form.querySelectorAll('input[name="collectionIds"]:checked')].map((item) => item.value);
        data.favorite = form.favorite.checked;
        if (snippet) await app.updateSnippet(snippet.id, data); else await app.createSnippet(data);
        Modal.close();
      });
    }
  });
}
