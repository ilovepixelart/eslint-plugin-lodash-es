/**
 * Native alternatives for Util functions
 */
import { FunctionCategory, createExpressionAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

const createUtilAlternative = (
  name: string,
  expression: string,
  description: string,
): [string, NativeAlternative] => [
  name,
  createExpressionAlternative(FunctionCategory.Util, name, expression, description),
]

export const utilAlternatives = new Map<string, NativeAlternative>([
  // Stub functions - return constant values
  createUtilAlternative('stubArray', '[]', 'Return empty array'),
  createUtilAlternative('stubFalse', 'false', 'Return false'),
  createUtilAlternative('stubTrue', 'true', 'Return true'),
  createUtilAlternative('stubObject', '{}', 'Return empty object'),
  createUtilAlternative('stubString', '\'\'', 'Return empty string'),

  // Utility helper functions
  createUtilAlternative('noop', 'undefined', 'No operation - returns undefined'),
  createUtilAlternative('identity', 'value', 'Return the first argument unchanged'),

  // Function generators
  createUtilAlternative('constant', '() => value', 'Create function that returns constant value'),

  // Array generation
  createUtilAlternative('times', 'Array.from({length: n}, (_, i) => fn(i))', 'Invoke function n times'),
  createUtilAlternative('range', 'Array.from({length: end - start}, (_, i) => start + i)', 'Create array of numbers from start to end'),
  createUtilAlternative('rangeRight', 'Array.from({length: end - start}, (_, i) => end - i - 1)', 'Create array of numbers from end to start'),
])
