import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('Number function autofixes', () => {
  describe('clamp', () => {
    it('should autofix clamp calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { clamp } from \'lodash-es\'; const result = clamp(value, 0, 100);',
              output: 'import { clamp } from \'lodash-es\'; const result = Math.min(Math.max(value, 0), 100);',
              options: [{ exclude: ['clamp'] }],
              errors: [{ message: /Lodash function 'clamp' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle complex expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { clamp } from \'lodash-es\'; const result = clamp(getValue(), min, max);',
              output: 'import { clamp } from \'lodash-es\'; const result = Math.min(Math.max(getValue(), min), max);',
              options: [{ exclude: ['clamp'] }],
              errors: [{ message: /Lodash function 'clamp' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('inRange', () => {
    it('should autofix inRange calls with start and end', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { inRange } from \'lodash-es\'; const result = inRange(5, 0, 10);',
              output: 'import { inRange } from \'lodash-es\'; const result = 5 >= 0 && 5 < 10;',
              options: [{ exclude: ['inRange'] }],
              errors: [{ message: /Lodash function 'inRange' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle variable references', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { inRange } from \'lodash-es\'; const result = inRange(value, min, max);',
              output: 'import { inRange } from \'lodash-es\'; const result = value >= min && value < max;',
              options: [{ exclude: ['inRange'] }],
              errors: [{ message: /Lodash function 'inRange' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('random', () => {
    it('should autofix random calls with min and max', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { random } from \'lodash-es\'; const result = random(0, 100);',
              output: 'import { random } from \'lodash-es\'; const result = Math.random() * (100 - 0) + 0;',
              options: [{ exclude: ['random'] }],
              errors: [{ message: /Lodash function 'random' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle single parameter (0 to max)', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { random } from \'lodash-es\'; const result = random(100);',
              output: 'import { random } from \'lodash-es\'; const result = Math.random() * 100;',
              options: [{ exclude: ['random'] }],
              errors: [{ message: /Lodash function 'random' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
