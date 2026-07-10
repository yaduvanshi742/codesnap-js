import { state } from '../../app/state.js';
import { downloadText } from '../../utils/download.js';
import { Toast } from '../../ui/toast.js';
import { Confirm } from '../../ui/confirm.js';

export const BackupService = {
  exportAll() {
    const payload = {
      app: 'CodeSnap JS V4',
      exportedAt: new Date().toISOString(),
      data: {
        snippets: state.snippets,
        folders: state.folders,
        collections: state.collections,
        notes: state.notes,
        versions: state.versions,
        playgrounds: state.playgrounds,
        settings: state.settings,
        activity: state.activity
      }
    };
    downloadText('codesnap-v4-backup.json', JSON.stringify(payload, null, 2), 'application/json');
  },

  importAll(app) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const payload = JSON.parse(await file.text());
        const data = payload.data || payload;
        if (!Array.isArray(data.snippets)) throw new Error('Invalid CodeSnap backup file.');
        await app.replaceWorkspace(data);
        Toast.show('Backup imported');
      } catch (error) {
        Toast.show(error.message || 'Import failed', 'error');
      }
    });
    input.click();
  },

  async reset(app) {
    const ok = await Confirm.ask('Reset workspace?', 'All snippets, notes, collections, versions, and settings will be removed.');
    if (!ok) return;
    await app.clearWorkspace();
    Toast.show('Workspace reset');
  }
};
