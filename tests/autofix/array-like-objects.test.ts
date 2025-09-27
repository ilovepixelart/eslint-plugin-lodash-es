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

  describe('data type extremes', () => {
    it('should handle BigInt values', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map([1n, 2n, 3n], n => n * 2n);',
              output: 'import { map } from \'lodash-es\'; const result = [1n, 2n, 3n].map(n => n * 2n);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle sparse arrays', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const sparse = [1, , , 4]; const result = map(sparse, x => x || 0);',
              output: 'import { map } from \'lodash-es\'; const sparse = [1, , , 4]; const result = sparse.map(x => x || 0);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('potential breaking transformations', () => {
    it('should document array-like objects limitation', () => {
      // This is a known limitation: lodash works with array-like objects,
      // but native Array methods don't. The transformation should NOT happen
      // for non-arrays, but our current implementation doesn't detect this.
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [
            // These should ideally be valid (not transformed) but current implementation will transform them
            // This documents the limitation
          ],
          invalid: [
            // Current behavior: transforms even when it shouldn't
            {
              code: 'import { map } from \'lodash-es\'; const nodeList = document.querySelectorAll("div"); const result = map(nodeList, node => node.textContent);',
              output: 'import { map } from \'lodash-es\'; const nodeList = document.querySelectorAll("div"); const result = nodeList.map(node => node.textContent);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
