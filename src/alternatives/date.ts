/**
 * Native alternatives for Date functions
 */
import { FunctionCategory, createAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

export const dateAlternatives = new Map<string, NativeAlternative>([
  // Utility
  ['now', createAlternative({
    category: FunctionCategory.Date,
    native: 'Date.now',
    description: 'Get current timestamp',
    example: {
      lodash: '_.now()',
      native: 'Date.now()',
    },
  })],
])
