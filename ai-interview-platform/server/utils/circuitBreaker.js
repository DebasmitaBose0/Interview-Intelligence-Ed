/**
 * CircuitBreaker Pattern Utility
 * Prevents continuous cascading failures to remote AI APIs by opening state on repeated failures.
 */
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 3;
    this.resetTimeout = options.resetTimeout || 30000; // 30 seconds reset window
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF-OPEN
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }

  async execute(requestFn, fallbackFn) {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF-OPEN';
      } else {
        if (typeof fallbackFn === 'function') {
          return fallbackFn(new Error('CircuitBreaker is OPEN'));
        }
        throw new Error('Circuit breaker is OPEN. Fast failing request.');
      }
    }

    try {
      const response = await requestFn();
      this.onSuccess();
      return response;
    } catch (err) {
      this.onFailure();
      if (typeof fallbackFn === 'function') {
        return fallbackFn(err);
      }
      throw err;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount += 1;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }
}

module.exports = CircuitBreaker;
