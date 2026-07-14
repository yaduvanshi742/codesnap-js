import { state } from '../../app/state.js';
import { Modal } from '../../ui/modal.js';
import { formatDate } from '../../utils/date.js';
import { highlightCode } from '../../utils/highlight.js';
import { escapeHTML } from '../../utils/html.js';

export function openVersionPanel(app, snippetId) {
  const snippet = state.snippets.find((item) => item.id === snippetId);
  const versions = state.versions.filter((item) => item.snippetId === snippetId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (!snippet) return;

  Modal.open({
    title: `Version history: ${escapeHTML(snippet.title)}`,
    wide: true,
    body: `
      <div class="version-list">
        ${versions.map((version) => `
          <article class="version-row">
            <div class="card__head">
              <div><strong>${escapeHTML(version.title)}</strong><p class="muted">Saved ${formatDate(version.createdAt)}</p></div>
              <button class="btn" data-restore-version="${version.id}">Restore</button>
            </div>
            <pre class="code-block"><code>${highlightCode(version.code, version.language)}</code></pre>
          </article>
        `).join('') || '<div class="empty">No older versions yet. Edit a snippet to create history.</div>'}
      </div>
    `,
    onMount(root) {
      root.querySelectorAll('[data-restore-version]').forEach((button) => {
        button.addEventListener('click', async () => {
          await app.restoreVersion(snippet.id, button.dataset.restoreVersion);
          Modal.close();
        });
      });
    }
  });
}
