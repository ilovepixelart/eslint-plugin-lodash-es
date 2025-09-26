import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('array-like objects fix', () => {
  it('should transform arguments object with Array.from()', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\'; function test() { const result = map(arguments, arg => arg * 2); }',
            output: 'import { map } from \'lodash-es\'; function test() { const result = Array.from(arguments).map(arg => arg * 2); }',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform NodeList with Array.from()', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\'; const result = map(document.querySelectorAll(\'div\'), el => el.textContent);',
            output: 'import { map } from \'lodash-es\'; const result = Array.from(document.querySelectorAll(\'div\')).map(el => el.textContent);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform HTMLCollection with Array.from()', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\'; const result = map(element.children, child => child.className);',
            output: 'import { map } from \'lodash-es\'; const result = Array.from(element.children).map(child => child.className);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should work with namespace imports', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import _ from \'lodash-es\'; function test() { const result = _.map(arguments, arg => arg * 2); }',
            output: 'import _ from \'lodash-es\'; function test() { const result = Array.from(arguments).map(arg => arg * 2); }',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should not affect regular arrays', () => {
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
        ],
      })
    }).not.toThrow()
  })
})
