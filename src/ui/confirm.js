import { Modal } from './modal.js';

export const Confirm = {
  ask(title, message) {
    return new Promise((resolve) => {
      Modal.open({
        title,
        body: `<p class="muted">${message}</p>`,
        footer: `<div class="actions"><button class="btn" id="cancelConfirm">Cancel</button><button class="btn btn--danger" id="okConfirm">Confirm</button></div>`,
        onMount(root) {
          root.querySelector('#cancelConfirm').addEventListener('click', () => { Modal.close(); resolve(false); });
          root.querySelector('#okConfirm').addEventListener('click', () => { Modal.close(); resolve(true); });
        }
      });
    });
  }
};
