/**
 * Native alternatives for Array functions
 */
import {
  FunctionCategory,
  createPrototypeMethodAlternative,
  createStaticMethodAlternative,
  createFixedParamPrototypeMethodAlternative,
  createSimpleArrayMethod,
  createArrayTransformMethod,
  safetyConfigs,
  migrationConfigs,
  relatedFunctions,
  descriptions,
} from '../shared'
import type { NativeAlternative } from '../shared'

// Helper functions to reduce duplication in array method creation
function createArrayMethods(
  methods: [string, string, string, string[]][],
): [string, NativeAlternative][] {
  return methods.map(([name, description, params, related]) => [
    name,
    createSimpleArrayMethod(name, description, params, [...related]),
  ])
}

function createBasicArrayMethods(
  methods: [string, string, string][],
): [string, NativeAlternative][] {
  return methods.map(([name, description, params]) => [
    name,
    createPrototypeMethodAlternative(FunctionCategory.Array, name, description, params),
  ])
}

function createFixedParamMethods(
  methods: [string, string, string, string, string][],
): [string, NativeAlternative][] {
  return methods.map(([name, nativeMethod, params, description, note]) => [
    name,
    createFixedParamPrototypeMethodAlternative(
      FunctionCategory.Array,
      name,
      nativeMethod,
      params,
      description,
      { notes: [note] },
    ),
  ])
}

export const arrayAlternatives = new Map<string, NativeAlternative>([
  // Array Methods - Safe and Direct Replacements
  ['isArray', createStaticMethodAlternative(
    FunctionCategory.Array,
    'isArray',
    'Array',
    descriptions.checkIfArray,
  )],

  // Core iteration methods
  ...createArrayMethods([
    ['forEach', descriptions.iterateElements('array'), 'fn', relatedFunctions.arrayIterators],
    ['filter', descriptions.filterElements('array'), 'predicate', relatedFunctions.arrayIterators],
    ['reduce', 'Reduce array to single value', 'fn, initial', relatedFunctions.arrayReducers],
    ['some', 'Test if some elements match predicate', 'predicate', relatedFunctions.arrayTests],
    ['every', 'Test if all elements match predicate', 'predicate', relatedFunctions.arrayTests],
  ]),

  // Finder methods
  ...createArrayMethods([
    ['find', 'Find first matching element', 'predicate', relatedFunctions.arrayFinders],
    ['findIndex', 'Find index of first matching element', 'predicate', relatedFunctions.arrayFinders],
    ['includes', 'Check if array includes a value', 'value', relatedFunctions.arrayFinders],
  ]),

  // Special case: map with detailed migration config
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

  // Basic array methods
  ...createBasicArrayMethods([
    ['slice', 'Extract section of array', 'start, end'],
    ['concat', 'Concatenate arrays', '...values'],
    ['join', 'Join array elements into string', 'separator'],
  ]),

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
  ...createBasicArrayMethods([
    ['indexOf', 'Find index of first occurrence of value', 'value, fromIndex'],
    ['lastIndexOf', 'Find index of last occurrence of value', 'value, fromIndex'],
  ]),

  // ES2019+ methods with notes
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
  ...createFixedParamMethods([
    ['first', 'at', '0', 'Get first element of array', 'Modern at() method available since ES2022'],
    ['head', 'at', '0', 'Get first element of array (alias for first)', 'Modern at() method available since ES2022'],
    ['last', 'at', '-1', 'Get last element of array', 'Modern at() method available since ES2022'],
    ['initial', 'slice', '0, -1', 'Get all elements except the last', 'Returns all but last element using slice(0, -1)'],
    ['tail', 'slice', '1', 'Get all elements except the first', 'Returns all but first element using slice(1)'],
  ]),

  // Quick Wins - High Impact Array Functions
  ['uniq', createArrayTransformMethod(
    'uniq',
    '[...new Set(array)]',
    'Remove duplicate values from array',
    relatedFunctions.arrayDeduplication,
    {
      notes: ['Uses ES6 Set for deduplication', 'Preserves insertion order', 'Works with primitives only'],
    },
  )],

  ['compact', createArrayTransformMethod(
    'compact',
    'array.filter(Boolean)',
    'Remove falsy values from array',
    relatedFunctions.arrayFilters,
    {
      notes: ['Removes false, null, 0, "", undefined, NaN', 'Uses Boolean constructor as filter predicate'],
    },
  )],

  ['sortBy', createArrayTransformMethod(
    'sortBy',
    'array.toSorted((a, b) => fn(a) - fn(b))',
    'Sort array by computed values (immutable)',
    relatedFunctions.arraySorting,
    {
      notes: ['Uses ES2023 toSorted() method', 'Returns new array (immutable)', 'Assumes numeric sort by default'],
    },
  )],
])
