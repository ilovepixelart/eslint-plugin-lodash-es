/**
 * Native alternatives for Array functions
 */
import { FunctionCategory, SafetyLevel, MigrationDifficulty, createAlternative } from '../shared'
import type { NativeAlternative, CreateAlternativeOptions } from '../shared'

// Array method helper
function createArrayMethod(
  lodashName: string,
  native: string,
  description: string,
  params = '',
  options?: Partial<CreateAlternativeOptions>,
): NativeAlternative {
  const paramSuffix = params ? `, ${params}` : ''
  return createAlternative({
    category: FunctionCategory.Array,
    native: `Array.prototype.${native}`,
    description,
    example: {
      lodash: `_.${lodashName}(array${paramSuffix})`,
      native: `array.${native}(${params})`,
    },
    ...options,
  })
}

// Static Array method helper
function createStaticArrayMethod(
  lodashName: string,
  native: string,
  description: string,
  params = 'value',
): NativeAlternative {
  return createAlternative({
    category: FunctionCategory.Array,
    native: `Array.${native}`,
    description,
    example: {
      lodash: `_.${lodashName}(${params})`,
      native: `Array.${native}(${params})`,
    },
  })
}

export const arrayAlternatives = new Map<string, NativeAlternative>([
  // Array Methods - Safe and Direct Replacements
  ['isArray', createStaticArrayMethod('isArray', 'isArray', 'Check if value is an array (reliable & performant)')],
  ['forEach', createArrayMethod('forEach', 'forEach', 'Iterate over array elements (native is faster)', 'fn', {
    related: ['map', 'filter'],
  })],
  ['map', createArrayMethod('map', 'map', 'Transform array elements using a callback function', 'fn', {
    migration: {
      steps: [
        'Replace _.map(array, fn) with array.map(fn)',
        'Ensure array is not null/undefined before calling',
      ],
    },
    related: ['filter', 'forEach'],
  })],
  ['filter', createArrayMethod('filter', 'filter', 'Filter array elements (native is faster)', 'predicate', {
    related: ['map', 'find'],
  })],
  ['find', createArrayMethod('find', 'find', 'Find first matching element', 'predicate', {
    related: ['filter', 'findIndex'],
  })],
  ['findIndex', createArrayMethod('findIndex', 'findIndex', 'Find index of first matching element', 'predicate', {
    related: ['find', 'indexOf'],
  })],
  ['includes', createArrayMethod('includes', 'includes', 'Check if array includes a value', 'value', {
    related: ['indexOf', 'find'],
  })],
  ['reduce', createArrayMethod('reduce', 'reduce', 'Reduce array to single value', 'fn, initial', {
    related: ['map', 'filter'],
  })],
  ['some', createArrayMethod('some', 'some', 'Test if some elements match predicate', 'predicate', {
    related: ['every', 'find'],
  })],
  ['every', createArrayMethod('every', 'every', 'Test if all elements match predicate', 'predicate', {
    related: ['some', 'filter'],
  })],
  ['slice', createArrayMethod('slice', 'slice', 'Extract section of array', 'start, end')],
  ['concat', createArrayMethod('concat', 'concat', 'Concatenate arrays', '...values')],
  ['join', createArrayMethod('join', 'join', 'Join array elements into string', 'separator')],

  // Array Methods - With Behavioral Differences
  ['reverse', createArrayMethod('reverse', 'reverse', 'Reverse array elements in place', '', {
    safety: {
      level: SafetyLevel.Caution,
      concerns: ['Mutates original array'],
      mitigation: 'Use [...array].reverse() or array.slice().reverse() for immutable version',
    },
    migration: {
      difficulty: MigrationDifficulty.Medium,
      challenges: ['Behavioral difference - mutable vs immutable'],
      steps: [
        'Decide if mutation is acceptable',
        'Use [...array].reverse() for immutable version',
        'Or use array.slice().reverse() for older browser support',
      ],
    },
    excludeByDefault: true,
    related: ['sort'],
  })],
])
