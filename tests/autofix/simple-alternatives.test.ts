import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('Simple native alternatives', () => {
  describe('String methods', () => {
    it('should autofix capitalize', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { capitalize } from \'lodash-es\'; const result = capitalize(str);',
              output: 'import { capitalize } from \'lodash-es\'; const result = str.at(0).toUpperCase() + str.slice(1).toLowerCase();',
              options: [{ exclude: ['capitalize'] }],
              errors: [{ message: /Lodash function 'capitalize' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix lowerFirst', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { lowerFirst } from \'lodash-es\'; const result = lowerFirst(str);',
              output: 'import { lowerFirst } from \'lodash-es\'; const result = str.at(0).toLowerCase() + str.slice(1);',
              options: [{ exclude: ['lowerFirst'] }],
              errors: [{ message: /Lodash function 'lowerFirst' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix upperFirst', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { upperFirst } from \'lodash-es\'; const result = upperFirst(str);',
              output: 'import { upperFirst } from \'lodash-es\'; const result = str.at(0).toUpperCase() + str.slice(1);',
              options: [{ exclude: ['upperFirst'] }],
              errors: [{ message: /Lodash function 'upperFirst' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('Lang comparison operators', () => {
    it('should autofix eq', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { eq } from \'lodash-es\'; const result = eq(a, b);',
              output: 'import { eq } from \'lodash-es\'; const result = Object.is(a, b);',
              options: [{ exclude: ['eq'] }],
              errors: [{ message: /Lodash function 'eq' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix gt', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { gt } from \'lodash-es\'; const result = gt(a, b);',
              output: 'import { gt } from \'lodash-es\'; const result = a > b;',
              options: [{ exclude: ['gt'] }],
              errors: [{ message: /Lodash function 'gt' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix gte', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { gte } from \'lodash-es\'; const result = gte(a, b);',
              output: 'import { gte } from \'lodash-es\'; const result = a >= b;',
              options: [{ exclude: ['gte'] }],
              errors: [{ message: /Lodash function 'gte' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix lt', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { lt } from \'lodash-es\'; const result = lt(a, b);',
              output: 'import { lt } from \'lodash-es\'; const result = a < b;',
              options: [{ exclude: ['lt'] }],
              errors: [{ message: /Lodash function 'lt' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix lte', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { lte } from \'lodash-es\'; const result = lte(a, b);',
              output: 'import { lte } from \'lodash-es\'; const result = a <= b;',
              options: [{ exclude: ['lte'] }],
              errors: [{ message: /Lodash function 'lte' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('Lang type checking', () => {
    it('should autofix isDate', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isDate } from \'lodash-es\'; const result = isDate(value);',
              output: 'import { isDate } from \'lodash-es\'; const result = value instanceof Date;',
              options: [{ exclude: ['isDate'] }],
              errors: [{ message: /Lodash function 'isDate' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix isRegExp', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isRegExp } from \'lodash-es\'; const result = isRegExp(value);',
              output: 'import { isRegExp } from \'lodash-es\'; const result = value instanceof RegExp;',
              options: [{ exclude: ['isRegExp'] }],
              errors: [{ message: /Lodash function 'isRegExp' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix isError', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isError } from \'lodash-es\'; const result = isError(value);',
              output: 'import { isError } from \'lodash-es\'; const result = value instanceof Error;',
              options: [{ exclude: ['isError'] }],
              errors: [{ message: /Lodash function 'isError' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix isSymbol', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isSymbol } from \'lodash-es\'; const result = isSymbol(value);',
              output: 'import { isSymbol } from \'lodash-es\'; const result = typeof value === \'symbol\';',
              options: [{ exclude: ['isSymbol'] }],
              errors: [{ message: /Lodash function 'isSymbol' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('Util stub functions', () => {
    it('should autofix stubArray', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { stubArray } from \'lodash-es\'; const result = stubArray();',
              output: 'import { stubArray } from \'lodash-es\'; const result = [];',
              options: [{ exclude: ['stubArray'] }],
              errors: [{ message: /Lodash function 'stubArray' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix stubFalse', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { stubFalse } from \'lodash-es\'; const result = stubFalse();',
              output: 'import { stubFalse } from \'lodash-es\'; const result = false;',
              options: [{ exclude: ['stubFalse'] }],
              errors: [{ message: /Lodash function 'stubFalse' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix stubTrue', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { stubTrue } from \'lodash-es\'; const result = stubTrue();',
              output: 'import { stubTrue } from \'lodash-es\'; const result = true;',
              options: [{ exclude: ['stubTrue'] }],
              errors: [{ message: /Lodash function 'stubTrue' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix stubObject', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { stubObject } from \'lodash-es\'; const result = stubObject();',
              output: 'import { stubObject } from \'lodash-es\'; const result = {};',
              options: [{ exclude: ['stubObject'] }],
              errors: [{ message: /Lodash function 'stubObject' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix stubString', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { stubString } from \'lodash-es\'; const result = stubString();',
              output: 'import { stubString } from \'lodash-es\'; const result = \'\';',
              options: [{ exclude: ['stubString'] }],
              errors: [{ message: /Lodash function 'stubString' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('Util helper functions', () => {
    it('should autofix noop', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { noop } from \'lodash-es\'; const result = noop();',
              output: 'import { noop } from \'lodash-es\'; const result = undefined;',
              options: [{ exclude: ['noop'] }],
              errors: [{ message: /Lodash function 'noop' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix identity', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { identity } from \'lodash-es\'; const result = identity(value);',
              output: 'import { identity } from \'lodash-es\'; const result = value;',
              options: [{ exclude: ['identity'] }],
              errors: [{ message: /Lodash function 'identity' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
