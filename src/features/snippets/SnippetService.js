import { uid } from '../../utils/id.js';
import { nowISO } from '../../utils/date.js';

async function log(repository, message, type = 'snippet') {
  await repository.activity.put({ id: uid('activity'), type, message, createdAt: nowISO() });
}

export const SnippetService = {
  normalize(data) {
    return {
      title: data.title?.trim() || 'Untitled snippet',
      description: data.description?.trim() || '',
      language: data.language || 'JavaScript',
      category: data.category || 'Utility',
      folderId: data.folderId || 'folder-js',
      collectionIds: Array.isArray(data.collectionIds) ? data.collectionIds : [],
      tags: String(data.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean),
      code: data.code || '',
      favorite: Boolean(data.favorite),
      archived: Boolean(data.archived)
    };
  },

  async create(repository, data) {
    const now = nowISO();
    const snippet = { id: uid('snippet'), ...this.normalize(data), copyCount: 0, createdAt: now, updatedAt: now };
    await repository.snippets.put(snippet);
    await log(repository, `Created snippet: ${snippet.title}`);
    return snippet;
  },

  async update(repository, original, data) {
    if (!original) return null;
    const next = { ...original, ...this.normalize({ ...original, ...data }), updatedAt: nowISO() };
    if (original.code !== next.code || original.title !== next.title || original.description !== next.description) {
      await repository.versions.put({
        id: uid('version'),
        snippetId: original.id,
        title: original.title,
        description: original.description,
        code: original.code,
        language: original.language,
        createdAt: nowISO()
      });
    }
    await repository.snippets.put(next);
    await log(repository, `Updated snippet: ${next.title}`);
    return next;
  },

  async patch(repository, original, patch) {
    const next = { ...original, ...patch, updatedAt: nowISO() };
    await repository.snippets.put(next);
    return next;
  },

  async remove(repository, snippet) {
    await repository.snippets.delete(snippet.id);
    const versions = await repository.versions.getAll();
    await Promise.all(versions.filter((item) => item.snippetId === snippet.id).map((item) => repository.versions.delete(item.id)));
    await log(repository, `Deleted snippet: ${snippet.title}`);
  },

  async touchCopy(repository, snippet) {
    const next = { ...snippet, copyCount: (snippet.copyCount || 0) + 1, updatedAt: nowISO() };
    await repository.snippets.put(next);
    await log(repository, `Copied snippet: ${snippet.title}`, 'copy');
    return next;
  },

  async restoreVersion(repository, snippet, version) {
    await repository.versions.put({ id: uid('version'), snippetId: snippet.id, title: snippet.title, description: snippet.description, code: snippet.code, language: snippet.language, createdAt: nowISO() });
    const restored = { ...snippet, title: version.title, description: version.description, code: version.code, language: version.language, updatedAt: nowISO() };
    await repository.snippets.put(restored);
    await log(repository, `Restored previous version: ${snippet.title}`, 'version');
    return restored;
  }
};
