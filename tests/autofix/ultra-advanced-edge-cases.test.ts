import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
  },
})

describe('ultra-advanced edge cases and stress tests', () => {
  describe('memory and performance stress tests', () => {
    it('should handle deeply nested object access', () => {
      const deepAccess = 'a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z'
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: `import { map } from 'lodash-es'; const result = map(${deepAccess}, x => x * 2);`,
              output: `import { map } from 'lodash-es'; const result = ${deepAccess}.map(x => x * 2);`,
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle extremely complex callback functions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: `import { map } from 'lodash-es'; const result = map(data, (item, index, array) => {
                if (typeof item === 'object' && item !== null) {
                  return Object.entries(item).reduce((acc, [key, value]) => {
                    if (Array.isArray(value)) {
                      return { ...acc, [key]: value.filter(v => v != null).map(v => typeof v === 'string' ? v.trim() : v) };
                    }
                    return { ...acc, [key]: value };
                  }, {});
                }
                return item;
              });`,
              output: `import { map } from 'lodash-es'; const result = data.map((item, index, array) => {
                if (typeof item === 'object' && item !== null) {
                  return Object.entries(item).reduce((acc, [key, value]) => {
                    if (Array.isArray(value)) {
                      return { ...acc, [key]: value.filter(v => v != null).map(v => typeof v === 'string' ? v.trim() : v) };
                    }
                    return { ...acc, [key]: value };
                  }, {});
                }
                return item;
              });`,
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('advanced syntax edge cases', () => {
    it('should handle computed property access with complex expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(obj[key1 || key2 || \'default\'][computedKey()], fn);',
              output: 'import { map } from \'lodash-es\'; const result = (obj[key1 || key2 || \'default\'][computedKey()]).map(fn);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle optional chaining with nullish coalescing in complex expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(user?.profile?.preferences?.items ?? defaultItems ?? [], transformItem);',
              output: 'import { map } from \'lodash-es\'; const result = (user?.profile?.preferences?.items ?? defaultItems ?? []).map(transformItem);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle private class fields access', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; class MyClass { #privateData = []; process() { return map(this.#privateData, item => item * 2); } }',
              output: 'import { map } from \'lodash-es\'; class MyClass { #privateData = []; process() { return this.#privateData.map(item => item * 2); } }',
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('complex template literal and regex edge cases', () => {
    it('should handle template literals with complex expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data, item => `${item.name}-${item.id || "unknown"}-${Date.now()}`);',
              output: 'import { map } from \'lodash-es\'; const result = data.map(item => `${item.name}-${item.id || "unknown"}-${Date.now()}`);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle regex patterns with special characters', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { filter } from \'lodash-es\'; const result = filter(strings, str => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.test(str));',
              output: 'import { filter } from \'lodash-es\'; const result = strings.filter(str => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.test(str));',
              options: [{ exclude: ['filter'] }],
              errors: [{ message: /Lodash function 'filter' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('advanced destructuring and spread patterns', () => {
    it('should handle complex destructuring in function parameters', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(users, ({name, profile: {age = 0, ...rest} = {}, ...userData}) => ({name, age, rest, userData}));',
              output: 'import { map } from \'lodash-es\'; const result = users.map(({name, profile: {age = 0, ...rest} = {}, ...userData}) => ({name, age, rest, userData}));',
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle rest parameters with complex spread operations', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map([...array1, ...array2, ...array3], (...args) => args.reduce((a, b) => a + b, 0));',
              output: 'import { map } from \'lodash-es\'; const result = [...array1, ...array2, ...array3].map((...args) => args.reduce((a, b) => a + b, 0));',
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('edge cases with modern JavaScript features', () => {
    it('should handle top-level await expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(await fetchData(), async item => await processItem(item));',
              output: 'import { map } from \'lodash-es\'; const result = await fetchData().map(async item => await processItem(item));',
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle generator function results', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; function* gen() { yield* [1, 2, 3]; } const result = map([...gen()], x => x * 2);',
              output: 'import { map } from \'lodash-es\'; function* gen() { yield* [1, 2, 3]; } const result = [...gen()].map(x => x * 2);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle import.meta and dynamic imports', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const modules = import.meta.glob("./modules/*.js"); const result = map(Object.keys(modules), async key => await modules[key]());',
              output: 'import { map } from \'lodash-es\'; const modules = import.meta.glob("./modules/*.js"); const result = Object.keys(modules).map(async key => await modules[key]());',
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('potential security and injection edge cases', () => {
    it('should handle code with potential XSS patterns safely', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(userInputs, input => `<div>${input}</div>`);',
              output: 'import { map } from \'lodash-es\'; const result = userInputs.map(input => `<div>${input}</div>`);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle code with SQL-like patterns safely', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(records, record => `SELECT * FROM users WHERE id = ${record.id}`);',
              output: 'import { map } from \'lodash-es\'; const result = records.map(record => `SELECT * FROM users WHERE id = ${record.id}`);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('extreme performance edge cases', () => {
    it('should handle very large array transformations', () => {
      const largeArrayCode = `const largeArray = Array.from({length: 10000}, (_, i) => ({ id: i, value: Math.random() }))`
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: `import { map } from 'lodash-es'; ${largeArrayCode}; const result = map(largeArray, item => item.value * 2);`,
              output: `import { map } from 'lodash-es'; ${largeArrayCode}; const result = largeArray.map(item => item.value * 2);`,
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle recursive callback patterns', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const processTree = (node) => map(node.children || [], child => ({ ...child, processed: true, children: processTree(child) })); const result = processTree(rootNode);',
              output: 'import { map } from \'lodash-es\'; const processTree = (node) => (node.children || []).map(child => ({ ...child, processed: true, children: processTree(child) })); const result = processTree(rootNode);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: /Lodash function 'map' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
