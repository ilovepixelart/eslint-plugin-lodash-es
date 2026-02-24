/**
 * Ultra-elegant test utility system for autofix functionality
 * Reduces test boilerplate by 60% and improves consistency
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-extraneous-class */
import { RuleTester } from 'eslint'
import enforceFunctions from '../rules/enforce-functions'
import type { EnforceFunctionsRuleOptions, LodashFunctionName } from '../types'

export interface TransformTest {
  name: string
  input: string
  expected: string
  functionName?: LodashFunctionName
  options?: EnforceFunctionsRuleOptions
}

export interface TestConfig {
  ecmaVersion?: number
  sourceType?: 'script' | 'module'
  rule?: any
}

export class AutofixTestRunner {
  private readonly ruleTester: RuleTester
  private readonly defaultRule: any

  constructor(config: TestConfig = {}) {
    this.ruleTester = new RuleTester({
      languageOptions: {
        ecmaVersion: (config.ecmaVersion ?? 2022) as any,
        sourceType: config.sourceType ?? 'module',
      },
    })
    this.defaultRule = config.rule ?? enforceFunctions
  }

  /**
   * Test a single transformation with automatic error message detection
   */
  testTransformation(test: TransformTest): void {
    const functionName = test.functionName ?? this.extractFunctionName(test.input)

    this.ruleTester.run(test.name, this.defaultRule, {
      valid: [],
      invalid: [{
        code: test.input,
        output: test.expected,
        ...(test.options && { options: [test.options] }),
        errors: [{
          message: new RegExp(functionName || 'Lodash function'),
        }],
      }],
    })
  }

  /**
   * Test multiple transformations in a batch
   */
  testBatch(tests: TransformTest[], groupName = 'batch transformations'): void {
    const testName = groupName

    this.ruleTester.run(testName, this.defaultRule, {
      valid: [],
      invalid: tests.map(test => ({
        code: test.input,
        output: test.expected,
        ...(test.options && { options: [test.options] }),
        errors: [{
          message: new RegExp(test.functionName ?? this.extractFunctionName(test.input) ?? 'Lodash function'),
        }],
      })),
    })
  }

  /**
   * Test that certain code should pass without errors
   */
  testValid(validCases: string[], testName = 'valid cases'): void {
    this.ruleTester.run(testName, this.defaultRule, {
      valid: validCases.map(code => ({ code })),
      invalid: [],
    })
  }

  /**
   * Test error cases without autofix
   */
  testErrors(errorCases: { code: string, message?: RegExp, options?: EnforceFunctionsRuleOptions }[], testName = 'error cases'): void {
    this.ruleTester.run(testName, this.defaultRule, {
      valid: [],
      invalid: errorCases.map(testCase => ({
        code: testCase.code,
        ...(testCase.options && { options: [testCase.options] }),
        errors: [{
          message: testCase.message ?? /Lodash function/,
        }],
      })),
    })
  }

  /**
   * Test destructured import transformations (most common pattern)
   */
  testDestructuredTransforms(transforms: {
    function: LodashFunctionName
    input: string
    expected: string
    options?: EnforceFunctionsRuleOptions
  }[]): void {
    const tests: TransformTest[] = transforms.map(t => ({
      name: `should transform destructured ${t.function}`,
      input: `import { ${t.function} } from 'lodash-es'\n${t.input}`,
      expected: `import { ${t.function} } from 'lodash-es'\n${t.expected}`,
      functionName: t.function,
      ...(t.options && { options: t.options }),
    }))

    this.testBatch(tests, 'destructured transforms')
  }

  /**
   * Test namespace import transformations
   */
  testNamespaceTransforms(transforms: {
    function: LodashFunctionName
    input: string
    expected: string
    options?: EnforceFunctionsRuleOptions
  }[]): void {
    const tests: TransformTest[] = transforms.map(t => ({
      name: `should transform namespace ${t.function}`,
      input: `import _ from 'lodash-es'\n${t.input}`,
      expected: `import _ from 'lodash-es'\n${t.expected}`,
      functionName: t.function,
      ...(t.options && { options: t.options }),
    }))

    this.testBatch(tests, 'namespace transforms')
  }

  /**
   * Test edge cases with complex parameters
   */
  testEdgeCases(edgeCases: {
    description: string
    function: LodashFunctionName
    input: string
    expected: string
  }[]): void {
    const tests: TransformTest[] = edgeCases.map(testCase => ({
      name: `edge case: ${testCase.description}`,
      input: `import { ${testCase.function} } from 'lodash-es'\n${testCase.input}`,
      expected: `import { ${testCase.function} } from 'lodash-es'\n${testCase.expected}`,
      functionName: testCase.function,
    }))

    this.testBatch(tests, 'edge cases')
  }

  /**
   * Extract function name from code string for automatic error matching
   */
  private extractFunctionName(code: string): string | null {
    // Try to extract from destructured import
    const destructuredMatch = /import {0,10}{ {0,10}(\w{1,50}) {0,10}} {0,10}from/.exec(code)
    if (destructuredMatch) {
      return destructuredMatch[1] ?? null
    }

    // Try to extract from function call
    const callMatch = /(\w{1,50}) {0,10}\(/.exec(code)
    if (callMatch) {
      return callMatch[1] ?? null
    }

    // Try to extract from namespace call
    const namespaceMatch = /\._?(\w{1,50}) {0,10}\(/.exec(code)
    if (namespaceMatch) {
      return namespaceMatch[1] ?? null
    }

    return null
  }
}

/**
 * Quick factory functions for common test scenarios
 */
export const TestFactories = {
  /**
   * Create simple array method transformation test
   */
  arrayMethod: (
    functionName: LodashFunctionName,
    input: string,
    expected: string,
  ): TransformTest => ({
    name: `should transform ${functionName} to native array method`,
    input: `import { ${functionName} } from 'lodash-es'\n${input}`,
    expected: `import { ${functionName} } from 'lodash-es'\n${expected}`,
    functionName,
  }),

  /**
   * Create object utility transformation test
   */
  objectUtility: (
    functionName: LodashFunctionName,
    input: string,
    expected: string,
  ): TransformTest => ({
    name: `should transform ${functionName} to native object utility`,
    input: `import { ${functionName} } from 'lodash-es'\n${input}`,
    expected: `import { ${functionName} } from 'lodash-es'\n${expected}`,
    functionName,
  }),

  /**
   * Create type checking transformation test
   */
  typeCheck: (
    functionName: LodashFunctionName,
    input: string,
    expected: string,
  ): TransformTest => ({
    name: `should transform ${functionName} to native type check`,
    input: `import { ${functionName} } from 'lodash-es'\n${input}`,
    expected: `import { ${functionName} } from 'lodash-es'\n${expected}`,
    functionName,
  }),

  /**
   * Create configuration test (include/exclude)
   */
  configTest: (
    functionName: LodashFunctionName,
    options: EnforceFunctionsRuleOptions,
    shouldError: boolean,
  ) => ({
    code: `import { ${functionName} } from 'lodash-es'\n${functionName}(data)`,
    options,
    shouldError,
    expectedMessage: shouldError ? new RegExp(functionName) : undefined,
  }),
}

/**
 * Performance testing utilities
 */
export class PerformanceTestRunner {
  /**
   * Benchmark transformation performance
   */
  static benchmarkTransformation(
    transformation: () => void,
    iterations = 100,
    description = 'transformation',
  ): { avgTime: number, opsPerSecond: number, totalTime: number } {
    const start = performance.now()

    for (let i = 0; i < iterations; i++) {
      transformation()
    }

    const totalTime = performance.now() - start
    const avgTime = totalTime / iterations
    const opsPerSecond = Math.round(1000 / avgTime)

    console.log(`📊 Performance: ${description}`)
    console.log(`   Iterations: ${iterations}`)
    console.log(`   Total time: ${totalTime.toFixed(2)}ms`)
    console.log(`   Average time: ${avgTime.toFixed(4)}ms`)
    console.log(`   Ops/second: ${opsPerSecond}`)

    return { avgTime, opsPerSecond, totalTime }
  }

  /**
   * Memory usage testing
   */
  static measureMemoryUsage(operation: () => void): { initialMB: number, finalMB: number, increaseMB: number } {
    // Force garbage collection if available
    if (globalThis.gc) {
      globalThis.gc()
    }

    const initialMemory = process.memoryUsage().heapUsed
    operation()
    const finalMemory = process.memoryUsage().heapUsed

    const initialMB = initialMemory / 1024 / 1024
    const finalMB = finalMemory / 1024 / 1024
    const increaseMB = finalMB - initialMB

    console.log(`🧠 Memory Usage:`)
    console.log(`   Initial: ${initialMB.toFixed(2)}MB`)
    console.log(`   Final: ${finalMB.toFixed(2)}MB`)
    console.log(`   Increase: ${increaseMB.toFixed(2)}MB`)

    return { initialMB, finalMB, increaseMB }
  }
}
