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

  // Collection Processing - ES2024+ Modern Native Features
  ['groupBy', createExpressionAlternative(
    FunctionCategory.Collection,
    'groupBy',
    'Object.groupBy(array, item => item.key)',
    'Group array elements by key using ES2024 Object.groupBy',
    {
      migration: {
        difficulty: MigrationDifficulty.Medium,
        challenges: ['ES2024 feature with limited browser support'],
        steps: [
          'Check browser compatibility for Object.groupBy',
          'Replace with Object.groupBy(array, keyFn)',
          'Add polyfill if needed for older environments',
          'Convert string paths to function calls: "prop" → item => item.prop',
        ],
      },
      safety: {
        level: SafetyLevel.Caution,
        concerns: ['Limited browser support for Object.groupBy'],
        mitigation: 'Use polyfill or fallback to reduce implementation',
      },
      notes: [
        'Object.groupBy() is the modern ES2024 standard',
        'Superior performance to reduce-based implementations',
        'For legacy browsers, use array.reduce() fallback',
        'Handles property paths and complex grouping logic',
      ],
      related: [...relatedFunctions.arrayReducers],
    },
  )],

  ['countBy', createExpressionAlternative(
    FunctionCategory.Collection,
    'countBy',
    'array.reduce((acc, item) => { const key = fn(item); acc[key] = (acc[key] || 0) + 1; return acc; }, {})',
    'Count elements by key using reduce',
    {
      migration: {
        difficulty: MigrationDifficulty.Medium,
        challenges: ['More verbose than lodash version'],
        steps: [
          'Convert to reduce-based counting pattern',
          'Handle string paths by converting to function calls',
          'Ensure proper initialization of count values',
        ],
      },
      safety: {
        level: SafetyLevel.Safe,
        concerns: [],
        mitigation: 'Direct replacement with reduce pattern',
      },
      notes: [
        'Native reduce() provides full control over counting logic',
        'More performant than multiple filter operations',
        'Handles complex counting scenarios',
      ],
      related: [...relatedFunctions.arrayReducers],
    },
  )],

  ['keyBy', createExpressionAlternative(
    FunctionCategory.Collection,
    'keyBy',
    'Object.fromEntries(value.map(item => [iteratee(item), item]))',
    'Create object keyed by function result',
    {
      migration: {
        difficulty: MigrationDifficulty.Easy,
        challenges: ['Slightly more verbose syntax'],
        steps: [
          'Replace with Object.fromEntries and map pattern',
          'Convert string paths to function calls',
          'Handle duplicate keys (last value wins)',
        ],
      },
      safety: {
        level: SafetyLevel.Safe,
        concerns: [],
        mitigation: 'Direct replacement with established pattern',
      },
      notes: [
        'Uses Object.fromEntries for clean object creation',
        'Duplicate keys overwrite previous values',
        'Works with complex key extraction functions',
      ],
      related: [...relatedFunctions.arrayReducers, ...relatedFunctions.objectManipulation],
    },
  )],

  ['chunk', createExpressionAlternative(
    FunctionCategory.Collection,
    'chunk',
    'Array.from({length: Math.ceil(array.length / size)}, (_, i) => array.slice(i * size, (i + 1) * size))',
    'Split array into chunks of specified size',
    {
      migration: {
        difficulty: MigrationDifficulty.Medium,
        challenges: ['Complex expression for simple concept'],
        steps: [
          'Replace with Array.from and slice pattern',
          'Handle edge cases with empty arrays',
          'Consider creating utility function for readability',
        ],
      },
      safety: {
        level: SafetyLevel.Safe,
        concerns: [],
        mitigation: 'Well-tested pattern for array chunking',
      },
      notes: [
        'Uses Array.from for efficient chunk generation',
        'Handles any array length and chunk size',
        'Last chunk may be smaller than specified size',
      ],
      related: [...relatedFunctions.arrayIterators],
    },
  )],

  ['orderBy', createExpressionAlternative(
    FunctionCategory.Collection,
    'orderBy',
    'value.toSorted((a, b) => iteratee(a) - iteratee(b))',
    'Sort array by iteratee function',
    {
      migration: {
        difficulty: MigrationDifficulty.Hard,
        challenges: ['Complex multi-field sorting logic', 'Direction handling'],
        steps: [
          'Convert to toSorted with multi-field comparison',
          'Handle string paths by converting to function calls',
          'Implement direction array handling for asc/desc',
          'Consider creating utility function for complex cases',
        ],
      },
      safety: {
        level: SafetyLevel.Safe,
        concerns: [],
        mitigation: 'Well-established sorting pattern with stable results',
      },
      notes: [
        'Uses toSorted() for non-mutating sort',
        'Supports multiple sort keys with cascading comparison',
        'For simple cases, consider array.toSorted((a, b) => fn(a) - fn(b))',
        'Direction arrays require additional logic implementation',
      ],
      related: [...relatedFunctions.arrayIterators],
    },
  )],
])
