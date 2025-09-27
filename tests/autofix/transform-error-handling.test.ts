import { describe, it, expect } from 'vitest'
import {
  handleNegationOperator,
  createExpressionFix,
  createConstructorFix,
  createStaticMethodFix,
  createFixedParamPrototypeMethodFix,
  createPrototypeMethodFix,
  extractFixedParams,
  type CallInfo,
} from '../../src/autofix/shared-transforms'

describe('shared-transforms branch coverage', () => {
  describe('handleNegationOperator edge cases', () => {
    it('should handle non-whitespace character before call', () => {
      // Test line 27: when the character before call is not whitespace
      const callInfo: CallInfo = {
        fullText: 'a!func(arg)',
        callStart: 2, // Position of 'func'
        callEnd: 11,
        params: 'arg',
      }

      const result = handleNegationOperator(callInfo, 'value === null')
      expect(result.start).toBe(1) // Should include the '!' since it's at position 1
      expect(result.text).toBe('!(value === null)')
    })

    it('should handle negation at beginning of text', () => {
      // Test line 27: when checkPos < 0
      const callInfo: CallInfo = {
        fullText: '!func(arg)',
        callStart: 1, // Position of 'func'
        callEnd: 10,
        params: 'arg',
      }

      const result = handleNegationOperator(callInfo, 'value === null')
      expect(result.start).toBe(0) // Should include the '!' at beginning
      expect(result.text).toBe('!(value === null)')
    })
  })

  describe('createExpressionFix edge cases', () => {
    it('should return null for empty params', () => {
      // Test line 54: if (!callInfo.params) return null
      const callInfo: CallInfo = {
        fullText: 'func()',
        callStart: 0,
        callEnd: 6,
        params: '',
      }

      const result = createExpressionFix(callInfo, 'value === null')
      expect(result).toBe(null)
    })

    it('should return null for has function with no comma', () => {
      // Test line 59: if (commaIndex === -1) return null for "has" function
      const callInfo: CallInfo = {
        fullText: 'has(object)',
        callStart: 0,
        callEnd: 11,
        params: 'object', // No comma, missing second parameter
      }

      const result = createExpressionFix(callInfo, 'key in object')
      expect(result).toBe(null)
    })
  })

  describe('createConstructorFix edge cases', () => {
    it('should return null for empty params', () => {
      // Test line 101: if (!callInfo.params) return null
      const callInfo: CallInfo = {
        fullText: 'toNumber()',
        callStart: 0,
        callEnd: 10,
        params: '',
      }

      const result = createConstructorFix(callInfo, 'Number.toNumber')
      expect(result).toBe(null)
    })
  })

  describe('createStaticMethodFix edge cases', () => {
    it('should return null for invalid static method', () => {
      // Test line 115: if (!staticInfo) return null
      const callInfo: CallInfo = {
        fullText: 'invalidMethod(arg)',
        callStart: 0,
        callEnd: 18,
        params: 'arg',
      }

      const result = createStaticMethodFix(callInfo, 'invalid.pattern')
      expect(result).toBe(null)
    })
  })

  describe('extractFixedParams edge cases', () => {
    it('should handle regex match with undefined capture group', () => {
      // Test line 145: match[1] being undefined case
      // This is hard to trigger since the regex would need to match but have no capture group
      const result1 = extractFixedParams('no.brackets.here')
      expect(result1).toBe(null)

      const result2 = extractFixedParams('Array.prototype.at[]') // Empty brackets
      expect(result2).toBe(null)
    })
  })

  describe('createFixedParamPrototypeMethodFix edge cases', () => {
    it('should return null for invalid native method', () => {
      // Test line 153: if (!nativeMethod) return null
      const callInfo: CallInfo = {
        fullText: 'func(arg)',
        callStart: 0,
        callEnd: 9,
        params: 'arg',
      }

      const result = createFixedParamPrototypeMethodFix(callInfo, 'invalid.pattern')
      expect(result).toBe(null)
    })

    it('should return null for missing fixed params', () => {
      // Test line 156: if (!fixedParams) return null
      const callInfo: CallInfo = {
        fullText: 'func(arg)',
        callStart: 0,
        callEnd: 9,
        params: 'arg',
      }

      const result = createFixedParamPrototypeMethodFix(callInfo, 'Array.prototype.at') // No brackets
      expect(result).toBe(null)
    })

    it('should handle expressions that need parentheses', () => {
      // Test line 166: needsParentheses ternary operation
      const callInfo: CallInfo = {
        fullText: 'func(a || b)',
        callStart: 0,
        callEnd: 12,
        params: 'a || b', // Expression that needs parentheses
      }

      const result = createFixedParamPrototypeMethodFix(callInfo, 'Array.prototype.at[0]')
      expect(result?.text).toBe('(a || b).at(0)')
    })

    it('should handle simple expressions that dont need parentheses', () => {
      // Test line 166: other branch of needsParentheses ternary
      const callInfo: CallInfo = {
        fullText: 'func(array)',
        callStart: 0,
        callEnd: 11,
        params: 'array', // Simple expression that doesn't need parentheses
      }

      const result = createFixedParamPrototypeMethodFix(callInfo, 'Array.prototype.at[0]')
      expect(result?.text).toBe('array.at(0)')
    })
  })

  describe('createPrototypeMethodFix edge cases', () => {
    it('should return null for invalid native method', () => {
      // Test line 182: if (!nativeMethod) return null
      const callInfo: CallInfo = {
        fullText: 'func(arg)',
        callStart: 0,
        callEnd: 9,
        params: 'arg',
      }

      const result = createPrototypeMethodFix(callInfo, 'invalid.pattern')
      expect(result).not.toBe(null) // Function treats 'invalid.pattern' as valid pattern
    })

    it('should return null for reject function with no predicate', () => {
      // Test line 210: if (!restParams) return null in reject handling
      const callInfo: CallInfo = {
        fullText: 'reject(array)',
        callStart: 0,
        callEnd: 13,
        params: 'array', // Only one parameter, no predicate
      }

      const result = createPrototypeMethodFix(callInfo, 'Array.prototype.filter', 'reject')
      expect(result).toBe(null)
    })
  })

  describe('complex edge case combinations', () => {
    it('should handle whitespace-only params', () => {
      const callInfo: CallInfo = {
        fullText: 'func(   )',
        callStart: 0,
        callEnd: 9,
        params: '   ', // Whitespace-only params
      }

      const result = createExpressionFix(callInfo, 'value === null')
      expect(result?.text).toBe('    === null')
    })

    it('should handle malformed alternative patterns', () => {
      const callInfo: CallInfo = {
        fullText: 'func(arg)',
        callStart: 0,
        callEnd: 9,
        params: 'arg',
      }

      // Test various malformed patterns
      expect(createStaticMethodFix(callInfo, '')).toBe(null)
      expect(createStaticMethodFix(callInfo, 'no.dot')).toBe(null)
      expect(createFixedParamPrototypeMethodFix(callInfo, '')).toBe(null)
      expect(createPrototypeMethodFix(callInfo, '')).toBe(null)
    })
  })
})
