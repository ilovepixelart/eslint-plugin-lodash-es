/**
 * Native alternatives for Number functions
 */
import { FunctionCategory, createAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

// Number/Math method helper
function createMathMethod(
  lodashName: string,
  native: string,
  description: string,
  params = 'number',
  notes?: readonly string[],
): NativeAlternative {
  return createAlternative({
    category: FunctionCategory.Number,
    native: `Math.${native}`,
    description,
    example: {
      lodash: `_.${lodashName}(${params})`,
      native: `Math.${native}(${params})`,
    },
    ...(notes && { notes }),
  })
}

// Number static method helper
function createNumberMethod(
  lodashName: string,
  native: string,
  description: string,
  params = 'value',
): NativeAlternative {
  return createAlternative({
    category: FunctionCategory.Number,
    native: `Number.${native}`,
    description,
    example: {
      lodash: `_.${lodashName}(${params})`,
      native: `Number.${native}(${params})`,
    },
  })
}

export const numberAlternatives = new Map<string, NativeAlternative>([
  ['isFinite', createNumberMethod('isFinite', 'isFinite', 'Check if value is finite number')],
  ['isInteger', createNumberMethod('isInteger', 'isInteger', 'Check if value is integer')],
  ['isNaN', createNumberMethod('isNaN', 'isNaN', 'Check if value is NaN')],

  // Math methods
  ['max', createMathMethod('max', 'max', 'Get maximum value', '...array', ['Use spread operator with native Math.max'])],
  ['min', createMathMethod('min', 'min', 'Get minimum value', '...array', ['Use spread operator with native Math.min'])],
  ['ceil', createMathMethod('ceil', 'ceil', 'Round up to nearest integer')],
  ['floor', createMathMethod('floor', 'floor', 'Round down to nearest integer')],
  ['round', createMathMethod('round', 'round', 'Round to nearest integer')],
])
