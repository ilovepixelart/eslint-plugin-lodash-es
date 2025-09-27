import { describe, it, expect } from 'vitest'
import {
  findFirstTopLevelComma,
  isArrayLikeObject,
} from '../../src/autofix/parameter-parser'

// Simple functional tests to trigger uncovered branches
describe('rules edge case coverage', () => {
  describe('parameter-parser specific uncovered branches', () => {
    it('should test empty text path in findFirstTopLevelComma', () => {
      // This tests line 71 in parameter-parser.ts
      expect(findFirstTopLevelComma('')).toBe(-1)
    })

    it('should test falsy character handling', () => {
      // This tests line 85 in parameter-parser.ts
      // Create a string with null characters that could be falsy
      const textWithNullChar = 'test\u0000test'
      const result = findFirstTopLevelComma(textWithNullChar)
      expect(result).toBe(-1) // No comma found
    })

    it('should test isArrayLikeObject with various patterns', () => {
      // Test different array-like object patterns to hit various branches
      expect(isArrayLikeObject('arguments')).toBe(true)
      expect(isArrayLikeObject('document.querySelectorAll("div")')).toBe(true)
      expect(isArrayLikeObject('element.children')).toBe(true)
      expect(isArrayLikeObject('normalArray')).toBe(false)
      expect(isArrayLikeObject('')).toBe(false)
    })

    it('should test complex comma finding scenarios', () => {
      // Test various complex scenarios for findFirstTopLevelComma
      expect(findFirstTopLevelComma('func(a, b), second')).toBe(10)
      expect(findFirstTopLevelComma('"test, comma", second')).toBe(13)
      expect(findFirstTopLevelComma('func(nested(a, b)), second')).toBe(18)
    })
  })

  describe('coverage focused tests', () => {
    it('should test specific edge cases for better coverage', () => {
      // These tests are designed to hit specific uncovered lines

      // Test empty string handling in various functions
      expect(isArrayLikeObject('   ')).toBe(false)

      // Test with null/undefined-like scenarios
      expect(findFirstTopLevelComma('null')).toBe(-1)
      expect(findFirstTopLevelComma('undefined')).toBe(-1)

      // Test complex nesting scenarios with actual top-level comma
      expect(findFirstTopLevelComma('func({a: {b: c}}), second')).toBe(17)
    })

    it('should handle template literal edge cases', () => {
      // Test template literal handling in parameter parsing
      expect(findFirstTopLevelComma('`template ${expr}`, second')).toBe(18)
      expect(findFirstTopLevelComma('`nested ${a, b} template`, third')).toBe(25)
    })

    it('should handle string literal edge cases', () => {
      // Test string literal handling
      expect(findFirstTopLevelComma('\'single quote\', second')).toBe(14)
      expect(findFirstTopLevelComma('"double quote", second')).toBe(14)
      expect(findFirstTopLevelComma('"escaped\\"quote", second')).toBe(16)
    })
  })
})
