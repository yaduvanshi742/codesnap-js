export const Modal = {
  open({ title = '', body = '', footer = '', wide = false, onMount = null }) {
    const root = document.getElementById('modalRoot');
    root.innerHTML = `
      <div class="modal-backdrop" data-action="close-modal">
        <article class="modal-card ${wide ? 'modal-card--wide' : ''}" role="dialog" aria-modal="true" aria-label="${title}">
          <header class="modal-head">
            <div><h3>${title}</h3></div>
            <button class="icon-btn" data-action="close-modal" aria-label="Close">×</button>
          </header>
          <div class="modal-body">${body}</div>
          ${footer ? `<footer class="modal-footer">${footer}</footer>` : ''}
        </article>
      </div>
    `;
    root.querySelector('.modal-card').addEventListener('click', (event) => event.stopPropagation());
    root.querySelectorAll('[data-action="close-modal"]').forEach((el) => el.addEventListener('click', () => Modal.close()));
    onMount?.(root);
  },
  close() {
    const root = document.getElementById('modalRoot');
    if (root) root.innerHTML = '';
  }
};
