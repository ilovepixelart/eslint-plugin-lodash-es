/**
 * Native alternatives for Array functions
 */
import { FunctionCategory, createPrototypeMethodAlternative, createStaticMethodAlternative, safetyConfigs, migrationConfigs, relatedFunctions, descriptions } from '../shared'
import type { NativeAlternative } from '../shared'

export const arrayAlternatives = new Map<string, NativeAlternative>([
  // Array Methods - Safe and Direct Replacements
  ['isArray', createStaticMethodAlternative(
    FunctionCategory.Array,
    'isArray',
    'Array',
    descriptions.checkIfArray,
  )],

  ['forEach', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'forEach',
    descriptions.iterateElements('array'),
    'fn',
    { related: [...relatedFunctions.arrayIterators] },
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

  ['filter', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'filter',
    descriptions.filterElements('array'),
    'predicate',
    { related: [...relatedFunctions.arrayIterators] },
  )],

  ['find', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'find',
    'Find first matching element',
    'predicate',
    { related: [...relatedFunctions.arrayFinders] },
  )],

  ['findIndex', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'findIndex',
    'Find index of first matching element',
    'predicate',
    { related: [...relatedFunctions.arrayFinders] },
  )],

  ['includes', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'includes',
    'Check if array includes a value',
    'value',
    { related: [...relatedFunctions.arrayFinders] },
  )],

  ['reduce', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'reduce',
    'Reduce array to single value',
    'fn, initial',
    { related: [...relatedFunctions.arrayReducers] },
  )],

  ['some', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'some',
    'Test if some elements match predicate',
    'predicate',
    { related: [...relatedFunctions.arrayTests] },
  )],

  ['every', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'every',
    'Test if all elements match predicate',
    'predicate',
    { related: [...relatedFunctions.arrayTests] },
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
])
