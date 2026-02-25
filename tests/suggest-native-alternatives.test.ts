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
          output: 'import _ from "lodash-es"; const result = Array.isArray(value);',
          errors: [
            {
              message: 'Consider native \'Array.isArray(value)\' instead of \'_.isArray()\'. Check if value is an array (reliable & performant).',
            },
          ],
        },
        {
          code: 'import lodash from "lodash-es"; const result = lodash.map(array, fn);',
          output: 'import lodash from "lodash-es"; const result = array.map(fn);',
          errors: [
            {
              message: 'Consider native \'array.map(fn)\' instead of \'_.map()\'. Transform array elements using a callback function.',
            },
          ],
        },
        {
          code: 'import _ from "lodash-es"; const check = _.isString(value); const nums = _.max(array);',
          output: 'import _ from "lodash-es"; const check = typeof value === "string"; const nums = Math.max(...array);',
          errors: [
            {
              message: 'Consider native \'typeof value === "string"\' instead of \'_.isString()\'. Check if value is string.',
            },
            {
              message: 'Consider native \'Math.max(...array)\' instead of \'_.max()\'. Get maximum value. Note: Use spread operator with native Math.max',
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
          code: 'import { isArray, map, filter } from "lodash-es"; const check = isArray(value); const result = map(arr, fn);',
          output: 'import { isArray, map, filter } from "lodash-es"; const check = Array.isArray(value); const result = arr.map(fn);',
          errors: [
            {
              message: 'Consider native \'array.filter(predicate)\' instead of \'_.filter()\'. Filter array elements (native is faster).',
            },
            {
              message: 'Consider native \'Array.isArray(value)\' instead of \'_.isArray()\'. Check if value is an array (reliable & performant).',
            },
            {
              message: 'Consider native \'array.map(fn)\' instead of \'_.map()\'. Transform array elements using a callback function.',
            },
          ],
        },
        {
          code: 'import { isArray, map, filter } from "lodash-es";',
          errors: [
            {
              message: 'Consider native \'Array.isArray(value)\' instead of \'_.isArray()\'. Check if value is an array (reliable & performant).',
            },
            {
              message: 'Consider native \'array.map(fn)\' instead of \'_.map()\'. Transform array elements using a callback function.',
            },
            {
              message: 'Consider native \'array.filter(predicate)\' instead of \'_.filter()\'. Filter array elements (native is faster).',
            },
          ],
        },
        {
          code: 'import { isNull, isUndefined, keys } from "lodash-es";',
          errors: [
            {
              message: 'Consider native \'value === null\' instead of \'_.isNull()\'. Check if value is null.',
            },
            {
              message: 'Consider native \'value === undefined\' instead of \'_.isUndefined()\'. Check if value is undefined.',
            },
            {
              message: 'Consider native \'Object.keys(object)\' instead of \'_.keys()\'. Get enumerable property names of object. ⚠️  Add null safety: use `obj || {}` to prevent runtime errors. Note: Lodash version handles null/undefined gracefully',
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
          output: 'import _ from "lodash-es"; const result = array.reverse();',
          options: [{ excludeUnsafe: false }],
          errors: [
            {
              message: /Consider native.*reverse/,
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
        'import { throttle, isEmpty } from "lodash-es"; // Functions without clean native alternatives',
      ],
      invalid: [
        // Mix of functions with and without alternatives
        {
          code: 'import { isArray, debounce } from "lodash-es";',
          errors: [
            {
              message: 'Consider native \'Array.isArray(value)\' instead of \'_.isArray()\'. Check if value is an array (reliable & performant).',
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
              message: /Consider native.*reverse/,
            },
          ],
        },
      ],
    })
  })
})
