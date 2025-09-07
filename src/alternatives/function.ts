/**
 * Native alternatives for Function/Type checking functions
 */
import { FunctionCategory, createExpressionAlternative, createStaticMethodAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

export const functionAlternatives = new Map<string, NativeAlternative>([
  // Type checking methods
  ['isNull', createExpressionAlternative(
    FunctionCategory.Function,
    'isNull',
    'value === null',
    'Check if value is null',
  )],

  ['isUndefined', createExpressionAlternative(
    FunctionCategory.Function,
    'isUndefined',
    'value === undefined',
    'Check if value is undefined',
  )],

  ['isNil', createExpressionAlternative(
    FunctionCategory.Function,
    'isNil',
    'value == null',
    'Check if value is null or undefined',
  )],

  ['isBoolean', createExpressionAlternative(
    FunctionCategory.Function,
    'isBoolean',
    'typeof value === "boolean"',
    'Check if value is boolean',
  )],

  ['isNumber', createExpressionAlternative(
    FunctionCategory.Function,
    'isNumber',
    'typeof value === "number"',
    'Check if value is number',
    { notes: ['Consider Number.isFinite() for finite numbers'] },
  )],

  ['isString', createExpressionAlternative(
    FunctionCategory.Function,
    'isString',
    'typeof value === "string"',
    'Check if value is string',
  )],

  ['isFunction', createExpressionAlternative(
    FunctionCategory.Function,
    'isFunction',
    'typeof value === "function"',
    'Check if value is function',
  )],

  ['isObject', createExpressionAlternative(
    FunctionCategory.Function,
    'isObject',
    'typeof value === "object" && value !== null',
    'Check if value is object',
    { notes: ['Lodash isObject also returns true for functions'] },
  )],

  // Conversion functions
  ['toNumber', createStaticMethodAlternative(
    FunctionCategory.Function,
    'toNumber',
    'Number',
    'Convert value to number',
    'value',
    { notes: ['Consider parseFloat() or parseInt() for strings'] },
  )],

  ['toString', createStaticMethodAlternative(
    FunctionCategory.Function,
    'toString',
    'String',
    'Convert value to string',
    'value',
    { notes: ['Consider .toString() method for objects'] },
  )],
])
