/**
 * Offline Submission Queue Manager
 * Persists failed network evaluation payloads and auto-flushes when connectivity is restored.
 */
const STORAGE_KEY = 'interview_offline_queue_v1';
const MAX_ATTEMPTS = 5;

export class OfflineQueue {
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
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      url,
      payload,
      timestamp: new Date().toISOString(),
      attempts: 0,
      options,
    };
    this.queue.push(item);
    this.saveQueue();
    return item;
  }

  getQueue() {
    return [...this.queue];
  }

  remove(id) {
    this.queue = this.queue.filter((item) => item.id !== id);
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
        const bodyContent = typeof item.payload === 'string' ? item.payload : JSON.stringify(item.payload);
        const response = await customFetch(item.url, {
          method: item.options.method || 'POST',
          headers: { 'Content-Type': 'application/json', ...(item.options.headers || {}) },
          body: bodyContent,
        });

        if (response.ok) {
          synced++;
        } else {
          item.attempts += 1;
          if (item.attempts < MAX_ATTEMPTS) {
            remaining.push(item);
          }
          failed++;
        }
      } catch (err) {
        item.attempts += 1;
        if (item.attempts < MAX_ATTEMPTS) {
          remaining.push(item);
        }
        failed++;
      }
    }

    this.queue = remaining;
    this.saveQueue();
    return { synced, failed };
  }
}

export const offlineQueue = new OfflineQueue();

/**
 * Convenience helper to queue an offline network request payload.
 *
 * @param {string} url - API endpoint URL
 * @param {any} payload - Request payload / body data
 * @param {object} [options] - Additional request options (method, headers)
 * @returns {object} Queued item object
 */
export function queueOfflineRequest(url, payload, options = {}) {
  return offlineQueue.enqueue(url, payload, options);
}

/**
 * Convenience helper to synchronize / flush all queued offline requests.
 *
 * @param {typeof fetch} [customFetch] - Optional custom fetch implementation
 * @returns {Promise<{ synced: number, failed: number }>}
 */
export async function syncOfflineRequests(customFetch = fetch) {
  return offlineQueue.flush(customFetch);
}

/**
 * Retrieves a copy of the current offline queue items.
 *
 * @returns {Array}
 */
export function getOfflineQueue() {
  return offlineQueue.getQueue();
}

/**
 * Clears all items in the offline queue.
 */
export function clearOfflineQueue() {
  offlineQueue.clear();
}

export default offlineQueue;
