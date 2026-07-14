export class Keyboard {
  constructor(app) { this.app = app; }
  bind() {
    document.addEventListener('keydown', (event) => {
      const active = document.activeElement;
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(active?.tagName);
      if (event.key === 'Escape') {
        document.getElementById('modalRoot').innerHTML = '';
        document.getElementById('commandRoot').innerHTML = '';
      }
      if (typing) return;
      if (event.key === '/') { event.preventDefault(); document.getElementById('globalSearch')?.focus(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'n') { event.preventDefault(); this.app.handleAction('new-snippet'); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') { event.preventDefault(); this.app.handleAction('export-all'); }
    });
  }
}
