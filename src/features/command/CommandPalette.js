import { state } from '../../app/state.js';
import { searchWorkspace } from '../search/searchService.js';
import { escapeHTML } from '../../utils/html.js';

export class CommandPalette {
  constructor(app) {
    this.app = app;
    this.root = document.getElementById('commandRoot');
  }

  bind() {
    document.addEventListener('keydown', (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        this.open();
      }
    });
  }

  open() {
    this.root.innerHTML = `<div class="command-backdrop"><section class="command-panel"><input id="commandInput" placeholder="Search or run a command..." autofocus /><div id="commandList" class="command-list"></div></section></div>`;
    const input = this.root.querySelector('#commandInput');
    const list = this.root.querySelector('#commandList');
    const render = () => {
      const q = input.value;
      const actions = [
        { title: 'Create new snippet', subtitle: 'Open snippet editor', run: () => this.app.handleAction('new-snippet') },
        { title: 'Open playground', subtitle: 'Run HTML, CSS, JS', run: () => this.app.navigate('playground') },
        { title: 'Create developer note', subtitle: 'Write a note', run: () => this.app.handleAction('new-note') },
        { title: 'Export workspace backup', subtitle: 'Download JSON', run: () => this.app.handleAction('export-all') },
        { title: 'Toggle theme', subtitle: 'Dark or light', run: () => this.app.handleAction('toggle-theme') }
      ];
      const search = searchWorkspace(state, q).map((item) => ({ title: item.title, subtitle: item.subtitle, run: () => this.app.openSearchResult(item) }));
      const items = q ? [...search, ...actions.filter((item) => item.title.toLowerCase().includes(q.toLowerCase()))] : actions;
      list.innerHTML = items.map((item, index) => `<button class="command-item ${index === 0 ? 'is-active' : ''}" data-index="${index}"><strong>${escapeHTML(item.title)}</strong><span class="muted">${escapeHTML(item.subtitle)}</span></button>`).join('') || '<div class="empty">No results found.</div>';
      list.querySelectorAll('[data-index]').forEach((button) => button.addEventListener('click', () => { const item = items[button.dataset.index]; this.close(); item.run(); }));
    };
    input.addEventListener('input', render);
    this.root.querySelector('.command-backdrop').addEventListener('click', () => this.close());
    this.root.querySelector('.command-panel').addEventListener('click', (event) => event.stopPropagation());
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') this.root.querySelector('.command-item')?.click();
      if (event.key === 'Escape') this.close();
    });
    render();
    input.focus();
  }

  close() { this.root.innerHTML = ''; }
}
