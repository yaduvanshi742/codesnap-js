import { SNIPPET_TEMPLATES, PLAYGROUND_STARTER } from '../config/templates.js';
import { uid } from '../utils/id.js';
import { nowISO } from '../utils/date.js';

export async function ensureSeedData(repository) {
  const existing = await repository.snippets.getAll();
  if (existing.length) return;

  const now = nowISO();
  const folders = [
    { id: 'folder-js', name: 'JavaScript Helpers', description: 'Reusable JavaScript utilities', createdAt: now, updatedAt: now },
    { id: 'folder-ui', name: 'UI Components', description: 'Frontend snippets and interface patterns', createdAt: now, updatedAt: now },
    { id: 'folder-api', name: 'API Examples', description: 'Network, REST, and data examples', createdAt: now, updatedAt: now }
  ];

  const collections = [
    { id: 'col-web', name: 'Frontend Toolkit', description: 'Small utilities for modern frontend work', color: '#2563eb', createdAt: now, updatedAt: now },
    { id: 'col-learning', name: 'Learning Notes', description: 'Snippets and notes to revise later', color: '#16a34a', createdAt: now, updatedAt: now }
  ];

  const snippets = SNIPPET_TEMPLATES.map((template, index) => ({
    id: uid('snippet'),
    title: template.name,
    description: template.description,
    language: template.language,
    category: template.category,
    folderId: index === 0 ? 'folder-api' : index === 2 ? 'folder-ui' : 'folder-js',
    collectionIds: index < 3 ? ['col-web'] : ['col-learning'],
    tags: template.tags,
    code: template.code,
    favorite: index === 0,
    archived: false,
    copyCount: 0,
    createdAt: now,
    updatedAt: now
  }));

  const notes = [
    {
      id: uid('note'),
      title: 'How to use CodeSnap',
      body: 'Save reusable code, connect it with notes, test small UI ideas in the playground, and export backups regularly.',
      linkedSnippetIds: [snippets[0].id],
      pinned: true,
      color: '#2563eb',
      createdAt: now,
      updatedAt: now
    }
  ];

  const playground = {
    id: 'default-playground',
    name: 'Frontend Experiment',
    html: PLAYGROUND_STARTER.html,
    css: PLAYGROUND_STARTER.css,
    js: PLAYGROUND_STARTER.js,
    createdAt: now,
    updatedAt: now
  };

  await Promise.all(folders.map((item) => repository.folders.put(item)));
  await Promise.all(collections.map((item) => repository.collections.put(item)));
  await Promise.all(snippets.map((item) => repository.snippets.put(item)));
  await Promise.all(notes.map((item) => repository.notes.put(item)));
  await repository.playgrounds.put(playground);
  await repository.activity.put({ id: uid('activity'), type: 'seed', message: 'Workspace initialized with starter content', createdAt: now });
}
