import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('Array slice functions debug', () => {
  it('should autofix drop calls', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { drop } from \'lodash-es\'; const result = drop(array, 2);',
            output: 'import { drop } from \'lodash-es\'; const result = array.slice(2);',
            options: [{ exclude: ['drop'] }],
            errors: [{ message: /Lodash function 'drop' is excluded/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix dropRight calls', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { dropRight } from \'lodash-es\'; const result = dropRight(array, 2);',
            output: 'import { dropRight } from \'lodash-es\'; const result = array.slice(0, -2);',
            options: [{ exclude: ['dropRight'] }],
            errors: [{ message: /Lodash function 'dropRight' is excluded/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix take calls', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { take } from \'lodash-es\'; const result = take(array, 3);',
            output: 'import { take } from \'lodash-es\'; const result = array.slice(0, 3);',
            options: [{ exclude: ['take'] }],
            errors: [{ message: /Lodash function 'take' is excluded/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix takeRight calls', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { takeRight } from \'lodash-es\'; const result = takeRight(array, 3);',
            output: 'import { takeRight } from \'lodash-es\'; const result = array.slice(-3);',
            options: [{ exclude: ['takeRight'] }],
            errors: [{ message: /Lodash function 'takeRight' is excluded/ }],
          },
        ],
      })
    }).not.toThrow()
  })
})
