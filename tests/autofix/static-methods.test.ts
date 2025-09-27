import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('comprehensive static method autofixes', () => {
  describe('Object static methods', () => {
    it('should autofix destructured Object.keys calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { keys } from \'lodash-es\'; const result = keys(userObj);',
              output: 'import { keys } from \'lodash-es\'; const result = Object.keys(userObj);',
              options: [{ exclude: ['keys'] }],
              errors: [{ message: 'Lodash function \'keys\' is excluded by configuration. Consider using native Object.keys: Object.keys(object)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace Object.keys calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.keys(userObj);',
              output: 'import _ from \'lodash-es\'; const result = Object.keys(userObj);',
              options: [{ exclude: ['keys'] }],
              errors: [{ message: 'Lodash function \'keys\' is excluded by configuration. Consider using native Object.keys: Object.keys(object)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix Object.values calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { values } from \'lodash-es\'; const result = values(config);',
              output: 'import { values } from \'lodash-es\'; const result = Object.values(config);',
              options: [{ exclude: ['values'] }],
              errors: [{ message: 'Lodash function \'values\' is excluded by configuration. Consider using native Object.values: Object.values(object || {})' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix Object.entries calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { entries } from \'lodash-es\'; const result = entries(data);',
              output: 'import { entries } from \'lodash-es\'; const result = Object.entries(data);',
              options: [{ exclude: ['entries'] }],
              errors: [{ message: 'Lodash function \'entries\' is excluded by configuration. Consider using native Object.entries: Object.entries(object || {})' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix Object.assign calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { assign } from \'lodash-es\'; const result = assign({}, source1, source2);',
              output: 'import { assign } from \'lodash-es\'; const result = Object.assign({}, source1, source2);',
              options: [{ exclude: ['assign'] }],
              errors: [{ message: 'Lodash function \'assign\' is excluded by configuration. Consider using native Object.assign: Object.assign(target, ...sources)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('Number static methods', () => {
    it('should autofix Number.isFinite calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isFinite } from \'lodash-es\'; const result = isFinite(userInput);',
              output: 'import { isFinite } from \'lodash-es\'; const result = Number.isFinite(userInput);',
              options: [{ exclude: ['isFinite'] }],
              errors: [{ message: 'Lodash function \'isFinite\' is excluded by configuration. Consider using native Number.isFinite: Number.isFinite(value)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix Number.isInteger calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isInteger } from \'lodash-es\'; const result = isInteger(count);',
              output: 'import { isInteger } from \'lodash-es\'; const result = Number.isInteger(count);',
              options: [{ exclude: ['isInteger'] }],
              errors: [{ message: 'Lodash function \'isInteger\' is excluded by configuration. Consider using native Number.isInteger: Number.isInteger(value)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix Number.isNaN calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isNaN } from \'lodash-es\'; const result = isNaN(parseFloat(input));',
              output: 'import { isNaN } from \'lodash-es\'; const result = Number.isNaN(parseFloat(input));',
              options: [{ exclude: ['isNaN'] }],
              errors: [{ message: 'Lodash function \'isNaN\' is excluded by configuration. Consider using native Number.isNaN: Number.isNaN(value)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('Math static methods', () => {
    it('should autofix Math.max calls with spread', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { max } from \'lodash-es\'; const result = max(scores);',
              output: 'import { max } from \'lodash-es\'; const result = Math.max(...scores);',
              options: [{ exclude: ['max'] }],
              errors: [{ message: 'Lodash function \'max\' is excluded by configuration. Consider using native Math.max: Math.max(...array)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix Math.min calls with spread', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { min } from \'lodash-es\'; const result = min(prices);',
              output: 'import { min } from \'lodash-es\'; const result = Math.min(...prices);',
              options: [{ exclude: ['min'] }],
              errors: [{ message: 'Lodash function \'min\' is excluded by configuration. Consider using native Math.min: Math.min(...array)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix Math.ceil calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { ceil } from \'lodash-es\'; const result = ceil(average);',
              output: 'import { ceil } from \'lodash-es\'; const result = Math.ceil(average);',
              options: [{ exclude: ['ceil'] }],
              errors: [{ message: 'Lodash function \'ceil\' is excluded by configuration. Consider using native Math.ceil: Math.ceil(number)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix Math.floor calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { floor } from \'lodash-es\'; const result = floor(percentage);',
              output: 'import { floor } from \'lodash-es\'; const result = Math.floor(percentage);',
              options: [{ exclude: ['floor'] }],
              errors: [{ message: 'Lodash function \'floor\' is excluded by configuration. Consider using native Math.floor: Math.floor(number)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix Math.round calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { round } from \'lodash-es\'; const result = round(temperature);',
              output: 'import { round } from \'lodash-es\'; const result = Math.round(temperature);',
              options: [{ exclude: ['round'] }],
              errors: [{ message: 'Lodash function \'round\' is excluded by configuration. Consider using native Math.round: Math.round(number)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('Array static methods', () => {
    it('should autofix Array.isArray calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isArray } from \'lodash-es\'; const result = isArray(input);',
              output: 'import { isArray } from \'lodash-es\'; const result = Array.isArray(input);',
              options: [{ exclude: ['isArray'] }],
              errors: [{ message: 'Lodash function \'isArray\' is excluded by configuration. Consider using native Array.isArray: Array.isArray(value)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('Constructor calls', () => {
    it('should autofix toNumber to Number constructor', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { toNumber } from \'lodash-es\'; const result = toNumber(inputString);',
              output: 'import { toNumber } from \'lodash-es\'; const result = Number(inputString);',
              options: [{ exclude: ['toNumber'] }],
              errors: [{ message: /Lodash function 'toNumber' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle toNumber with namespace imports', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.toNumber(userInput);',
              output: 'import _ from \'lodash-es\'; const result = Number(userInput);',
              options: [{ exclude: ['toNumber'] }],
              errors: [{ message: /Lodash function 'toNumber' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('complex expressions', () => {
    it('should handle Object.keys in spread expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { keys } from \'lodash-es\'; const keysList = keys(data);',
              output: 'import { keys } from \'lodash-es\'; const keysList = Object.keys(data);',
              options: [{ exclude: ['keys'] }],
              errors: [
                { message: 'Lodash function \'keys\' is excluded by configuration. Consider using native Object.keys: Object.keys(object)' },
              ],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle Math functions with computed expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { max, min } from \'lodash-es\'; const range = max(data) - min(data);',
              output: 'import { max, min } from \'lodash-es\'; const range = Math.max(...data) - Math.min(...data);',
              options: [{ exclude: ['max', 'min'] }],
              errors: [
                { message: 'Lodash function \'max\' is excluded by configuration. Consider using native Math.max: Math.max(...array)' },
                { message: 'Lodash function \'min\' is excluded by configuration. Consider using native Math.min: Math.min(...array)' },
              ],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle Object.keys separately', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { keys } from \'lodash-es\'; const objKeys = keys(obj);',
              output: 'import { keys } from \'lodash-es\'; const objKeys = Object.keys(obj);',
              options: [{ exclude: ['keys'] }],
              errors: [
                { message: 'Lodash function \'keys\' is excluded by configuration. Consider using native Object.keys: Object.keys(object)' },
              ],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle Number methods with complex expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isFinite, isInteger } from \'lodash-es\'; const valid = isFinite(value) && isInteger(value);',
              output: 'import { isFinite, isInteger } from \'lodash-es\'; const valid = Number.isFinite(value) && Number.isInteger(value);',
              options: [{ exclude: ['isFinite', 'isInteger'] }],
              errors: [
                { message: 'Lodash function \'isFinite\' is excluded by configuration. Consider using native Number.isFinite: Number.isFinite(value)' },
                { message: 'Lodash function \'isInteger\' is excluded by configuration. Consider using native Number.isInteger: Number.isInteger(value)' },
              ],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle spread expressions in Math functions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { max } from \'lodash-es\'; const highest = max([...group1, ...group2]);',
              output: 'import { max } from \'lodash-es\'; const highest = Math.max(...[...group1, ...group2]);',
              options: [{ exclude: ['max'] }],
              errors: [{ message: 'Lodash function \'max\' is excluded by configuration. Consider using native Math.max: Math.max(...array)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
