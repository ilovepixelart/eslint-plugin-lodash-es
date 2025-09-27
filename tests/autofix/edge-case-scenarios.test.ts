import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('autofix edge cases and corner cases', () => {
  describe('double transformation prevention', () => {
    it('should not transform already-native method calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [
            // Native method calls should not be transformed
            {
              code: 'import { map } from \'lodash-es\'; const result = data.map(x => x * 2);',
              options: [{ exclude: ['map'] }],
            },
            {
              code: 'import { filter } from \'lodash-es\'; const result = users.filter(user => user.active);',
              options: [{ exclude: ['filter'] }],
            },
            {
              code: 'import { reduce } from \'lodash-es\'; const result = arr.reduce((acc, val) => acc + val, 0);',
              options: [{ exclude: ['reduce'] }],
            },
          ],
          invalid: [],
        })
      }).not.toThrow()
    })

    it('should not transform chained native method calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [
            {
              code: 'import { map, filter } from \'lodash-es\'; const result = data.filter(x => x > 0).map(x => x * 2);',
              options: [{ exclude: ['map', 'filter'] }],
            },
          ],
          invalid: [],
        })
      }).not.toThrow()
    })
  })

  describe('complex method chaining', () => {
    it('should autofix when first parameter is complex expression', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(users.filter(u => u.active), user => user.name);',
              output: 'import { map } from \'lodash-es\'; const result = users.filter(u => u.active).map(user => user.name);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
            {
              code: 'import { filter } from \'lodash-es\'; const result = filter(data.slice(0, 10), item => item.score > 80);',
              output: 'import { filter } from \'lodash-es\'; const result = data.slice(0, 10).filter(item => item.score > 80);',
              options: [{ exclude: ['filter'] }],
              errors: [{ message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle deeply nested expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(getData().users.filter(u => u.active).slice(0, 5), user => user.profile.name);',
              output: 'import { map } from \'lodash-es\'; const result = getData().users.filter(u => u.active).slice(0, 5).map(user => user.profile.name);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('parameter parsing edge cases', () => {
    it('should handle regex patterns with commas', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data, item => item.text.replace(/[,;]/, ""));',
              output: 'import { map } from \'lodash-es\'; const result = data.map(item => item.text.replace(/[,;]/, ""));',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle complex template literals with nested expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(items, item => `${item.name}: ${item.values.join(", ")}`);',
              output: 'import { map } from \'lodash-es\'; const result = items.map(item => `${item.name}: ${item.values.join(", ")}`);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle spread operators in array parameters', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map([...data, ...moreData], x => x * 2);',
              output: 'import { map } from \'lodash-es\'; const result = [...data, ...moreData].map(x => x * 2);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle simple multiline calls without comments', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: `import { map } from 'lodash-es';
const result = map(
  data,
  x => x * 2
);`,
              output: `import { map } from 'lodash-es';
const result = data.map(x => x * 2);`,
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('function call variations', () => {
    it('should handle function expressions as callbacks', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data, function transform(item) { return item.value * 2; });',
              output: 'import { map } from \'lodash-es\'; const result = data.map(function transform(item) { return item.value * 2; });',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle named function references', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const transform = x => x * 2; const result = map(data, transform);',
              output: 'import { map } from \'lodash-es\'; const transform = x => x * 2; const result = data.map(transform);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle built-in function references', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(strings, String);',
              output: 'import { map } from \'lodash-es\'; const result = strings.map(String);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('nested lodash calls', () => {
    it('should transform outer call (inner calls require separate passes)', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map, filter } from \'lodash-es\'; const result = map(users, user => filter(user.scores, score => score > 80));',
              output: 'import { map, filter } from \'lodash-es\'; const result = users.map(user => filter(user.scores, score => score > 80));',
              options: [{ exclude: ['map', 'filter'] }],
              errors: [
                { message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' },
                { message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' },
              ],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('whitespace and formatting edge cases', () => {
    it('should normalize extra whitespace in function calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(  data  ,  x => x * 2  );',
              output: 'import { map } from \'lodash-es\'; const result = data.map(x => x * 2);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should normalize newlines in function calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: `import { map } from 'lodash-es';
const result = map(
  data,
  x => x * 2
);`,
              output: `import { map } from 'lodash-es';
const result = data.map(x => x * 2);`,
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('JavaScript language features', () => {
    it('should handle async/await in callbacks', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data, async (item) => await processItem(item));',
              output: 'import { map } from \'lodash-es\'; const result = data.map(async (item) => await processItem(item));',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle generator functions as callbacks', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data, function* (item) { yield item * 2; });',
              output: 'import { map } from \'lodash-es\'; const result = data.map(function* (item) { yield item * 2; });',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle try-catch blocks in callbacks', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: `import { map } from 'lodash-es';
const result = map(data, item => {
  try {
    return processItem(item);
  } catch (e) {
    return null;
  }
});`,
              output: `import { map } from 'lodash-es';
const result = data.map(item => {
  try {
    return processItem(item);
  } catch (e) {
    return null;
  }
});`,
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle computed property access in callbacks', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const prop = "value"; const result = map(data, item => item[prop]);',
              output: 'import { map } from \'lodash-es\'; const prop = "value"; const result = data.map(item => item[prop]);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle Symbol properties', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const sym = Symbol("id"); const result = map(data, item => item[sym]);',
              output: 'import { map } from \'lodash-es\'; const sym = Symbol("id"); const result = data.map(item => item[sym]);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('known limitations', () => {
    it('should document current scope analysis limitations', () => {
      // These scenarios are known limitations that would require advanced scope analysis:
      // 1. Variable shadowing - detecting when local variables shadow imported names
      // 2. Function parameter shadowing - detecting parameter names that shadow imports
      // 3. Block scope analysis - understanding nested scopes and variable hoisting
      //
      // Current implementation does simple pattern matching without full scope analysis.
      // For production use, these edge cases should be handled by:
      // - Code review processes
      // - Additional linting rules for variable naming
      // - Gradual migration approach with manual review of edge cases

      expect(true).toBe(true) // Placeholder test to document limitations
    })
  })
})
