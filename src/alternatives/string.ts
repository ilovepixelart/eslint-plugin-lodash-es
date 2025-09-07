/**
 * Native alternatives for String functions
 */
import { FunctionCategory, createPrototypeMethodAlternative, descriptions } from '../shared'
import type { NativeAlternative } from '../shared'

export const stringAlternatives = new Map<string, NativeAlternative>([
  // String Methods
  ['startsWith', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'startsWith',
    descriptions.checkStringStarts,
    'target',
  )],

  ['endsWith', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'endsWith',
    descriptions.checkStringEnds,
    'target',
  )],

  ['repeat', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'repeat',
    descriptions.repeatString,
    'n',
  )],

  ['trim', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'trim',
    descriptions.removeWhitespace('both ends'),
  )],

  ['trimStart', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'trimStart',
    descriptions.removeWhitespace('start'),
  )],

  ['trimEnd', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'trimEnd',
    descriptions.removeWhitespace('end'),
  )],

  ['toLower', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'toLowerCase',
    descriptions.convertStringCase('lowercase'),
  )],

  ['toUpper', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'toUpperCase',
    descriptions.convertStringCase('uppercase'),
  )],

  ['replace', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'replace',
    descriptions.replaceSubstring,
    'pattern, replacement',
  )],

  ['split', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'split',
    descriptions.splitStringToArray,
    'separator',
  )],

  ['padEnd', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'padEnd',
    descriptions.padString('end'),
    'length, chars',
  )],
])
