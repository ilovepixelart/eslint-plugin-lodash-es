import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('Object Utilities Functions Basic Validation', () => {
  it('should transform merge function', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = Object.assign({}, target, source);',
        ],
        invalid: [
          {
            code: 'import { merge } from "lodash-es"; merge(target, source);',
            output: 'import { merge } from "lodash-es"; Object.assign({}, target, source);',
            options: [{ exclude: ['merge'] }],
            errors: [{ message: /merge/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform get function for simple paths', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = obj?.user?.name;',
        ],
        invalid: [
          {
            code: 'import { get } from "lodash-es"; get(obj, "user.name");',
            output: 'import { get } from "lodash-es"; obj?.user?.name;',
            options: [{ exclude: ['get'] }],
            errors: [{ message: /get/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should handle merge with multiple sources', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = Object.assign({}, target, source1, source2);',
        ],
        invalid: [
          {
            code: 'import { merge } from "lodash-es"; merge(target, source1, source2);',
            output: 'import { merge } from "lodash-es"; Object.assign({}, target, source1, source2);',
            options: [{ exclude: ['merge'] }],
            errors: [{ message: /merge/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform clone function', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = {...obj};',
        ],
        invalid: [
          {
            code: 'import { clone } from "lodash-es"; const result = clone(obj);',
            output: 'import { clone } from "lodash-es"; const result = {...obj};',
            options: [{ exclude: ['clone'] }],
            errors: [{ message: /clone/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform cloneDeep function', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = structuredClone(obj);',
        ],
        invalid: [
          {
            code: 'import { cloneDeep } from "lodash-es"; cloneDeep(obj);',
            output: 'import { cloneDeep } from "lodash-es"; structuredClone(obj);',
            options: [{ exclude: ['cloneDeep'] }],
            errors: [{ message: /cloneDeep/ }],
          },
        ],
      })
    }).not.toThrow()
  })
})
