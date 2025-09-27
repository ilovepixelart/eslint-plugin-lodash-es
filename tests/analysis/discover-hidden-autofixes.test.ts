import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('🔥 DISCOVERING HIDDEN AUTOFIXES', () => {
  describe('🎯 Object Functions - STATIC METHOD AUTOFIXES', () => {
    it('keys should autofix to Object.keys', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { keys } from \'lodash-es\'; const result = keys(obj);',
              output: 'import { keys } from \'lodash-es\'; const result = Object.keys(obj);',
              options: [{ exclude: ['keys'] }],
              errors: [{ message: 'Lodash function \'keys\' is excluded by configuration. Consider using native Object.keys: Object.keys(object)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('values should autofix to Object.values', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { values } from \'lodash-es\'; const result = values(obj);',
              output: 'import { values } from \'lodash-es\'; const result = Object.values(obj);',
              options: [{ exclude: ['values'] }],
              errors: [{ message: 'Lodash function \'values\' is excluded by configuration. Consider using native Object.values: Object.values(object || {})' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('entries should autofix to Object.entries', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { entries } from \'lodash-es\'; const result = entries(obj);',
              output: 'import { entries } from \'lodash-es\'; const result = Object.entries(obj);',
              options: [{ exclude: ['entries'] }],
              errors: [{ message: 'Lodash function \'entries\' is excluded by configuration. Consider using native Object.entries: Object.entries(object || {})' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('assign should autofix to Object.assign', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { assign } from \'lodash-es\'; const result = assign(target, source);',
              output: 'import { assign } from \'lodash-es\'; const result = Object.assign(target, source);',
              options: [{ exclude: ['assign'] }],
              errors: [{ message: 'Lodash function \'assign\' is excluded by configuration. Consider using native Object.assign: Object.assign(target, ...sources)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('🎯 Number/Math Functions - STATIC METHOD AUTOFIXES', () => {
    it('isFinite should autofix to Number.isFinite', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isFinite } from \'lodash-es\'; const result = isFinite(num);',
              output: 'import { isFinite } from \'lodash-es\'; const result = Number.isFinite(num);',
              options: [{ exclude: ['isFinite'] }],
              errors: [{ message: 'Lodash function \'isFinite\' is excluded by configuration. Consider using native Number.isFinite: Number.isFinite(value)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('isInteger should autofix to Number.isInteger', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isInteger } from \'lodash-es\'; const result = isInteger(num);',
              output: 'import { isInteger } from \'lodash-es\'; const result = Number.isInteger(num);',
              options: [{ exclude: ['isInteger'] }],
              errors: [{ message: 'Lodash function \'isInteger\' is excluded by configuration. Consider using native Number.isInteger: Number.isInteger(value)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('isNaN should autofix to Number.isNaN', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isNaN } from \'lodash-es\'; const result = isNaN(num);',
              output: 'import { isNaN } from \'lodash-es\'; const result = Number.isNaN(num);',
              options: [{ exclude: ['isNaN'] }],
              errors: [{ message: 'Lodash function \'isNaN\' is excluded by configuration. Consider using native Number.isNaN: Number.isNaN(value)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('max should autofix to Math.max', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { max } from \'lodash-es\'; const result = max(numbers);',
              output: 'import { max } from \'lodash-es\'; const result = Math.max(...numbers);',
              options: [{ exclude: ['max'] }],
              errors: [{ message: 'Lodash function \'max\' is excluded by configuration. Consider using native Math.max: Math.max(...array)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('min should autofix to Math.min', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { min } from \'lodash-es\'; const result = min(numbers);',
              output: 'import { min } from \'lodash-es\'; const result = Math.min(...numbers);',
              options: [{ exclude: ['min'] }],
              errors: [{ message: 'Lodash function \'min\' is excluded by configuration. Consider using native Math.min: Math.min(...array)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('ceil should autofix to Math.ceil', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { ceil } from \'lodash-es\'; const result = ceil(num);',
              output: 'import { ceil } from \'lodash-es\'; const result = Math.ceil(num);',
              options: [{ exclude: ['ceil'] }],
              errors: [{ message: 'Lodash function \'ceil\' is excluded by configuration. Consider using native Math.ceil: Math.ceil(number)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('floor should autofix to Math.floor', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { floor } from \'lodash-es\'; const result = floor(num);',
              output: 'import { floor } from \'lodash-es\'; const result = Math.floor(num);',
              options: [{ exclude: ['floor'] }],
              errors: [{ message: 'Lodash function \'floor\' is excluded by configuration. Consider using native Math.floor: Math.floor(number)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('round should autofix to Math.round', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { round } from \'lodash-es\'; const result = round(num);',
              output: 'import { round } from \'lodash-es\'; const result = Math.round(num);',
              options: [{ exclude: ['round'] }],
              errors: [{ message: 'Lodash function \'round\' is excluded by configuration. Consider using native Math.round: Math.round(number)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('🎯 Array Static Functions', () => {
    it('isArray should autofix to Array.isArray', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isArray } from \'lodash-es\'; const result = isArray(data);',
              output: 'import { isArray } from \'lodash-es\'; const result = Array.isArray(data);',
              options: [{ exclude: ['isArray'] }],
              errors: [{ message: 'Lodash function \'isArray\' is excluded by configuration. Consider using native Array.isArray: Array.isArray(value)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('🎯 Function/Type Conversion Functions', () => {
    it('toNumber should have autofix to Number constructor', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { toNumber } from \'lodash-es\'; const result = toNumber(str);',
              output: 'import { toNumber } from \'lodash-es\'; const result = Number(str);',
              options: [{ exclude: ['toNumber'] }],
              errors: [{ message: /Lodash function 'toNumber' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('toString should autofix to prototype method', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { toString } from \'lodash-es\'; const result = toString(value);',
              output: 'import { toString } from \'lodash-es\'; const result = value.toString();',
              options: [{ exclude: ['toString'] }],
              errors: [{ message: /Lodash function 'toString' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
