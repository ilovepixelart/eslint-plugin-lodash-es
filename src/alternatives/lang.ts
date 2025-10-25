/**
 * Native alternatives for Lang/Type checking functions
 */
import { FunctionCategory, createExpressionAlternative, createStaticMethodAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

export const langAlternatives = new Map<string, NativeAlternative>([
  // Comparison operators
  ['eq', createStaticMethodAlternative(
    FunctionCategory.Function,
    'is',
    'Object',
    'Check if two values are the same',
    'value, other',
  )],

  ['gt', createExpressionAlternative(
    FunctionCategory.Function,
    'gt',
    'value > other',
    'Check if value is greater than other',
  )],

  ['gte', createExpressionAlternative(
    FunctionCategory.Function,
    'gte',
    'value >= other',
    'Check if value is greater than or equal to other',
  )],

  ['lt', createExpressionAlternative(
    FunctionCategory.Function,
    'lt',
    'value < other',
    'Check if value is less than other',
  )],

  ['lte', createExpressionAlternative(
    FunctionCategory.Function,
    'lte',
    'value <= other',
    'Check if value is less than or equal to other',
  )],

  // Type checking with instanceof
  ['isDate', createExpressionAlternative(
    FunctionCategory.Function,
    'isDate',
    'value instanceof Date',
    'Check if value is a Date object',
  )],

  ['isRegExp', createExpressionAlternative(
    FunctionCategory.Function,
    'isRegExp',
    'value instanceof RegExp',
    'Check if value is a RegExp object',
  )],

  ['isError', createExpressionAlternative(
    FunctionCategory.Function,
    'isError',
    'value instanceof Error',
    'Check if value is an Error object',
  )],

  ['isSet', createExpressionAlternative(
    FunctionCategory.Function,
    'isSet',
    'value instanceof Set',
    'Check if value is a Set object',
  )],

  ['isWeakMap', createExpressionAlternative(
    FunctionCategory.Function,
    'isWeakMap',
    'value instanceof WeakMap',
    'Check if value is a WeakMap object',
  )],

  ['isWeakSet', createExpressionAlternative(
    FunctionCategory.Function,
    'isWeakSet',
    'value instanceof WeakSet',
    'Check if value is a WeakSet object',
  )],

  // Type checking with typeof
  ['isSymbol', createExpressionAlternative(
    FunctionCategory.Function,
    'isSymbol',
    'typeof value === \'symbol\'',
    'Check if value is a Symbol',
  )],

  // Type checking with Number static methods
  ['isSafeInteger', createStaticMethodAlternative(
    FunctionCategory.Number,
    'isSafeInteger',
    'Number',
    'Check if value is a safe integer',
    'value',
  )],

  // Array-like validation
  ['isLength', createExpressionAlternative(
    FunctionCategory.Function,
    'isLength',
    'Number.isInteger(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER',
    'Check if value is valid array-like length',
  )],

  ['isArrayLike', createExpressionAlternative(
    FunctionCategory.Function,
    'isArrayLike',
    'value != null && typeof value.length === \'number\' && value.length >= 0 && value.length <= Number.MAX_SAFE_INTEGER',
    'Check if value is array-like',
  )],

  // Type conversion functions
  ['castArray', createExpressionAlternative(
    FunctionCategory.Array,
    'castArray',
    'Array.isArray(value) ? value : [value]',
    'Cast value as an array if it\'s not one',
  )],

  ['toArray', createStaticMethodAlternative(
    FunctionCategory.Array,
    'from',
    'Array',
    'Convert value to an array',
    'value',
  )],

  ['toFinite', createExpressionAlternative(
    FunctionCategory.Number,
    'toFinite',
    'Number(value) || 0',
    'Convert value to a finite number',
  )],

  ['toInteger', createExpressionAlternative(
    FunctionCategory.Number,
    'toInteger',
    'Math.trunc(Number(value)) || 0',
    'Convert value to an integer',
  )],

  ['toSafeInteger', createExpressionAlternative(
    FunctionCategory.Number,
    'toSafeInteger',
    'Math.min(Math.max(Math.trunc(Number(value)) || 0, -Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER)',
    'Convert value to a safe integer',
  )],
])
