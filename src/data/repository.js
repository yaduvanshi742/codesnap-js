import { STORES } from '../config/constants.js';
import { Database } from './db.js';
import { nowISO } from '../utils/date.js';

function storeRepo(db, storeName) {
  return {
    getAll: () => db.getAll(storeName),
    get: (id) => db.get(storeName, id),
    put: (value) => db.put(storeName, value),
    delete: (id) => db.delete(storeName, id),
    clear: () => db.clear(storeName),
    setValue: (id, value) => db.put(storeName, { id, value, updatedAt: nowISO() })
  };
}

export class Repository {
  constructor() {
    this.db = new Database();
  }

  async init() {
    await this.db.open();
    Object.entries(STORES).forEach(([key, store]) => {
      this[key] = storeRepo(this.db, store);
    });
  }
}
