import { describe, it, expect } from 'vitest'

import { RuleTester } from 'eslint'

import enforceFunctions from '../src/rules/enforce-functions'

// Create ESLint rule tester
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('enforce-functions', () => {
  it('should pass when no restrictions are configured', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          // No options means no restrictions
          'import _ from \'lodash-es\'; const result = _.map([1, 2, 3], x => x * 2);',
          'import { map, filter } from \'lodash-es\'; map([1, 2, 3], x => x * 2);',
          'import * as lodash from \'lodash-es\'; lodash.filter([1, 2, 3], x => x > 1);',
        ],
        invalid: [],
      })
    }).not.toThrow()
  })

  it('should respect exclude configuration for default imports', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          // Allowed functions should pass
          {
            code: 'import _ from \'lodash-es\'; const result = _.first([1, 2, 3]);',
            options: [{ exclude: ['map'] }],
          },
        ],
        invalid: [
          {
            code: 'import _ from \'lodash-es\'; const result = _.map([1, 2, 3], x => x * 2);',
            options: [{ exclude: ['map'] }],
            errors: [
              {
                message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)',
              },
            ],
          },
          {
            code: `import _ from 'lodash-es';
const result = _.map([1, 2, 3], x => x * 2);
const filtered = _.filter([1, 2, 3], x => x > 1);`,
            options: [{ exclude: ['map', 'filter'] }],
            errors: [
              {
                message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)',
              },
              {
                message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should respect exclude configuration for namespace imports', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          {
            code: 'import * as lodash from \'lodash-es\'; const result = lodash.first([1, 2, 3]);',
            options: [{ exclude: ['map'] }],
          },
        ],
        invalid: [
          {
            code: 'import * as lodash from \'lodash-es\'; const result = lodash.map([1, 2, 3], x => x * 2);',
            options: [{ exclude: ['map'] }],
            errors: [
              {
                message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should respect exclude configuration for destructured imports', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          {
            code: 'import { first, last } from \'lodash-es\';',
            options: [{ exclude: ['map'] }],
          },
        ],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\';',
            options: [{ exclude: ['map'] }],
            errors: [
              {
                message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)',
              },
            ],
          },
          {
            code: 'import { map, filter, first } from \'lodash-es\';',
            options: [{ exclude: ['map', 'filter'] }],
            errors: [
              {
                message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)',
              },
              {
                message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should respect include configuration for default imports', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          {
            code: 'import _ from \'lodash-es\'; const result = _.first([1, 2, 3]);',
            options: [{ include: ['first', 'last'] }],
          },
        ],
        invalid: [
          {
            code: 'import _ from \'lodash-es\'; const result = _.map([1, 2, 3], x => x * 2);',
            options: [{ include: ['first', 'last'] }],
            errors: [
              {
                message: 'Lodash function \'map\' is not in the allowed functions list. Consider using native Array.prototype.map: array.map(fn)',
              },
            ],
          },
          {
            code: `import _ from 'lodash-es';
const result = _.map([1, 2, 3], x => x * 2);
const sorted = _.sortBy([1, 2, 3]);`,
            options: [{ include: ['first', 'last'] }],
            errors: [
              {
                message: 'Lodash function \'map\' is not in the allowed functions list. Consider using native Array.prototype.map: array.map(fn)',
              },
              {
                message: 'Lodash function \'sortBy\' is not in the allowed functions list.',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should respect include configuration for destructured imports', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          {
            code: 'import { first, last } from \'lodash-es\';',
            options: [{ include: ['first', 'last'] }],
          },
        ],
        invalid: [
          {
            code: 'import { map } from \'lodash-es\';',
            options: [{ include: ['first', 'last'] }],
            errors: [
              {
                message: 'Lodash function \'map\' is not in the allowed functions list. Consider using native Array.prototype.map: array.map(fn)',
              },
            ],
          },
          {
            code: 'import { map, filter, first } from \'lodash-es\';',
            options: [{ include: ['first', 'last'] }],
            errors: [
              {
                message: 'Lodash function \'map\' is not in the allowed functions list. Consider using native Array.prototype.map: array.map(fn)',
              },
              {
                message: 'Lodash function \'filter\' is not in the allowed functions list. Consider using native Array.prototype.filter: array.filter(predicate)',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should handle mixed import styles', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: `import _, { filter } from 'lodash-es';
const result = _.map([1, 2, 3], x => x * 2);
filter([1, 2, 3], x => x > 1);`,
            options: [{ exclude: ['map', 'filter'] }],
            errors: [
              {
                message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)',
              },
              {
                message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should ignore non-lodash imports', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [
          // Non-lodash imports should be ignored
          {
            code: 'import { map } from \'ramda\';',
            options: [{ exclude: ['map'] }],
          },
          {
            code: 'import _ from \'underscore\';',
            options: [{ exclude: ['map'] }],
          },
        ],
        invalid: [],
      })
    }).not.toThrow()
  })

  it('should handle lodash package (not just lodash-es)', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import _ from \'lodash\'; const result = _.map([1, 2, 3], x => x * 2);',
            options: [{ exclude: ['map'] }],
            errors: [
              {
                message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should throw error when both include and exclude are provided', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import _ from \'lodash-es\'; const result = _.first([1, 2, 3]);',
            options: [{ include: ['first'], exclude: ['map'] }],
            errors: [{}],
          },
        ],
      })
    }).toThrow('Cannot specify both "include" and "exclude" options. Use only one.')
  })
})
