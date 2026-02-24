import { describe, it, expect } from 'vitest'

import { RuleTester } from 'eslint'

import noMethodImports from '../src/rules/no-method-imports'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('no-method-imports', () => {
  it('should pass with valid non-per-method imports', () => {
    expect(() => {
      ruleTester.run('no-method-imports', noMethodImports, {
        valid: [
          // Destructured imports (preferred)
          'import { map, filter } from \'lodash-es\';',
          'import { isArray, isEmpty } from \'lodash-es\';',
          // Default/namespace imports (handled by other rules)
          'import _ from \'lodash-es\';',
          'import * as lodash from \'lodash-es\';',
          // Non-lodash imports
          'import map from \'rxjs/operators\';',
          'import { someFunction } from \'other-lib\';',
          // No imports
          'const data = [1, 2, 3];',
        ],
        invalid: [],
      })
    }).not.toThrow()
  })

  it('should flag lodash/function per-method imports', () => {
    expect(() => {
      ruleTester.run('no-method-imports', noMethodImports, {
        valid: [],
        invalid: [
          {
            code: 'import map from \'lodash/map\';',
            errors: [
              {
                messageId: 'perMethodDeprecated',
                suggestions: [{
                  desc: 'Convert to destructured lodash-es import',
                  output: 'import { map } from \'lodash-es\';',
                }],
              },
            ],
          },
          {
            code: 'import filter from \'lodash/filter\';',
            errors: [
              {
                messageId: 'perMethodDeprecated',
                suggestions: [{
                  desc: 'Convert to destructured lodash-es import',
                  output: 'import { filter } from \'lodash-es\';',
                }],
              },
            ],
          },
          {
            code: 'import isArray from \'lodash/isArray\';',
            errors: [
              {
                messageId: 'perMethodDeprecated',
                suggestions: [{
                  desc: 'Convert to destructured lodash-es import',
                  output: 'import { isArray } from \'lodash-es\';',
                }],
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should flag lodash.function per-method imports', () => {
    expect(() => {
      ruleTester.run('no-method-imports', noMethodImports, {
        valid: [],
        invalid: [
          {
            code: 'import map from \'lodash.map\';',
            errors: [
              {
                messageId: 'perMethodDeprecated',
                suggestions: [{
                  desc: 'Convert to destructured lodash-es import',
                  output: 'import { map } from \'lodash-es\';',
                }],
              },
            ],
          },
          {
            code: 'import isEmpty from \'lodash.isEmpty\';',
            errors: [
              {
                messageId: 'perMethodDeprecated',
                suggestions: [{
                  desc: 'Convert to destructured lodash-es import',
                  output: 'import { isEmpty } from \'lodash-es\';',
                }],
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should flag lodash/fp per-method imports', () => {
    expect(() => {
      ruleTester.run('no-method-imports', noMethodImports, {
        valid: [],
        invalid: [
          {
            code: 'import map from \'lodash/fp/map\';',
            errors: [
              {
                messageId: 'perMethodDeprecated',
                suggestions: [{
                  desc: 'Convert to destructured lodash-es import',
                  output: 'import { map } from \'lodash-es\';',
                }],
              },
            ],
          },
          {
            code: 'import curry from \'lodash/fp/curry\';',
            errors: [
              {
                messageId: 'perMethodDeprecated',
                suggestions: [{
                  desc: 'Convert to destructured lodash-es import',
                  output: 'import { curry } from \'lodash-es\';',
                }],
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should flag invalid lodash function names', () => {
    expect(() => {
      ruleTester.run('no-method-imports', noMethodImports, {
        valid: [],
        invalid: [
          {
            code: 'import invalidFunction from \'lodash/invalidFunction\';',
            errors: [
              {
                messageId: 'invalidPerMethodImport',
              },
            ],
          },
          {
            code: 'import notALodashFunction from \'lodash/notALodashFunction\';',
            errors: [
              {
                messageId: 'invalidPerMethodImport',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should suggest consolidation for multiple per-method imports', () => {
    expect(() => {
      ruleTester.run('no-method-imports', noMethodImports, {
        valid: [],
        invalid: [
          {
            code: `import map from 'lodash/map';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';`,
            errors: [
              {
                messageId: 'perMethodDeprecated',
                suggestions: [{
                  desc: 'Convert to destructured lodash-es import',
                  output: `import { map } from 'lodash-es';
import filter from 'lodash/filter';
import reduce from 'lodash/reduce';`,
                }],
              },
              {
                messageId: 'autoFixSuggestion',
                suggestions: [{
                  desc: 'Consolidate 3 per-method imports into single destructured import',
                  output: `import { filter, map, reduce } from 'lodash-es';\n\n`,
                }],
              },
              {
                messageId: 'perMethodDeprecated',
                suggestions: [{
                  desc: 'Convert to destructured lodash-es import',
                  output: `import map from 'lodash/map';
import { filter } from 'lodash-es';
import reduce from 'lodash/reduce';`,
                }],
              },
              {
                messageId: 'perMethodDeprecated',
                suggestions: [{
                  desc: 'Convert to destructured lodash-es import',
                  output: `import map from 'lodash/map';
import filter from 'lodash/filter';
import { reduce } from 'lodash-es';`,
                }],
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should handle mixed valid and invalid function names', () => {
    expect(() => {
      ruleTester.run('no-method-imports', noMethodImports, {
        valid: [],
        invalid: [
          {
            code: `import map from 'lodash/map';
import invalidFunc from 'lodash/invalidFunc';`,
            errors: [
              {
                messageId: 'perMethodDeprecated',
                suggestions: [{
                  desc: 'Convert to destructured lodash-es import',
                  output: 'import { map } from \'lodash-es\';\nimport invalidFunc from \'lodash/invalidFunc\';',
                }],
              },
              {
                messageId: 'invalidPerMethodImport',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should not affect regular imports with similar patterns', () => {
    expect(() => {
      ruleTester.run('no-method-imports', noMethodImports, {
        valid: [
          // These patterns shouldn\'t match
          'import something from \'not-lodash/map\';',
          'import other from \'mylodash/filter\';',
          'import custom from \'lodash-extended/map\';',
          'import util from \'@lodash/map\';',
        ],
        invalid: [],
      })
    }).not.toThrow()
  })
})
