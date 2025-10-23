import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('Math function autofixes', () => {
  describe('arithmetic operations', () => {
    it('should autofix add calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { add } from \'lodash-es\'; const result = add(5, 3);',
              output: 'import { add } from \'lodash-es\'; const result = 5 + 3;',
              options: [{ exclude: ['add'] }],
              errors: [{ message: /Lodash function 'add' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix subtract calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { subtract } from \'lodash-es\'; const result = subtract(10, 3);',
              output: 'import { subtract } from \'lodash-es\'; const result = 10 - 3;',
              options: [{ exclude: ['subtract'] }],
              errors: [{ message: /Lodash function 'subtract' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix multiply calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { multiply } from \'lodash-es\'; const result = multiply(4, 5);',
              output: 'import { multiply } from \'lodash-es\'; const result = 4 * 5;',
              options: [{ exclude: ['multiply'] }],
              errors: [{ message: /Lodash function 'multiply' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix divide calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { divide } from \'lodash-es\'; const result = divide(20, 4);',
              output: 'import { divide } from \'lodash-es\'; const result = 20 / 4;',
              options: [{ exclude: ['divide'] }],
              errors: [{ message: /Lodash function 'divide' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('array aggregation', () => {
    it('should autofix sum calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { sum } from \'lodash-es\'; const result = sum([1, 2, 3, 4]);',
              output: 'import { sum } from \'lodash-es\'; const result = [1, 2, 3, 4].reduce((sum, n) => sum + n, 0);',
              options: [{ exclude: ['sum'] }],
              errors: [{ message: /Lodash function 'sum' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix mean calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { mean } from \'lodash-es\'; const result = mean([1, 2, 3, 4]);',
              output: 'import { mean } from \'lodash-es\'; const result = [1, 2, 3, 4].reduce((sum, n) => sum + n, 0) / [1, 2, 3, 4].length;',
              options: [{ exclude: ['mean'] }],
              errors: [{ message: /Lodash function 'mean' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle complex expressions in add', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { add } from \'lodash-es\'; const result = add(getValue(), getOther());',
              output: 'import { add } from \'lodash-es\'; const result = getValue() + getOther();',
              options: [{ exclude: ['add'] }],
              errors: [{ message: /Lodash function 'add' is excluded/ }],
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
              code: 'import { sum } from \'lodash-es\'; const result = sum(numbers);',
              output: 'import { sum } from \'lodash-es\'; const result = numbers.reduce((sum, n) => sum + n, 0);',
              options: [{ exclude: ['sum'] }],
              errors: [{ message: /Lodash function 'sum' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
