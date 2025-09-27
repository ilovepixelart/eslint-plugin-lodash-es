import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('edge case coverage improvements', () => {
  describe('autofix edge cases', () => {
    it('should handle functions with no native alternatives (destructured)', () => {
      // Test destructured-autofix.ts line 48: when getNativeAlternative returns null
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { debounce } from \'lodash-es\'; debounce(fn, 300);',
              options: [{ exclude: ['debounce'] }],
              errors: [{ message: /Lodash function 'debounce' is excluded/ }],
              // No output expected since there's no native alternative
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle functions with no native alternatives (namespace)', () => {
      // Test similar case for namespace autofix
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; _.debounce(fn, 300);',
              options: [{ exclude: ['debounce'] }],
              errors: [{ message: /Lodash function 'debounce' is excluded/ }],
              // No output expected since there's no native alternative
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle namespace calls with fixed parameter prototype methods', () => {
      // Test namespace-autofix.ts lines 72-73: fixed parameter prototype method path
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.first(array);',
              output: 'import _ from \'lodash-es\'; const result = array.at(0);',
              options: [{ exclude: ['first'] }],
              errors: [{ message: /Lodash function 'first' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle array-like objects requiring Array.from()', () => {
      // Test shared-transforms.ts line 164: Array.from() case
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { first } from \'lodash-es\'; const result = first(document.querySelectorAll("div"));',
              output: 'import { first } from \'lodash-es\'; const result = Array.from(document.querySelectorAll("div")).at(0);',
              options: [{ exclude: ['first'] }],
              errors: [{ message: /Lodash function 'first' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle complex array-like object expressions', () => {
      // Test more complex array-like object cases
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { first } from \'lodash-es\'; const result = first(arguments);',
              output: 'import { first } from \'lodash-es\'; const result = Array.from(arguments).at(0);',
              options: [{ exclude: ['first'] }],
              errors: [{ message: /Lodash function 'first' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle NodeList array-like objects', () => {
      // Test another array-like object pattern - use document.getElementsByTagName which is recognized
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { last } from \'lodash-es\'; const result = last(document.getElementsByTagName("div"));',
              output: 'import { last } from \'lodash-es\'; const result = Array.from(document.getElementsByTagName("div")).at(-1);',
              options: [{ exclude: ['last'] }],
              errors: [{ message: /Lodash function 'last' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
