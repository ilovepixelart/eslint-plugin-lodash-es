/**
 * Native alternatives for Number functions
 */
import {
  FunctionCategory,
  createStaticMethodAlternative,
  createExpressionAlternative,
  createArrayTransformMethod,
  relatedFunctions,
} from '../shared'
import type { NativeAlternative } from '../shared'

export const numberAlternatives = new Map<string, NativeAlternative>([
  // Number static methods
  ['isFinite', createStaticMethodAlternative(
    FunctionCategory.Number,
    'isFinite',
    'Number',
    'Check if value is finite number',
  )],

  ['isInteger', createStaticMethodAlternative(
    FunctionCategory.Number,
    'isInteger',
    'Number',
    'Check if value is integer',
  )],

  ['isNaN', createStaticMethodAlternative(
    FunctionCategory.Number,
    'isNaN',
    'Number',
    'Check if value is NaN',
  )],

  // Math methods
  ['max', createStaticMethodAlternative(
    FunctionCategory.Number,
    'max',
    'Math',
    'Get maximum value',
    '...array',
    { notes: ['Use spread operator with native Math.max'] },
  )],

  ['min', createStaticMethodAlternative(
    FunctionCategory.Number,
    'min',
    'Math',
    'Get minimum value',
    '...array',
    { notes: ['Use spread operator with native Math.min'] },
  )],

  ['ceil', createStaticMethodAlternative(
    FunctionCategory.Number,
    'ceil',
    'Math',
    'Round up to nearest integer',
    'number',
  )],

  ['floor', createStaticMethodAlternative(
    FunctionCategory.Number,
    'floor',
    'Math',
    'Round down to nearest integer',
    'number',
  )],

  ['round', createStaticMethodAlternative(
    FunctionCategory.Number,
    'round',
    'Math',
    'Round to nearest integer',
    'number',
  )],

  // Arithmetic operations
  ['add', createExpressionAlternative(
    FunctionCategory.Number,
    'add',
    'a + b',
    'Add two numbers',
  )],

  ['subtract', createExpressionAlternative(
    FunctionCategory.Number,
    'subtract',
    'a - b',
    'Subtract two numbers',
  )],

  ['multiply', createExpressionAlternative(
    FunctionCategory.Number,
    'multiply',
    'a * b',
    'Multiply two numbers',
  )],

  ['divide', createExpressionAlternative(
    FunctionCategory.Number,
    'divide',
    'a / b',
    'Divide two numbers',
  )],

  // Array aggregation
  ['sum', createArrayTransformMethod(
    'sum',
    'array.reduce((sum, n) => sum + n, 0)',
    'Sum all numbers in array',
    relatedFunctions.arrayReducers,
  )],

  ['mean', createArrayTransformMethod(
    'mean',
    'array.reduce((sum, n) => sum + n, 0) / array.length',
    'Calculate mean of numbers in array',
    relatedFunctions.arrayReducers,
  )],

  // Number operations
  ['clamp', createExpressionAlternative(
    FunctionCategory.Number,
    'clamp',
    'Math.min(Math.max(number, lower), upper)',
    'Clamp number within inclusive bounds',
  )],

  ['inRange', createExpressionAlternative(
    FunctionCategory.Number,
    'inRange',
    'number >= start && number < end',
    'Check if number is in range',
  )],

  ['random', createExpressionAlternative(
    FunctionCategory.Number,
    'random',
    'Math.random() * (max - min) + min',
    'Generate random number between bounds',
  )],
])
