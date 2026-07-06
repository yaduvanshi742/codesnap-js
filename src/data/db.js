import { DB_NAME, DB_VERSION, STORES } from '../config/constants.js';

export class Database {
  constructor() {
    this.db = null;
  }

  open() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        Object.values(STORES).forEach((store) => {
          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      request.onerror = () => reject(request.error);
    });
  }

  transaction(store, mode = 'readonly') {
    return this.db.transaction(store, mode).objectStore(store);
  }

  getAll(store) {
    return new Promise((resolve, reject) => {
      const request = this.transaction(store).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  get(store, id) {
    return new Promise((resolve, reject) => {
      const request = this.transaction(store).get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  put(store, value) {
    return new Promise((resolve, reject) => {
      const request = this.transaction(store, 'readwrite').put(value);
      request.onsuccess = () => resolve(value);
      request.onerror = () => reject(request.error);
    });
  }

  delete(store, id) {
    return new Promise((resolve, reject) => {
      const request = this.transaction(store, 'readwrite').delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  clear(store) {
    return new Promise((resolve, reject) => {
      const request = this.transaction(store, 'readwrite').clear();
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
}
