import { nowISO } from '../../utils/date.js';

export const TagService = {
  rename(snippets, oldName, newName) {
    return snippets.map((snippet) => ({
      ...snippet,
      tags: (snippet.tags || []).map((tag) => tag === oldName ? newName : tag).filter(Boolean),
      updatedAt: nowISO()
    }));
  },
  remove(snippets, tagName) {
    return snippets.map((snippet) => ({
      ...snippet,
      tags: (snippet.tags || []).filter((tag) => tag !== tagName),
      updatedAt: nowISO()
    }));
  }
};
