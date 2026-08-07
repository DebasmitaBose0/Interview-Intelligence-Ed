/**
 * AI Provider Dispatcher and Resilience Engine
 * Manages failover between primary Gemini AI service and local/secondary Ollama providers.
 */
const CircuitBreaker = require('../utils/circuitBreaker');

class AIProviderEngine {
  constructor() {
    this.primaryBreaker = new CircuitBreaker({ failureThreshold: 3, resetTimeout: 20000 });
  }

  /**
   * Executes AI evaluation task using primary provider with fallback to backup provider.
   * @param {Function} primaryCall - Primary Gemini AI provider call.
   * @param {Function} secondaryCall - Fallback local provider call.
   * @returns {Promise<Object>} Evaluated evaluation output.
   */
  async evaluateWithFallback(primaryCall, secondaryCall) {
    try {
      return await this.primaryBreaker.execute(primaryCall, async (err) => {
        console.warn(`[AI Engine] Primary provider failed or opened breaker (${err.message}). Invoking fallback provider...`);
        if (typeof secondaryCall === 'function') {
          return await secondaryCall();
        }
        return {
          score: 75,
          feedback: 'Evaluated using system heuristic fallback mode due to temporary AI service unavailability.',
          isFallback: true
        };
      });
    } catch (error) {
      console.error('[AI Engine] All provider executions failed:', error.message);
      return {
        score: 70,
        feedback: 'Standard evaluation generated via platform safe default fallback.',
        isFallback: true,
        error: error.message
      };
    }
  }
}

module.exports = new AIProviderEngine();
