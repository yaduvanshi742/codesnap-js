import { uid } from '../../utils/id.js';
import { nowISO } from '../../utils/date.js';

export const NoteService = {
  async create(repository, data) {
    const now = nowISO();
    const note = { id: uid('note'), title: data.title.trim(), body: data.body?.trim() || '', linkedSnippetIds: data.linkedSnippetIds || [], pinned: Boolean(data.pinned), color: data.color || '#2563eb', createdAt: now, updatedAt: now };
    await repository.notes.put(note);
    await repository.activity.put({ id: uid('activity'), type: 'note', message: `Created note: ${note.title}`, createdAt: now });
    return note;
  },
  async update(repository, note, data) {
    const next = { ...note, title: data.title.trim(), body: data.body?.trim() || '', linkedSnippetIds: data.linkedSnippetIds || [], pinned: Boolean(data.pinned), color: data.color || note.color, updatedAt: nowISO() };
    await repository.notes.put(next);
    return next;
  }
};
