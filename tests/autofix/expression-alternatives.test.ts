import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('comprehensive expression alternative autofixes', () => {
  describe('type checking expression autofixes', () => {
    it('should autofix isNull to strict equality check', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isNull } from \'lodash-es\'; const result = isNull(value);',
              output: 'import { isNull } from \'lodash-es\'; const result = value === null;',
              options: [{ exclude: ['isNull'] }],
              errors: [{ message: /Lodash function 'isNull' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix isUndefined to strict equality check', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isUndefined } from \'lodash-es\'; const result = isUndefined(data);',
              output: 'import { isUndefined } from \'lodash-es\'; const result = data === undefined;',
              options: [{ exclude: ['isUndefined'] }],
              errors: [{ message: /Lodash function 'isUndefined' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix isNil to loose equality check', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isNil } from \'lodash-es\'; const result = isNil(input);',
              output: 'import { isNil } from \'lodash-es\'; const result = input == null;',
              options: [{ exclude: ['isNil'] }],
              errors: [{ message: /Lodash function 'isNil' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix isBoolean to typeof check', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isBoolean } from \'lodash-es\'; const result = isBoolean(flag);',
              output: 'import { isBoolean } from \'lodash-es\'; const result = typeof flag === "boolean";',
              options: [{ exclude: ['isBoolean'] }],
              errors: [{ message: /Lodash function 'isBoolean' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix isNumber to typeof check', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isNumber } from \'lodash-es\'; const result = isNumber(count);',
              output: 'import { isNumber } from \'lodash-es\'; const result = typeof count === "number";',
              options: [{ exclude: ['isNumber'] }],
              errors: [{ message: /Lodash function 'isNumber' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix isString to typeof check', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isString } from \'lodash-es\'; const result = isString(text);',
              output: 'import { isString } from \'lodash-es\'; const result = typeof text === "string";',
              options: [{ exclude: ['isString'] }],
              errors: [{ message: /Lodash function 'isString' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix isFunction to typeof check', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isFunction } from \'lodash-es\'; const result = isFunction(callback);',
              output: 'import { isFunction } from \'lodash-es\'; const result = typeof callback === "function";',
              options: [{ exclude: ['isFunction'] }],
              errors: [{ message: /Lodash function 'isFunction' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix isObject to complex typeof check', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isObject } from \'lodash-es\'; const result = isObject(obj);',
              output: 'import { isObject } from \'lodash-es\'; const result = typeof obj === "object" && obj !== null;',
              options: [{ exclude: ['isObject'] }],
              errors: [{ message: /Lodash function 'isObject' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('namespace import expression autofixes', () => {
    it('should autofix namespace isNull calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.isNull(userInput);',
              output: 'import _ from \'lodash-es\'; const result = userInput === null;',
              options: [{ exclude: ['isNull'] }],
              errors: [{ message: /Lodash function 'isNull' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace typeof checks', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const check = _.isString(value) && _.isFunction(callback);',
              output: 'import _ from \'lodash-es\'; const check = typeof value === "string" && typeof callback === "function";',
              options: [{ exclude: ['isString', 'isFunction'] }],
              errors: [
                { message: /Lodash function 'isString' is excluded/ },
                { message: /Lodash function 'isFunction' is excluded/ },
              ],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('complex expression handling', () => {
    it('should handle complex object property checks', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isString } from \'lodash-es\'; const result = isString(user.name.firstName);',
              output: 'import { isString } from \'lodash-es\'; const result = typeof user.name.firstName === "string";',
              options: [{ exclude: ['isString'] }],
              errors: [{ message: /Lodash function 'isString' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle function call results', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isNumber } from \'lodash-es\'; const result = isNumber(parseFloat(input));',
              output: 'import { isNumber } from \'lodash-es\'; const result = typeof parseFloat(input) === "number";',
              options: [{ exclude: ['isNumber'] }],
              errors: [{ message: /Lodash function 'isNumber' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle operator precedence with parentheses', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isString } from \'lodash-es\'; const result = isString(a || b);',
              output: 'import { isString } from \'lodash-es\'; const result = typeof (a || b) === "string";',
              options: [{ exclude: ['isString'] }],
              errors: [{ message: /Lodash function 'isString' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle ternary expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isFunction } from \'lodash-es\'; const result = isFunction(condition ? fn1 : fn2);',
              output: 'import { isFunction } from \'lodash-es\'; const result = typeof (condition ? fn1 : fn2) === "function";',
              options: [{ exclude: ['isFunction'] }],
              errors: [{ message: /Lodash function 'isFunction' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('mixed type checking scenarios', () => {
    it('should handle multiple type checks in logical expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isString, isNull } from \'lodash-es\'; const valid = isString(value) || isNull(value);',
              output: 'import { isString, isNull } from \'lodash-es\'; const valid = typeof value === "string" || value === null;',
              options: [{ exclude: ['isString', 'isNull'] }],
              errors: [
                { message: /Lodash function 'isString' is excluded/ },
                { message: /Lodash function 'isNull' is excluded/ },
              ],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle type guards in conditional statements', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { isFunction, isUndefined } from \'lodash-es\'; function test() { if (isFunction(callback) && !isUndefined(data)) { return callback(data); } }',
              output: 'import { isFunction, isUndefined } from \'lodash-es\'; function test() { if (typeof callback === "function" && !(data === undefined)) { return callback(data); } }',
              options: [{ exclude: ['isFunction', 'isUndefined'] }],
              errors: [
                { message: /Lodash function 'isFunction' is excluded/ },
                { message: /Lodash function 'isUndefined' is excluded/ },
              ],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})

describe('zero-parameter static method autofixes', () => {
  describe('Date.now() autofix', () => {
    it('should autofix destructured now calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { now } from \'lodash-es\'; const timestamp = now();',
              output: 'import { now } from \'lodash-es\'; const timestamp = Date.now();',
              options: [{ exclude: ['now'] }],
              errors: [{ message: /Lodash function 'now' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace now calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const timestamp = _.now();',
              output: 'import _ from \'lodash-es\'; const timestamp = Date.now();',
              options: [{ exclude: ['now'] }],
              errors: [{ message: /Lodash function 'now' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle now in expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { now } from \'lodash-es\'; const elapsed = now() - startTime;',
              output: 'import { now } from \'lodash-es\'; const elapsed = Date.now() - startTime;',
              options: [{ exclude: ['now'] }],
              errors: [{ message: /Lodash function 'now' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})

describe('prototype method autofixes', () => {
  describe('toString prototype method autofix', () => {
    it('should autofix toString to prototype method', () => {
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

    it('should autofix namespace toString calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.toString(numericValue);',
              output: 'import _ from \'lodash-es\'; const result = numericValue.toString();',
              options: [{ exclude: ['toString'] }],
              errors: [{ message: /Lodash function 'toString' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle toString with complex expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { toString } from \'lodash-es\'; const result = toString(obj.prop || defaultValue);',
              output: 'import { toString } from \'lodash-es\'; const result = (obj.prop || defaultValue).toString();',
              options: [{ exclude: ['toString'] }],
              errors: [{ message: /Lodash function 'toString' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})

describe('newly added object expression alternatives', () => {
  describe('has expression alternatives', () => {
    it('should autofix has calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { has } from \'lodash-es\'; const result = has(obj, "prop");',
              output: 'import { has } from \'lodash-es\'; const result = "prop" in obj;',
              options: [{ exclude: ['has'] }],
              errors: [{ message: /Lodash function 'has' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace has calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.has(user, "name");',
              output: 'import _ from \'lodash-es\'; const result = "name" in user;',
              options: [{ exclude: ['has'] }],
              errors: [{ message: /Lodash function 'has' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle complex object expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { has } from \'lodash-es\'; const result = has(data.user || {}, "active");',
              output: 'import { has } from \'lodash-es\'; const result = "active" in (data.user || {});',
              options: [{ exclude: ['has'] }],
              errors: [{ message: /Lodash function 'has' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
