import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('operator precedence fixes', () => {
  describe('logical operators', () => {
    it('should add parentheses for logical OR operator', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data?.items || [], item => item?.value);',
              output: 'import { map } from \'lodash-es\'; const result = (data?.items || []).map(item => item?.value);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
            {
              code: 'import { filter } from \'lodash-es\'; const result = filter(users || defaultUsers, user => user.active);',
              output: 'import { filter } from \'lodash-es\'; const result = (users || defaultUsers).filter(user => user.active);',
              options: [{ exclude: ['filter'] }],
              errors: [{ message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should add parentheses for logical AND operator', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(isValid && data, item => item.value);',
              output: 'import { map } from \'lodash-es\'; const result = (isValid && data).map(item => item.value);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should add parentheses for nullish coalescing operator', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data ?? fallbackData, item => item.value);',
              output: 'import { map } from \'lodash-es\'; const result = (data ?? fallbackData).map(item => item.value);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('ternary operators', () => {
    it('should add parentheses for ternary operator', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(condition ? dataA : dataB, item => item.value);',
              output: 'import { map } from \'lodash-es\'; const result = (condition ? dataA : dataB).map(item => item.value);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('assignment operators', () => {
    it('should add parentheses for assignment operators', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(cache = getData(), item => item.value);',
              output: 'import { map } from \'lodash-es\'; const result = (cache = getData()).map(item => item.value);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('namespace imports', () => {
    it('should add parentheses for namespace imports with operators', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.map(data || [], item => item.value);',
              output: 'import _ from \'lodash-es\'; const result = (data || []).map(item => item.value);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
            {
              code: 'import * as lodash from \'lodash-es\'; const result = lodash.filter(condition ? users : guests, user => user.active);',
              output: 'import * as lodash from \'lodash-es\'; const result = (condition ? users : guests).filter(user => user.active);',
              options: [{ exclude: ['filter'] }],
              errors: [{ message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('expressions that should NOT get parentheses', () => {
    it('should not add parentheses for simple expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data, item => item.value);',
              output: 'import { map } from \'lodash-es\'; const result = data.map(item => item.value);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
            {
              code: 'import { map } from \'lodash-es\'; const result = map(users.filter(u => u.active), item => item.name);',
              output: 'import { map } from \'lodash-es\'; const result = users.filter(u => u.active).map(item => item.name);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
            {
              code: 'import { map } from \'lodash-es\'; const result = map(getData(), item => item.value);',
              output: 'import { map } from \'lodash-es\'; const result = getData().map(item => item.value);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should not add parentheses for optional chaining without operators', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data?.items, item => item?.value);',
              output: 'import { map } from \'lodash-es\'; const result = data?.items.map(item => item?.value);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should not add parentheses for comparison operators inside parentheses', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(getArray(x === y), item => item.value);',
              output: 'import { map } from \'lodash-es\'; const result = getArray(x === y).map(item => item.value);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('complex nested scenarios', () => {
    it('should handle multiple operator levels correctly', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(condition ? dataA || [] : dataB && fallback, item => item.value);',
              output: 'import { map } from \'lodash-es\'; const result = (condition ? dataA || [] : dataB && fallback).map(item => item.value);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
