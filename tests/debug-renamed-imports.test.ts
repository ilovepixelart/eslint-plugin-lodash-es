import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('debug renamed imports', () => {
  it('should detect simple renamed import', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { map as mapFunc } from \'lodash-es\'; const result = mapFunc([1, 2, 3], x => x * 2);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should still detect regular imports', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\'; const result = map([1, 2, 3], x => x * 2);',
            output: 'import { map } from \'lodash-es\'; const result = [1, 2, 3].map(x => x * 2);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
        ],
      })
    }).not.toThrow()
  })
})
