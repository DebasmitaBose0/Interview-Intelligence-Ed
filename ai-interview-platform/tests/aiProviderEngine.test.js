const aiProviderEngine = require('../server/services/aiProviderEngine');
const CircuitBreaker = require('../server/utils/circuitBreaker');

describe('AI Provider Resilience Engine & CircuitBreaker', () => {
  test('CircuitBreaker transitions to OPEN after hitting failure threshold', async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 2, resetTimeout: 5000 });
    const failingCall = jest.fn().mockRejectedValue(new Error('API Rate Limit'));

    await expect(breaker.execute(failingCall)).rejects.toThrow('API Rate Limit');
    expect(breaker.state).toBe('CLOSED');

    await expect(breaker.execute(failingCall)).rejects.toThrow('API Rate Limit');
    expect(breaker.state).toBe('OPEN');
  });

  test('aiProviderEngine triggers secondary fallback when primary provider fails', async () => {
    const primaryCall = jest.fn().mockRejectedValue(new Error('Service Unavailable'));
    const secondaryCall = jest.fn().mockResolvedValue({ score: 88, feedback: 'Fallback success', isFallback: true });

    const result = await aiProviderEngine.evaluateWithFallback(primaryCall, secondaryCall);

    expect(result.score).toBe(88);
    expect(result.isFallback).toBe(true);
    expect(secondaryCall).toHaveBeenCalled();
  });
});
