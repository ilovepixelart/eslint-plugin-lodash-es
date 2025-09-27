import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('collection function autofixes', () => {
  describe('reject autofix', () => {
    it('should autofix reject calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { reject } from \'lodash-es\'; const result = reject(array, isEven);',
              output: 'import { reject } from \'lodash-es\'; const result = array.filter(item => !isEven(item));',
              options: [{ exclude: ['reject'] }],
              errors: [{ message: /Lodash function 'reject' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace reject calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.reject(items, predicate);',
              output: 'import _ from \'lodash-es\'; const result = items.filter(item => !predicate(item));',
              options: [{ exclude: ['reject'] }],
              errors: [{ message: /Lodash function 'reject' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle complex predicates', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { reject } from \'lodash-es\'; const result = reject(users, user => user.active && user.role === "admin");',
              output: 'import { reject } from \'lodash-es\'; const result = users.filter(item => !(user => user.active && user.role === "admin")(item));',
              options: [{ exclude: ['reject'] }],
              errors: [{ message: /Lodash function 'reject' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('size autofix', () => {
    it('should autofix size calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { size } from \'lodash-es\'; const result = size(array);',
              output: 'import { size } from \'lodash-es\'; const result = array.length;',
              options: [{ exclude: ['size'] }],
              errors: [{ message: /Lodash function 'size' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace size calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.size(collection);',
              output: 'import _ from \'lodash-es\'; const result = collection.length;',
              options: [{ exclude: ['size'] }],
              errors: [{ message: /Lodash function 'size' is excluded/ }],
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
              code: 'import { size } from \'lodash-es\'; const result = size(data.items || []);',
              output: 'import { size } from \'lodash-es\'; const result = (data.items || []).length;',
              options: [{ exclude: ['size'] }],
              errors: [{ message: /Lodash function 'size' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('each autofix', () => {
    it('should autofix each calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { each } from \'lodash-es\'; each(array, fn);',
              output: 'import { each } from \'lodash-es\'; array.forEach(fn);',
              options: [{ exclude: ['each'] }],
              errors: [{ message: /Lodash function 'each' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace each calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; _.each(items, callback);',
              output: 'import _ from \'lodash-es\'; items.forEach(callback);',
              options: [{ exclude: ['each'] }],
              errors: [{ message: /Lodash function 'each' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle callback functions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { each } from \'lodash-es\'; each(data, (item, index) => console.log(item, index));',
              output: 'import { each } from \'lodash-es\'; data.forEach((item, index) => console.log(item, index));',
              options: [{ exclude: ['each'] }],
              errors: [{ message: /Lodash function 'each' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('findLast autofix', () => {
    it('should autofix findLast calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { findLast } from \'lodash-es\'; const result = findLast(array, predicate);',
              output: 'import { findLast } from \'lodash-es\'; const result = array.findLast(predicate);',
              options: [{ exclude: ['findLast'] }],
              errors: [{ message: /Lodash function 'findLast' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace findLast calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.findLast(users, user => user.active);',
              output: 'import _ from \'lodash-es\'; const result = users.findLast(user => user.active);',
              options: [{ exclude: ['findLast'] }],
              errors: [{ message: /Lodash function 'findLast' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle complex predicates', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { findLast } from \'lodash-es\'; const result = findLast(data.items, item => item.status === "active");',
              output: 'import { findLast } from \'lodash-es\'; const result = data.items.findLast(item => item.status === "active");',
              options: [{ exclude: ['findLast'] }],
              errors: [{ message: /Lodash function 'findLast' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('mixed collection function usage', () => {
    it('should handle multiple collection functions in one statement', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { reject, size } from \'lodash-es\'; const filtered = reject(data, isEmpty); const count = size(filtered);',
              output: 'import { reject, size } from \'lodash-es\'; const filtered = data.filter(item => !isEmpty(item)); const count = filtered.length;',
              options: [{ exclude: ['reject', 'size'] }],
              errors: [
                { message: /Lodash function 'reject' is excluded/ },
                { message: /Lodash function 'size' is excluded/ },
              ],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle collection functions with include configuration', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; _.each(items, callback); _.size(items);',
              output: 'import _ from \'lodash-es\'; items.forEach(callback); items.length;',
              options: [{ exclude: ['each', 'size'] }],
              errors: [
                { message: /Lodash function 'each' is excluded/ },
                { message: /Lodash function 'size' is excluded/ },
              ],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
