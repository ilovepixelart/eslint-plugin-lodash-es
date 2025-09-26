import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('destructured autofix functionality', () => {
  it('should autofix basic destructured import transformations', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\'; const result = map([1, 2, 3], x => x * 2);',
            output: 'import { map } from \'lodash-es\'; const result = [1, 2, 3].map(x => x * 2);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
          {
            code: 'import { filter } from \'lodash-es\'; const result = filter([1, 2, 3], x => x > 1);',
            output: 'import { filter } from \'lodash-es\'; const result = [1, 2, 3].filter(x => x > 1);',
            options: [{ exclude: ['filter'] }],
            errors: [{ message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' }],
          },
          {
            code: 'import { reduce } from \'lodash-es\'; const result = reduce([1, 2, 3], (acc, val) => acc + val, 0);',
            output: 'import { reduce } from \'lodash-es\'; const result = [1, 2, 3].reduce((acc, val) => acc + val, 0);',
            options: [{ exclude: ['reduce'] }],
            errors: [{ message: 'Lodash function \'reduce\' is excluded by configuration. Consider using native Array.prototype.reduce: array.reduce(fn, initial)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix complex arrow function expressions', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\'; const result = map(data, x => ({ id: x, doubled: x * 2 }));',
            output: 'import { map } from \'lodash-es\'; const result = data.map(x => ({ id: x, doubled: x * 2 }));',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
          {
            code: 'import { filter } from \'lodash-es\'; const result = filter(users, ({ age, active }) => active && age >= 18);',
            output: 'import { filter } from \'lodash-es\'; const result = users.filter(({ age, active }) => active && age >= 18);',
            options: [{ exclude: ['filter'] }],
            errors: [{ message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix multiline arrow functions', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: `import { map } from 'lodash-es';
const result = map(data, x => {
  const doubled = x * 2;
  return doubled + 1;
});`,
            output: `import { map } from 'lodash-es';
const result = data.map(x => {
  const doubled = x * 2;
  return doubled + 1;
});`,
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix regular function expressions', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\'; const result = map(data, function(x) { return x * 2; });',
            output: 'import { map } from \'lodash-es\'; const result = data.map(function(x) { return x * 2; });',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
          {
            code: 'import { filter } from \'lodash-es\'; const result = filter(data, function filterCallback(x) { return x > 2; });',
            output: 'import { filter } from \'lodash-es\'; const result = data.filter(function filterCallback(x) { return x > 2; });',
            options: [{ exclude: ['filter'] }],
            errors: [{ message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix complex expressions with template literals', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\'; const result = map(users, user => `User: ${user.name} (${user.age})`);',
            output: 'import { map } from \'lodash-es\'; const result = users.map(user => `User: ${user.name} (${user.age})`);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix functions with multiple parameters', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { reduce } from \'lodash-es\'; const result = reduce(data, (acc, val, index) => acc + val * index, 0);',
            output: 'import { reduce } from \'lodash-es\'; const result = data.reduce((acc, val, index) => acc + val * index, 0);',
            options: [{ exclude: ['reduce'] }],
            errors: [{ message: 'Lodash function \'reduce\' is excluded by configuration. Consider using native Array.prototype.reduce: array.reduce(fn, initial)' }],
          },
          {
            code: 'import { map } from \'lodash-es\'; const result = map(data, (val, index) => `${index}: ${val}`);',
            output: 'import { map } from \'lodash-es\'; const result = data.map((val, index) => `${index}: ${val}`);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix nested expressions and complex object operations', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\'; const result = map(data, x => ({ value: x, nested: { double: x * 2 } }));',
            output: 'import { map } from \'lodash-es\'; const result = data.map(x => ({ value: x, nested: { double: x * 2 } }));',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
          {
            code: 'import { filter } from \'lodash-es\'; const result = filter(objects, obj => obj.values.some(v => v > 10));',
            output: 'import { filter } from \'lodash-es\'; const result = objects.filter(obj => obj.values.some(v => v > 10));',
            options: [{ exclude: ['filter'] }],
            errors: [{ message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix ternary operators and conditional expressions', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\'; const result = map(data, x => x > 3 ? x * 2 : x);',
            output: 'import { map } from \'lodash-es\'; const result = data.map(x => x > 3 ? x * 2 : x);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should handle edge cases gracefully', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\'; const result = map(data, String);',
            output: 'import { map } from \'lodash-es\'; const result = data.map(String);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
          {
            code: 'import { map } from \'lodash-es\'; const result = map(data, veryLongParameterNameForTesting => veryLongParameterNameForTesting * 2);',
            output: 'import { map } from \'lodash-es\'; const result = data.map(veryLongParameterNameForTesting => veryLongParameterNameForTesting * 2);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix multiple function calls in same file', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: `import { map, filter, reduce } from 'lodash-es';
const mapped = map(data, x => x * 2);
const filtered = filter(data, x => x > 1);
const reduced = reduce(data, (acc, val) => acc + val, 0);`,
            output: `import { map, filter, reduce } from 'lodash-es';
const mapped = data.map(x => x * 2);
const filtered = data.filter(x => x > 1);
const reduced = data.reduce((acc, val) => acc + val, 0);`,
            options: [{ exclude: ['map', 'filter', 'reduce'] }],
            errors: [
              { message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' },
              { message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' },
              { message: 'Lodash function \'reduce\' is excluded by configuration. Consider using native Array.prototype.reduce: array.reduce(fn, initial)' },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix all supported lodash functions', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\'; map(data, x => x * 2);',
            output: 'import { map } from \'lodash-es\'; data.map(x => x * 2);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
          {
            code: 'import { filter } from \'lodash-es\'; filter(data, x => x > 1);',
            output: 'import { filter } from \'lodash-es\'; data.filter(x => x > 1);',
            options: [{ exclude: ['filter'] }],
            errors: [{ message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' }],
          },
          {
            code: 'import { find } from \'lodash-es\'; find(data, x => x === 3);',
            output: 'import { find } from \'lodash-es\'; data.find(x => x === 3);',
            options: [{ exclude: ['find'] }],
            errors: [{ message: 'Lodash function \'find\' is excluded by configuration. Consider using native Array.prototype.find: array.find(predicate)' }],
          },
          {
            code: 'import { findIndex } from \'lodash-es\'; findIndex(data, x => x === 3);',
            output: 'import { findIndex } from \'lodash-es\'; data.findIndex(x => x === 3);',
            options: [{ exclude: ['findIndex'] }],
            errors: [{ message: 'Lodash function \'findIndex\' is excluded by configuration. Consider using native Array.prototype.findIndex: array.findIndex(predicate)' }],
          },
          {
            code: 'import { reduce } from \'lodash-es\'; reduce(data, (acc, val) => acc + val, 0);',
            output: 'import { reduce } from \'lodash-es\'; data.reduce((acc, val) => acc + val, 0);',
            options: [{ exclude: ['reduce'] }],
            errors: [{ message: 'Lodash function \'reduce\' is excluded by configuration. Consider using native Array.prototype.reduce: array.reduce(fn, initial)' }],
          },
          {
            code: 'import { forEach } from \'lodash-es\'; forEach(data, x => console.log(x));',
            output: 'import { forEach } from \'lodash-es\'; data.forEach(x => console.log(x));',
            options: [{ exclude: ['forEach'] }],
            errors: [{ message: 'Lodash function \'forEach\' is excluded by configuration. Consider using native Array.prototype.forEach: array.forEach(fn)' }],
          },
          {
            code: 'import { some } from \'lodash-es\'; some(data, x => x > 3);',
            output: 'import { some } from \'lodash-es\'; data.some(x => x > 3);',
            options: [{ exclude: ['some'] }],
            errors: [{ message: 'Lodash function \'some\' is excluded by configuration. Consider using native Array.prototype.some: array.some(predicate)' }],
          },
          {
            code: 'import { every } from \'lodash-es\'; every(data, x => x > 0);',
            output: 'import { every } from \'lodash-es\'; data.every(x => x > 0);',
            options: [{ exclude: ['every'] }],
            errors: [{ message: 'Lodash function \'every\' is excluded by configuration. Consider using native Array.prototype.every: array.every(predicate)' }],
          },
        ],
      })
    }).not.toThrow()
  })
})
