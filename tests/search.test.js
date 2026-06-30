import assert from 'node:assert/strict';
import { buildTagIndex, filterSnippets } from '../src/features/search/searchService.js';

export function runSearchTests() {
  const snippets = [
    { title: 'Fetch helper', description: 'api', code: 'fetch()', tags: ['api', 'fetch'], language: 'JavaScript', category: 'API', folderId: 'f1', collectionIds: ['c1'], archived: false, updatedAt: '2026-01-01' },
    { title: 'CSS Card', description: 'ui', code: '.card{}', tags: ['css'], language: 'CSS', category: 'Frontend', folderId: 'f2', collectionIds: [], archived: false, updatedAt: '2026-01-02' }
  ];
  assert.equal(filterSnippets(snippets, { query: 'fetch', folderId: 'all', collectionId: 'all', language: 'all', category: 'all', tag: 'all', archived: 'active' }).length, 1);
  assert.equal(buildTagIndex(snippets)[0].name, 'api');
}
