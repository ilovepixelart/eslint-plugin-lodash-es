import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('namespace autofix functionality', () => {
  it('should autofix namespace imports (default import)', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import _ from \'lodash-es\'; const result = _.map([1, 2, 3], x => x * 2);',
            output: 'import _ from \'lodash-es\'; const result = [1, 2, 3].map(x => x * 2);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
          {
            code: 'import _ from \'lodash-es\'; const result = _.filter(users, user => user.active);',
            output: 'import _ from \'lodash-es\'; const result = users.filter(user => user.active);',
            options: [{ exclude: ['filter'] }],
            errors: [{ message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' }],
          },
          {
            code: 'import _ from \'lodash-es\'; const result = _.reduce(data, (acc, val) => acc + val, 0);',
            output: 'import _ from \'lodash-es\'; const result = data.reduce((acc, val) => acc + val, 0);',
            options: [{ exclude: ['reduce'] }],
            errors: [{ message: 'Lodash function \'reduce\' is excluded by configuration. Consider using native Array.prototype.reduce: array.reduce(fn, initial)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix namespace imports (namespace import)', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import * as lodash from \'lodash-es\'; const result = lodash.map([1, 2, 3], x => x * 2);',
            output: 'import * as lodash from \'lodash-es\'; const result = [1, 2, 3].map(x => x * 2);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
          {
            code: 'import * as _ from \'lodash-es\'; const result = _.filter(data, x => x > 10);',
            output: 'import * as _ from \'lodash-es\'; const result = data.filter(x => x > 10);',
            options: [{ exclude: ['filter'] }],
            errors: [{ message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix complex namespace expressions', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import _ from \'lodash-es\'; const result = _.map(users, user => ({ ...user, displayName: `${user.first} ${user.last}` }));',
            output: 'import _ from \'lodash-es\'; const result = users.map(user => ({ ...user, displayName: `${user.first} ${user.last}` }));',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
          {
            code: 'import * as lodash from \'lodash-es\'; const result = lodash.filter(data, ({ active, role }) => active && role === "admin");',
            output: 'import * as lodash from \'lodash-es\'; const result = data.filter(({ active, role }) => active && role === "admin");',
            options: [{ exclude: ['filter'] }],
            errors: [{ message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix multiline namespace expressions', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: `import _ from 'lodash-es';
const result = _.map(data, item => {
  const processed = processItem(item);
  return { id: item.id, value: processed };
});`,
            output: `import _ from 'lodash-es';
const result = data.map(item => {
  const processed = processItem(item);
  return { id: item.id, value: processed };
});`,
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix regular lodash package imports', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import _ from \'lodash\'; const result = _.map([1, 2, 3], x => x * 2);',
            output: 'import _ from \'lodash\'; const result = [1, 2, 3].map(x => x * 2);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should autofix multiple namespace function calls', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: `import _ from 'lodash-es';
const mapped = _.map(data, x => x * 2);
const filtered = _.filter(data, x => x > 5);
const reduced = _.reduce(data, (acc, val) => acc + val, 0);`,
            output: `import _ from 'lodash-es';
const mapped = data.map(x => x * 2);
const filtered = data.filter(x => x > 5);
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

  it('should autofix all supported lodash functions with namespace imports', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import _ from \'lodash-es\'; _.map(data, x => x * 2);',
            output: 'import _ from \'lodash-es\'; data.map(x => x * 2);',
            options: [{ exclude: ['map'] }],
            errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
          },
          {
            code: 'import _ from \'lodash-es\'; _.filter(data, x => x > 1);',
            output: 'import _ from \'lodash-es\'; data.filter(x => x > 1);',
            options: [{ exclude: ['filter'] }],
            errors: [{ message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' }],
          },
          {
            code: 'import _ from \'lodash-es\'; _.find(data, x => x === 3);',
            output: 'import _ from \'lodash-es\'; data.find(x => x === 3);',
            options: [{ exclude: ['find'] }],
            errors: [{ message: 'Lodash function \'find\' is excluded by configuration. Consider using native Array.prototype.find: array.find(predicate)' }],
          },
          {
            code: 'import _ from \'lodash-es\'; _.findIndex(data, x => x === 3);',
            output: 'import _ from \'lodash-es\'; data.findIndex(x => x === 3);',
            options: [{ exclude: ['findIndex'] }],
            errors: [{ message: 'Lodash function \'findIndex\' is excluded by configuration. Consider using native Array.prototype.findIndex: array.findIndex(predicate)' }],
          },
          {
            code: 'import _ from \'lodash-es\'; _.reduce(data, (acc, val) => acc + val, 0);',
            output: 'import _ from \'lodash-es\'; data.reduce((acc, val) => acc + val, 0);',
            options: [{ exclude: ['reduce'] }],
            errors: [{ message: 'Lodash function \'reduce\' is excluded by configuration. Consider using native Array.prototype.reduce: array.reduce(fn, initial)' }],
          },
          {
            code: 'import _ from \'lodash-es\'; _.forEach(data, x => console.log(x));',
            output: 'import _ from \'lodash-es\'; data.forEach(x => console.log(x));',
            options: [{ exclude: ['forEach'] }],
            errors: [{ message: 'Lodash function \'forEach\' is excluded by configuration. Consider using native Array.prototype.forEach: array.forEach(fn)' }],
          },
          {
            code: 'import _ from \'lodash-es\'; _.some(data, x => x > 3);',
            output: 'import _ from \'lodash-es\'; data.some(x => x > 3);',
            options: [{ exclude: ['some'] }],
            errors: [{ message: 'Lodash function \'some\' is excluded by configuration. Consider using native Array.prototype.some: array.some(predicate)' }],
          },
          {
            code: 'import _ from \'lodash-es\'; _.every(data, x => x > 0);',
            output: 'import _ from \'lodash-es\'; data.every(x => x > 0);',
            options: [{ exclude: ['every'] }],
            errors: [{ message: 'Lodash function \'every\' is excluded by configuration. Consider using native Array.prototype.every: array.every(predicate)' }],
          },
        ],
      })
    }).not.toThrow()
  })
})
