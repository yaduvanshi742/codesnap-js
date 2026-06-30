import { App } from './app/App.js';
import { registerServiceWorker } from './core/serviceWorker.js';

const app = new App();
app.init().catch((error) => {
  console.error(error);
  document.body.innerHTML = `<main style="font-family:system-ui;padding:2rem"><h1>CodeSnap failed to start</h1><pre>${error.message}</pre></main>`;
});

registerServiceWorker();
