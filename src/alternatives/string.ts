/**
 * Native alternatives for String functions
 */
import { FunctionCategory, createAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

export const stringAlternatives = new Map<string, NativeAlternative>([
  // String Methods
  ['startsWith', createAlternative({
    category: FunctionCategory.String,
    native: 'String.prototype.startsWith',
    description: 'Check if string starts with target',
    example: {
      lodash: '_.startsWith(string, target)',
      native: 'string.startsWith(target)',
    },
  })],

  ['endsWith', createAlternative({
    category: FunctionCategory.String,
    native: 'String.prototype.endsWith',
    description: 'Check if string ends with target',
    example: {
      lodash: '_.endsWith(string, target)',
      native: 'string.endsWith(target)',
    },
  })],

  ['repeat', createAlternative({
    category: FunctionCategory.String,
    native: 'String.prototype.repeat',
    description: 'Repeat string n times',
    example: {
      lodash: '_.repeat(string, n)',
      native: 'string.repeat(n)',
    },
  })],

  ['trim', createAlternative({
    category: FunctionCategory.String,
    native: 'String.prototype.trim',
    description: 'Remove whitespace from both ends',
    example: {
      lodash: '_.trim(string)',
      native: 'string.trim()',
    },
  })],

  ['trimStart', createAlternative({
    category: FunctionCategory.String,
    native: 'String.prototype.trimStart',
    description: 'Remove whitespace from start',
    example: {
      lodash: '_.trimStart(string)',
      native: 'string.trimStart()',
    },
  })],

  ['trimEnd', createAlternative({
    category: FunctionCategory.String,
    native: 'String.prototype.trimEnd',
    description: 'Remove whitespace from end',
    example: {
      lodash: '_.trimEnd(string)',
      native: 'string.trimEnd()',
    },
  })],

  ['toLower', createAlternative({
    category: FunctionCategory.String,
    native: 'String.prototype.toLowerCase',
    description: 'Convert string to lowercase',
    example: {
      lodash: '_.toLower(string)',
      native: 'string.toLowerCase()',
    },
  })],

  ['toUpper', createAlternative({
    category: FunctionCategory.String,
    native: 'String.prototype.toUpperCase',
    description: 'Convert string to uppercase',
    example: {
      lodash: '_.toUpper(string)',
      native: 'string.toUpperCase()',
    },
  })],

  ['replace', createAlternative({
    category: FunctionCategory.String,
    native: 'String.prototype.replace',
    description: 'Replace substring',
    example: {
      lodash: '_.replace(string, pattern, replacement)',
      native: 'string.replace(pattern, replacement)',
    },
  })],

  ['split', createAlternative({
    category: FunctionCategory.String,
    native: 'String.prototype.split',
    description: 'Split string into array',
    example: {
      lodash: '_.split(string, separator)',
      native: 'string.split(separator)',
    },
  })],

  ['padStart', createAlternative({
    category: FunctionCategory.String,
    native: 'String.prototype.padStart',
    description: 'Pad string to target length from start',
    example: {
      lodash: '_.padStart(string, length, chars)',
      native: 'string.padStart(length, chars)',
    },
  })],
])
