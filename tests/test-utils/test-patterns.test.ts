/**
 * Tests for CommonTestPatterns functionality
 */
import { describe, it, expect } from 'vitest'
import { CommonTestPatterns, QuickTests } from '../../src/test-utils/test-patterns'

describe('TDD: CommonTestPatterns', () => {
  it('should create autofix transformation test pattern', () => {
    expect(() => {
      CommonTestPatterns.autofixTransformation('test category', [
        {
          function: 'map',
          input: 'map([1,2,3], x => x * 2)',
          expected: '[1,2,3].map(x => x * 2)',
        },
      ])
    }).not.toThrow()
  })

  it('should create configuration test pattern', () => {
    expect(() => {
      CommonTestPatterns.configurationTests('test config', { exclude: ['map'] }, [
        {
          function: 'map',
          code: 'map(data, fn)',
          shouldError: true,
        },
      ])
    }).not.toThrow()
  })

  it('should create edge case test pattern', () => {
    expect(() => {
      CommonTestPatterns.edgeCaseTests('test edge cases', [
        {
          description: 'complex expression',
          function: 'map',
          input: 'map(data.items, x => x.value)',
          expected: 'data.items.map(x => x.value)',
        },
      ])
    }).not.toThrow()
  })

  it('should create category test pattern', () => {
    expect(() => {
      CommonTestPatterns.categoryTests('test category', () => [
        {
          function: 'map',
          input: 'map([1,2,3], x => x * 2)',
          expected: '[1,2,3].map(x => x * 2)',
        },
      ])
    }).not.toThrow()
  })

  it('should create batch transform test pattern', () => {
    expect(() => {
      CommonTestPatterns.batchTransformTests('batch transforms', [
        {
          function: 'map',
          input: 'map([1,2,3], x => x * 2)',
          expected: '[1,2,3].map(x => x * 2)',
        },
      ])
    }).not.toThrow()
  })

  it('should create complete test suite', () => {
    expect(() => {
      CommonTestPatterns.createCompleteSuite('complete suite', {
        transformations: [
          {
            function: 'map',
            input: 'map([1,2,3], x => x * 2)',
            expected: '[1,2,3].map(x => x * 2)',
          },
        ],
      })
    }).not.toThrow()
  })
})

describe('TDD: QuickTests', () => {
  it('should provide arrayMethods quick test', () => {
    expect(() => {
      QuickTests.arrayMethods()
    }).not.toThrow()
  })

  it('should provide stringMethods quick test', () => {
    expect(() => {
      QuickTests.stringMethods()
    }).not.toThrow()
  })

  it('should provide typeChecking quick test', () => {
    expect(() => {
      QuickTests.typeChecking()
    }).not.toThrow()
  })

  it('should provide objectUtilities quick test', () => {
    expect(() => {
      QuickTests.objectUtilities()
    }).not.toThrow()
  })

  it('should provide allBasicTests comprehensive suite', () => {
    expect(() => {
      QuickTests.allBasicTests()
    }).not.toThrow()
  })
})
