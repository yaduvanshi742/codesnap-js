import { uid } from '../../utils/id.js';
import { nowISO } from '../../utils/date.js';

export const CollectionService = {
  async create(repository, data) {
    const now = nowISO();
    const collection = { id: uid('collection'), name: data.name.trim(), description: data.description?.trim() || '', color: data.color || '#2563eb', createdAt: now, updatedAt: now };
    await repository.collections.put(collection);
    await repository.activity.put({ id: uid('activity'), type: 'collection', message: `Created collection: ${collection.name}`, createdAt: now });
    return collection;
  },
  async update(repository, collection, data) {
    const next = { ...collection, name: data.name.trim(), description: data.description?.trim() || '', color: data.color || collection.color, updatedAt: nowISO() };
    await repository.collections.put(next);
    return next;
  },
  async remove(repository, collection, snippets) {
    await Promise.all(snippets.map((snippet) => repository.snippets.put({ ...snippet, collectionIds: (snippet.collectionIds || []).filter((id) => id !== collection.id), updatedAt: nowISO() })));
    await repository.collections.delete(collection.id);
  }
};
