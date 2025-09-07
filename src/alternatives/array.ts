/**
 * Native alternatives for Array functions
 */
import { FunctionCategory, SafetyLevel, MigrationDifficulty, createAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

export const arrayAlternatives = new Map<string, NativeAlternative>([
  // Array Methods - Safe and Direct Replacements
  ['isArray', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.isArray',
    description: 'Check if value is an array (reliable & performant)',
    example: {
      lodash: '_.isArray(value)',
      native: 'Array.isArray(value)',
    },
  })],

  ['forEach', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.prototype.forEach',
    description: 'Iterate over array elements (native is faster)',
    example: {
      lodash: '_.forEach(array, fn)',
      native: 'array.forEach(fn)',
    },
    related: ['map', 'filter'],
  })],

  ['map', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.prototype.map',
    description: 'Transform array elements using a callback function',
    example: {
      lodash: '_.map(array, fn)',
      native: 'array.map(fn)',
    },
    migration: {
      steps: [
        'Replace _.map(array, fn) with array.map(fn)',
        'Ensure array is not null/undefined before calling',
      ],
    },
    related: ['filter', 'forEach'],
  })],

  ['filter', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.prototype.filter',
    description: 'Filter array elements (native is faster)',
    example: {
      lodash: '_.filter(array, predicate)',
      native: 'array.filter(predicate)',
    },
    related: ['map', 'find'],
  })],

  ['find', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.prototype.find',
    description: 'Find first matching element',
    example: {
      lodash: '_.find(array, predicate)',
      native: 'array.find(predicate)',
    },
    related: ['filter', 'findIndex'],
  })],

  ['findIndex', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.prototype.findIndex',
    description: 'Find index of first matching element',
    example: {
      lodash: '_.findIndex(array, predicate)',
      native: 'array.findIndex(predicate)',
    },
    related: ['find', 'indexOf'],
  })],

  ['includes', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.prototype.includes',
    description: 'Check if array includes a value',
    example: {
      lodash: '_.includes(array, value)',
      native: 'array.includes(value)',
    },
    related: ['indexOf', 'find'],
  })],

  ['reduce', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.prototype.reduce',
    description: 'Reduce array to single value',
    example: {
      lodash: '_.reduce(array, fn, initial)',
      native: 'array.reduce(fn, initial)',
    },
    related: ['map', 'filter'],
  })],

  ['some', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.prototype.some',
    description: 'Test if some elements match predicate',
    example: {
      lodash: '_.some(array, predicate)',
      native: 'array.some(predicate)',
    },
    related: ['every', 'find'],
  })],

  ['every', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.prototype.every',
    description: 'Test if all elements match predicate',
    example: {
      lodash: '_.every(array, predicate)',
      native: 'array.every(predicate)',
    },
    related: ['some', 'filter'],
  })],

  ['slice', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.prototype.slice',
    description: 'Extract section of array',
    example: {
      lodash: '_.slice(array, start, end)',
      native: 'array.slice(start, end)',
    },
  })],

  ['concat', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.prototype.concat',
    description: 'Concatenate arrays',
    example: {
      lodash: '_.concat(array, ...values)',
      native: 'array.concat(...values)',
    },
  })],

  ['join', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.prototype.join',
    description: 'Join array elements into string',
    example: {
      lodash: '_.join(array, separator)',
      native: 'array.join(separator)',
    },
  })],

  // Array Methods - With Behavioral Differences
  ['reverse', createAlternative({
    category: FunctionCategory.Array,
    native: 'Array.prototype.reverse',
    description: 'Reverse array elements in place',
    example: {
      lodash: '_.reverse(array)',
      native: 'array.reverse()',
    },
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
