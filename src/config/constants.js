export const APP_NAME = 'CodeSnap JS V4';
export const DB_NAME = 'codesnap-js-v4-db';
export const DB_VERSION = 4;

export const STORES = {
  snippets: 'snippets',
  folders: 'folders',
  collections: 'collections',
  notes: 'notes',
  versions: 'versions',
  playgrounds: 'playgrounds',
  settings: 'settings',
  activity: 'activity'
};

export const DEFAULT_SETTINGS = {
  theme: 'dark',
  view: 'dashboard',
  folderId: 'all',
  collectionId: 'all',
  sortBy: 'updatedDesc',
  showArchived: false,
  defaultLanguage: 'JavaScript',
  autoSavePlayground: true,
  editorFontSize: 14,
  backupReminder: true
};

export const LANGUAGES = ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'JSON', 'Bash', 'PHP', 'Python', 'SQL', 'Markdown', 'Other'];
export const CATEGORIES = ['Utility', 'Frontend', 'Backend', 'API', 'Database', 'Component', 'Config', 'Learning', 'Other'];
export const COLLECTION_COLORS = ['#2563eb', '#16a34a', '#d97706', '#9333ea', '#dc2626', '#0891b2', '#475569'];
