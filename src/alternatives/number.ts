/**
 * Native alternatives for Number functions
 */
import { FunctionCategory, createAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

export const numberAlternatives = new Map<string, NativeAlternative>([
  ['isFinite', createAlternative({
    category: FunctionCategory.Number,
    native: 'Number.isFinite',
    description: 'Check if value is finite number',
    example: {
      lodash: '_.isFinite(value)',
      native: 'Number.isFinite(value)',
    },
  })],

  ['isInteger', createAlternative({
    category: FunctionCategory.Number,
    native: 'Number.isInteger',
    description: 'Check if value is integer',
    example: {
      lodash: '_.isInteger(value)',
      native: 'Number.isInteger(value)',
    },
  })],

  ['isNaN', createAlternative({
    category: FunctionCategory.Number,
    native: 'Number.isNaN',
    description: 'Check if value is NaN',
    example: {
      lodash: '_.isNaN(value)',
      native: 'Number.isNaN(value)',
    },
  })],

  // Math methods
  ['max', createAlternative({
    category: FunctionCategory.Number,
    native: 'Math.max',
    description: 'Get maximum value',
    example: {
      lodash: '_.max(array)',
      native: 'Math.max(...array)',
    },
    notes: ['Use spread operator with native Math.max'],
  })],

  ['min', createAlternative({
    category: FunctionCategory.Number,
    native: 'Math.min',
    description: 'Get minimum value',
    example: {
      lodash: '_.min(array)',
      native: 'Math.min(...array)',
    },
    notes: ['Use spread operator with native Math.min'],
  })],

  ['ceil', createAlternative({
    category: FunctionCategory.Number,
    native: 'Math.ceil',
    description: 'Round up to nearest integer',
    example: {
      lodash: '_.ceil(number)',
      native: 'Math.ceil(number)',
    },
  })],

  ['floor', createAlternative({
    category: FunctionCategory.Number,
    native: 'Math.floor',
    description: 'Round down to nearest integer',
    example: {
      lodash: '_.floor(number)',
      native: 'Math.floor(number)',
    },
  })],

  ['round', createAlternative({
    category: FunctionCategory.Number,
    native: 'Math.round',
    description: 'Round to nearest integer',
    example: {
      lodash: '_.round(number)',
      native: 'Math.round(number)',
    },
  })],
])
