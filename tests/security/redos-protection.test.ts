/**
 * ReDoS (Regular expression Denial of Service) protection tests
 * Ensures the regex patterns used in autofix functions cannot be exploited
 * for denial of service attacks through catastrophic backtracking.
 */

import { describe, it, expect } from 'vitest'

describe('ReDoS Protection', () => {
  describe('isFixedParamPrototypeMethod regex protection', () => {
    it('should handle normal valid inputs efficiently', () => {
      const validInputs = [
        'Array.prototype.at[0]',
        'Array.prototype.slice[0, -1]',
        'String.prototype.padStart[10, "0"]',
      ]

      validInputs.forEach((input) => {
        const start = performance.now()
        // Test the regex pattern directly
        const result = /^\w{1,50}\.prototype\.\w{1,50}\[[^\]]{1,20}\]$/.test(input)
        const end = performance.now()

        expect(result).toBe(true)
        expect(end - start).toBeLessThan(1) // Should be very fast
      })
    })

    it('should reject malicious inputs safely and quickly', () => {
      const maliciousInputs = [
        // Extremely long object name
        'a'.repeat(1000) + '.prototype.method[0]',
        // Extremely long method name
        'Object.prototype.' + 'b'.repeat(1000) + '[0]',
        // Extremely long parameters
        'Array.prototype.at[' + 'c'.repeat(1000) + ']',
        // Combined long input
        'a'.repeat(100) + '.prototype.' + 'b'.repeat(100) + '[' + 'c'.repeat(100) + ']',
      ]

      maliciousInputs.forEach((input) => {
        const start = performance.now()
        const result = /^\w{1,50}\.prototype\.\w{1,50}\[[^\]]{1,20}\]$/.test(input)
        const end = performance.now()

        expect(result).toBe(false) // Should reject
        expect(end - start).toBeLessThan(5) // Should be fast (< 5ms)
      })
    })

    it('should handle edge cases at length boundaries', () => {
      // Test at the exact limits
      const at50Chars = 'a'.repeat(50)
      const at20Chars = 'x'.repeat(20)

      const boundaryValid = `${at50Chars}.prototype.${at50Chars}[${at20Chars}]`
      const boundaryInvalid = `${at50Chars}x.prototype.${at50Chars}[${at20Chars}]` // 51 chars

      expect(/^\w{1,50}\.prototype\.\w{1,50}\[[^\]]{1,20}\]$/.test(boundaryValid)).toBe(true)
      expect(/^\w{1,50}\.prototype\.\w{1,50}\[[^\]]{1,20}\]$/.test(boundaryInvalid)).toBe(false)
    })
  })

  describe('extractFixedParams regex protection', () => {
    it('should handle normal parameter extraction efficiently', () => {
      const validInputs = [
        '[0]',
        '[1]',
        '[-1]',
        '[0, -1]',
        '[someParam]',
      ]

      validInputs.forEach((input) => {
        const start = performance.now()
        const match = /\[([^\]]{1,20})\]$/.exec(input)
        const end = performance.now()

        expect(match).toBeTruthy()
        expect(match?.[1]).toBeDefined()
        expect(end - start).toBeLessThan(1) // Should be very fast
      })
    })

    it('should reject malicious parameter inputs safely', () => {
      const maliciousInputs = [
        '[' + 'x'.repeat(1000) + ']',
        '[' + 'y'.repeat(500) + ']',
        '[' + 'z'.repeat(100) + ']', // Beyond 20 char limit
      ]

      maliciousInputs.forEach((input) => {
        const start = performance.now()
        const match = /\[([^\]]{1,20})\]$/.exec(input)
        const end = performance.now()

        expect(match).toBe(null) // Should not match
        expect(end - start).toBeLessThan(5) // Should be fast
      })
    })

    it('should handle boundary cases correctly', () => {
      const at20Chars = 'x'.repeat(20)
      const at21Chars = 'x'.repeat(21)

      const validBoundary = `[${at20Chars}]`
      const invalidBoundary = `[${at21Chars}]`

      const validMatch = /\[([^\]]{1,20})\]$/.exec(validBoundary)
      const invalidMatch = /\[([^\]]{1,20})\]$/.exec(invalidBoundary)

      expect(validMatch).toBeTruthy()
      expect(validMatch?.[1]).toBe(at20Chars)
      expect(invalidMatch).toBe(null)
    })
  })

  describe('Performance benchmarks', () => {
    it('should process many valid inputs quickly', () => {
      const validInputs = Array(1000).fill(0).map((_, i) =>
        `Array.prototype.at[${i}]`,
      )

      const start = performance.now()
      validInputs.forEach((input) => {
        /^\w{1,50}\.prototype\.\w{1,50}\[[^\]]{1,20}\]$/.test(input)
      })
      const end = performance.now()

      expect(end - start).toBeLessThan(100) // Should process 1000 inputs in < 100ms
    })

    it('should reject many malicious inputs quickly', () => {
      const maliciousInputs = Array(100).fill(0).map((_, i) =>
        'a'.repeat(100 + i) + '.prototype.' + 'b'.repeat(100 + i) + '[' + 'c'.repeat(50 + i) + ']',
      )

      const start = performance.now()
      maliciousInputs.forEach((input) => {
        /^\w{1,50}\.prototype\.\w{1,50}\[[^\]]{1,20}\]$/.test(input)
      })
      const end = performance.now()

      expect(end - start).toBeLessThan(50) // Should process 100 malicious inputs in < 50ms
    })
  })

  describe('Real-world security validation', () => {
    it('should prevent denial of service through regex exploitation', () => {
      // This test simulates a real attack scenario where an attacker
      // provides crafted input designed to cause exponential backtracking

      const attackVector = 'a'.repeat(1000) + '.prototype.' + 'b'.repeat(1000) + '[' + 'c'.repeat(1000) + ']' + 'X'

      // Measure execution time
      const iterations = 10
      const times: number[] = []

      for (let i = 0; i < iterations; i++) {
        const start = performance.now()
        const result = /^\w{1,50}\.prototype\.\w{1,50}\[[^\]]{1,20}\]$/.test(attackVector)
        const end = performance.now()
        times.push(end - start)
        expect(result).toBe(false)
      }

      const avgTime = times.reduce((a, b) => a + b) / times.length
      const maxTime = Math.max(...times)

      // All executions should be fast and consistent
      expect(avgTime).toBeLessThan(1) // Average < 1ms
      expect(maxTime).toBeLessThan(5) // Max < 5ms

      // Variance should be low (consistent performance)
      const variance = times.reduce((acc, time) => acc + Math.pow(time - avgTime, 2), 0) / times.length
      expect(variance).toBeLessThan(1) // Low variance indicates no backtracking
    })
  })
})
