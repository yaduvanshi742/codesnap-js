export function buildTagIndex(snippets = []) {
  const counts = new Map();
  snippets.forEach((snippet) => {
    (snippet.tags || []).forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
  });
  return [...counts.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function filterSnippets(snippets = [], filters = {}) {
  const query = (filters.query || '').toLowerCase().trim();
  return snippets.filter((snippet) => {
    const archiveOk = filters.archived === 'all' || (filters.archived === 'archived' ? snippet.archived : !snippet.archived);
    const folderOk = !filters.folderId || filters.folderId === 'all' || snippet.folderId === filters.folderId;
    const collectionOk = !filters.collectionId || filters.collectionId === 'all' || (snippet.collectionIds || []).includes(filters.collectionId);
    const languageOk = !filters.language || filters.language === 'all' || snippet.language === filters.language;
    const categoryOk = !filters.category || filters.category === 'all' || snippet.category === filters.category;
    const tagOk = !filters.tag || filters.tag === 'all' || (snippet.tags || []).includes(filters.tag);
    const text = [snippet.title, snippet.description, snippet.language, snippet.category, snippet.code, ...(snippet.tags || [])].join(' ').toLowerCase();
    const queryOk = !query || text.includes(query);
    return archiveOk && folderOk && collectionOk && languageOk && categoryOk && tagOk && queryOk;
  }).sort((a, b) => {
    if (filters.sortBy === 'titleAsc') return a.title.localeCompare(b.title);
    if (filters.sortBy === 'createdDesc') return new Date(b.createdAt) - new Date(a.createdAt);
    if (filters.sortBy === 'copiedDesc') return (b.copyCount || 0) - (a.copyCount || 0);
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
}

export function searchWorkspace(state, query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const snippetResults = state.snippets.filter((item) => [item.title, item.description, item.code, ...(item.tags || [])].join(' ').toLowerCase().includes(q)).map((item) => ({ type: 'snippet', id: item.id, title: item.title, subtitle: `${item.language} • ${item.category}` }));
  const noteResults = state.notes.filter((item) => [item.title, item.body].join(' ').toLowerCase().includes(q)).map((item) => ({ type: 'note', id: item.id, title: item.title, subtitle: 'Developer note' }));
  const collectionResults = state.collections.filter((item) => [item.name, item.description].join(' ').toLowerCase().includes(q)).map((item) => ({ type: 'collection', id: item.id, title: item.name, subtitle: 'Collection' }));
  return [...snippetResults, ...noteResults, ...collectionResults].slice(0, 12);
}
