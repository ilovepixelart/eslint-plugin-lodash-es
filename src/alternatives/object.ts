/**
 * Native alternatives for Object functions
 */
import { FunctionCategory, SafetyLevel, MigrationDifficulty, createStaticMethodAlternative, createExpressionAlternative, safetyConfigs, migrationConfigs, relatedFunctions } from '../shared'
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

  // Quick Wins - High Impact Object Functions
  ['pick', createExpressionAlternative(
    FunctionCategory.Object,
    'pick',
    'Object.fromEntries(keys.map(k => [k, obj[k]]))',
    'Create object with only specified keys',
    {
      migration: migrationConfigs.easy,
      safety: safetyConfigs.safe,
      notes: ['Uses Object.fromEntries and array mapping', 'Includes undefined values for missing keys'],
      related: [...relatedFunctions.objectManipulation],
    },
  )],

  ['omit', createExpressionAlternative(
    FunctionCategory.Object,
    'omit',
    'Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))',
    'Create object without specified keys',
    {
      migration: migrationConfigs.easy,
      safety: safetyConfigs.safe,
      notes: ['Uses Object.entries, filter, and Object.fromEntries', 'Preserves all other properties'],
      related: [...relatedFunctions.objectManipulation],
    },
  )],

  // Object Utilities - Enterprise Critical Functions
  ['merge', createExpressionAlternative(
    FunctionCategory.Object,
    'merge',
    'Object.assign({}, target, ...sources)',
    'Merge multiple objects (shallow merge)',
    {
      migration: {
        difficulty: MigrationDifficulty.Medium,
        challenges: ['Lodash merge is deep, Object.assign is shallow'],
        steps: [
          'Replace with Object.assign for shallow merge',
          'For deep merge, use structured clone or recursive function',
          'Consider using spread operator: {...target, ...source}',
        ],
      },
      safety: {
        level: SafetyLevel.Caution,
        concerns: ['Behavior difference: shallow vs deep merge'],
        mitigation: 'Use Object.assign for shallow merge, implement custom deep merge if needed',
      },
      notes: [
        'Object.assign performs shallow merge only',
        'Lodash merge performs deep merge',
        'Consider {...target, ...source} for simple cases',
      ],
      related: [...relatedFunctions.objectManipulation],
    },
  )],

  ['get', createExpressionAlternative(
    FunctionCategory.Object,
    'get',
    'obj?.path?.to?.property',
    'Get nested object property safely',
    {
      migration: {
        difficulty: MigrationDifficulty.Medium,
        challenges: ['String path notation vs object property access'],
        steps: [
          'Convert string paths to optional chaining',
          'Replace get(obj, "a.b.c") with obj?.a?.b?.c',
          'Handle array notation: get(obj, "a[0].b") → obj?.a?.[0]?.b',
        ],
      },
      safety: safetyConfigs.safe,
      notes: [
        'Optional chaining provides null safety',
        'Works with nested objects and arrays',
        'ES2020+ feature with excellent browser support',
      ],
      related: [...relatedFunctions.objectManipulation],
    },
  )],

  ['clone', createExpressionAlternative(
    FunctionCategory.Object,
    'clone',
    '{...obj}',
    'Shallow clone object using spread syntax',
    {
      migration: migrationConfigs.easy,
      safety: {
        level: SafetyLevel.Caution,
        concerns: ['Lodash clone is shallow, same as spread operator'],
        mitigation: 'Use structuredClone() for deep cloning if needed',
      },
      notes: [
        'Spread operator performs shallow clone',
        'For deep cloning, use structuredClone() (modern) or JSON.parse(JSON.stringify())',
        'Spread syntax is the most concise and performant for shallow cloning',
      ],
      related: [...relatedFunctions.objectManipulation],
    },
  )],

  ['cloneDeep', createExpressionAlternative(
    FunctionCategory.Object,
    'cloneDeep',
    'structuredClone(obj)',
    'Deep clone object using structured clone algorithm',
    {
      migration: {
        difficulty: MigrationDifficulty.Medium,
        challenges: ['Browser support considerations for structuredClone'],
        steps: [
          'Replace with structuredClone() for modern environments',
          'Use JSON.parse(JSON.stringify()) for legacy support',
          'Consider custom deep clone function for complex objects',
        ],
      },
      safety: {
        level: SafetyLevel.Caution,
        concerns: ['structuredClone() has limited browser support'],
        mitigation: 'Check browser compatibility or use polyfill',
      },
      notes: [
        'structuredClone() is the modern standard for deep cloning',
        'Supports complex objects including Date, RegExp, etc.',
        'For legacy browsers, use JSON.parse(JSON.stringify()) with limitations',
      ],
      related: [...relatedFunctions.objectManipulation],
    },
  )],
])
