import { describe, it, expect } from 'vitest'
import { performance } from 'perf_hooks'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
  },
})

interface BenchmarkResult {
  operation: string
  iterations: number
  totalTime: number
  averageTime: number
  opsPerSecond: number
}

function benchmark(name: string, iterations: number, operation: () => void): BenchmarkResult {
  // Warm up
  for (let i = 0; i < Math.min(100, iterations / 10); i++) {
    operation()
  }

  const startTime = performance.now()

  for (let i = 0; i < iterations; i++) {
    operation()
  }

  const endTime = performance.now()
  const totalTime = endTime - startTime
  const averageTime = totalTime / iterations
  const opsPerSecond = (1000 / averageTime)

  return {
    operation: name,
    iterations,
    totalTime,
    averageTime,
    opsPerSecond,
  }
}

describe('performance benchmarks', () => {
  // Helper functions for test data generation
  const createLargeFile = (count: number): string => {
    const imports = Array.from({ length: count }, (_, i) =>
      `const result${i} = map(data${i}, x => x * ${i + 1});`,
    ).join('\n        ')

    return `import { map } from 'lodash-es';\n        ${imports}`
  }

  const createExpectedOutput = (count: number): string => {
    const transformations = Array.from({ length: count }, (_, i) =>
      `const result${i} = data${i}.map(x => x * ${i + 1});`,
    ).join('\n        ')

    return `import { map } from 'lodash-es';\n        ${transformations}`
  }

  const createExpectedErrors = (count: number): { message: RegExp }[] =>
    Array.from({ length: count }, () => ({ message: /Lodash function 'map' is excluded/ }))

  describe('autofix performance tests', () => {
    it('should benchmark simple array method transformations', { timeout: 10000 }, () => {
      const testCode = 'import { map } from \'lodash-es\'; const result = map(data, x => x * 2);'
      const expectedOutput = 'import { map } from \'lodash-es\'; const result = data.map(x => x * 2);'

      const result = benchmark('Simple array method transformation', 50, () => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: testCode,
              output: expectedOutput,
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      })

      console.log(`\n📊 Performance: ${result.operation}`)
      console.log(`   Iterations: ${result.iterations}`)
      console.log(`   Total time: ${result.totalTime.toFixed(2)}ms`)
      console.log(`   Average time: ${result.averageTime.toFixed(4)}ms`)
      console.log(`   Ops/second: ${result.opsPerSecond.toFixed(0)}`)

      // Performance assertions - ESLint RuleTester is inherently slow
      expect(result.averageTime).toBeLessThan(100) // Should be under 100ms per operation
      expect(result.opsPerSecond).toBeGreaterThan(10) // Should handle 10+ ops per second
    })

    it('should benchmark complex expression transformations', { timeout: 10000 }, () => {
      const testCode = 'import { map } from \'lodash-es\'; const result = map(user?.profile?.items ?? [], item => ({ ...item, processed: true }));'
      const expectedOutput = 'import { map } from \'lodash-es\'; const result = (user?.profile?.items ?? []).map(item => ({ ...item, processed: true }));'

      const result = benchmark('Complex expression transformation', 25, () => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: testCode,
              output: expectedOutput,
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      })

      console.log(`\n📊 Performance: ${result.operation}`)
      console.log(`   Iterations: ${result.iterations}`)
      console.log(`   Total time: ${result.totalTime.toFixed(2)}ms`)
      console.log(`   Average time: ${result.averageTime.toFixed(4)}ms`)
      console.log(`   Ops/second: ${result.opsPerSecond.toFixed(0)}`)

      expect(result.averageTime).toBeLessThan(150) // Complex operations under 150ms
      expect(result.opsPerSecond).toBeGreaterThan(7) // Should handle 7+ ops per second
    })

    it('should benchmark static method transformations', { timeout: 10000 }, () => {
      const testCode = 'import { keys } from \'lodash-es\'; const result = keys(object);'
      const expectedOutput = 'import { keys } from \'lodash-es\'; const result = Object.keys(object);'

      const result = benchmark('Static method transformation', 50, () => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: testCode,
              output: expectedOutput,
              options: [{ exclude: ['keys'] }],
              errors: [{ message: /Lodash function 'keys' is excluded/ }],
            },
          ],
        })
      })

      console.log(`\n📊 Performance: ${result.operation}`)
      console.log(`   Iterations: ${result.iterations}`)
      console.log(`   Total time: ${result.totalTime.toFixed(2)}ms`)
      console.log(`   Average time: ${result.averageTime.toFixed(4)}ms`)
      console.log(`   Ops/second: ${result.opsPerSecond.toFixed(0)}`)

      expect(result.averageTime).toBeLessThan(100) // Static methods under 100ms
      expect(result.opsPerSecond).toBeGreaterThan(10) // Should handle 10+ ops per second
    })

    it('should benchmark expression alternatives (type checking)', { timeout: 10000 }, () => {
      const testCode = 'import { isString } from \'lodash-es\'; const result = isString(value);'
      const expectedOutput = 'import { isString } from \'lodash-es\'; const result = typeof value === "string";'

      const result = benchmark('Expression alternative transformation', 50, () => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: testCode,
              output: expectedOutput,
              options: [{ exclude: ['isString'] }],
              errors: [{ message: /Lodash function 'isString' is excluded/ }],
            },
          ],
        })
      })

      console.log(`\n📊 Performance: ${result.operation}`)
      console.log(`   Iterations: ${result.iterations}`)
      console.log(`   Total time: ${result.totalTime.toFixed(2)}ms`)
      console.log(`   Average time: ${result.averageTime.toFixed(4)}ms`)
      console.log(`   Ops/second: ${result.opsPerSecond.toFixed(0)}`)

      expect(result.averageTime).toBeLessThan(100) // Expression alternatives under 100ms
      expect(result.opsPerSecond).toBeGreaterThan(10) // Should handle 10+ ops per second
    })

    it('should benchmark large file processing', { timeout: 15000 }, () => {
      const testCode = createLargeFile(50)
      const expectedOutput = createExpectedOutput(50)
      const expectedErrors = createExpectedErrors(50)

      const testCase = {
        code: testCode,
        output: expectedOutput,
        options: [{ exclude: ['map'] }],
        errors: expectedErrors,
      }

      const result = benchmark('Large file processing (50 transformations)', 5, () => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [testCase],
        })
      })

      console.log(`\n📊 Performance: ${result.operation}`)
      console.log(`   Iterations: ${result.iterations}`)
      console.log(`   Total time: ${result.totalTime.toFixed(2)}ms`)
      console.log(`   Average time: ${result.averageTime.toFixed(4)}ms`)
      console.log(`   Ops/second: ${result.opsPerSecond.toFixed(0)}`)

      expect(result.averageTime).toBeLessThan(500) // Large files under 500ms
      expect(result.opsPerSecond).toBeGreaterThan(2) // Should handle 2+ large files per second
    })
  })

  describe('parameter parsing performance tests', () => {
    it('should benchmark parameter parsing with complex expressions', async () => {
      const paramParser = await import('../../src/autofix/parameter-parser.js')
      const { findFirstTopLevelComma, needsParentheses } = paramParser

      const complexExpression = 'obj?.prop?.nested?.[key] ?? defaultValue || fallback, (x, y) => x + y'

      const result = benchmark('Complex parameter parsing', 10000, () => {
        findFirstTopLevelComma(complexExpression)
        needsParentheses('obj?.prop?.nested?.[key] ?? defaultValue || fallback')
      })

      console.log(`\n📊 Performance: ${result.operation}`)
      console.log(`   Iterations: ${result.iterations}`)
      console.log(`   Total time: ${result.totalTime.toFixed(2)}ms`)
      console.log(`   Average time: ${result.averageTime.toFixed(6)}ms`)
      console.log(`   Ops/second: ${result.opsPerSecond.toFixed(0)}`)

      expect(result.averageTime).toBeLessThan(0.1) // Parameter parsing should be very fast
      expect(result.opsPerSecond).toBeGreaterThan(10000) // Should handle 10k+ ops per second
    })
  })

  describe('memory usage tests', () => {
    it('should not leak memory during repeated transformations', { timeout: 30000 }, () => {
      const initialMemory = process.memoryUsage().heapUsed

      // Run many transformations
      for (let i = 0; i < 1000; i++) {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: `import { map } from 'lodash-es'; const result${i} = map(data, x => x * ${i});`,
              output: `import { map } from 'lodash-es'; const result${i} = data.map(x => x * ${i});`,
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })

        // Force garbage collection every 100 iterations
        if (i % 100 === 0 && global.gc) {
          global.gc()
        }
      }

      const finalMemory = process.memoryUsage().heapUsed
      const memoryIncrease = finalMemory - initialMemory
      const memoryIncreaseMB = memoryIncrease / 1024 / 1024

      console.log(`\n🧠 Memory Usage:`)
      console.log(`   Initial: ${(initialMemory / 1024 / 1024).toFixed(2)}MB`)
      console.log(`   Final: ${(finalMemory / 1024 / 1024).toFixed(2)}MB`)
      console.log(`   Increase: ${memoryIncreaseMB.toFixed(2)}MB`)

      // Memory increase should be reasonable (less than 100MB for 1000 operations)
      // ESLint operations are memory-intensive, so this is a realistic bound
      expect(memoryIncreaseMB).toBeLessThan(100)
    })
  })
})
