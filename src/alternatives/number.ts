/**
 * Native alternatives for Number functions
 */
import { FunctionCategory, createStaticMethodAlternative } from '../shared'
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
])
