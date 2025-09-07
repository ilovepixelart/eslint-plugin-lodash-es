/**
 * Native alternatives for Number functions
 */
import { FunctionCategory, SafetyLevel, MigrationDifficulty } from '../shared'
import type { NativeAlternative } from '../shared'

export const numberAlternatives = new Map<string, NativeAlternative>([
  ['isFinite', {
    category: FunctionCategory.Number,
    native: 'Number.isFinite',
    description: 'Check if value is finite number',
    example: {
      lodash: '_.isFinite(value)',
      native: 'Number.isFinite(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isInteger', {
    category: FunctionCategory.Number,
    native: 'Number.isInteger',
    description: 'Check if value is integer',
    example: {
      lodash: '_.isInteger(value)',
      native: 'Number.isInteger(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isNaN', {
    category: FunctionCategory.Number,
    native: 'Number.isNaN',
    description: 'Check if value is NaN',
    example: {
      lodash: '_.isNaN(value)',
      native: 'Number.isNaN(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  // Math methods
  ['max', {
    category: FunctionCategory.Number,
    native: 'Math.max',
    description: 'Get maximum value',
    example: {
      lodash: '_.max(array)',
      native: 'Math.max(...array)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    notes: ['Use spread operator with native Math.max'],
  }],

  ['min', {
    category: FunctionCategory.Number,
    native: 'Math.min',
    description: 'Get minimum value',
    example: {
      lodash: '_.min(array)',
      native: 'Math.min(...array)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    notes: ['Use spread operator with native Math.min'],
  }],

  ['ceil', {
    category: FunctionCategory.Number,
    native: 'Math.ceil',
    description: 'Round up to nearest integer',
    example: {
      lodash: '_.ceil(number)',
      native: 'Math.ceil(number)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['floor', {
    category: FunctionCategory.Number,
    native: 'Math.floor',
    description: 'Round down to nearest integer',
    example: {
      lodash: '_.floor(number)',
      native: 'Math.floor(number)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['round', {
    category: FunctionCategory.Number,
    native: 'Math.round',
    description: 'Round to nearest integer',
    example: {
      lodash: '_.round(number)',
      native: 'Math.round(number)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],
])
