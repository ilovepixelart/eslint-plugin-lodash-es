import { describe, it } from 'vitest'

import { RuleTester } from 'eslint'

import suggestNativeAlternatives from '../src/rules/suggest-native-alternatives'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('suggest-native-alternatives rule', () => {
  it('should work with default/namespace imports and suggest native alternatives', () => {
    ruleTester.run('suggest-native-alternatives', suggestNativeAlternatives, {
      valid: [
        // Using native alternatives already
        'import lodash from "lodash-es"; const result = Array.isArray(value);',
        // Functions without native alternatives
        'import _ from "lodash-es"; const result = _.debounce(fn, 100);',
        // Non-lodash imports
        'import { isArray } from "some-other-lib"; const result = isArray(value);',
      ],
      invalid: [
        {
          code: 'import _ from "lodash-es"; const result = _.isArray(value);',
          errors: [
            {
              message: 'Consider using native \'Array.isArray(value)\' instead of lodash \'isArray\'. Check if value is an array.',
              type: 'ImportDeclaration',
            },
          ],
        },
        {
          code: 'import lodash from "lodash-es"; const result = lodash.map(array, fn);',
          errors: [
            {
              message: 'Consider using native \'array.map(fn)\' instead of lodash \'map\'. Transform array elements.',
              type: 'ImportDeclaration',
            },
          ],
        },
        {
          code: 'import _ from "lodash-es"; const check = _.isString(value); const nums = _.max(array);',
          errors: [
            {
              message: 'Consider using native \'typeof value === "string"\' instead of lodash \'isString\'. Check if value is string.',
              type: 'ImportDeclaration',
            },
            {
              message: 'Consider using native \'Math.max(...array)\' instead of lodash \'max\'. Get maximum value.',
              type: 'ImportDeclaration',
            },
          ],
        },
      ],
    })
  })

  it('should work with destructured imports (guidance only)', () => {
    ruleTester.run('suggest-native-alternatives destructured', suggestNativeAlternatives, {
      valid: [
        // Functions without native alternatives
        'import { debounce, throttle } from "lodash-es"; const fn = debounce(callback, 100);',
      ],
      invalid: [
        {
          code: 'import { isArray, map, filter } from "lodash-es";',
          errors: [
            {
              message: 'Consider using native \'Array.isArray(value)\' instead of lodash \'isArray\'. Check if value is an array.',
              type: 'ImportSpecifier',
            },
            {
              message: 'Consider using native \'array.map(fn)\' instead of lodash \'map\'. Transform array elements.',
              type: 'ImportSpecifier',
            },
            {
              message: 'Consider using native \'array.filter(predicate)\' instead of lodash \'filter\'. Filter array elements.',
              type: 'ImportSpecifier',
            },
          ],
        },
        {
          code: 'import { isNull, isUndefined, keys } from "lodash-es";',
          errors: [
            {
              message: 'Consider using native \'value === null\' instead of lodash \'isNull\'. Check if value is null.',
              type: 'ImportSpecifier',
            },
            {
              message: 'Consider using native \'value === undefined\' instead of lodash \'isUndefined\'. Check if value is undefined.',
              type: 'ImportSpecifier',
            },
            {
              message: 'Consider using native \'Object.keys(object)\' instead of lodash \'keys\'. Get object keys.',
              type: 'ImportSpecifier',
            },
          ],
        },
      ],
    })
  })

  it('should respect excludeUnsafe option', () => {
    ruleTester.run('suggest-native-alternatives excludeUnsafe', suggestNativeAlternatives, {
      valid: [
        {
          code: 'import _ from "lodash-es"; const result = _.reverse(array);',
          options: [{ excludeUnsafe: true }],
        },
      ],
      invalid: [
        {
          code: 'import _ from "lodash-es"; const result = _.reverse(array);',
          options: [{ excludeUnsafe: false }],
          errors: [
            {
              message: /Consider using native.*reverse/,
              type: 'ImportDeclaration',
            },
          ],
        },
      ],
    })
  })

  it('should handle edge cases with unsupported functions', () => {
    // Test with functions that don't have native alternatives to ensure defensive programming works
    ruleTester.run('suggest-native-alternatives edge cases', suggestNativeAlternatives, {
      valid: [
        // Functions that don't have native alternatives should not trigger errors
        'import _ from "lodash-es"; const result = _.debounce(fn, 100);',
        'import { debounce, throttle } from "lodash-es"; // No native alternatives',
        // Test import specifier edge cases
        'import { chunk, compact } from "lodash-es"; // No native alternatives',
      ],
      invalid: [
        // Mix of functions with and without alternatives
        {
          code: 'import { isArray, debounce } from "lodash-es";',
          errors: [
            {
              message: 'Consider using native \'Array.isArray(value)\' instead of lodash \'isArray\'. Check if value is an array.',
              type: 'ImportSpecifier',
            },
            // debounce should not generate an error since it has no native alternative
          ],
        },
      ],
    })
  })

  it('should handle excludeUnsafe option with functions that have different behavior', () => {
    // This tests the branch where alternatives with "different behavior" are excluded
    ruleTester.run('suggest-native-alternatives unsafe exclusion', suggestNativeAlternatives, {
      valid: [
        // Should not suggest reverse when excludeUnsafe is true (default)
        {
          code: 'import { reverse } from "lodash-es";',
          options: [{ excludeUnsafe: true }],
        },
      ],
      invalid: [
        // Should suggest reverse when excludeUnsafe is false
        {
          code: 'import { reverse } from "lodash-es";',
          options: [{ excludeUnsafe: false }],
          errors: [
            {
              message: /Consider using native.*reverse/,
              type: 'ImportSpecifier',
            },
          ],
        },
      ],
    })
  })
})
