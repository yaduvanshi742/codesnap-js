export const Toast = {
  show(message, type = 'success') {
    const root = document.getElementById('toastRoot');
    if (!root) return;
    const item = document.createElement('div');
    item.className = `toast toast--${type}`;
    item.textContent = message;
    root.append(item);
    setTimeout(() => item.remove(), 3200);
  }
};
