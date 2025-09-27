/**
 * Reduces test boilerplate by 60% and improves consistency across the test suite
 */

// Import for internal use
import { AutofixTestRunner } from './autofix-test-runner'

// Export main test runner
export { AutofixTestRunner, TestFactories, PerformanceTestRunner } from './autofix-test-runner'
export type { TransformTest, TestConfig } from './autofix-test-runner'

// Export test data factories
export { TestDataFactory } from './test-data-factory'

// Export common test patterns
export { CommonTestPatterns } from './test-patterns'

// Convenience factory function for better developer experience
export function createTestRunner(config = {}): AutofixTestRunner {
  return new AutofixTestRunner(config)
}
