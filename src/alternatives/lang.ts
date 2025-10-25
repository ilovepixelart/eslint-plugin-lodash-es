/**
 * Native alternatives for Lang/Type checking functions
 */
import { FunctionCategory, createExpressionAlternative, createStaticMethodAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

// Helper functions to reduce duplication
function createComparisonOperators(
  operators: [string, string, string][],
): [string, NativeAlternative][] {
  return operators.map(([name, operator, description]) => [
    name,
    createExpressionAlternative(FunctionCategory.Function, name, operator, description),
  ])
}

function createInstanceOfChecks(
  checks: [string, string, string][],
): [string, NativeAlternative][] {
  return checks.map(([name, type, description]) => [
    name,
    createExpressionAlternative(FunctionCategory.Function, name, `value instanceof ${type}`, description),
  ])
}

function createTypeConversions(
  conversions: [string, FunctionCategory, string, string][],
): [string, NativeAlternative][] {
  return conversions.map(([name, category, expression, description]) => [
    name,
    createExpressionAlternative(category, name, expression, description),
  ])
}

export const langAlternatives = new Map<string, NativeAlternative>([
  // Comparison operators
  ['eq', createStaticMethodAlternative(
    FunctionCategory.Function,
    'is',
    'Object',
    'Check if two values are the same',
    'value, other',
  )],

  ...createComparisonOperators([
    ['gt', 'value > other', 'Check if value is greater than other'],
    ['gte', 'value >= other', 'Check if value is greater than or equal to other'],
    ['lt', 'value < other', 'Check if value is less than other'],
    ['lte', 'value <= other', 'Check if value is less than or equal to other'],
  ]),

  // Type checking with instanceof
  ...createInstanceOfChecks([
    ['isDate', 'Date', 'Check if value is a Date object'],
    ['isRegExp', 'RegExp', 'Check if value is a RegExp object'],
    ['isError', 'Error', 'Check if value is an Error object'],
    ['isSet', 'Set', 'Check if value is a Set object'],
    ['isWeakMap', 'WeakMap', 'Check if value is a WeakMap object'],
    ['isWeakSet', 'WeakSet', 'Check if value is a WeakSet object'],
  ]),

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
  ...createTypeConversions([
    ['castArray', FunctionCategory.Array, 'Array.isArray(value) ? value : [value]', 'Cast value as an array if it\'s not one'],
    ['toFinite', FunctionCategory.Number, 'Number(value) || 0', 'Convert value to a finite number'],
    ['toInteger', FunctionCategory.Number, 'Math.trunc(Number(value)) || 0', 'Convert value to an integer'],
    ['toSafeInteger', FunctionCategory.Number, 'Math.min(Math.max(Math.trunc(Number(value)) || 0, -Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER)', 'Convert value to a safe integer'],
  ]),

  ['toArray', createStaticMethodAlternative(
    FunctionCategory.Array,
    'from',
    'Array',
    'Convert value to an array',
    'value',
  )],
])
