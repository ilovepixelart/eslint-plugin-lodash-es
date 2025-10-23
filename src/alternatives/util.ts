/**
 * Native alternatives for Util functions
 */
import { FunctionCategory, createExpressionAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

export const utilAlternatives = new Map<string, NativeAlternative>([
  // Stub functions - return constant values
  ['stubArray', createExpressionAlternative(
    FunctionCategory.Util,
    'stubArray',
    '[]',
    'Return empty array',
  )],

  ['stubFalse', createExpressionAlternative(
    FunctionCategory.Util,
    'stubFalse',
    'false',
    'Return false',
  )],

  ['stubTrue', createExpressionAlternative(
    FunctionCategory.Util,
    'stubTrue',
    'true',
    'Return true',
  )],

  ['stubObject', createExpressionAlternative(
    FunctionCategory.Util,
    'stubObject',
    '{}',
    'Return empty object',
  )],

  ['stubString', createExpressionAlternative(
    FunctionCategory.Util,
    'stubString',
    '\'\'',
    'Return empty string',
  )],

  // Utility helper functions
  ['noop', createExpressionAlternative(
    FunctionCategory.Util,
    'noop',
    'undefined',
    'No operation - returns undefined',
  )],

  ['identity', createExpressionAlternative(
    FunctionCategory.Util,
    'identity',
    'value',
    'Return the first argument unchanged',
  )],

  // Function generators
  ['constant', createExpressionAlternative(
    FunctionCategory.Util,
    'constant',
    '() => value',
    'Create function that returns constant value',
  )],

  // Array generation
  ['times', createExpressionAlternative(
    FunctionCategory.Util,
    'times',
    'Array.from({length: n}, (_, i) => fn(i))',
    'Invoke function n times',
  )],

  ['range', createExpressionAlternative(
    FunctionCategory.Util,
    'range',
    'Array.from({length: end - start}, (_, i) => start + i)',
    'Create array of numbers from start to end',
  )],

  ['rangeRight', createExpressionAlternative(
    FunctionCategory.Util,
    'rangeRight',
    'Array.from({length: end - start}, (_, i) => end - i - 1)',
    'Create array of numbers from end to start',
  )],
])