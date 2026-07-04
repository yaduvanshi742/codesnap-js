export class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(name, callback) {
    const callbacks = this.events.get(name) || [];
    callbacks.push(callback);
    this.events.set(name, callbacks);
    return () => this.off(name, callback);
  }

  off(name, callback) {
    this.events.set(name, (this.events.get(name) || []).filter((item) => item !== callback));
  }

  emit(name, payload) {
    (this.events.get(name) || []).forEach((callback) => callback(payload));
  }
}
