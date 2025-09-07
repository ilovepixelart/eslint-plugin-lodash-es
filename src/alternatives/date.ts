/**
 * Native alternatives for Date functions
 */
import { FunctionCategory, SafetyLevel, MigrationDifficulty } from '../shared'
import type { NativeAlternative } from '../shared'

export const dateAlternatives = new Map<string, NativeAlternative>([
  // Utility
  ['now', {
    category: FunctionCategory.Date,
    native: 'Date.now',
    description: 'Get current timestamp',
    example: {
      lodash: '_.now()',
      native: 'Date.now()',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],
])
