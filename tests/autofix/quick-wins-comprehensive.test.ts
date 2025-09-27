import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('Quick Wins Functions Comprehensive', () => {
  describe('uniq function transformation', () => {
    it('should transform destructured uniq calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { uniq } from "lodash-es"; const result = uniq([1, 2, 2, 3]);',
              output: 'import { uniq } from "lodash-es"; const result = [...new Set([1, 2, 2, 3])];',
              options: [{ exclude: ['uniq'] }],
              errors: [{ message: /uniq/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should transform namespace uniq calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from "lodash-es"; const result = _.uniq(array);',
              output: 'import _ from "lodash-es"; const result = [...new Set(array)];',
              options: [{ exclude: ['uniq'] }],
              errors: [{ message: /uniq/ }],
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
              code: 'import { uniq } from "lodash-es"; const result = uniq(data.items || []);',
              output: 'import { uniq } from "lodash-es"; const result = [...new Set(data.items || [])];',
              options: [{ exclude: ['uniq'] }],
              errors: [{ message: /uniq/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('compact function transformation', () => {
    it('should transform destructured compact calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { compact } from "lodash-es"; const result = compact([0, 1, false, 2, "", 3]);',
              output: 'import { compact } from "lodash-es"; const result = [0, 1, false, 2, "", 3].filter(Boolean);',
              options: [{ exclude: ['compact'] }],
              errors: [{ message: /compact/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should transform namespace compact calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from "lodash-es"; const result = _.compact(array);',
              output: 'import _ from "lodash-es"; const result = array.filter(Boolean);',
              options: [{ exclude: ['compact'] }],
              errors: [{ message: /compact/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle method chaining in first parameter', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { compact } from "lodash-es"; const result = compact(data.map(x => x.value));',
              output: 'import { compact } from "lodash-es"; const result = data.map(x => x.value).filter(Boolean);',
              options: [{ exclude: ['compact'] }],
              errors: [{ message: /compact/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('sortBy function transformation', () => {
    it('should transform destructured sortBy calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { sortBy } from "lodash-es"; const result = sortBy(users, user => user.age);',
              output: 'import { sortBy } from "lodash-es"; const result = users.toSorted((a, b) => (user => user.age)(a) - (user => user.age)(b));',
              options: [{ exclude: ['sortBy'] }],
              errors: [{ message: /sortBy/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should transform namespace sortBy calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from "lodash-es"; const result = _.sortBy(array, fn);',
              output: 'import _ from "lodash-es"; const result = array.toSorted((a, b) => fn(a) - fn(b));',
              options: [{ exclude: ['sortBy'] }],
              errors: [{ message: /sortBy/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle simple sortBy calls without callback', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { sortBy } from "lodash-es"; const result = sortBy(numbers);',
              output: 'import { sortBy } from "lodash-es"; const result = numbers.toSorted();',
              options: [{ exclude: ['sortBy'] }],
              errors: [{ message: /sortBy/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('pick function transformation', () => {
    it('should transform destructured pick calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { pick } from "lodash-es"; const result = pick(obj, ["name", "age"]);',
              output: 'import { pick } from "lodash-es"; const result = Object.fromEntries(["name", "age"].map(k => [k, obj[k]]));',
              options: [{ exclude: ['pick'] }],
              errors: [{ message: /pick/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should transform namespace pick calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from "lodash-es"; const result = _.pick(user, keys);',
              output: 'import _ from "lodash-es"; const result = Object.fromEntries(keys.map(k => [k, user[k]]));',
              options: [{ exclude: ['pick'] }],
              errors: [{ message: /pick/ }],
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
              code: 'import { pick } from "lodash-es"; const result = pick(data.user || {}, props);',
              output: 'import { pick } from "lodash-es"; const result = Object.fromEntries(props.map(k => [k, (data.user || {})[k]]));',
              options: [{ exclude: ['pick'] }],
              errors: [{ message: /pick/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('omit function transformation', () => {
    it('should transform destructured omit calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { omit } from "lodash-es"; const result = omit(obj, ["password", "secret"]);',
              output: 'import { omit } from "lodash-es"; const result = Object.fromEntries(Object.entries(obj).filter(([k]) => !["password", "secret"].includes(k)));',
              options: [{ exclude: ['omit'] }],
              errors: [{ message: /omit/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should transform namespace omit calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from "lodash-es"; const result = _.omit(user, excludeKeys);',
              output: 'import _ from "lodash-es"; const result = Object.fromEntries(Object.entries(user).filter(([k]) => !excludeKeys.includes(k)));',
              options: [{ exclude: ['omit'] }],
              errors: [{ message: /omit/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle complex object and key expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { omit } from "lodash-es"; const result = omit(api.response.data, getExcludeKeys());',
              output: 'import { omit } from "lodash-es"; const result = Object.fromEntries(Object.entries(api.response.data).filter(([k]) => !getExcludeKeys().includes(k)));',
              options: [{ exclude: ['omit'] }],
              errors: [{ message: /omit/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('mixed Quick Wins functions', () => {
    it('should handle multiple Quick Wins functions in same file', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: `import { uniq, compact, pick } from "lodash-es";
const unique = uniq([1, 2, 2, 3]);
const filtered = compact([0, 1, false, 2]);
const selected = pick(obj, ["id", "name"]);`,
              output: `import { uniq, compact, pick } from "lodash-es";
const unique = [...new Set([1, 2, 2, 3])];
const filtered = [0, 1, false, 2].filter(Boolean);
const selected = Object.fromEntries(["id", "name"].map(k => [k, obj[k]]));`,
              options: [{ exclude: ['uniq', 'compact', 'pick'] }],
              errors: [
                { message: /uniq/ },
                { message: /compact/ },
                { message: /pick/ },
              ],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle chained operations with Quick Wins functions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { uniq, compact } from "lodash-es"; const result = uniq(compact(array));',
              output: 'import { uniq, compact } from "lodash-es"; const result = [...new Set(compact(array))];',
              options: [{ exclude: ['uniq', 'compact'] }],
              errors: [
                { message: /uniq/ },
                { message: /compact/ },
              ],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('edge cases and boundary conditions', () => {
    it('should handle parentheses in complex expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { uniq } from "lodash-es"; const result = uniq((a || b).concat(c));',
              output: 'import { uniq } from "lodash-es"; const result = [...new Set((a || b).concat(c))];',
              options: [{ exclude: ['uniq'] }],
              errors: [{ message: /uniq/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle template literals in parameters', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { pick } from "lodash-es"; const result = pick(obj, [`key_${id}`, "name"]);',
              output: 'import { pick } from "lodash-es"; const result = Object.fromEntries([`key_${id}`, "name"].map(k => [k, obj[k]]));',
              options: [{ exclude: ['pick'] }],
              errors: [{ message: /pick/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle function calls as parameters', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { compact } from "lodash-es"; const result = compact(getData().items);',
              output: 'import { compact } from "lodash-es"; const result = getData().items.filter(Boolean);',
              options: [{ exclude: ['compact'] }],
              errors: [{ message: /compact/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
