import { describe, it, expect } from 'vitest'

import { RuleTester } from 'eslint'

import noChaining from '../src/rules/no-chaining'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('no-chaining', () => {
  it('should pass when chain is not imported or used', () => {
    expect(() => {
      ruleTester.run('no-chaining', noChaining, {
        valid: [
          // No chain import
          'import { map, filter } from \'lodash-es\'; map([1,2,3], x => x * 2);',
          // Native chaining
          'const result = [1,2,3].map(x => x * 2).filter(x => x > 2);',
          // Non-lodash imports
          'import { chain } from \'other-lib\'; chain([1,2,3]);',
          // No imports at all
          'const data = [1, 2, 3];',
        ],
        invalid: [],
      })
    }).not.toThrow()
  })

  it('should flag chain imports from lodash-es', () => {
    expect(() => {
      ruleTester.run('no-chaining', noChaining, {
        valid: [],
        invalid: [
          {
            code: 'import { chain, map } from \'lodash-es\';',
            errors: [
              {
                messageId: 'noChaining',
                type: 'ImportSpecifier',
                suggestions: [{
                  desc: 'Remove chain import and use native array methods',
                  output: 'import { map } from \'lodash-es\';',
                }],
              },
            ],
          },
          {
            code: 'import { chain } from \'lodash-es\';',
            errors: [
              {
                messageId: 'noChaining',
                type: 'ImportSpecifier',
                suggestions: [{
                  desc: 'Remove chain import and use native array methods',
                  output: '',
                }],
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should flag chain() call expressions', () => {
    expect(() => {
      ruleTester.run('no-chaining', noChaining, {
        valid: [],
        invalid: [
          {
            code: `import { chain } from 'lodash-es';
const result = chain([1,2,3]).map(x => x * 2).value();`,
            errors: [
              {
                messageId: 'noChaining',
                type: 'ImportSpecifier',
                suggestions: [{
                  desc: 'Remove chain import and use native array methods',
                  output: '\nconst result = chain([1,2,3]).map(x => x * 2).value();',
                }],
              },
              {
                messageId: 'noChaining',
                type: 'CallExpression',
              },
            ],
          },
          {
            code: `import _ from 'lodash-es';
const result = _.chain([1,2,3]).map(x => x * 2).value();`,
            errors: [
              {
                messageId: 'noChaining',
                type: 'CallExpression',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should work with both lodash and lodash-es sources', () => {
    expect(() => {
      ruleTester.run('no-chaining', noChaining, {
        valid: [],
        invalid: [
          {
            code: 'import { chain } from \'lodash\';',
            errors: [
              {
                messageId: 'noChaining',
                type: 'ImportSpecifier',
                suggestions: [{
                  desc: 'Remove chain import and use native array methods',
                  output: '',
                }],
              },
            ],
          },
          {
            code: `import * as _ from 'lodash';
const result = _.chain([1,2,3]).map(x => x * 2).value();`,
            errors: [
              {
                messageId: 'noChaining',
                type: 'CallExpression',
              },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should not flag chain usage without lodash imports', () => {
    expect(() => {
      ruleTester.run('no-chaining', noChaining, {
        valid: [
          // Chain usage without lodash imports should be ignored
          'const chain = (data) => ({ map: (fn) => chain(data.map(fn)) }); chain([1,2,3]);',
          'const result = someOtherLib.chain([1,2,3]);',
        ],
        invalid: [],
      })
    }).not.toThrow()
  })
})
