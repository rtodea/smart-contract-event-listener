export class Storage {
  constructor() {
    this._storage = new Map();
  }

  save(key, value) {
    console.log("Saving", key, value);
    this._storage.set(key, value);
    console.log("Storage size", this._storage.size);
  }

  read(key) {
    return this._storage.get(key);
  }

  size() {
    return this._storage.size;
  }

  async init() {
    console.log("Storage initialized");
  }
}
