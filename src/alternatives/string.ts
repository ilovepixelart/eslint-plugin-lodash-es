/**
 * Native alternatives for String functions
 */
import { FunctionCategory, createPrototypeMethodAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

export const stringAlternatives = new Map<string, NativeAlternative>([
  // String Methods
  ['startsWith', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'startsWith',
    'Check if string starts with target',
    'target',
  )],

  ['endsWith', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'endsWith',
    'Check if string ends with target',
    'target',
  )],

  ['repeat', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'repeat',
    'Repeat string n times',
    'n',
  )],

  ['trim', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'trim',
    'Remove whitespace from both ends',
  )],

  ['trimStart', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'trimStart',
    'Remove whitespace from start',
  )],

  ['trimEnd', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'trimEnd',
    'Remove whitespace from end',
  )],

  ['toLower', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'toLowerCase',
    'Convert string to lowercase',
  )],

  ['toUpper', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'toUpperCase',
    'Convert string to uppercase',
  )],

  ['replace', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'replace',
    'Replace substring',
    'pattern, replacement',
  )],

  ['split', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'split',
    'Split string into array',
    'separator',
  )],

  ['padStart', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'padStart',
    'Pad string to target length from start',
    'length, chars',
  )],
])
