import { state } from '../../app/state.js';
import { $ } from '../../ui/dom.js';
import { PLAYGROUND_STARTER } from '../../config/templates.js';
import { Toast } from '../../ui/toast.js';

export function renderPlayground(app) {
  const current = state.playgrounds[0] || { id: 'temp', name: 'Frontend Experiment', ...PLAYGROUND_STARTER };
  $('#playgroundView').innerHTML = `
    <div class="card">
      <div class="card__head">
        <div><h3>Code Playground</h3><p class="muted">Test small HTML, CSS, and JavaScript ideas directly in the browser.</p></div>
        <div class="actions"><button class="btn" id="runPlayground">Run</button><button class="btn" id="savePlayground">Save</button><button class="btn btn--primary" id="saveAsSnippet">Save as Snippet</button></div>
      </div>
      <div class="playground-layout">
        <div class="playground-editors">
          ${editor('HTML', 'pgHtml', current.html)}
          ${editor('CSS', 'pgCss', current.css)}
          ${editor('JavaScript', 'pgJs', current.js)}
        </div>
        <iframe class="preview-frame" id="playgroundPreview" title="Playground preview" sandbox="allow-scripts allow-modals"></iframe>
      </div>
    </div>`;

  const run = () => renderPreview();
  const renderPreview = () => {
    const html = $('#pgHtml').value;
    const css = $('#pgCss').value;
    const js = $('#pgJs').value;
    $('#playgroundPreview').srcdoc = `${html}<style>${css}</style><script>${js.replaceAll('</script>', '<\\/script>')}<\/script>`;
  };

  $('#runPlayground').addEventListener('click', run);
  $('#savePlayground').addEventListener('click', async () => {
    await app.savePlayground({ id: current.id, name: current.name, html: $('#pgHtml').value, css: $('#pgCss').value, js: $('#pgJs').value });
    Toast.show('Playground saved');
  });
  $('#saveAsSnippet').addEventListener('click', async () => {
    const code = `<!-- HTML -->\n${$('#pgHtml').value}\n\n/* CSS */\n${$('#pgCss').value}\n\n// JavaScript\n${$('#pgJs').value}`;
    await app.createSnippet({ title: 'Playground Experiment', description: 'Saved from CodeSnap playground.', language: 'HTML', category: 'Frontend', folderId: state.folders[0]?.id, collectionIds: [], tags: 'playground, experiment', code });
    Toast.show('Playground saved as snippet');
  });
  ['pgHtml', 'pgCss', 'pgJs'].forEach((id) => $(`#${id}`).addEventListener('input', () => state.settings.autoSavePlayground && run()));
  run();
}

function editor(label, id, value = '') {
  return `<div class="form-row"><label>${label}</label><textarea class="textarea code-input" id="${id}" spellcheck="false">${value}</textarea></div>`;
}
