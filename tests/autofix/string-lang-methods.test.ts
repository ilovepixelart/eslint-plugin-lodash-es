import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('String and Lang methods', () => {
  describe('parseInt', () => {
    it('should autofix parseInt with string', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { parseInt } from \'lodash-es\'; const result = parseInt(str);',
              output: 'import { parseInt } from \'lodash-es\'; const result = parseInt(str);',
              options: [{ exclude: ['parseInt'] }],
              errors: [{ message: /Lodash function 'parseInt' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix parseInt with radix', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { parseInt } from \'lodash-es\'; const result = parseInt(str, 10);',
              output: 'import { parseInt } from \'lodash-es\'; const result = parseInt(str, 10);',
              options: [{ exclude: ['parseInt'] }],
              errors: [{ message: /Lodash function 'parseInt' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('isLength', () => {
    it('should autofix isLength', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isLength } from \'lodash-es\'; const result = isLength(value);',
              output: 'import { isLength } from \'lodash-es\'; const result = Number.isInteger(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;',
              options: [{ exclude: ['isLength'] }],
              errors: [{ message: /Lodash function 'isLength' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('isArrayLike', () => {
    it('should autofix isArrayLike', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isArrayLike } from \'lodash-es\'; const result = isArrayLike(value);',
              output: 'import { isArrayLike } from \'lodash-es\'; const result = value != null && typeof value.length === \'number\' && value.length >= 0 && value.length <= Number.MAX_SAFE_INTEGER;',
              options: [{ exclude: ['isArrayLike'] }],
              errors: [{ message: /Lodash function 'isArrayLike' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})