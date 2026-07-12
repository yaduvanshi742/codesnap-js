import { state } from '../../app/state.js';
import { $ } from '../../ui/dom.js';
import { Modal } from '../../ui/modal.js';
import { escapeHTML, nl2br } from '../../utils/html.js';
import { formatDate } from '../../utils/date.js';

export function renderNotes(app) {
  const notes = [...state.notes].sort((a, b) => Number(b.pinned) - Number(a.pinned) || new Date(b.updatedAt) - new Date(a.updatedAt));
  $('#notesView').innerHTML = `
    <div class="card card__head"><div><h3>Developer Notes</h3><p class="muted">Keep mini docs, reminders, and learning notes connected with snippets.</p></div><button class="btn btn--primary" data-action="new-note">New Note</button></div>
    <div class="note-grid" style="margin-top:1rem">${notes.map(renderNote).join('') || '<div class="empty">No notes yet.</div>'}</div>`;
}

function renderNote(note) {
  const linked = (note.linkedSnippetIds || []).map((id) => state.snippets.find((item) => item.id === id)?.title).filter(Boolean);
  return `<article class="card note-card" style="border-left-color:${note.color}"><div class="card__head"><div><h3>${note.pinned ? '📌 ' : ''}${escapeHTML(note.title)}</h3><p class="muted">Updated ${formatDate(note.updatedAt)}</p></div></div><p>${nl2br(note.body)}</p><div class="tags">${linked.map((title) => `<span class="tag-pill">${escapeHTML(title)}</span>`).join('')}</div><div class="actions" style="margin-top:1rem"><button class="btn" data-action="edit-note" data-note-id="${note.id}">Edit</button><button class="btn btn--danger" data-action="delete-note" data-note-id="${note.id}">Delete</button></div></article>`;
}

export function openNoteEditor(app, id = null) {
  const note = state.notes.find((item) => item.id === id);
  const selected = note?.linkedSnippetIds || [];
  Modal.open({
    title: note ? 'Edit note' : 'Create note',
    wide: true,
    body: `<form id="noteForm" class="form-grid"><div class="form-row"><label>Title</label><input class="input" name="title" value="${escapeHTML(note?.title || '')}" required /></div><div class="form-row"><label>Body</label><textarea class="textarea" name="body" style="min-height:220px">${escapeHTML(note?.body || '')}</textarea></div><div class="grid grid--2"><div class="form-row"><label>Color</label><input class="input" name="color" value="${note?.color || '#2563eb'}" /></div><label class="tag-pill"><input type="checkbox" name="pinned" ${note?.pinned ? 'checked' : ''}/> Pin note</label></div><div class="form-row"><label>Linked snippets</label><div class="tags">${state.snippets.map((snippet) => `<label class="tag-pill"><input type="checkbox" name="linkedSnippetIds" value="${snippet.id}" ${selected.includes(snippet.id) ? 'checked' : ''}/> ${escapeHTML(snippet.title)}</label>`).join('')}</div></div><div class="actions"><button class="btn btn--primary" type="submit">Save note</button><button class="btn" type="button" data-action="close-modal">Cancel</button></div></form>`,
    onMount(root) {
      root.querySelector('#noteForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const data = Object.fromEntries(new FormData(form).entries());
        data.linkedSnippetIds = [...form.querySelectorAll('input[name="linkedSnippetIds"]:checked')].map((input) => input.value);
        data.pinned = form.pinned.checked;
        if (note) await app.updateNote(note.id, data); else await app.createNote(data);
        Modal.close();
      });
    }
  });
}
