/**
 * Native alternatives for String functions
 */
import { FunctionCategory, createAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

// String method helper
function createStringMethod(
  lodashName: string,
  native: string,
  description: string,
  params = '',
): NativeAlternative {
  const paramSuffix = params ? `, ${params}` : ''
  return createAlternative({
    category: FunctionCategory.String,
    native: `String.prototype.${native}`,
    description,
    example: {
      lodash: `_.${lodashName}(string${paramSuffix})`,
      native: `string.${native}(${params})`,
    },
  })
}

export const stringAlternatives = new Map<string, NativeAlternative>([
  // String Methods
  ['startsWith', createStringMethod('startsWith', 'startsWith', 'Check if string starts with target', 'target')],
  ['endsWith', createStringMethod('endsWith', 'endsWith', 'Check if string ends with target', 'target')],
  ['repeat', createStringMethod('repeat', 'repeat', 'Repeat string n times', 'n')],
  ['trim', createStringMethod('trim', 'trim', 'Remove whitespace from both ends')],
  ['trimStart', createStringMethod('trimStart', 'trimStart', 'Remove whitespace from start')],
  ['trimEnd', createStringMethod('trimEnd', 'trimEnd', 'Remove whitespace from end')],
  ['toLower', createStringMethod('toLower', 'toLowerCase', 'Convert string to lowercase')],
  ['toUpper', createStringMethod('toUpper', 'toUpperCase', 'Convert string to uppercase')],
  ['replace', createStringMethod('replace', 'replace', 'Replace substring', 'pattern, replacement')],
  ['split', createStringMethod('split', 'split', 'Split string into array', 'separator')],
  ['padStart', createStringMethod('padStart', 'padStart', 'Pad string to target length from start', 'length, chars')],
])
