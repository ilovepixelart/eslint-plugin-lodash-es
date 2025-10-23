import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('Object.create', () => {
  it('should autofix create', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { create } from \'lodash-es\'; const result = create(prototype);',
            output: 'import { create } from \'lodash-es\'; const result = Object.create(prototype);',
            options: [{ exclude: ['create'] }],
            errors: [{ message: /Lodash function 'create' is excluded/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix create with null prototype', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { create } from \'lodash-es\'; const result = create(null);',
            output: 'import { create } from \'lodash-es\'; const result = Object.create(null);',
            options: [{ exclude: ['create'] }],
            errors: [{ message: /Lodash function 'create' is excluded/ }],
          },
        ],
      })
    }).not.toThrow()
  })
})