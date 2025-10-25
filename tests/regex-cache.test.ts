/**
 * Tests for RegexCache functionality
 */
import { describe, it, expect, vi } from 'vitest'
import { RegexCache, measureRegexPerformance, RegexPatterns } from '../src/regex-cache'

describe('TDD: RegexCache', () => {
  it('should create and cache member regex patterns', () => {
    const importName = 'lodash'

    const regex1 = RegexCache.getMemberRegex(importName)
    const regex2 = RegexCache.getMemberRegex(importName)

    expect(regex1).toBeInstanceOf(RegExp)
    expect(regex2).toBeInstanceOf(RegExp)
    expect(regex1).toBe(regex2)
  })

  it('should create and cache destructured regex patterns', () => {
    const localName = 'map'

    const regex1 = RegexCache.getDestructuredRegex(localName)
    const regex2 = RegexCache.getDestructuredRegex(localName)

    expect(regex1).toBeInstanceOf(RegExp)
    expect(regex2).toBeInstanceOf(RegExp)
    expect(regex1).toBe(regex2)
  })

  it('should create different regex objects for different import names', () => {
    const name1 = 'lodash'
    const name2 = 'underscore'

    const regex1 = RegexCache.getMemberRegex(name1)
    const regex2 = RegexCache.getMemberRegex(name2)

    expect(regex1).not.toBe(regex2)
    expect(regex1.source).toContain(name1)
    expect(regex2.source).toContain(name2)
  })

  it('should create different regex objects for different local names', () => {
    const name1 = 'map'
    const name2 = 'filter'

    const regex1 = RegexCache.getDestructuredRegex(name1)
    const regex2 = RegexCache.getDestructuredRegex(name2)

    expect(regex1).not.toBe(regex2)
    expect(regex1.source).toContain(name1)
    expect(regex2.source).toContain(name2)
  })

  it('should handle special characters in import names', () => {
    const specialName = 'lodash-es'

    const regex = RegexCache.getMemberRegex(specialName)

    expect(regex).toBeInstanceOf(RegExp)
    expect(regex.source).toContain('lodash-es')
  })

  it('should handle complex local names', () => {
    const complexName = 'mapValues'

    const regex = RegexCache.getDestructuredRegex(complexName)

    expect(regex).toBeInstanceOf(RegExp)
    expect(regex.source).toContain(complexName)
  })

  it('should create functional regex patterns', () => {
    const memberRegex = RegexCache.getMemberRegex('_')
    const destructuredRegex = RegexCache.getDestructuredRegex('map')

    expect('_.map(data, fn)').toMatch(memberRegex)
    expect('_.filter(data, fn)').toMatch(memberRegex)

    expect('map(data, fn)').toMatch(destructuredRegex)
    expect('data.map(fn)').not.toMatch(destructuredRegex)
  })

  it('should create and cache function call regex', () => {
    const functionName = 'map'

    const regex1 = RegexCache.getFunctionCallRegex(functionName)
    const regex2 = RegexCache.getFunctionCallRegex(functionName)

    expect(regex1).toBeInstanceOf(RegExp)
    expect(regex1).toBe(regex2)
    expect('map(data, fn)').toMatch(regex1)
  })

  it('should create and cache namespace function regex', () => {
    const functionName = 'map'

    const regex1 = RegexCache.getNamespaceFunctionRegex(functionName)
    const regex2 = RegexCache.getNamespaceFunctionRegex(functionName)

    expect(regex1).toBeInstanceOf(RegExp)
    expect(regex1).toBe(regex2)
    expect('_.map(data, fn)').toMatch(regex1)
  })

  it('should create and cache fixed param prototype regex', () => {
    const regex1 = RegexCache.getFixedParamPrototypeRegex()
    const regex2 = RegexCache.getFixedParamPrototypeRegex()

    expect(regex1).toBeInstanceOf(RegExp)
    expect(regex1).toBe(regex2)
    expect('Array.prototype.at[0]').toMatch(regex1)
  })

  it('should create and cache method extraction regex', () => {
    const regex1 = RegexCache.getMethodExtractionRegex()
    const regex2 = RegexCache.getMethodExtractionRegex()

    expect(regex1).toBeInstanceOf(RegExp)
    expect(regex1).toBe(regex2)
    expect('.map').toMatch(regex1)
  })

  it('should create and cache simple property path regex', () => {
    const regex1 = RegexCache.getSimplePropertyPathRegex()
    const regex2 = RegexCache.getSimplePropertyPathRegex()

    expect(regex1).toBeInstanceOf(RegExp)
    expect(regex1).toBe(regex2)
    expect('user.name').toMatch(regex1)
    expect('user.profile.email').toMatch(regex1)
  })

  it('should clear the cache', () => {
    RegexCache.getMemberRegex('test1')
    RegexCache.getDestructuredRegex('test2')

    expect(RegexCache.getCacheSize()).toBeGreaterThan(0)

    RegexCache.clearCache()

    expect(RegexCache.getCacheSize()).toBe(0)
  })

  it('should get cache size correctly', () => {
    RegexCache.clearCache()

    expect(RegexCache.getCacheSize()).toBe(0)

    RegexCache.getMemberRegex('test1')
    expect(RegexCache.getCacheSize()).toBe(1)

    RegexCache.getDestructuredRegex('test2')
    expect(RegexCache.getCacheSize()).toBe(2)
  })

  it('should get cache stats', () => {
    RegexCache.clearCache()
    RegexCache.getMemberRegex('test1')

    const stats = RegexCache.getCacheStats()

    expect(stats).toHaveProperty('size')
    expect(stats).toHaveProperty('maxSize')
    expect(stats.size).toBe(1)
    expect(stats.maxSize).toBe(100)
  })

  it('should limit cache size to prevent memory leaks', () => {
    RegexCache.clearCache()

    // Fill cache beyond max size
    for (let i = 0; i < 105; i++) {
      RegexCache.getMemberRegex(`test${i}`)
    }

    // Cache should not exceed max size
    expect(RegexCache.getCacheSize()).toBeLessThanOrEqual(100)
  })

  it('should handle regex special characters correctly', () => {
    const specialChars = '$lodash.test'
    const regex = RegexCache.getMemberRegex(specialChars)

    expect(regex).toBeInstanceOf(RegExp)
    // Should not throw when used
    expect(() => 'test'.match(regex)).not.toThrow()
  })
})

describe('RegexPatterns', () => {
  it('should have pre-compiled assignment operator patterns', () => {
    expect(RegexPatterns.ASSIGNMENT_OPERATORS).toBeInstanceOf(RegExp)
    expect('+=').toMatch(RegexPatterns.ASSIGNMENT_OPERATORS)
    expect('=').toMatch(RegexPatterns.ASSIGNMENT_OPERATORS)
  })

  it('should have logical assignment pattern', () => {
    expect(RegexPatterns.LOGICAL_ASSIGNMENT).toBeInstanceOf(RegExp)
    expect('||=').toMatch(RegexPatterns.LOGICAL_ASSIGNMENT)
    expect('&&=').toMatch(RegexPatterns.LOGICAL_ASSIGNMENT)
  })

  it('should have identifier pattern', () => {
    expect(RegexPatterns.IDENTIFIER).toBeInstanceOf(RegExp)
    expect('myVar').toMatch(RegexPatterns.IDENTIFIER)
    expect('_private').toMatch(RegexPatterns.IDENTIFIER)
  })

  it('should have arrow function pattern', () => {
    expect(RegexPatterns.ARROW_FUNCTION).toBeInstanceOf(RegExp)
    expect('x => x').toMatch(RegexPatterns.ARROW_FUNCTION)
  })
})

describe('measureRegexPerformance', () => {
  it('should wrap function and return result', () => {
    const testFn = (x: number): number => x * 2
    const wrappedFn = measureRegexPerformance(testFn, 'test-operation')

    const result = wrappedFn(5)
    expect(result).toBe(10)
  })

  it('should log performance in development mode for slow operations', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { /* noop */ })

    const slowFn = (): number => {
      // Simulate slow operation (must be >1ms to trigger logging)
      const start = Date.now()
      while (Date.now() - start < 2) {
        // Busy wait
      }
      return 42
    }

    const wrappedFn = measureRegexPerformance(slowFn, 'slow-operation')
    wrappedFn()

    // Should log if operation took more than 1ms
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
    process.env.NODE_ENV = originalEnv
  })

  it('should not log in production mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'

    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { /* noop */ })

    const fastFn = (): number => 42

    const wrappedFn = measureRegexPerformance(fastFn, 'fast-operation')
    wrappedFn()

    // Should never log in production, even for slow operations
    expect(consoleSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
    process.env.NODE_ENV = originalEnv
  })
})
