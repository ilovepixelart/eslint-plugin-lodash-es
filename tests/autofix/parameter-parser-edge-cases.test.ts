import { describe, it, expect } from 'vitest'
import {
  findFirstTopLevelComma,
  extractMethodName,
  needsParentheses,
  isArrayLikeObject,
  extractStaticMethodInfo,
  findClosingParenthesis,
  isStaticMethod,
  isConstructorCall,
  isExpressionAlternative,
  isZeroParamStaticMethod,
} from '../../src/autofix/parameter-parser'

describe('parameter parser edge cases', () => {
  describe('findFirstTopLevelComma', () => {
    it('should handle empty string', () => {
      // Test parameter-parser.ts line 71: empty text check
      expect(findFirstTopLevelComma('')).toBe(-1)
    })

    it('should handle null/undefined input', () => {
      // Test edge cases with falsy inputs
      // @ts-expect-error testing invalid inputs
      expect(findFirstTopLevelComma(null)).toBe(-1)
      // @ts-expect-error testing invalid inputs
      expect(findFirstTopLevelComma(undefined)).toBe(-1)
    })

    it('should handle strings with no commas', () => {
      expect(findFirstTopLevelComma('simple string')).toBe(-1)
    })

    it('should handle strings with only nested commas', () => {
      expect(findFirstTopLevelComma('func(a, b, c)')).toBe(-1)
    })

    it('should handle complex nested structures', () => {
      expect(findFirstTopLevelComma('func(a, {b: c, d: e}), second')).toBe(21)
    })

    it('should handle malformed parentheses', () => {
      expect(findFirstTopLevelComma('func(a, b')).toBe(-1)
    })

    it('should handle string literals with commas', () => {
      expect(findFirstTopLevelComma('"test, comma", second')).toBe(13)
    })

    it('should handle escaped quotes', () => {
      expect(findFirstTopLevelComma('"test\\"quote", second')).toBe(13)
    })

    it('should handle single quotes', () => {
      expect(findFirstTopLevelComma('\'test, comma\', second')).toBe(13)
    })

    it('should handle backticks', () => {
      expect(findFirstTopLevelComma('`template, string`, second')).toBe(18)
    })

    it('should handle template literals with expressions', () => {
      expect(findFirstTopLevelComma('`temp ${expr, value} late`, second')).toBe(26)
    })
  })

  describe('extractMethodName', () => {
    it('should handle invalid input', () => {
      expect(extractMethodName('')).toBe(null)
      expect(extractMethodName('invalid')).toBe(null)
    })

    it('should extract method from prototype methods', () => {
      expect(extractMethodName('Array.prototype.map')).toBe('map')
    })

    it('should extract method from fixed parameter methods', () => {
      expect(extractMethodName('Array.prototype.at[0]')).toBe('at')
      expect(extractMethodName('Array.prototype.slice[0, 1]')).toBe('slice')
    })

    it('should handle malformed prototype methods', () => {
      expect(extractMethodName('Array.prototype.')).toBe(null)
      expect(extractMethodName('.prototype.map')).toBe('map')
    })
  })

  describe('needsParentheses', () => {
    it('should identify expressions needing parentheses', () => {
      expect(needsParentheses('a || b')).toBe(true)
      expect(needsParentheses('a && b')).toBe(true)
      expect(needsParentheses('a ? b : c')).toBe(true)
      expect(needsParentheses('a = b')).toBe(true)
      expect(needsParentheses('a += b')).toBe(true)
      // Note: arithmetic operators may not require parentheses in this context
    })

    it('should not require parentheses for simple expressions', () => {
      expect(needsParentheses('simpleVar')).toBe(false)
      expect(needsParentheses('obj.prop')).toBe(false)
      expect(needsParentheses('func()')).toBe(false)
      expect(needsParentheses('array[0]')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(needsParentheses('')).toBe(false)
      expect(needsParentheses('   ')).toBe(false)
    })
  })

  describe('isArrayLikeObject', () => {
    it('should identify array-like objects', () => {
      expect(isArrayLikeObject('arguments')).toBe(true)
      expect(isArrayLikeObject('document.querySelectorAll("div")')).toBe(true)
      expect(isArrayLikeObject('document.getElementsByTagName("p")')).toBe(true)
      expect(isArrayLikeObject('document.getElementsByClassName("test")')).toBe(true)
      expect(isArrayLikeObject('document.getElementsByName("name")')).toBe(true)
      expect(isArrayLikeObject('element.children')).toBe(true)
      expect(isArrayLikeObject('element.childNodes')).toBe(true)
    })

    it('should not identify regular arrays or objects', () => {
      expect(isArrayLikeObject('array')).toBe(false)
      expect(isArrayLikeObject('regularObject')).toBe(false)
      expect(isArrayLikeObject('myVar')).toBe(false)
      expect(isArrayLikeObject('obj.prop')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isArrayLikeObject('')).toBe(false)
      expect(isArrayLikeObject('   ')).toBe(false)
    })
  })

  describe('extractStaticMethodInfo', () => {
    it('should extract static method information', () => {
      expect(extractStaticMethodInfo('Object.keys')).toEqual({
        object: 'Object',
        method: 'keys',
      })

      expect(extractStaticMethodInfo('Math.max')).toEqual({
        object: 'Math',
        method: 'max',
      })
    })

    it('should handle invalid static method patterns', () => {
      expect(extractStaticMethodInfo('invalid')).toBe(null)
      expect(extractStaticMethodInfo('Object.')).toBe(null)
      expect(extractStaticMethodInfo('.keys')).toBe(null)
      expect(extractStaticMethodInfo('')).toBe(null)
    })
  })

  describe('findClosingParenthesis', () => {
    it('should find closing parenthesis', () => {
      expect(findClosingParenthesis('func(arg)', 4)).toBe(9)
      expect(findClosingParenthesis('func(nested(call))', 4)).toBe(18)
    })

    it('should handle malformed parentheses', () => {
      expect(findClosingParenthesis('func(arg', 4)).toBe(4) // Returns start index when no close found
    })

    it('should handle edge cases', () => {
      expect(findClosingParenthesis('', 0)).toBe(0)
      expect(findClosingParenthesis('func()', 10)).toBe(10) // Start beyond string
    })
  })

  describe('type checking functions', () => {
    it('should identify static methods', () => {
      expect(isStaticMethod('Object.keys')).toBe(true)
      expect(isStaticMethod('Math.max')).toBe(true)
      expect(isStaticMethod('Date.now')).toBe(true)
    })

    it('should identify constructor calls', () => {
      expect(isConstructorCall('Number.toNumber', 'toNumber')).toBe(true)
      expect(isConstructorCall('String.constructor', 'toString')).toBe(false)
    })

    it('should identify expression alternatives', () => {
      expect(isExpressionAlternative('value === null')).toBe(true)
      expect(isExpressionAlternative('typeof value === "string"')).toBe(true)
      expect(isExpressionAlternative('key in object')).toBe(true)
    })

    it('should identify zero parameter static methods', () => {
      expect(isZeroParamStaticMethod('Date.now')).toBe(true)
      expect(isZeroParamStaticMethod('Math.random')).toBe(false) // Not in the list
      expect(isZeroParamStaticMethod('Object.keys')).toBe(false)
    })

    it('should handle edge cases for type checking', () => {
      expect(isStaticMethod('')).toBe(false)
      expect(isConstructorCall('', '')).toBe(false)
      expect(isExpressionAlternative('')).toBe(false)
      expect(isZeroParamStaticMethod('')).toBe(false)
    })
  })
})
