import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('Function utility methods', () => {
  describe('bind', () => {
    it('should autofix bind', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { bind } from \'lodash-es\'; const result = bind(func, thisArg);',
              output: 'import { bind } from \'lodash-es\'; const result = func.bind(thisArg);',
              options: [{ exclude: ['bind'] }],
              errors: [{ message: /Lodash function 'bind' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix bind with partial application', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { bind } from \'lodash-es\'; const result = bind(func, thisArg, arg1, arg2);',
              output: 'import { bind } from \'lodash-es\'; const result = func.bind(thisArg, arg1, arg2);',
              options: [{ exclude: ['bind'] }],
              errors: [{ message: /Lodash function 'bind' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('delay', () => {
    it('should autofix delay', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { delay } from \'lodash-es\'; const result = delay(func, 1000);',
              output: 'import { delay } from \'lodash-es\'; const result = setTimeout(func, 1000);',
              options: [{ exclude: ['delay'] }],
              errors: [{ message: /Lodash function 'delay' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix delay with arguments', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { delay } from \'lodash-es\'; const result = delay(func, 1000, arg1, arg2);',
              output: 'import { delay } from \'lodash-es\'; const result = setTimeout(func, 1000, arg1, arg2);',
              options: [{ exclude: ['delay'] }],
              errors: [{ message: /Lodash function 'delay' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('defer', () => {
    it('should autofix defer', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { defer } from \'lodash-es\'; const result = defer(func);',
              output: 'import { defer } from \'lodash-es\'; const result = setTimeout(func, 0);',
              options: [{ exclude: ['defer'] }],
              errors: [{ message: /Lodash function 'defer' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})