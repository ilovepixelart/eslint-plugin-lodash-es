/**
 * Native alternatives for Collection functions
 */
import { FunctionCategory, SafetyLevel, MigrationDifficulty, createAlternative, createPrototypeMethodAlternative, createExpressionAlternative, relatedFunctions } from '../shared'
import type { NativeAlternative } from '../shared'

export const collectionAlternatives = new Map<string, NativeAlternative>([
  // Collection Methods - Safe and Direct Replacements
  ['reject', createPrototypeMethodAlternative(
    FunctionCategory.Collection,
    'filter',
    'Filter out elements that match predicate (inverse of filter)',
    'item => !predicate(item)',
    {
      notes: ['Inverse of filter - use array.filter(item => !predicate(item))'],
      migration: {
        steps: [
          'Replace _.reject(array, predicate) with array.filter(item => !predicate(item))',
          'Ensure predicate logic is inverted correctly',
        ],
      },
      related: [...relatedFunctions.arrayIterators],
    },
  )],

  ['size', createExpressionAlternative(
    FunctionCategory.Collection,
    'size',
    'value.length',
    'Get collection size',
    {
      notes: [
        'Works for arrays and strings',
        'For objects use Object.keys(object).length',
        'Consider type checking for mixed usage',
      ],
    },
  )],

  ['each', createPrototypeMethodAlternative(
    FunctionCategory.Collection,
    'forEach',
    'Iterate over collection elements (alias for forEach)',
    'fn',
    {
      notes: ['Direct alias for forEach'],
      related: [...relatedFunctions.arrayIterators],
    },
  )],

  ['partition', {
    category: FunctionCategory.Collection,
    native: 'Array filtering',
    description: 'Split collection into two arrays based on predicate',
    example: {
      lodash: '_.partition(array, predicate)',
      native: '[array.filter(predicate), array.filter(item => !predicate(item))]',
    },
    safety: {
      level: SafetyLevel.Safe,
      concerns: [],
      mitigation: '',
    },
    notes: [
      'Split into [truthyItems, falsyItems]',
      'Requires two filter passes for native equivalent',
    ],
    migration: {
      difficulty: MigrationDifficulty.Easy,
      challenges: [],
      steps: [
        'Replace _.partition(array, predicate) with two filter calls',
        'Ensure predicate is consistent in both calls',
        'Consider performance impact of double iteration',
      ],
    },
  } as NativeAlternative],

  ['findLast', createPrototypeMethodAlternative(
    FunctionCategory.Collection,
    'findLast',
    'Find last element matching predicate',
    'predicate',
    {
      notes: [
        'Native findLast() available since ES2023',
        'For older environments: [...array].reverse().find(predicate)',
      ],
      related: [...relatedFunctions.arrayFinders],
    },
  )],

  // More Complex Cases
  ['isEmpty', createAlternative({
    category: FunctionCategory.Collection,
    native: 'Various approaches',
    description: 'Check if collection is empty',
    example: {
      lodash: '_.isEmpty(value)',
      native: '!value || Object.keys(value).length === 0',
    },
    safety: {
      level: SafetyLevel.Unsafe,
      concerns: [
        'No single native equivalent',
        'Different behavior for different types',
        'Type checking complexity',
      ],
      mitigation: 'Create utility function or use multiple checks based on expected types',
    },
    migration: {
      difficulty: MigrationDifficulty.Hard,
      challenges: [
        'No direct equivalent',
        'Type-specific logic needed',
        'Edge case handling',
      ],
      steps: [
        'Identify all usage patterns',
        'Create type-specific checks',
        'Consider creating utility function',
        'Test thoroughly with edge cases',
      ],
    },
    excludeByDefault: true,
    notes: [
      'lodash isEmpty handles many edge cases',
      'Consider if you really need such generic empty checking',
    ],
  })],
])
