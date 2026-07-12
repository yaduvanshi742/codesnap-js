import { state } from '../../app/state.js';
import { $ } from '../../ui/dom.js';
import { LANGUAGES } from '../../config/constants.js';

export function renderSettings(app) {
  $('#settingsView').innerHTML = `
    <div class="card">
      <div class="card__head"><div><h3>Settings</h3><p class="muted">Customize the local workspace and manage data.</p></div></div>
      <div class="settings-list">
        <div class="settings-row"><div><strong>Theme</strong><p class="muted">Switch between dark and light mode.</p></div><button class="btn" data-action="toggle-theme">${state.settings.theme}</button></div>
        <div class="settings-row"><div><strong>Default language</strong><p class="muted">Used when creating new snippets.</p></div><select class="select" id="defaultLanguage">${LANGUAGES.map((item) => `<option ${item === state.settings.defaultLanguage ? 'selected' : ''}>${item}</option>`).join('')}</select></div>
        <div class="settings-row"><div><strong>Auto-save playground</strong><p class="muted">Update preview while typing.</p></div><label class="tag-pill"><input id="autoSavePlayground" type="checkbox" ${state.settings.autoSavePlayground ? 'checked' : ''}/> Enabled</label></div>
        <div class="settings-row"><div><strong>Export backup</strong><p class="muted">Download all local data as JSON.</p></div><button class="btn" data-action="export-all">Export</button></div>
        <div class="settings-row"><div><strong>Import backup</strong><p class="muted">Restore from a previous CodeSnap backup file.</p></div><button class="btn" data-action="import-data">Import</button></div>
        <div class="settings-row"><div><strong>Reset workspace</strong><p class="muted">Clear all data from this browser.</p></div><button class="btn btn--danger" data-action="reset-data">Reset</button></div>
      </div>
    </div>`;

  $('#defaultLanguage').addEventListener('change', async (event) => {
    state.settings.defaultLanguage = event.target.value;
    await app.saveSettings();
  });
  $('#autoSavePlayground').addEventListener('change', async (event) => {
    state.settings.autoSavePlayground = event.target.checked;
    await app.saveSettings();
  });
}
