/**
 * Offline Submission Queue Manager
 * Persists failed network evaluation payloads and auto-flushes when connectivity is restored.
 */
const STORAGE_KEY = 'interview_offline_queue_v1';

class OfflineQueue {
  constructor() {
    this.queue = this.loadQueue();
  }

  loadQueue() {
    if (typeof localStorage === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveQueue() {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.error('[OfflineQueue] Error persisting queue:', e);
    }
  }

  enqueue(url, payload, options = {}) {
    const item = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      url,
      payload,
      timestamp: new Date().toISOString(),
      attempts: 0,
      options
    };
    this.queue.push(item);
    this.saveQueue();
    return item;
  }

  getQueue() {
    return [...this.queue];
  }

  remove(id) {
    this.queue = this.queue.filter(item => item.id !== id);
    this.saveQueue();
  }

  clear() {
    this.queue = [];
    this.saveQueue();
  }

  async flush(customFetch = fetch) {
    if (this.queue.length === 0) return { synced: 0, failed: 0 };

    let synced = 0;
    let failed = 0;
    const remaining = [];

    for (const item of this.queue) {
      try {
        const response = await customFetch(item.url, {
          method: item.options.method || 'POST',
          headers: { 'Content-Type': 'application/json', ...(item.options.headers || {}) },
          body: JSON.stringify(item.payload)
        });

        if (response.ok) {
          synced++;
        } else {
          item.attempts += 1;
          remaining.push(item);
          failed++;
        }
      } catch (err) {
        item.attempts += 1;
        remaining.push(item);
        failed++;
      }
    }

    this.queue = remaining;
    this.saveQueue();
    return { synced, failed };
  }
}

const offlineQueueInstance = new OfflineQueue();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    OfflineQueue,
    offlineQueue: offlineQueueInstance
  };
}
