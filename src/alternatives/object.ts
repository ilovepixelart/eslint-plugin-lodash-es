/**
 * Native alternatives for Object functions
 */
import { FunctionCategory, createStaticMethodAlternative, safetyConfigs, migrationConfigs } from '../shared'
import type { NativeAlternative } from '../shared'

export const objectAlternatives = new Map<string, NativeAlternative>([
  // Object Methods - With Null Safety Issues
  ['keys', createStaticMethodAlternative(
    FunctionCategory.Object,
    'keys',
    'Object',
    'Get enumerable property names of object',
    'object',
    {
      safety: safetyConfigs.nullUndefinedThrows,
      migration: {
        ...migrationConfigs.nullSafetyHandling,
        steps: [
          'Check all usage sites for potential null/undefined values',
          'Add null checks: Object.keys(object || {})',
          'Consider using optional chaining where appropriate',
        ],
      },
      notes: ['Lodash version handles null/undefined gracefully'],
    },
  )],

  ['values', createStaticMethodAlternative(
    FunctionCategory.Object,
    'values',
    'Object',
    'Get object values as array',
    'object || {}',
    {
      safety: safetyConfigs.nullUndefinedThrows,
      migration: migrationConfigs.nullSafetyHandling,
    },
  )],

  ['entries', createStaticMethodAlternative(
    FunctionCategory.Object,
    'entries',
    'Object',
    'Get object key-value pairs as array',
    'object || {}',
    {
      safety: safetyConfigs.nullUndefinedThrows,
      migration: migrationConfigs.nullSafetyHandling,
    },
  )],

  ['assign', createStaticMethodAlternative(
    FunctionCategory.Object,
    'assign',
    'Object',
    'Copy properties to target object',
    'target, ...sources',
  )],

  // Object Property Checking
  ['has', {
    category: FunctionCategory.Object,
    native: 'key in object',
    description: 'Check if object has property',
    example: {
      lodash: '_.has(object, key)',
      native: 'key in object',
    },
    safety: safetyConfigs.nullUndefinedThrows,
    migration: migrationConfigs.nullSafetyHandling,
    notes: ['Use "in" operator or Object.prototype.hasOwnProperty.call()'],
  } as NativeAlternative],
])
