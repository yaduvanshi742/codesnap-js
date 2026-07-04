export const state = {
  snippets: [],
  folders: [],
  collections: [],
  notes: [],
  versions: [],
  playgrounds: [],
  settings: {},
  activity: [],
  filters: {
    query: '',
    folderId: 'all',
    collectionId: 'all',
    language: 'all',
    category: 'all',
    tag: 'all',
    archived: 'active'
  },
  ui: {
    activeView: 'dashboard'
  }
};
