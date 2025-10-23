import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('Util methods', () => {
  describe('constant', () => {
    it('should autofix constant', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { constant } from \'lodash-es\'; const result = constant(42);',
              output: 'import { constant } from \'lodash-es\'; const result = () => 42;',
              options: [{ exclude: ['constant'] }],
              errors: [{ message: /Lodash function 'constant' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix constant with object', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { constant } from \'lodash-es\'; const result = constant({x: 1});',
              output: 'import { constant } from \'lodash-es\'; const result = () => {x: 1};',
              options: [{ exclude: ['constant'] }],
              errors: [{ message: /Lodash function 'constant' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('times', () => {
    it('should autofix times', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { times } from \'lodash-es\'; const result = times(3, fn);',
              output: 'import { times } from \'lodash-es\'; const result = Array.from({length: 3}, (_, i) => fn(i));',
              options: [{ exclude: ['times'] }],
              errors: [{ message: /Lodash function 'times' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('range', () => {
    it('should autofix range with single param', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { range } from \'lodash-es\'; const result = range(5);',
              output: 'import { range } from \'lodash-es\'; const result = Array.from({length: 5}, (_, i) => i);',
              options: [{ exclude: ['range'] }],
              errors: [{ message: /Lodash function 'range' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix range with start and end', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { range } from \'lodash-es\'; const result = range(2, 10);',
              output: 'import { range } from \'lodash-es\'; const result = Array.from({length: 10 - 2}, (_, i) => 2 + i);',
              options: [{ exclude: ['range'] }],
              errors: [{ message: /Lodash function 'range' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('rangeRight', () => {
    it('should autofix rangeRight with single param', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { rangeRight } from \'lodash-es\'; const result = rangeRight(5);',
              output: 'import { rangeRight } from \'lodash-es\'; const result = Array.from({length: 5}, (_, i) => 5 - i - 1);',
              options: [{ exclude: ['rangeRight'] }],
              errors: [{ message: /Lodash function 'rangeRight' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix rangeRight with start and end', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { rangeRight } from \'lodash-es\'; const result = rangeRight(2, 10);',
              output: 'import { rangeRight } from \'lodash-es\'; const result = Array.from({length: 10 - 2}, (_, i) => 10 - i - 1);',
              options: [{ exclude: ['rangeRight'] }],
              errors: [{ message: /Lodash function 'rangeRight' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})