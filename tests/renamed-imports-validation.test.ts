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

  describe('import/export extremes', () => {
    it('should correctly detect multiple renamed imports by tracking aliases', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { filter as filterFunc, map as mapFunc } from \'lodash-es\'; const result = mapFunc([1, 2, 3], x => x * 2); const filtered = filterFunc([1, 2, 3], x => x > 0);',
              options: [{ exclude: ['map', 'filter'] }],
              errors: [
                { message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' },
                { message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' },
              ],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should document dynamic property access limitation (UNFIXABLE)', () => {
      // UNFIXABLE LIMITATION: Cannot detect dynamic property access _[funcName]
      // Rule only detects static property access like _.map, not computed property access
      // This requires runtime analysis which is impossible in static linting
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [
            // Dynamic property access is not detected (and cannot be)
            {
              code: 'import * as _ from \'lodash-es\'; const funcName = "map"; const result = _[funcName](data, x => x * 2);',
              options: [{ exclude: ['map'] }],
            },
          ],
          invalid: [],
        })
      }).not.toThrow()
    })
  })
})
