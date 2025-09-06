import { describe, it, expect } from 'vitest'

import { RuleTester } from 'eslint'

import enforceDestructuring from '../src/rules/enforce-destructuring'

// Create ESLint rule tester
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('enforce-destructuring', () => {
  it('should pass valid destructured imports', () => {
    expect(() => {
      ruleTester.run('enforce-destructuring', enforceDestructuring, {
        valid: [
          // Already destructured imports
          'import { first, last } from \'lodash-es\';',
          'import { map, filter } from \'lodash-es\';',
          // Non-lodash imports
          'import _ from \'underscore\';',
          'import lodash from \'some-other-package\';',
          // No imports
          'const data = [1, 2, 3];',
        ],
        invalid: [],
      })
    }).not.toThrow()
  })

  it('should fix default imports', () => {
    expect(() => {
      ruleTester.run('enforce-destructuring', enforceDestructuring, {
        valid: [],
        invalid: [
          {
            code: `import _ from 'lodash-es';
const result = _.first([1, 2, 3]);
const lastItem = _.last([1, 2, 3]);`,
            output: `import { first, last } from 'lodash-es';
const result = first([1, 2, 3]);
const lastItem = last([1, 2, 3]);`,
            errors: [
              {
                message: 'Use destructured imports from lodash-es instead of default import.',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should fix namespace imports', () => {
    expect(() => {
      ruleTester.run('enforce-destructuring', enforceDestructuring, {
        valid: [],
        invalid: [
          {
            code: `import * as _ from 'lodash-es';
const mapped = _.map([1, 2, 3], x => x * 2);
const filtered = _.filter([1, 2, 3], x => x > 1);`,
            output: `import { filter, map } from 'lodash-es';
const mapped = map([1, 2, 3], x => x * 2);
const filtered = filter([1, 2, 3], x => x > 1);`,
            errors: [
              {
                message: 'Use destructured imports from lodash-es instead of namespace import.',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should handle lodash package', () => {
    expect(() => {
      ruleTester.run('enforce-destructuring', enforceDestructuring, {
        valid: [],
        invalid: [
          {
            code: `import _ from 'lodash';
const result = _.isEmpty({}); 
const cloned = _.clone(obj);`,
            output: `import { clone, isEmpty } from 'lodash-es';
const result = isEmpty({}); 
const cloned = clone(obj);`,
            errors: [
              {
                message: 'Use destructured imports from lodash-es instead of default import.',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should remove unused imports', () => {
    expect(() => {
      ruleTester.run('enforce-destructuring', enforceDestructuring, {
        valid: [],
        invalid: [
          {
            code: `import _ from 'lodash-es';
console.log('No lodash functions used');`,
            output: `
console.log('No lodash functions used');`,
            errors: [
              {
                message: 'Use destructured imports from lodash-es instead of default import.',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should handle complex usage patterns', () => {
    expect(() => {
      ruleTester.run('enforce-destructuring', enforceDestructuring, {
        valid: [],
        invalid: [
          {
            code: `import _ from 'lodash-es';
const users = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 }
];
const names = _.map(users, 'name');
const adults = _.filter(users, user => user.age >= 18);
const firstUser = _.first(users);
const grouped = _.groupBy(users, 'age');`,
            output: `import { filter, first, groupBy, map } from 'lodash-es';
const users = [
  { name: 'John', age: 25 },
  { name: 'Jane', age: 30 }
];
const names = map(users, 'name');
const adults = filter(users, user => user.age >= 18);
const firstUser = first(users);
const grouped = groupBy(users, 'age');`,
            errors: [
              {
                message: 'Use destructured imports from lodash-es instead of default import.',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })
})
