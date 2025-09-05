/**
 * Mapping of lodash functions to their native JavaScript alternatives
 */

export interface NativeAlternative {
  native: string
  description: string
  example?: {
    lodash: string
    native: string
  }
  notes?: string
}

export const nativeAlternatives: Record<string, NativeAlternative> = {
  // Array methods
  isArray: {
    native: 'Array.isArray',
    description: 'Check if value is an array',
    example: {
      lodash: '_.isArray(value)',
      native: 'Array.isArray(value)',
    },
  },

  forEach: {
    native: 'Array.prototype.forEach',
    description: 'Iterate over array elements',
    example: {
      lodash: '_.forEach(array, fn)',
      native: 'array.forEach(fn)',
    },
  },

  map: {
    native: 'Array.prototype.map',
    description: 'Transform array elements',
    example: {
      lodash: '_.map(array, fn)',
      native: 'array.map(fn)',
    },
  },

  filter: {
    native: 'Array.prototype.filter',
    description: 'Filter array elements',
    example: {
      lodash: '_.filter(array, predicate)',
      native: 'array.filter(predicate)',
    },
  },

  find: {
    native: 'Array.prototype.find',
    description: 'Find first matching element',
    example: {
      lodash: '_.find(array, predicate)',
      native: 'array.find(predicate)',
    },
  },

  findIndex: {
    native: 'Array.prototype.findIndex',
    description: 'Find index of first matching element',
    example: {
      lodash: '_.findIndex(array, predicate)',
      native: 'array.findIndex(predicate)',
    },
  },

  includes: {
    native: 'Array.prototype.includes',
    description: 'Check if array includes a value',
    example: {
      lodash: '_.includes(array, value)',
      native: 'array.includes(value)',
    },
  },

  reduce: {
    native: 'Array.prototype.reduce',
    description: 'Reduce array to single value',
    example: {
      lodash: '_.reduce(array, fn, initial)',
      native: 'array.reduce(fn, initial)',
    },
  },

  some: {
    native: 'Array.prototype.some',
    description: 'Test if some elements match predicate',
    example: {
      lodash: '_.some(array, predicate)',
      native: 'array.some(predicate)',
    },
  },

  every: {
    native: 'Array.prototype.every',
    description: 'Test if all elements match predicate',
    example: {
      lodash: '_.every(array, predicate)',
      native: 'array.every(predicate)',
    },
  },

  reverse: {
    native: 'Array.prototype.reverse',
    description: 'Reverse array in place',
    example: {
      lodash: '_.reverse(array)',
      native: 'array.reverse()',
    },
    notes: 'Native method mutates the original array and has different behavior',
  },

  slice: {
    native: 'Array.prototype.slice',
    description: 'Extract section of array',
    example: {
      lodash: '_.slice(array, start, end)',
      native: 'array.slice(start, end)',
    },
  },

  concat: {
    native: 'Array.prototype.concat',
    description: 'Concatenate arrays',
    example: {
      lodash: '_.concat(array, ...values)',
      native: 'array.concat(...values)',
    },
  },

  join: {
    native: 'Array.prototype.join',
    description: 'Join array elements into string',
    example: {
      lodash: '_.join(array, separator)',
      native: 'array.join(separator)',
    },
  },

  // Object methods
  keys: {
    native: 'Object.keys',
    description: 'Get object keys',
    example: {
      lodash: '_.keys(object)',
      native: 'Object.keys(object)',
    },
  },

  values: {
    native: 'Object.values',
    description: 'Get object values',
    example: {
      lodash: '_.values(object)',
      native: 'Object.values(object)',
    },
  },

  entries: {
    native: 'Object.entries',
    description: 'Get object key-value pairs',
    example: {
      lodash: '_.entries(object)',
      native: 'Object.entries(object)',
    },
  },

  assign: {
    native: 'Object.assign',
    description: 'Copy properties to target object',
    example: {
      lodash: '_.assign(target, ...sources)',
      native: 'Object.assign(target, ...sources)',
    },
  },

  // Type checking
  isNull: {
    native: 'value === null',
    description: 'Check if value is null',
    example: {
      lodash: '_.isNull(value)',
      native: 'value === null',
    },
  },

  isUndefined: {
    native: 'value === undefined',
    description: 'Check if value is undefined',
    example: {
      lodash: '_.isUndefined(value)',
      native: 'value === undefined',
    },
  },

  isNil: {
    native: 'value == null',
    description: 'Check if value is null or undefined',
    example: {
      lodash: '_.isNil(value)',
      native: 'value == null',
    },
  },

  isBoolean: {
    native: 'typeof value === "boolean"',
    description: 'Check if value is boolean',
    example: {
      lodash: '_.isBoolean(value)',
      native: 'typeof value === "boolean"',
    },
  },

  isNumber: {
    native: 'typeof value === "number"',
    description: 'Check if value is number',
    example: {
      lodash: '_.isNumber(value)',
      native: 'typeof value === "number"',
    },
    notes: 'Consider Number.isFinite() for finite numbers',
  },

  isString: {
    native: 'typeof value === "string"',
    description: 'Check if value is string',
    example: {
      lodash: '_.isString(value)',
      native: 'typeof value === "string"',
    },
  },

  isFunction: {
    native: 'typeof value === "function"',
    description: 'Check if value is function',
    example: {
      lodash: '_.isFunction(value)',
      native: 'typeof value === "function"',
    },
  },

  isObject: {
    native: 'typeof value === "object" && value !== null',
    description: 'Check if value is object',
    example: {
      lodash: '_.isObject(value)',
      native: 'typeof value === "object" && value !== null',
    },
    notes: 'Lodash isObject also returns true for functions',
  },

  isFinite: {
    native: 'Number.isFinite',
    description: 'Check if value is finite number',
    example: {
      lodash: '_.isFinite(value)',
      native: 'Number.isFinite(value)',
    },
  },

  isInteger: {
    native: 'Number.isInteger',
    description: 'Check if value is integer',
    example: {
      lodash: '_.isInteger(value)',
      native: 'Number.isInteger(value)',
    },
  },

  isNaN: {
    native: 'Number.isNaN',
    description: 'Check if value is NaN',
    example: {
      lodash: '_.isNaN(value)',
      native: 'Number.isNaN(value)',
    },
  },

  // String methods
  startsWith: {
    native: 'String.prototype.startsWith',
    description: 'Check if string starts with target',
    example: {
      lodash: '_.startsWith(string, target)',
      native: 'string.startsWith(target)',
    },
  },

  endsWith: {
    native: 'String.prototype.endsWith',
    description: 'Check if string ends with target',
    example: {
      lodash: '_.endsWith(string, target)',
      native: 'string.endsWith(target)',
    },
  },

  repeat: {
    native: 'String.prototype.repeat',
    description: 'Repeat string n times',
    example: {
      lodash: '_.repeat(string, n)',
      native: 'string.repeat(n)',
    },
  },

  trim: {
    native: 'String.prototype.trim',
    description: 'Remove whitespace from both ends',
    example: {
      lodash: '_.trim(string)',
      native: 'string.trim()',
    },
  },

  trimStart: {
    native: 'String.prototype.trimStart',
    description: 'Remove whitespace from start',
    example: {
      lodash: '_.trimStart(string)',
      native: 'string.trimStart()',
    },
  },

  trimEnd: {
    native: 'String.prototype.trimEnd',
    description: 'Remove whitespace from end',
    example: {
      lodash: '_.trimEnd(string)',
      native: 'string.trimEnd()',
    },
  },

  toLower: {
    native: 'String.prototype.toLowerCase',
    description: 'Convert string to lowercase',
    example: {
      lodash: '_.toLower(string)',
      native: 'string.toLowerCase()',
    },
  },

  toUpper: {
    native: 'String.prototype.toUpperCase',
    description: 'Convert string to uppercase',
    example: {
      lodash: '_.toUpper(string)',
      native: 'string.toUpperCase()',
    },
  },

  replace: {
    native: 'String.prototype.replace',
    description: 'Replace substring',
    example: {
      lodash: '_.replace(string, pattern, replacement)',
      native: 'string.replace(pattern, replacement)',
    },
  },

  split: {
    native: 'String.prototype.split',
    description: 'Split string into array',
    example: {
      lodash: '_.split(string, separator)',
      native: 'string.split(separator)',
    },
  },

  // Math methods
  max: {
    native: 'Math.max',
    description: 'Get maximum value',
    example: {
      lodash: '_.max(array)',
      native: 'Math.max(...array)',
    },
    notes: 'Use spread operator with native Math.max',
  },

  min: {
    native: 'Math.min',
    description: 'Get minimum value',
    example: {
      lodash: '_.min(array)',
      native: 'Math.min(...array)',
    },
    notes: 'Use spread operator with native Math.min',
  },

  ceil: {
    native: 'Math.ceil',
    description: 'Round up to nearest integer',
    example: {
      lodash: '_.ceil(number)',
      native: 'Math.ceil(number)',
    },
  },

  floor: {
    native: 'Math.floor',
    description: 'Round down to nearest integer',
    example: {
      lodash: '_.floor(number)',
      native: 'Math.floor(number)',
    },
  },

  round: {
    native: 'Math.round',
    description: 'Round to nearest integer',
    example: {
      lodash: '_.round(number)',
      native: 'Math.round(number)',
    },
  },

  // Utility
  now: {
    native: 'Date.now',
    description: 'Get current timestamp',
    example: {
      lodash: '_.now()',
      native: 'Date.now()',
    },
  },

  toNumber: {
    native: 'Number',
    description: 'Convert value to number',
    example: {
      lodash: '_.toNumber(value)',
      native: 'Number(value)',
    },
    notes: 'Consider parseFloat() or parseInt() for strings',
  },

  toString: {
    native: 'String',
    description: 'Convert value to string',
    example: {
      lodash: '_.toString(value)',
      native: 'String(value)',
    },
    notes: 'Consider .toString() method for objects',
  },
}

/**
 * Get native alternative for a lodash function
 */
export function getNativeAlternative(functionName: string): NativeAlternative | undefined {
  return nativeAlternatives[functionName]
}

/**
 * Check if a lodash function has a native alternative
 */
export function hasNativeAlternative(functionName: string): boolean {
  return functionName in nativeAlternatives
}
