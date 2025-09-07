/**
 * Native alternatives for Object functions
 */
import { FunctionCategory, SafetyLevel, MigrationDifficulty, createAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

// Object method helper
function createObjectMethod(
  lodashName: string,
  native: string,
  description: string,
  params = 'object',
  safetyOptions?: {
    level?: SafetyLevel
    concerns?: readonly string[]
    mitigation?: string
  },
  migrationOptions?: {
    difficulty?: MigrationDifficulty
    challenges?: readonly string[]
    steps?: readonly string[]
  },
  notes?: readonly string[],
): NativeAlternative {
  return createAlternative({
    category: FunctionCategory.Object,
    native: `Object.${native}`,
    description,
    example: {
      lodash: `_.${lodashName}(${params})`,
      native: `Object.${native}(${params})`,
    },
    ...(safetyOptions && { safety: safetyOptions }),
    ...(migrationOptions && { migration: migrationOptions }),
    ...(notes && { notes }),
  })
}

export const objectAlternatives = new Map<string, NativeAlternative>([
  // Object Methods - With Null Safety Issues
  ['keys', createObjectMethod('keys', 'keys', 'Get enumerable property names of object', 'object', {
    level: SafetyLevel.Caution,
    concerns: ['Throws on null/undefined input'],
    mitigation: 'Use Object.keys(object || {}) for null safety',
  }, {
    difficulty: MigrationDifficulty.Medium,
    challenges: ['Null safety handling'],
    steps: [
      'Check all usage sites for potential null/undefined values',
      'Add null checks: Object.keys(object || {})',
      'Consider using optional chaining where appropriate',
    ],
  }, ['Lodash version handles null/undefined gracefully'])],

  ['values', createObjectMethod('values', 'values', 'Get object values as array', 'object || {}', {
    level: SafetyLevel.Caution,
    concerns: ['Throws on null/undefined input'],
    mitigation: 'Use Object.values(object || {}) for null safety',
  }, {
    difficulty: MigrationDifficulty.Medium,
    challenges: ['Null safety handling'],
    steps: [
      'Add null checks: Object.values(object || {})',
      'Test with null/undefined values',
    ],
  })],

  ['entries', createObjectMethod('entries', 'entries', 'Get object key-value pairs as array', 'object || {}', {
    level: SafetyLevel.Caution,
    concerns: ['Throws on null/undefined input'],
    mitigation: 'Use Object.entries(object || {}) for null safety',
  }, {
    difficulty: MigrationDifficulty.Medium,
    challenges: ['Null safety handling'],
    steps: [
      'Add null checks: Object.entries(object || {})',
      'Test with null/undefined values',
    ],
  })],

  ['assign', createObjectMethod('assign', 'assign', 'Copy properties to target object', 'target, ...sources')],
])
