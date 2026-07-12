import { uid } from '../../utils/id.js';
import { nowISO } from '../../utils/date.js';

export const FolderService = {
  async create(repository, data) {
    const now = nowISO();
    const folder = { id: uid('folder'), name: data.name.trim(), description: data.description?.trim() || '', createdAt: now, updatedAt: now };
    await repository.folders.put(folder);
    await repository.activity.put({ id: uid('activity'), type: 'folder', message: `Created folder: ${folder.name}`, createdAt: now });
    return folder;
  },
  async update(repository, folder, data) {
    const next = { ...folder, name: data.name.trim(), description: data.description?.trim() || '', updatedAt: nowISO() };
    await repository.folders.put(next);
    return next;
  },
  async remove(repository, folder, snippets) {
    await Promise.all(snippets.filter((item) => item.folderId === folder.id).map((item) => repository.snippets.put({ ...item, folderId: 'folder-js', updatedAt: nowISO() })));
    await repository.folders.delete(folder.id);
  }
};
