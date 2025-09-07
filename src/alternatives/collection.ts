/**
 * Native alternatives for Collection functions
 */
import { FunctionCategory, SafetyLevel, MigrationDifficulty, createAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

export const collectionAlternatives = new Map<string, NativeAlternative>([
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
