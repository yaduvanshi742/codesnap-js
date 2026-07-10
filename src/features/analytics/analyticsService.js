export function getLanguageStats(snippets = []) {
  return countBy(snippets, 'language');
}

export function getCategoryStats(snippets = []) {
  return countBy(snippets, 'category');
}

export function getCollectionStats(snippets = [], collections = []) {
  return collections.map((collection) => ({ name: collection.name, count: snippets.filter((snippet) => (snippet.collectionIds || []).includes(collection.id)).length }));
}

function countBy(items, key) {
  const map = new Map();
  items.forEach((item) => map.set(item[key] || 'Unknown', (map.get(item[key] || 'Unknown') || 0) + 1));
  return [...map.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}
