/**
 * Native alternatives for Array functions
 */
import { FunctionCategory, createPrototypeMethodAlternative, createStaticMethodAlternative, safetyConfigs, migrationConfigs } from '../shared'
import type { NativeAlternative } from '../shared'

export const arrayAlternatives = new Map<string, NativeAlternative>([
  // Array Methods - Safe and Direct Replacements
  ['isArray', createStaticMethodAlternative(
    FunctionCategory.Array,
    'isArray',
    'Array',
    'Check if value is an array (reliable & performant)',
  )],

  ['forEach', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'forEach',
    'Iterate over array elements (native is faster)',
    'fn',
    { related: ['map', 'filter'] },
  )],

  ['map', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'map',
    'Transform array elements using a callback function',
    'fn',
    {
      migration: {
        steps: [
          'Replace _.map(array, fn) with array.map(fn)',
          'Ensure array is not null/undefined before calling',
        ],
      },
      related: ['filter', 'forEach'],
    },
  )],

  ['filter', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'filter',
    'Filter array elements (native is faster)',
    'predicate',
    { related: ['map', 'find'] },
  )],

  ['find', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'find',
    'Find first matching element',
    'predicate',
    { related: ['filter', 'findIndex'] },
  )],

  ['findIndex', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'findIndex',
    'Find index of first matching element',
    'predicate',
    { related: ['find', 'indexOf'] },
  )],

  ['includes', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'includes',
    'Check if array includes a value',
    'value',
    { related: ['indexOf', 'find'] },
  )],

  ['reduce', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'reduce',
    'Reduce array to single value',
    'fn, initial',
    { related: ['map', 'filter'] },
  )],

  ['some', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'some',
    'Test if some elements match predicate',
    'predicate',
    { related: ['every', 'find'] },
  )],

  ['every', createPrototypeMethodAlternative(
    FunctionCategory.Array,
    'every',
    'Test if all elements match predicate',
    'predicate',
    { related: ['some', 'filter'] },
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
      related: ['sort'],
    },
  )],
])
