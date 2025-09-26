import { describe, it, expect } from 'vitest'
import { findFirstTopLevelComma, extractMethodName, findClosingParenthesis, needsParentheses } from '../../src/autofix/parameter-parser'

describe('parameter parser utilities', () => {
  describe('findFirstTopLevelComma', () => {
    it('should find simple comma', () => {
      const result = findFirstTopLevelComma('array, fn')
      expect(result).toBe(5)
    })

    it('should ignore commas inside parentheses', () => {
      const result = findFirstTopLevelComma('func(a, b), fn')
      expect(result).toBe(10)
    })

    it('should ignore commas inside brackets', () => {
      const result = findFirstTopLevelComma('[a, b, c], fn')
      expect(result).toBe(9)
    })

    it('should ignore commas inside braces', () => {
      const result = findFirstTopLevelComma('{ a: 1, b: 2 }, fn')
      expect(result).toBe(14)
    })

    it('should ignore commas inside strings', () => {
      const result = findFirstTopLevelComma('"hello, world", fn')
      expect(result).toBe(14)
    })

    it('should ignore commas inside template literals', () => {
      const result = findFirstTopLevelComma('`hello, ${name}`, fn')
      expect(result).toBe(16)
    })

    it('should handle nested structures', () => {
      const result = findFirstTopLevelComma('func({ a: [1, 2], b: "test, value" }), callback')
      expect(result).toBe(37)
    })

    it('should handle complex arrow functions', () => {
      const result = findFirstTopLevelComma('data, ({ name, age }) => age > 18')
      expect(result).toBe(4)
    })

    it('should handle template literals with expressions', () => {
      const result = findFirstTopLevelComma('users, user => `User: ${user.name}, Age: ${user.age}`')
      expect(result).toBe(5)
    })

    it('should return -1 when no comma found', () => {
      const result = findFirstTopLevelComma('single_parameter')
      expect(result).toBe(-1)
    })

    it('should handle escaped characters in strings', () => {
      const result = findFirstTopLevelComma('"escaped\\", quote", fn')
      expect(result).toBe(18)
    })
  })

  describe('extractMethodName', () => {
    it('should extract method from prototype notation', () => {
      const result = extractMethodName('Array.prototype.map')
      expect(result).toBe('map')
    })

    it('should extract method from object notation', () => {
      const result = extractMethodName('array.map(fn)')
      expect(result).toBe('map')
    })

    it('should extract method from simple object notation', () => {
      const result = extractMethodName('obj.method')
      expect(result).toBe('method')
    })

    it('should handle multiple dots', () => {
      const result = extractMethodName('some.nested.object.method')
      expect(result).toBe('method')
    })

    it('should handle methods with parentheses', () => {
      const result = extractMethodName('array.filter(predicate)')
      expect(result).toBe('filter')
    })

    it('should return null for invalid input', () => {
      const result = extractMethodName('simple_function')
      expect(result).toBe(null)
    })

    it('should handle empty parts', () => {
      const result = extractMethodName('Array.prototype.')
      expect(result).toBe(null)
    })
  })

  describe('findClosingParenthesis', () => {
    it('should find closing parenthesis for simple expression', () => {
      const text = 'function(a, b)'
      const result = findClosingParenthesis(text, 8)
      expect(result).toBe(14)
    })

    it('should handle nested parentheses', () => {
      const text = 'func(inner(a, b), c)'
      const result = findClosingParenthesis(text, 4)
      expect(result).toBe(20)
    })

    it('should start from correct position', () => {
      const text = 'prefix func(a, b) suffix'
      const result = findClosingParenthesis(text, 11)
      expect(result).toBe(17)
    })

    it('should return start index when no parentheses found', () => {
      const text = 'no parentheses here'
      const result = findClosingParenthesis(text, 5)
      expect(result).toBe(5)
    })

    it('should handle multiple levels of nesting', () => {
      const text = 'outer(inner(deep(x, y), z), w)'
      const result = findClosingParenthesis(text, 5)
      expect(result).toBe(30)
    })

    it('should handle empty parentheses', () => {
      const text = 'func()'
      const result = findClosingParenthesis(text, 4)
      expect(result).toBe(6)
    })
  })

  describe('needsParentheses', () => {
    it('should return true for logical OR operator', () => {
      expect(needsParentheses('data || []')).toBe(true)
      expect(needsParentheses('users || defaultUsers')).toBe(true)
    })

    it('should return true for logical AND operator', () => {
      expect(needsParentheses('isValid && data')).toBe(true)
      expect(needsParentheses('condition && array')).toBe(true)
    })

    it('should return true for nullish coalescing operator', () => {
      expect(needsParentheses('data ?? fallback')).toBe(true)
      expect(needsParentheses('items ?? []')).toBe(true)
    })

    it('should return true for ternary operator', () => {
      expect(needsParentheses('condition ? dataA : dataB')).toBe(true)
      expect(needsParentheses('x > 0 ? positive : negative')).toBe(true)
    })

    it('should return true for assignment operators', () => {
      expect(needsParentheses('cache = getData()')).toBe(true)
      expect(needsParentheses('result += value')).toBe(true)
    })

    it('should return false for simple expressions', () => {
      expect(needsParentheses('data')).toBe(false)
      expect(needsParentheses('users.filter(u => u.active)')).toBe(false)
      expect(needsParentheses('getData()')).toBe(false)
      expect(needsParentheses('[1, 2, 3]')).toBe(false)
    })

    it('should return false for optional chaining without operators', () => {
      expect(needsParentheses('data?.items')).toBe(false)
      expect(needsParentheses('user?.profile?.name')).toBe(false)
    })

    it('should return false for comparison operators', () => {
      expect(needsParentheses('x === y')).toBe(false)
      expect(needsParentheses('a > b')).toBe(false)
      expect(needsParentheses('item !== null')).toBe(false)
    })

    it('should return false for operators inside parentheses', () => {
      expect(needsParentheses('getArray(x || y)')).toBe(false)
      expect(needsParentheses('func(a && b)')).toBe(false)
    })

    it('should return false for operators inside strings', () => {
      expect(needsParentheses('"text || more"')).toBe(false)
      expect(needsParentheses('`template ${x || y}`')).toBe(false)
    })

    it('should handle complex nested expressions', () => {
      expect(needsParentheses('condition ? dataA || [] : dataB && fallback')).toBe(true)
      expect(needsParentheses('func(a || b) && other')).toBe(true)
      expect(needsParentheses('(a || b) && (c || d)')).toBe(true)
    })
  })

  describe('integration tests', () => {
    it('should work together to parse complex expressions', () => {
      const expression = 'users.filter(user => user.age > 18), user => ({ name: user.name, adult: true })'
      const commaIndex = findFirstTopLevelComma(expression)
      expect(commaIndex).toBe(35)

      const firstParam = expression.slice(0, commaIndex).trim()
      expect(firstParam).toBe('users.filter(user => user.age > 18)')

      const restParams = expression.slice(commaIndex + 1).trim()
      expect(restParams).toBe('user => ({ name: user.name, adult: true })')
    })

    it('should handle complex template literal expressions', () => {
      const expression = 'data, item => `Name: ${item.name}, Score: ${item.score > 80 ? "High" : "Low"}`'
      const commaIndex = findFirstTopLevelComma(expression)
      expect(commaIndex).toBe(4)

      const firstParam = expression.slice(0, commaIndex).trim()
      expect(firstParam).toBe('data')
    })
  })
})
