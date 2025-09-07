/**
 * Native alternatives for Function/Type checking functions
 */
import { FunctionCategory, SafetyLevel, MigrationDifficulty, createAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

export const functionAlternatives = new Map<string, NativeAlternative>([
  // Type checking methods
  ['isNull', createAlternative({
    category: FunctionCategory.Function,
    native: 'value === null',
    description: 'Check if value is null',
    example: {
      lodash: '_.isNull(value)',
      native: 'value === null',
    },
  })],

  ['isUndefined', createAlternative({
    category: FunctionCategory.Function,
    native: 'value === undefined',
    description: 'Check if value is undefined',
    example: {
      lodash: '_.isUndefined(value)',
      native: 'value === undefined',
    },
  })],

  ['isNil', createAlternative({
    category: FunctionCategory.Function,
    native: 'value == null',
    description: 'Check if value is null or undefined',
    example: {
      lodash: '_.isNil(value)',
      native: 'value == null',
    },
  })],

  ['isBoolean', createAlternative({
    category: FunctionCategory.Function,
    native: 'typeof value === "boolean"',
    description: 'Check if value is boolean',
    example: {
      lodash: '_.isBoolean(value)',
      native: 'typeof value === "boolean"',
    },
  })],

  ['isNumber', createAlternative({
    category: FunctionCategory.Function,
    native: 'typeof value === "number"',
    description: 'Check if value is number',
    example: {
      lodash: '_.isNumber(value)',
      native: 'typeof value === "number"',
    },
    notes: ['Consider Number.isFinite() for finite numbers'],
  })],

  ['isString', createAlternative({
    category: FunctionCategory.Function,
    native: 'typeof value === "string"',
    description: 'Check if value is string',
    example: {
      lodash: '_.isString(value)',
      native: 'typeof value === "string"',
    },
  })],

  ['isFunction', createAlternative({
    category: FunctionCategory.Function,
    native: 'typeof value === "function"',
    description: 'Check if value is function',
    example: {
      lodash: '_.isFunction(value)',
      native: 'typeof value === "function"',
    },
  })],

  ['isObject', createAlternative({
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
  })],

  ['toNumber', createAlternative({
    category: FunctionCategory.Function,
    native: 'Number',
    description: 'Convert value to number',
    example: {
      lodash: '_.toNumber(value)',
      native: 'Number(value)',
    },
    notes: ['Consider parseFloat() or parseInt() for strings'],
  })],

  ['toString', createAlternative({
    category: FunctionCategory.Function,
    native: 'String',
    description: 'Convert value to string',
    example: {
      lodash: '_.toString(value)',
      native: 'String(value)',
    },
    notes: ['Consider .toString() method for objects'],
  })],
])
