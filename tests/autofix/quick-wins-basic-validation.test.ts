import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('Quick Wins Functions Basic Validation', () => {
  it('should transform uniq function', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = [...new Set(array)];',
        ],
        invalid: [
          {
            code: 'import { uniq } from "lodash-es"; uniq([1, 2, 2, 3]);',
            output: 'import { uniq } from "lodash-es"; [...new Set([1, 2, 2, 3])];',
            options: [{ exclude: ['uniq'] }],
            errors: [{ message: /uniq/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform compact function', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = array.filter(Boolean);',
        ],
        invalid: [
          {
            code: 'import { compact } from "lodash-es"; compact([0, 1, false, 2]);',
            output: 'import { compact } from "lodash-es"; [0, 1, false, 2].filter(Boolean);',
            options: [{ exclude: ['compact'] }],
            errors: [{ message: /compact/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform pick function', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = Object.fromEntries(keys.map(k => [k, obj[k]]));',
        ],
        invalid: [
          {
            code: 'import { pick } from "lodash-es"; pick(obj, ["name", "age"]);',
            output: 'import { pick } from "lodash-es"; Object.fromEntries(["name", "age"].map(k => [k, obj[k]]));',
            options: [{ exclude: ['pick'] }],
            errors: [{ message: /pick/ }],
          },
        ],
      })
    }).not.toThrow()
  })
})
