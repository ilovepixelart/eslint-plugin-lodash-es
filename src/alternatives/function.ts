/**
 * Native alternatives for Function/Type checking functions
 */
import { FunctionCategory, createAlternative } from '../shared'
import type { NativeAlternative } from '../shared'

// Type checking helper
function createTypeCheck(
  lodashName: string,
  native: string,
  description: string,
  notes?: readonly string[],
): NativeAlternative {
  return createAlternative({
    category: FunctionCategory.Function,
    native,
    description,
    example: {
      lodash: `_.${lodashName}(value)`,
      native,
    },
    ...(notes && { notes }),
  })
}

// Conversion helper
function createConverter(
  lodashName: string,
  native: string,
  description: string,
  notes?: readonly string[],
): NativeAlternative {
  return createAlternative({
    category: FunctionCategory.Function,
    native,
    description,
    example: {
      lodash: `_.${lodashName}(value)`,
      native: `${native}(value)`,
    },
    ...(notes && { notes }),
  })
}

export const functionAlternatives = new Map<string, NativeAlternative>([
  // Type checking methods
  ['isNull', createTypeCheck('isNull', 'value === null', 'Check if value is null')],
  ['isUndefined', createTypeCheck('isUndefined', 'value === undefined', 'Check if value is undefined')],
  ['isNil', createTypeCheck('isNil', 'value == null', 'Check if value is null or undefined')],
  ['isBoolean', createTypeCheck('isBoolean', 'typeof value === "boolean"', 'Check if value is boolean')],
  ['isNumber', createTypeCheck('isNumber', 'typeof value === "number"', 'Check if value is number', ['Consider Number.isFinite() for finite numbers'])],
  ['isString', createTypeCheck('isString', 'typeof value === "string"', 'Check if value is string')],
  ['isFunction', createTypeCheck('isFunction', 'typeof value === "function"', 'Check if value is function')],
  ['isObject', createTypeCheck('isObject', 'typeof value === "object" && value !== null', 'Check if value is object', ['Lodash isObject also returns true for functions'])],

  ['toNumber', createConverter('toNumber', 'Number', 'Convert value to number', ['Consider parseFloat() or parseInt() for strings'])],
  ['toString', createConverter('toString', 'String', 'Convert value to string', ['Consider .toString() method for objects'])],
])
