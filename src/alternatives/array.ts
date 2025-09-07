/**
 * Native alternatives for Array functions
 */
import { FunctionCategory, SafetyLevel, MigrationDifficulty } from '../shared'
import type { NativeAlternative } from '../shared'

export const arrayAlternatives = new Map<string, NativeAlternative>([
  // Array Methods - Safe and Direct Replacements
  ['isArray', {
    category: FunctionCategory.Array,
    native: 'Array.isArray',
    description: 'Check if value is an array (reliable & performant)',
    example: {
      lodash: '_.isArray(value)',
      native: 'Array.isArray(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['forEach', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.forEach',
    description: 'Iterate over array elements (native is faster)',
    example: {
      lodash: '_.forEach(array, fn)',
      native: 'array.forEach(fn)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['map', 'filter'],
  }],

  ['map', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.map',
    description: 'Transform array elements using a callback function',
    example: {
      lodash: '_.map(array, fn)',
      native: 'array.map(fn)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
      steps: [
        'Replace _.map(array, fn) with array.map(fn)',
        'Ensure array is not null/undefined before calling',
      ],
    },
    related: ['filter', 'forEach'],
  }],

  ['filter', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.filter',
    description: 'Filter array elements (native is faster)',
    example: {
      lodash: '_.filter(array, predicate)',
      native: 'array.filter(predicate)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['map', 'find'],
  }],

  ['find', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.find',
    description: 'Find first matching element',
    example: {
      lodash: '_.find(array, predicate)',
      native: 'array.find(predicate)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['filter', 'findIndex'],
  }],

  ['findIndex', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.findIndex',
    description: 'Find index of first matching element',
    example: {
      lodash: '_.findIndex(array, predicate)',
      native: 'array.findIndex(predicate)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['find', 'indexOf'],
  }],

  ['includes', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.includes',
    description: 'Check if array includes a value',
    example: {
      lodash: '_.includes(array, value)',
      native: 'array.includes(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['indexOf', 'find'],
  }],

  ['reduce', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.reduce',
    description: 'Reduce array to single value',
    example: {
      lodash: '_.reduce(array, fn, initial)',
      native: 'array.reduce(fn, initial)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['map', 'filter'],
  }],

  ['some', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.some',
    description: 'Test if some elements match predicate',
    example: {
      lodash: '_.some(array, predicate)',
      native: 'array.some(predicate)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['every', 'find'],
  }],

  ['every', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.every',
    description: 'Test if all elements match predicate',
    example: {
      lodash: '_.every(array, predicate)',
      native: 'array.every(predicate)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['some', 'filter'],
  }],

  ['slice', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.slice',
    description: 'Extract section of array',
    example: {
      lodash: '_.slice(array, start, end)',
      native: 'array.slice(start, end)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['concat', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.concat',
    description: 'Concatenate arrays',
    example: {
      lodash: '_.concat(array, ...values)',
      native: 'array.concat(...values)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['join', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.join',
    description: 'Join array elements into string',
    example: {
      lodash: '_.join(array, separator)',
      native: 'array.join(separator)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  // Array Methods - With Behavioral Differences
  ['reverse', {
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
  }],
])
