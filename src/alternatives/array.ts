/**
 * Native alternatives for Array functions
 */
import { FunctionCategory, createPrototypeMethodAlternative, createStaticMethodAlternative, createFixedParamPrototypeMethodAlternative, createExpressionAlternative, createSimpleArrayMethod, safetyConfigs, migrationConfigs, relatedFunctions, descriptions } from '../shared'
import type { NativeAlternative } from '../shared'

export const arrayAlternatives = new Map<string, NativeAlternative>([
  // Array Methods - Safe and Direct Replacements
  ['isArray', createStaticMethodAlternative(
    FunctionCategory.Array,
    'isArray',
    'Array',
    descriptions.checkIfArray,
  )],

  ['forEach', createSimpleArrayMethod(
    'forEach',
    descriptions.iterateElements('array'),
    'fn',
    [...relatedFunctions.arrayIterators],
  )],

  ['map', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'map',
    descriptions.transformElements('array'),
    'fn',
    {
      migration: {
        steps: [
          'Replace _.map(array, fn) with array.map(fn)',
          'Ensure array is not null/undefined before calling',
        ],
      },
      related: [...relatedFunctions.arrayIterators],
    },
  )],

  ['filter', createSimpleArrayMethod(
    'filter',
    descriptions.filterElements('array'),
    'predicate',
    [...relatedFunctions.arrayIterators],
  )],

  ['find', createSimpleArrayMethod(
    'find',
    'Find first matching element',
    'predicate',
    [...relatedFunctions.arrayFinders],
  )],

  ['findIndex', createSimpleArrayMethod(
    'findIndex',
    'Find index of first matching element',
    'predicate',
    [...relatedFunctions.arrayFinders],
  )],

  ['includes', createSimpleArrayMethod(
    'includes',
    'Check if array includes a value',
    'value',
    [...relatedFunctions.arrayFinders],
  )],

  ['reduce', createSimpleArrayMethod(
    'reduce',
    'Reduce array to single value',
    'fn, initial',
    [...relatedFunctions.arrayReducers],
  )],

  ['some', createSimpleArrayMethod(
    'some',
    'Test if some elements match predicate',
    'predicate',
    [...relatedFunctions.arrayTests],
  )],

  ['every', createSimpleArrayMethod(
    'every',
    'Test if all elements match predicate',
    'predicate',
    [...relatedFunctions.arrayTests],
  )],

  ['slice', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'slice',
    'Extract section of array',
    'start, end',
  )],

  ['concat', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'concat',
    'Concatenate arrays',
    '...values',
  )],

  ['join', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'join',
    'Join array elements into string',
    'separator',
  )],

  // Array Methods - With Behavioral Differences
  ['reverse', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'reverse',
    'Reverse array elements in place',
    undefined,
    {
      safety: safetyConfigs.mutatesOriginal,
      migration: migrationConfigs.mutabilityConcerns,
      excludeByDefault: true,
      related: [...relatedFunctions.arrayMutators],
    },
  )],

  // Additional Array Methods - Direct Native Equivalents
  ['indexOf', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'indexOf',
    'Find index of first occurrence of value',
    'value, fromIndex',
  )],

  ['lastIndexOf', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'lastIndexOf',
    'Find index of last occurrence of value',
    'value, fromIndex',
  )],

  ['flatten', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'flat',
    'Flatten array one level deep',
    undefined,
    { notes: ['Native flat() method available since ES2019'] },
  )],

  ['flatMap', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'flatMap',
    'Map and flatten array',
    'fn',
    { notes: ['Native flatMap() method available since ES2019'] },
  )],

  ['reduceRight', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'reduceRight',
    'Reduce array from right to left',
    'fn, initial',
    { related: [...relatedFunctions.arrayReducers] },
  )],

  // Array Access Utilities
  ['first', createFixedParamPrototypeMethodAlternative(
    FunctionCategory.Array,
    'first',
    'at',
    '0',
    'Get first element of array',
    { notes: ['Modern at() method available since ES2022'] },
  )],

  ['head', createFixedParamPrototypeMethodAlternative(
    FunctionCategory.Array,
    'head',
    'at',
    '0',
    'Get first element of array (alias for first)',
    { notes: ['Modern at() method available since ES2022'] },
  )],

  ['last', createFixedParamPrototypeMethodAlternative(
    FunctionCategory.Array,
    'last',
    'at',
    '-1',
    'Get last element of array',
    { notes: ['Modern at() method available since ES2022'] },
  )],

  ['initial', createFixedParamPrototypeMethodAlternative(
    FunctionCategory.Array,
    'initial',
    'slice',
    '0, -1',
    'Get all elements except the last',
    { notes: ['Returns all but last element using slice(0, -1)'] },
  )],

  ['tail', createFixedParamPrototypeMethodAlternative(
    FunctionCategory.Array,
    'tail',
    'slice',
    '1',
    'Get all elements except the first',
    { notes: ['Returns all but first element using slice(1)'] },
  )],

  // Quick Wins - High Impact Array Functions
  ['uniq', createExpressionAlternative(
    FunctionCategory.Array,
    'uniq',
    '[...new Set(array)]',
    'Remove duplicate values from array',
    {
      migration: migrationConfigs.easy,
      safety: safetyConfigs.safe,
      notes: ['Uses ES6 Set for deduplication', 'Preserves insertion order', 'Works with primitives only'],
      related: [...relatedFunctions.arrayDeduplication],
    },
  )],

  ['compact', createExpressionAlternative(
    FunctionCategory.Array,
    'compact',
    'array.filter(Boolean)',
    'Remove falsy values from array',
    {
      migration: migrationConfigs.easy,
      safety: safetyConfigs.safe,
      notes: ['Removes false, null, 0, "", undefined, NaN', 'Uses Boolean constructor as filter predicate'],
      related: [...relatedFunctions.arrayFilters],
    },
  )],

  ['sortBy', createExpressionAlternative(
    FunctionCategory.Array,
    'sortBy',
    'array.toSorted((a, b) => fn(a) - fn(b))',
    'Sort array by computed values (immutable)',
    {
      migration: migrationConfigs.easy,
      safety: safetyConfigs.safe,
      notes: ['Uses ES2023 toSorted() method', 'Returns new array (immutable)', 'Assumes numeric sort by default'],
      related: [...relatedFunctions.arraySorting],
    },
  )],
])
