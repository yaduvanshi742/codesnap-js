import { state } from './state.js';
import { DEFAULT_SETTINGS } from '../config/constants.js';
import { SNIPPET_TEMPLATES } from '../config/templates.js';
import { Repository } from '../data/repository.js';
import { ensureSeedData } from '../data/seed.js';
import { $, $$ } from '../ui/dom.js';
import { Toast } from '../ui/toast.js';
import { Confirm } from '../ui/confirm.js';
import { Modal } from '../ui/modal.js';
import { CommandPalette } from '../features/command/CommandPalette.js';
import { Keyboard } from '../features/shortcuts/Keyboard.js';
import { BackupService } from '../features/backup/BackupService.js';
import { renderDashboard } from '../features/dashboard/DashboardView.js';
import { renderSnippets } from '../features/snippets/SnippetView.js';
import { openSnippetEditor } from '../features/snippets/SnippetEditor.js';
import { openVersionPanel } from '../features/snippets/VersionPanel.js';
import { SnippetService } from '../features/snippets/SnippetService.js';
import { renderCollections, openCollectionEditor } from '../features/collections/CollectionView.js';
import { CollectionService } from '../features/collections/CollectionService.js';
import { renderFolders, openFolderEditor } from '../features/folders/FolderView.js';
import { FolderService } from '../features/folders/FolderService.js';
import { renderNotes, openNoteEditor } from '../features/notes/NoteView.js';
import { NoteService } from '../features/notes/NoteService.js';
import { renderPlayground } from '../features/playground/PlaygroundView.js';
import { renderTags, openTagRename } from '../features/tags/TagManagerView.js';
import { TagService } from '../features/tags/TagService.js';
import { renderTemplates } from '../features/templates/TemplateView.js';
import { renderAnalytics } from '../features/analytics/AnalyticsView.js';
import { renderSettings } from '../features/settings/SettingsView.js';
import { filterSnippets } from '../features/search/searchService.js';
import { CodeExportService } from '../features/exporter/CodeExportService.js';
import { nowISO } from '../utils/date.js';

export class App {
  constructor() {
    this.repository = new Repository();
    this.commandPalette = new CommandPalette(this);
    this.keyboard = new Keyboard(this);
  }

  async init() {
    await this.repository.init();
    await ensureSeedData(this.repository);
    await this.loadState();
    this.applyTheme();
    this.bindEvents();
    this.commandPalette.bind();
    this.keyboard.bind();
    await this.navigate(state.settings.view || 'dashboard', false);
    Toast.show('CodeSnap V4 workspace ready');
  }

  async loadState() {
    state.snippets = await this.repository.snippets.getAll();
    state.folders = await this.repository.folders.getAll();
    state.collections = await this.repository.collections.getAll();
    state.notes = await this.repository.notes.getAll();
    state.versions = await this.repository.versions.getAll();
    state.playgrounds = await this.repository.playgrounds.getAll();
    state.activity = await this.repository.activity.getAll();
    const settings = await this.repository.settings.get('workspace');
    state.settings = { ...DEFAULT_SETTINGS, ...(settings?.value || {}) };
    state.filters.folderId = state.settings.folderId || 'all';
    state.filters.collectionId = state.settings.collectionId || 'all';
    state.filters.sortBy = state.settings.sortBy || 'updatedDesc';
    state.ui.activeView = state.settings.view || 'dashboard';
  }

  async saveSettings() {
    await this.repository.settings.setValue('workspace', state.settings);
  }

  bindEvents() {
    document.addEventListener('click', async (event) => {
      const view = event.target.closest('[data-view]')?.dataset.view;
      const actionEl = event.target.closest('[data-action]');
      if (view) await this.navigate(view);
      if (actionEl) {
        event.preventDefault();
        await this.handleAction(actionEl.dataset.action, actionEl.dataset);
      }
    });

    $('#globalSearch').addEventListener('input', (event) => {
      state.filters.query = event.target.value;
      if (state.ui.activeView === 'dashboard') this.navigate('snippets'); else this.render();
    });
  }

  async handleAction(action, data = {}) {
    const snippet = state.snippets.find((item) => item.id === data.snippetId);
    const folder = state.folders.find((item) => item.id === data.folderId);
    const collection = state.collections.find((item) => item.id === data.collectionId);
    const note = state.notes.find((item) => item.id === data.noteId);

    const actions = {
      'new-snippet': () => openSnippetEditor(this),
      'edit-snippet': () => openSnippetEditor(this, data.snippetId),
      'view-snippet': () => this.viewSnippet(data.snippetId),
      'copy-snippet': () => this.copySnippet(snippet),
      'delete-snippet': () => this.deleteSnippet(snippet),
      'toggle-favorite': () => this.toggleFavorite(snippet),
      'toggle-archive': () => this.toggleArchive(snippet),
      'version-history': () => openVersionPanel(this, data.snippetId),
      'export-snippet': () => CodeExportService.exportSnippet(snippet),
      'export-gist': () => CodeExportService.exportGistFormat(filterSnippets(state.snippets, state.filters)),
      'new-folder': () => openFolderEditor(this),
      'edit-folder': () => openFolderEditor(this, data.folderId),
      'delete-folder': () => this.deleteFolder(folder),
      'open-folder': () => this.openFolder(data.folderId),
      'new-collection': () => openCollectionEditor(this),
      'edit-collection': () => openCollectionEditor(this, data.collectionId),
      'delete-collection': () => this.deleteCollection(collection),
      'open-collection': () => this.openCollection(data.collectionId),
      'new-note': () => openNoteEditor(this),
      'edit-note': () => openNoteEditor(this, data.noteId),
      'delete-note': () => this.deleteNote(note),
      'rename-tag': () => openTagRename(this, data.tag),
      'delete-tag': () => this.deleteTag(data.tag),
      'filter-tag': () => this.filterTag(data.tag),
      'use-template': () => this.useTemplate(data.templateId),
      'open-command': () => this.commandPalette.open(),
      'toggle-theme': () => this.toggleTheme(),
      'export-all': () => BackupService.exportAll(),
      'import-data': () => BackupService.importAll(this),
      'reset-data': () => BackupService.reset(this),
      'close-modal': () => Modal.close()
    };
    await actions[action]?.();
  }

  async navigate(view, persist = true) {
    state.ui.activeView = view;
    state.settings.view = view;
    if (persist) await this.saveSettings();
    $$('.nav__item').forEach((item) => item.classList.toggle('is-active', item.dataset.view === view));
    $$('.view').forEach((section) => section.classList.remove('is-visible'));
    $(`#${view}View`)?.classList.add('is-visible');
    $('#viewTitle').textContent = view.replace(/(^|-)\w/g, (match) => match.toUpperCase()).replace('-', ' ');
    this.render();
  }

  render() {
    this.renderSidebar();
    const view = state.ui.activeView;
    if (view === 'dashboard') renderDashboard(this);
    if (view === 'snippets') renderSnippets(this);
    if (view === 'playground') renderPlayground(this);
    if (view === 'notes') renderNotes(this);
    if (view === 'collections') renderCollections(this);
    if (view === 'folders') renderFolders(this);
    if (view === 'tags') renderTags(this);
    if (view === 'templates') renderTemplates(this);
    if (view === 'analytics') renderAnalytics(this);
    if (view === 'settings') renderSettings(this);
  }

  renderSidebar() {
    $('#folderList').innerHTML = `<button class="folder-chip ${state.filters.folderId === 'all' ? 'is-active' : ''}" data-action="open-folder" data-folder-id="all"><span>All snippets</span><strong>${state.snippets.filter((item) => !item.archived).length}</strong></button>${state.folders.map((folder) => `<button class="folder-chip ${state.filters.folderId === folder.id ? 'is-active' : ''}" data-action="open-folder" data-folder-id="${folder.id}"><span>${folder.name}</span><strong>${state.snippets.filter((item) => item.folderId === folder.id && !item.archived).length}</strong></button>`).join('')}`;
    $('#collectionList').innerHTML = `<button class="folder-chip ${state.filters.collectionId === 'all' ? 'is-active' : ''}" data-action="open-collection" data-collection-id="all"><span>All collections</span><strong>${state.collections.length}</strong></button>${state.collections.map((collection) => `<button class="folder-chip ${state.filters.collectionId === collection.id ? 'is-active' : ''}" data-action="open-collection" data-collection-id="${collection.id}"><span>${collection.name}</span><strong>${state.snippets.filter((item) => (item.collectionIds || []).includes(collection.id)).length}</strong></button>`).join('')}`;
  }

  async refresh() {
    await this.loadState();
    this.applyTheme();
    this.render();
  }

  async createSnippet(data) { await SnippetService.create(this.repository, data); await this.refresh(); }
  async updateSnippet(id, data) { await SnippetService.update(this.repository, state.snippets.find((item) => item.id === id), data); await this.refresh(); Toast.show('Snippet saved'); }
  async restoreVersion(snippetId, versionId) { await SnippetService.restoreVersion(this.repository, state.snippets.find((item) => item.id === snippetId), state.versions.find((item) => item.id === versionId)); await this.refresh(); Toast.show('Version restored'); }
  async copySnippet(snippet) { if (!snippet) return; await navigator.clipboard.writeText(snippet.code); await SnippetService.touchCopy(this.repository, snippet); await this.refresh(); Toast.show('Code copied'); }
  async toggleFavorite(snippet) { if (!snippet) return; await SnippetService.patch(this.repository, snippet, { favorite: !snippet.favorite }); await this.refresh(); }
  async toggleArchive(snippet) { if (!snippet) return; await SnippetService.patch(this.repository, snippet, { archived: !snippet.archived }); await this.refresh(); }
  async deleteSnippet(snippet) { if (!snippet) return; if (await Confirm.ask('Delete snippet?', 'This will remove the snippet and its saved versions.')) { await SnippetService.remove(this.repository, snippet); await this.refresh(); } }

  viewSnippet(id) { state.filters.query = ''; this.navigate('snippets'); setTimeout(() => document.querySelector(`[data-snippet-id="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50); }
  openFolder(id) { state.filters.folderId = id || 'all'; state.settings.folderId = state.filters.folderId; this.navigate('snippets'); }
  openCollection(id) { state.filters.collectionId = id || 'all'; state.settings.collectionId = state.filters.collectionId; this.navigate('snippets'); }
  filterTag(tag) { state.filters.tag = tag || 'all'; this.navigate('snippets'); }

  async createFolder(data) { await FolderService.create(this.repository, data); await this.refresh(); }
  async updateFolder(id, data) { await FolderService.update(this.repository, state.folders.find((item) => item.id === id), data); await this.refresh(); }
  async deleteFolder(folder) { if (!folder) return; if (await Confirm.ask('Delete folder?', 'Snippets will move to the first available folder.')) { await FolderService.remove(this.repository, folder, state.snippets); await this.refresh(); } }

  async createCollection(data) { await CollectionService.create(this.repository, data); await this.refresh(); }
  async updateCollection(id, data) { await CollectionService.update(this.repository, state.collections.find((item) => item.id === id), data); await this.refresh(); }
  async deleteCollection(collection) { if (!collection) return; if (await Confirm.ask('Delete collection?', 'Snippets will stay saved, but this collection will be removed.')) { await CollectionService.remove(this.repository, collection, state.snippets); await this.refresh(); } }

  async createNote(data) { await NoteService.create(this.repository, data); await this.refresh(); }
  async updateNote(id, data) { await NoteService.update(this.repository, state.notes.find((item) => item.id === id), data); await this.refresh(); }
  async deleteNote(note) { if (!note) return; if (await Confirm.ask('Delete note?', 'This note will be permanently removed.')) { await this.repository.notes.delete(note.id); await this.refresh(); } }

  async renameTag(oldName, newName) { if (!newName || oldName === newName) return; await Promise.all(TagService.rename(state.snippets, oldName, newName).map((item) => this.repository.snippets.put(item))); await this.refresh(); }
  async deleteTag(tag) { if (!tag) return; if (await Confirm.ask(`Remove #${tag}?`, 'The tag will be removed from all snippets.')) { await Promise.all(TagService.remove(state.snippets, tag).map((item) => this.repository.snippets.put(item))); await this.refresh(); } }

  async useTemplate(templateId) { const tpl = SNIPPET_TEMPLATES.find((item) => item.id === templateId); if (!tpl) return; await this.createSnippet({ title: tpl.name, description: tpl.description, language: tpl.language, category: tpl.category, folderId: state.folders[0]?.id, collectionIds: [], tags: tpl.tags.join(', '), code: tpl.code }); Toast.show('Template added'); }

  async savePlayground(data) { await this.repository.playgrounds.put({ ...data, updatedAt: nowISO(), createdAt: data.createdAt || nowISO() }); await this.refresh(); }

  async replaceWorkspace(data) {
    await this.clearWorkspace(false);
    const stores = ['snippets', 'folders', 'collections', 'notes', 'versions', 'playgrounds', 'activity'];
    for (const store of stores) await Promise.all((data[store] || []).map((item) => this.repository[store].put(item)));
    await this.repository.settings.setValue('workspace', { ...DEFAULT_SETTINGS, ...(data.settings || {}) });
    await this.refresh();
  }

  async clearWorkspace(refresh = true) {
    for (const store of ['snippets', 'folders', 'collections', 'notes', 'versions', 'playgrounds', 'activity', 'settings']) await this.repository[store].clear();
    if (refresh) { await ensureSeedData(this.repository); await this.refresh(); }
  }

  openSearchResult(result) {
    if (result.type === 'snippet') this.viewSnippet(result.id);
    if (result.type === 'note') { this.navigate('notes'); setTimeout(() => document.querySelector(`[data-note-id="${result.id}"]`)?.scrollIntoView({ behavior: 'smooth' }), 50); }
    if (result.type === 'collection') this.openCollection(result.id);
  }

  applyTheme() {
    document.documentElement.dataset.theme = state.settings.theme || 'dark';
  }

  async toggleTheme() {
    state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme();
    await this.saveSettings();
  }
}
