import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('Lang type conversion functions', () => {
  describe('isSafeInteger', () => {
    it('should autofix isSafeInteger', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isSafeInteger } from \'lodash-es\'; const result = isSafeInteger(value);',
              output: 'import { isSafeInteger } from \'lodash-es\'; const result = Number.isSafeInteger(value);',
              options: [{ exclude: ['isSafeInteger'] }],
              errors: [{ message: /Lodash function 'isSafeInteger' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('castArray', () => {
    it('should autofix castArray', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { castArray } from \'lodash-es\'; const result = castArray(value);',
              output: 'import { castArray } from \'lodash-es\'; const result = Array.isArray(value) ? value : [value];',
              options: [{ exclude: ['castArray'] }],
              errors: [{ message: /Lodash function 'castArray' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('toArray', () => {
    it('should autofix toArray', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { toArray } from \'lodash-es\'; const result = toArray(value);',
              output: 'import { toArray } from \'lodash-es\'; const result = Array.from(value);',
              options: [{ exclude: ['toArray'] }],
              errors: [{ message: /Lodash function 'toArray' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('toFinite', () => {
    it('should autofix toFinite', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { toFinite } from \'lodash-es\'; const result = toFinite(value);',
              output: 'import { toFinite } from \'lodash-es\'; const result = Number(value) || 0;',
              options: [{ exclude: ['toFinite'] }],
              errors: [{ message: /Lodash function 'toFinite' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('toInteger', () => {
    it('should autofix toInteger', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { toInteger } from \'lodash-es\'; const result = toInteger(value);',
              output: 'import { toInteger } from \'lodash-es\'; const result = Math.trunc(Number(value)) || 0;',
              options: [{ exclude: ['toInteger'] }],
              errors: [{ message: /Lodash function 'toInteger' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('toSafeInteger', () => {
    it('should autofix toSafeInteger', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { toSafeInteger } from \'lodash-es\'; const result = toSafeInteger(value);',
              output: 'import { toSafeInteger } from \'lodash-es\'; const result = Math.min(Math.max(Math.trunc(Number(value)) || 0, -Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER);',
              options: [{ exclude: ['toSafeInteger'] }],
              errors: [{ message: /Lodash function 'toSafeInteger' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})