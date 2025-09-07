/**
 * Native alternatives for Function/Type checking functions
 */
import { FunctionCategory, SafetyLevel, MigrationDifficulty } from '../shared'
import type { NativeAlternative } from '../shared'

export const functionAlternatives = new Map<string, NativeAlternative>([
  // Type checking methods
  ['isNull', {
    category: FunctionCategory.Function,
    native: 'value === null',
    description: 'Check if value is null',
    example: {
      lodash: '_.isNull(value)',
      native: 'value === null',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isUndefined', {
    category: FunctionCategory.Function,
    native: 'value === undefined',
    description: 'Check if value is undefined',
    example: {
      lodash: '_.isUndefined(value)',
      native: 'value === undefined',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isNil', {
    category: FunctionCategory.Function,
    native: 'value == null',
    description: 'Check if value is null or undefined',
    example: {
      lodash: '_.isNil(value)',
      native: 'value == null',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isBoolean', {
    category: FunctionCategory.Function,
    native: 'typeof value === "boolean"',
    description: 'Check if value is boolean',
    example: {
      lodash: '_.isBoolean(value)',
      native: 'typeof value === "boolean"',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isNumber', {
    category: FunctionCategory.Function,
    native: 'typeof value === "number"',
    description: 'Check if value is number',
    example: {
      lodash: '_.isNumber(value)',
      native: 'typeof value === "number"',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    notes: ['Consider Number.isFinite() for finite numbers'],
  }],

  ['isString', {
    category: FunctionCategory.Function,
    native: 'typeof value === "string"',
    description: 'Check if value is string',
    example: {
      lodash: '_.isString(value)',
      native: 'typeof value === "string"',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isFunction', {
    category: FunctionCategory.Function,
    native: 'typeof value === "function"',
    description: 'Check if value is function',
    example: {
      lodash: '_.isFunction(value)',
      native: 'typeof value === "function"',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isObject', {
    category: FunctionCategory.Function,
    native: 'typeof value === "object" && value !== null',
    description: 'Check if value is object',
    example: {
      lodash: '_.isObject(value)',
      native: 'typeof value === "object" && value !== null',
    },
    safety: {
      level: SafetyLevel.Caution,
      concerns: ['Different behavior - lodash includes functions'],
      mitigation: 'Use (typeof value === "object" && value !== null) || typeof value === "function" for exact lodash behavior',
    },
    migration: {
      difficulty: MigrationDifficulty.Medium,
      challenges: ['Behavioral difference with functions'],
    },
    notes: ['Lodash isObject also returns true for functions'],
  }],

  ['toNumber', {
    category: FunctionCategory.Function,
    native: 'Number',
    description: 'Convert value to number',
    example: {
      lodash: '_.toNumber(value)',
      native: 'Number(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    notes: ['Consider parseFloat() or parseInt() for strings'],
  }],

  ['toString', {
    category: FunctionCategory.Function,
    native: 'String',
    description: 'Convert value to string',
    example: {
      lodash: '_.toString(value)',
      native: 'String(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    notes: ['Consider .toString() method for objects'],
  }],
])
