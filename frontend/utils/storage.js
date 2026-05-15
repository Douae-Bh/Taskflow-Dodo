const storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  get(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  saveDraft(projectId, data) {
    this.set(`draft_${projectId}`, { ...data, timestamp: Date.now() });
  },

  getDraft(projectId) {
    return this.get(`draft_${projectId}`);
  },

  clearDraft(projectId) {
    this.remove(`draft_${projectId}`);
  }
};

window.storage = storage;