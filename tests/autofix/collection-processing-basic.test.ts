import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('Collection Processing Functions Basic Validation', () => {
  it('should transform groupBy function with ES2024 Object.groupBy', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = Object.groupBy(items, item => item.category);',
        ],
        invalid: [
          {
            code: 'import { groupBy } from "lodash-es"; groupBy(items, "category");',
            output: 'import { groupBy } from "lodash-es"; Object.groupBy(items, item => item.category);',
            options: [{ exclude: ['groupBy'] }],
            errors: [{ message: /groupBy/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform groupBy function with function iteratee', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = Object.groupBy(users, user => user.age);',
        ],
        invalid: [
          {
            code: 'import { groupBy } from "lodash-es"; groupBy(users, user => user.age);',
            output: 'import { groupBy } from "lodash-es"; Object.groupBy(users, user => user.age);',
            options: [{ exclude: ['groupBy'] }],
            errors: [{ message: /groupBy/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform countBy function with reduce pattern', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = items.reduce((acc, item) => { const key = (item => item.type)(item); acc[key] = (acc[key] || 0) + 1; return acc; }, {});',
        ],
        invalid: [
          {
            code: 'import { countBy } from "lodash-es"; countBy(items, item => item.type);',
            output: 'import { countBy } from "lodash-es"; items.reduce((acc, item) => { const key = (item => item.type)(item); acc[key] = (acc[key] || 0) + 1; return acc; }, {});',
            options: [{ exclude: ['countBy'] }],
            errors: [{ message: /countBy/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform countBy function with string path', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = items.reduce((acc, item) => { const key = (item => item.status)(item); acc[key] = (acc[key] || 0) + 1; return acc; }, {});',
        ],
        invalid: [
          {
            code: 'import { countBy } from "lodash-es"; countBy(items, "status");',
            output: 'import { countBy } from "lodash-es"; items.reduce((acc, item) => { const key = (item => item.status)(item); acc[key] = (acc[key] || 0) + 1; return acc; }, {});',
            options: [{ exclude: ['countBy'] }],
            errors: [{ message: /countBy/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform keyBy function with function iteratee', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = Object.fromEntries(users.map(item => [(item => item.id)(item), item]));',
        ],
        invalid: [
          {
            code: 'import { keyBy } from "lodash-es"; keyBy(users, item => item.id);',
            output: 'import { keyBy } from "lodash-es"; Object.fromEntries(users.map(item => [(item => item.id)(item), item]));',
            options: [{ exclude: ['keyBy'] }],
            errors: [{ message: /keyBy/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform keyBy function with string path to function', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = Object.fromEntries(users.map(item => [(item => item.username)(item), item]));',
        ],
        invalid: [
          {
            code: 'import { keyBy } from "lodash-es"; keyBy(users, "username");',
            output: 'import { keyBy } from "lodash-es"; Object.fromEntries(users.map(item => [(item => item.username)(item), item]));',
            options: [{ exclude: ['keyBy'] }],
            errors: [{ message: /keyBy/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform chunk function with Array.from pattern', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = Array.from({length: Math.ceil(items.length / 3)}, (_, i) => items.slice(i * 3, (i + 1) * 3));',
        ],
        invalid: [
          {
            code: 'import { chunk } from "lodash-es"; chunk(items, 3);',
            output: 'import { chunk } from "lodash-es"; Array.from({length: Math.ceil(items.length / 3)}, (_, i) => items.slice(i * 3, (i + 1) * 3));',
            options: [{ exclude: ['chunk'] }],
            errors: [{ message: /chunk/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform orderBy function with single iteratee', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = users.toSorted((a, b) => (item => item.age)(a) - (item => item.age)(b));',
        ],
        invalid: [
          {
            code: 'import { orderBy } from "lodash-es"; orderBy(users, item => item.age);',
            output: 'import { orderBy } from "lodash-es"; users.toSorted((a, b) => (item => item.age)(a) - (item => item.age)(b));',
            options: [{ exclude: ['orderBy'] }],
            errors: [{ message: /orderBy/ }],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should transform orderBy function with string path to function', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          'const result = users.toSorted((a, b) => (item => item.name)(a) - (item => item.name)(b));',
        ],
        invalid: [
          {
            code: 'import { orderBy } from "lodash-es"; orderBy(users, "name");',
            output: 'import { orderBy } from "lodash-es"; users.toSorted((a, b) => (item => item.name)(a) - (item => item.name)(b));',
            options: [{ exclude: ['orderBy'] }],
            errors: [{ message: /orderBy/ }],
          },
        ],
      })
    }).not.toThrow()
  })
})
