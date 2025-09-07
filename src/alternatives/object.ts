/**
 * Native alternatives for Object functions
 */
import { FunctionCategory, SafetyLevel, MigrationDifficulty, createAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

export const objectAlternatives = new Map<string, NativeAlternative>([
  // Object Methods - With Null Safety Issues
  ['keys', createAlternative({
    category: FunctionCategory.Object,
    native: 'Object.keys',
    description: 'Get enumerable property names of object',
    example: {
      lodash: '_.keys(object)',
      native: 'Object.keys(object)',
    },
    safety: {
      level: SafetyLevel.Caution,
      concerns: ['Throws on null/undefined input'],
      mitigation: 'Use Object.keys(object || {}) for null safety',
    },
    migration: {
      difficulty: MigrationDifficulty.Medium,
      challenges: ['Null safety handling'],
      steps: [
        'Check all usage sites for potential null/undefined values',
        'Add null checks: Object.keys(object || {})',
        'Consider using optional chaining where appropriate',
      ],
    },
    notes: ['Lodash version handles null/undefined gracefully'],
  })],

  ['values', createAlternative({
    category: FunctionCategory.Object,
    native: 'Object.values',
    description: 'Get object values as array',
    example: {
      lodash: '_.values(object)',
      native: 'Object.values(object || {})',
    },
    safety: {
      level: SafetyLevel.Caution,
      concerns: ['Throws on null/undefined input'],
      mitigation: 'Use Object.values(object || {}) for null safety',
    },
    migration: {
      difficulty: MigrationDifficulty.Medium,
      challenges: ['Null safety handling'],
      steps: [
        'Add null checks: Object.values(object || {})',
        'Test with null/undefined values',
      ],
    },
  })],

  ['entries', createAlternative({
    category: FunctionCategory.Object,
    native: 'Object.entries',
    description: 'Get object key-value pairs as array',
    example: {
      lodash: '_.entries(object)',
      native: 'Object.entries(object || {})',
    },
    safety: {
      level: SafetyLevel.Caution,
      concerns: ['Throws on null/undefined input'],
      mitigation: 'Use Object.entries(object || {}) for null safety',
    },
    migration: {
      difficulty: MigrationDifficulty.Medium,
      challenges: ['Null safety handling'],
      steps: [
        'Add null checks: Object.entries(object || {})',
        'Test with null/undefined values',
      ],
    },
  })],

  ['assign', createAlternative({
    category: FunctionCategory.Object,
    native: 'Object.assign',
    description: 'Copy properties to target object',
    example: {
      lodash: '_.assign(target, ...sources)',
      native: 'Object.assign(target, ...sources)',
    },
  })],
])
