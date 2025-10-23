/**
 * Native alternatives for String functions
 */
import { FunctionCategory, createPrototypeMethodAlternative, createExpressionAlternative, descriptions } from '../shared'
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

  ['padStart', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'padStart',
    descriptions.padString('start'),
    'length, chars',
  )],

  ['padEnd', createPrototypeMethodAlternative(
    FunctionCategory.String,
    'padEnd',
    descriptions.padString('end'),
    'length, chars',
  )],

  // String case transformations
  ['capitalize', createExpressionAlternative(
    FunctionCategory.String,
    'capitalize',
    'string.at(0).toUpperCase() + string.slice(1).toLowerCase()',
    'Capitalize first character and lowercase rest',
  )],

  ['lowerFirst', createExpressionAlternative(
    FunctionCategory.String,
    'lowerFirst',
    'string.at(0).toLowerCase() + string.slice(1)',
    'Lowercase first character',
  )],

  ['upperFirst', createExpressionAlternative(
    FunctionCategory.String,
    'upperFirst',
    'string.at(0).toUpperCase() + string.slice(1)',
    'Uppercase first character',
  )],

  // Parsing
  ['parseInt', createExpressionAlternative(
    FunctionCategory.String,
    'parseInt',
    'parseInt(string, radix)',
    'Parse string to integer',
  )],
])
