const { OfflineQueue } = require('../client/src/utils/offlineQueue');

describe('Offline Submission Queue Utility', () => {
  test('enqueue and getQueue store items properly', () => {
    const queue = new OfflineQueue();
    queue.clear();

    const item = queue.enqueue('/api/interview/evaluate', { code: 'console.log("hello")' });
    expect(item.url).toBe('/api/interview/evaluate');
    expect(queue.getQueue().length).toBe(1);
  });

  test('flush sends items and clears queue when fetch succeeds', async () => {
    const queue = new OfflineQueue();
    queue.clear();
    queue.enqueue('/api/interview/evaluate', { code: 'test' });

    const mockFetch = jest.fn().mockResolvedValue({ ok: true });
    const result = await queue.flush(mockFetch);

    expect(result.synced).toBe(1);
    expect(queue.getQueue().length).toBe(0);
  });
});
