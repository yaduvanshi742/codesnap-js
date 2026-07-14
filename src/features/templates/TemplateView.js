import { $ } from '../../ui/dom.js';
import { SNIPPET_TEMPLATES } from '../../config/templates.js';
import { escapeHTML } from '../../utils/html.js';
import { highlightCode } from '../../utils/highlight.js';

export function renderTemplates(app) {
  $('#templatesView').innerHTML = `
    <div class="card card__head"><div><h3>Snippet Templates</h3><p class="muted">Starter snippets you can add and customize.</p></div></div>
    <div class="template-grid" style="margin-top:1rem">
      ${SNIPPET_TEMPLATES.map((template) => `<article class="card"><div class="card__head"><div><h3>${escapeHTML(template.name)}</h3><p class="muted">${escapeHTML(template.description)}</p></div><span class="badge">${template.language}</span></div><pre class="code-block"><code>${highlightCode(template.code, template.language)}</code></pre><div class="actions"><button class="btn btn--primary" data-action="use-template" data-template-id="${template.id}">Use Template</button></div></article>`).join('')}
    </div>`;
}
