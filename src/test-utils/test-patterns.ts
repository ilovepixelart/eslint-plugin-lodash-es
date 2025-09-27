/**
 * Provides reusable patterns for different types of tests
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import { describe, it, expect } from 'vitest'
import { AutofixTestRunner, TestDataFactory } from './index'
import type { LodashFunctionName, EnforceFunctionsRuleOptions } from '../types'

export class CommonTestPatterns {
  /**
   * Standard autofix transformation test pattern
   */
  static autofixTransformation(
    category: string,
    transformations: {
      function: LodashFunctionName
      input: string
      expected: string
    }[],
  ): void {
    describe(`${category} autofix transformations`, () => {
      const runner = new AutofixTestRunner()

      transformations.forEach((transformation) => {
        const testCase = this.createTransformationTest(transformation, runner)
        it(`should transform ${transformation.function} correctly`, testCase)
      })
    })
  }

  private static createTransformationTest(
    transformation: { function: LodashFunctionName, input: string, expected: string },
    runner: AutofixTestRunner,
  ): () => void {
    return this.createTransformationTestWithPrefix('', transformation, runner)
  }

  /**
   * Configuration testing pattern
   */
  static configurationTests(
    configName: string,
    options: EnforceFunctionsRuleOptions,
    testCases: {
      function: LodashFunctionName
      code: string
      shouldError: boolean
    }[],
  ): void {
    describe(`${configName} configuration`, () => {
      const runner = new AutofixTestRunner()

      testCases.forEach((testCase) => {
        const { function: fnName, code, shouldError } = testCase

        if (shouldError) {
          const errorTest = this.createErrorTest(fnName, code, options, runner)
          it(`should flag ${fnName} as error`, errorTest)
        } else {
          const validTest = this.createValidTest(fnName, code, runner)
          it(`should allow ${fnName}`, validTest)
        }
      })
    })
  }

  private static createErrorTest(
    fnName: LodashFunctionName,
    code: string,
    options: EnforceFunctionsRuleOptions,
    runner: AutofixTestRunner,
  ): () => void {
    return () => {
      expect(() => {
        runner.testErrors([{
          code: `import { ${fnName} } from 'lodash-es'\n${code}`,
          options,
          message: new RegExp(fnName),
        }])
      }).not.toThrow()
    }
  }

  private static createValidTest(
    fnName: LodashFunctionName,
    code: string,
    runner: AutofixTestRunner,
  ): () => void {
    return () => {
      expect(() => {
        runner.testValid([`import { ${fnName} } from 'lodash-es'\n${code}`])
      }).not.toThrow()
    }
  }

  /**
   * Edge case testing pattern
   */
  static edgeCaseTests(
    category: string,
    edgeCases: {
      description: string
      function: LodashFunctionName
      input: string
      expected: string
    }[],
  ): void {
    describe(`${category} edge cases`, () => {
      const runner = new AutofixTestRunner()

      edgeCases.forEach((edgeCase) => {
        const testCase = this.createEdgeCaseTest(edgeCase, runner)
        it(`should handle ${edgeCase.description}`, testCase)
      })
    })
  }

  private static createEdgeCaseTest(
    edgeCase: { description: string, function: LodashFunctionName, input: string, expected: string },
    runner: AutofixTestRunner,
  ): () => void {
    return () => {
      expect(() => {
        runner.testTransformation({
          name: `edge case: ${edgeCase.description}`,
          input: `import { ${edgeCase.function} } from 'lodash-es'\n${edgeCase.input}`,
          expected: `import { ${edgeCase.function} } from 'lodash-es'\n${edgeCase.expected}`,
          functionName: edgeCase.function,
        })
      }).not.toThrow()
    }
  }

  /**
   * Performance testing pattern
   */
  static performanceTests(
    category: string,
    scenarios: {
      description: string
      operation: () => void
      expectedOpsPerSecond?: number
    }[],
  ): void {
    describe(`${category} performance`, () => {
      scenarios.forEach((scenario) => {
        const testCase = this.createPerformanceTest(scenario)
        it(`should benchmark ${scenario.description}`, testCase)
      })
    })
  }

  private static createPerformanceTest(
    scenario: { description: string, operation: () => void, expectedOpsPerSecond?: number },
  ): () => void {
    return () => {
      const { opsPerSecond } = (globalThis as any).PerformanceTestRunner.benchmarkTransformation(
        scenario.operation,
        50,
        scenario.description,
      )

      if (scenario.expectedOpsPerSecond) {
        expect(opsPerSecond).toBeGreaterThan(scenario.expectedOpsPerSecond)
      }

      // Basic performance check - should complete reasonably fast
      expect(opsPerSecond).toBeGreaterThan(10) // At least 10 ops/second
    }
  }

  /**
   * Comprehensive category test pattern
   */
  static categoryTests(
    category: string,
    dataFactory: () => {
      function: LodashFunctionName
      input: string
      expected: string
    }[],
  ): void {
    describe(`${category} comprehensive tests`, () => {
      const runner = new AutofixTestRunner()
      const testData = dataFactory()

      describe('basic transformations', () => {
        testData.forEach((transformation) => {
          const testCase = this.createBasicTransformationTest(transformation, runner)
          it(`should transform ${transformation.function}`, testCase)
        })
      })

      describe('namespace transformations', () => {
        testData.slice(0, 3).forEach((transformation) => {
          const testCase = this.createNamespaceTransformationTest(transformation, runner)
          it(`should transform namespace ${transformation.function}`, testCase)
        })
      })
    })
  }

  private static createBasicTransformationTest(
    transformation: { function: LodashFunctionName, input: string, expected: string },
    runner: AutofixTestRunner,
  ): () => void {
    return this.createTransformationTestWithPrefix('basic ', transformation, runner)
  }

  private static createTransformationTestWithPrefix(
    prefix: string,
    transformation: { function: LodashFunctionName, input: string, expected: string },
    runner: AutofixTestRunner,
  ): () => void {
    return () => {
      expect(() => {
        runner.testTransformation({
          name: `${prefix}${transformation.function} transformation`,
          input: `import { ${transformation.function} } from 'lodash-es'\n${transformation.input}`,
          expected: `import { ${transformation.function} } from 'lodash-es'\n${transformation.expected}`,
          functionName: transformation.function,
        })
      }).not.toThrow()
    }
  }

  private static createNamespaceTransformationTest(
    transformation: { function: LodashFunctionName, input: string, expected: string },
    runner: AutofixTestRunner,
  ): () => void {
    return () => {
      const namespaceInput = transformation.input.replace(
        new RegExp(`\\b${transformation.function}\\(`),
        `_.${transformation.function}(`,
      )

      expect(() => {
        runner.testTransformation({
          name: `namespace ${transformation.function} transformation`,
          input: `import _ from 'lodash-es'\n${namespaceInput}`,
          expected: `import _ from 'lodash-es'\n${transformation.expected}`,
          functionName: transformation.function,
        })
      }).not.toThrow()
    }
  }

  /**
   * Batch transformation test pattern
   */
  static batchTransformTests(
    testName: string,
    transformations: {
      function: LodashFunctionName
      input: string
      expected: string
    }[],
  ): void {
    describe(testName, () => {
      const destructuredTest = this.createBatchDestructuredTest(transformations)
      it('should handle batch transformations', destructuredTest)

      const namespaceTest = this.createBatchNamespaceTest(transformations)
      it('should handle namespace batch transformations', namespaceTest)
    })
  }

  private static createBatchDestructuredTest(
    transformations: { function: LodashFunctionName, input: string, expected: string }[],
  ): () => void {
    return () => {
      const runner = new AutofixTestRunner()
      expect(() => {
        runner.testDestructuredTransforms(transformations)
      }).not.toThrow()
    }
  }

  private static createBatchNamespaceTest(
    transformations: { function: LodashFunctionName, input: string, expected: string }[],
  ): () => void {
    return () => {
      const runner = new AutofixTestRunner()
      expect(() => {
        runner.testNamespaceTransforms(transformations)
      }).not.toThrow()
    }
  }

  /**
   * Quick factory for creating complete test suites
   */
  static createCompleteSuite(
    suiteName: string,
    config: {
      transformations?: { function: LodashFunctionName, input: string, expected: string }[]
      edgeCases?: { description: string, function: LodashFunctionName, input: string, expected: string }[]
      configurations?: { name: string, options: EnforceFunctionsRuleOptions, testCases: { function: LodashFunctionName, code: string, shouldError: boolean }[] }[]
      performance?: { description: string, operation: () => void }[]
    },
  ): void {
    describe(suiteName, () => {
      this.setupTransformationTests(config.transformations)
      this.setupEdgeCaseTests(config.edgeCases)
      this.setupConfigurationTests(config.configurations)
      this.setupPerformanceTests(config.performance)
    })
  }

  private static setupTransformationTests(
    transformations?: { function: LodashFunctionName, input: string, expected: string }[],
  ): void {
    if (transformations) {
      this.autofixTransformation('basic', transformations)
      this.batchTransformTests('batch operations', transformations)
    }
  }

  private static setupEdgeCaseTests(
    edgeCases?: { description: string, function: LodashFunctionName, input: string, expected: string }[],
  ): void {
    if (edgeCases) {
      this.edgeCaseTests('advanced', edgeCases)
    }
  }

  private static setupConfigurationTests(
    configurations?: { name: string, options: EnforceFunctionsRuleOptions, testCases: { function: LodashFunctionName, code: string, shouldError: boolean }[] }[],
  ): void {
    if (configurations) {
      configurations.forEach((configuration) => {
        this.configurationTests(configuration.name, configuration.options, configuration.testCases)
      })
    }
  }

  private static setupPerformanceTests(
    performance?: { description: string, operation: () => void }[],
  ): void {
    if (performance) {
      this.performanceTests('benchmark', performance)
    }
  }
}

/**
 * Convenience functions for rapid test creation
 */
export const QuickTests = {
  /**
   * Create array method tests in one line
   */
  arrayMethods: () => CommonTestPatterns.categoryTests('Array Methods', TestDataFactory.arrayMethods),

  /**
   * Create string method tests in one line
   */
  stringMethods: () => CommonTestPatterns.categoryTests('String Methods', TestDataFactory.stringMethods),

  /**
   * Create type checking tests in one line
   */
  typeChecking: () => CommonTestPatterns.categoryTests('Type Checking', TestDataFactory.typeChecking),

  /**
   * Create object utility tests in one line
   */
  objectUtilities: () => CommonTestPatterns.categoryTests('Object Utilities', TestDataFactory.objectUtilities),

  /**
   * Create all basic tests with single function call
   */
  allBasicTests: () => {
    const data = TestDataFactory.all()
    CommonTestPatterns.categoryTests('Array Methods', () => data.arrayMethods)
    CommonTestPatterns.categoryTests('String Methods', () => data.stringMethods)
    CommonTestPatterns.categoryTests('Type Checking', () => data.typeChecking)
    CommonTestPatterns.categoryTests('Object Utilities', () => data.objectUtilities)
  },
}
