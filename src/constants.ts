/**
 * Shared constants for lodash module detection and function validation
 */

export enum SafetyLevel {
  Safe = 'safe',
  Caution = 'caution',
  Unsafe = 'unsafe',
}

export const safetyLevels = Object.values(SafetyLevel)

export enum MigrationDifficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export const migrationDifficulties = Object.values(MigrationDifficulty)

export enum FunctionCategory {
  Array = 'array',
  Object = 'object',
  String = 'string',
  Number = 'number',
  Date = 'date',
  Function = 'function',
  Collection = 'collection',
}

export const functionCategories = Object.values(FunctionCategory)

export const lodashModules = new Set([
  'lodash',
  'lodash-es',
] as const)

export const lodashFunctions = new Set([
  // Array
  'chunk', 'compact', 'concat', 'difference', 'differenceBy', 'differenceWith',
  'drop', 'dropRight', 'dropRightWhile', 'dropWhile', 'fill', 'findIndex',
  'findLastIndex', 'first', 'flatten', 'flattenDeep', 'flattenDepth',
  'fromPairs', 'head', 'indexOf', 'initial', 'intersection', 'intersectionBy',
  'intersectionWith', 'join', 'last', 'lastIndexOf', 'nth', 'pull', 'pullAll',
  'pullAllBy', 'pullAllWith', 'pullAt', 'remove', 'reverse', 'slice', 'sortBy',
  'sortedIndex', 'sortedIndexBy', 'sortedIndexOf', 'sortedLastIndex',
  'sortedLastIndexBy', 'sortedLastIndexOf', 'sortedUniq', 'sortedUniqBy',
  'tail', 'take', 'takeRight', 'takeRightWhile', 'takeWhile', 'union',
  'unionBy', 'unionWith', 'uniq', 'uniqBy', 'uniqWith', 'unzip', 'unzipWith',
  'without', 'xor', 'xorBy', 'xorWith', 'zip', 'zipObject', 'zipObjectDeep',
  'zipWith',

  // Collection
  'countBy', 'each', 'eachRight', 'every', 'filter', 'find', 'findLast',
  'flatMap', 'flatMapDeep', 'flatMapDepth', 'forEach', 'forEachRight',
  'groupBy', 'includes', 'invokeMap', 'keyBy', 'map', 'orderBy', 'partition',
  'reduce', 'reduceRight', 'reject', 'sample', 'sampleSize', 'shuffle',
  'size', 'some', // 'sortBy' moved to Array section only

  // Date
  'now',

  // Function
  'after', 'ary', 'before', 'bind', 'bindKey', 'curry', 'curryRight',
  'debounce', 'defer', 'delay', 'flip', 'memoize', 'negate', 'once',
  'overArgs', 'partial', 'partialRight', 'rearg', 'rest', 'spread',
  'throttle', 'unary', 'wrap',

  // Lang
  'castArray', 'clone', 'cloneDeep', 'cloneDeepWith', 'cloneWith',
  'conformsTo', 'eq', 'gt', 'gte', 'isArguments', 'isArray', 'isArrayBuffer',
  'isArrayLike', 'isArrayLikeObject', 'isBoolean', 'isBuffer', 'isDate',
  'isElement', 'isEmpty', 'isEqual', 'isEqualWith', 'isError', 'isFinite',
  'isFunction', 'isInteger', 'isLength', 'isMap', 'isMatch', 'isMatchWith',
  'isNaN', 'isNative', 'isNil', 'isNull', 'isNumber', 'isObject',
  'isObjectLike', 'isPlainObject', 'isRegExp', 'isSafeInteger', 'isSet',
  'isString', 'isSymbol', 'isTypedArray', 'isUndefined', 'isWeakMap',
  'isWeakSet', 'lt', 'lte', 'toArray', 'toFinite', 'toInteger', 'toLength',
  'toNumber', 'toPlainObject', 'toSafeInteger', 'toString',

  // Math
  'add', 'ceil', 'divide', 'floor', 'max', 'maxBy', 'mean', 'meanBy',
  'min', 'minBy', 'multiply', 'round', 'subtract', 'sum', 'sumBy',

  // Number
  'clamp', 'inRange', 'random',

  // Object
  'assign', 'assignIn', 'assignInWith', 'assignWith', 'at', 'create',
  'defaults', 'defaultsDeep', 'entries', 'entriesIn', 'extend', 'extendWith',
  'findKey', 'findLastKey', 'forIn', 'forInRight', 'forOwn', 'forOwnRight',
  'functions', 'functionsIn', 'get', 'has', 'hasIn', 'invert', 'invertBy',
  'invoke', 'keys', 'keysIn', 'mapKeys', 'mapValues', 'merge', 'mergeWith',
  'omit', 'omitBy', 'pick', 'pickBy', 'result', 'set', 'setWith', 'toPairs',
  'toPairsIn', 'transform', 'unset', 'update', 'updateWith', 'values',
  'valuesIn',

  // Seq
  'chain', 'tap', 'thru', 'value',

  // String
  'camelCase', 'capitalize', 'deburr', 'endsWith', 'escape', 'escapeRegExp',
  'kebabCase', 'lowerCase', 'lowerFirst', 'pad', 'padEnd', 'padStart',
  'parseInt', 'repeat', 'replace', 'snakeCase', 'split', 'startCase',
  'startsWith', 'template', 'toLower', 'toUpper', 'trim', 'trimEnd',
  'trimStart', 'truncate', 'unescape', 'upperCase', 'upperFirst', 'words',

  // Util
  'attempt', 'bindAll', 'cond', 'conforms', 'constant', 'defaultTo',
  'flow', 'flowRight', 'identity', 'iteratee', 'matches', 'matchesProperty',
  'method', 'methodOf', 'mixin', 'noConflict', 'noop', 'nthArg', 'over',
  'overEvery', 'overSome', 'property', 'propertyOf', 'range', 'rangeRight',
  'stubArray', 'stubFalse', 'stubObject', 'stubString', 'stubTrue', 'times',
  'toPath', 'uniqueId',
] as const)

/**
 * Native alternatives data
 */

// Native alternatives with comprehensive metadata
export const nativeAlternatives = new Map([
  // Array Methods - Safe and Direct Replacements
  ['isArray', {
    category: FunctionCategory.Array,
    native: 'Array.isArray',
    description: 'Check if value is an array (reliable & performant)',
    example: {
      lodash: '_.isArray(value)',
      native: 'Array.isArray(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['forEach', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.forEach',
    description: 'Iterate over array elements (native is faster)',
    example: {
      lodash: '_.forEach(array, fn)',
      native: 'array.forEach(fn)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['map', 'filter'],
  }],

  ['map', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.map',
    description: 'Transform array elements using a callback function',
    example: {
      lodash: '_.map(array, fn)',
      native: 'array.map(fn)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
      steps: [
        'Replace _.map(array, fn) with array.map(fn)',
        'Ensure array is not null/undefined before calling',
      ],
    },
    related: ['filter', 'forEach'],
  }],

  ['filter', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.filter',
    description: 'Filter array elements (native is faster)',
    example: {
      lodash: '_.filter(array, predicate)',
      native: 'array.filter(predicate)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['map', 'find'],
  }],

  ['find', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.find',
    description: 'Find first matching element',
    example: {
      lodash: '_.find(array, predicate)',
      native: 'array.find(predicate)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['filter', 'findIndex'],
  }],

  ['findIndex', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.findIndex',
    description: 'Find index of first matching element',
    example: {
      lodash: '_.findIndex(array, predicate)',
      native: 'array.findIndex(predicate)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['find', 'indexOf'],
  }],

  ['includes', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.includes',
    description: 'Check if array includes a value',
    example: {
      lodash: '_.includes(array, value)',
      native: 'array.includes(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['indexOf', 'find'],
  }],

  ['reduce', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.reduce',
    description: 'Reduce array to single value',
    example: {
      lodash: '_.reduce(array, fn, initial)',
      native: 'array.reduce(fn, initial)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['map', 'filter'],
  }],

  ['some', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.some',
    description: 'Test if some elements match predicate',
    example: {
      lodash: '_.some(array, predicate)',
      native: 'array.some(predicate)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['every', 'find'],
  }],

  ['every', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.every',
    description: 'Test if all elements match predicate',
    example: {
      lodash: '_.every(array, predicate)',
      native: 'array.every(predicate)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    related: ['some', 'filter'],
  }],

  ['slice', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.slice',
    description: 'Extract section of array',
    example: {
      lodash: '_.slice(array, start, end)',
      native: 'array.slice(start, end)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['concat', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.concat',
    description: 'Concatenate arrays',
    example: {
      lodash: '_.concat(array, ...values)',
      native: 'array.concat(...values)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['join', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.join',
    description: 'Join array elements into string',
    example: {
      lodash: '_.join(array, separator)',
      native: 'array.join(separator)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  // Array Methods - With Behavioral Differences
  ['reverse', {
    category: FunctionCategory.Array,
    native: 'Array.prototype.reverse',
    description: 'Reverse array elements in place',
    example: {
      lodash: '_.reverse(array)',
      native: 'array.reverse()',
    },
    safety: {
      level: SafetyLevel.Caution,
      concerns: ['Mutates original array'],
      mitigation: 'Use [...array].reverse() or array.slice().reverse() for immutable version',
    },
    migration: {
      difficulty: MigrationDifficulty.Medium,
      challenges: ['Behavioral difference - mutable vs immutable'],
      steps: [
        'Decide if mutation is acceptable',
        'Use [...array].reverse() for immutable version',
        'Or use array.slice().reverse() for older browser support',
      ],
    },
    excludeByDefault: true,
    related: ['sort'],
  }],

  // Object Methods - With Null Safety Issues
  ['keys', {
    category: FunctionCategory.Object,
    native: 'Object.keys',
    description: 'Get enumerable property names of object',
    example: {
      lodash: '_.keys(object)',
      native: 'Object.keys(object)',
    },
    safety: {
      level: SafetyLevel.Caution,
      concerns: ['Throws on null/undefined input'],
      mitigation: 'Use Object.keys(object || {}) for null safety',
    },
    migration: {
      difficulty: MigrationDifficulty.Medium,
      challenges: ['Null safety handling'],
      steps: [
        'Check all usage sites for potential null/undefined values',
        'Add null checks: Object.keys(object || {})',
        'Consider using optional chaining where appropriate',
      ],
    },
    notes: ['Lodash version handles null/undefined gracefully'],
  }],

  ['values', {
    category: FunctionCategory.Object,
    native: 'Object.values',
    description: 'Get object values as array',
    example: {
      lodash: '_.values(object)',
      native: 'Object.values(object || {})',
    },
    safety: {
      level: SafetyLevel.Caution,
      concerns: ['Throws on null/undefined input'],
      mitigation: 'Use Object.values(object || {}) for null safety',
    },
    migration: {
      difficulty: MigrationDifficulty.Medium,
      challenges: ['Null safety handling'],
      steps: [
        'Add null checks: Object.values(object || {})',
        'Test with null/undefined values',
      ],
    },
  }],

  ['entries', {
    category: FunctionCategory.Object,
    native: 'Object.entries',
    description: 'Get object key-value pairs as array',
    example: {
      lodash: '_.entries(object)',
      native: 'Object.entries(object || {})',
    },
    safety: {
      level: SafetyLevel.Caution,
      concerns: ['Throws on null/undefined input'],
      mitigation: 'Use Object.entries(object || {}) for null safety',
    },
    migration: {
      difficulty: MigrationDifficulty.Medium,
      challenges: ['Null safety handling'],
      steps: [
        'Add null checks: Object.entries(object || {})',
        'Test with null/undefined values',
      ],
    },
  }],

  ['assign', {
    category: FunctionCategory.Object,
    native: 'Object.assign',
    description: 'Copy properties to target object',
    example: {
      lodash: '_.assign(target, ...sources)',
      native: 'Object.assign(target, ...sources)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  // Type checking methods
  ['isNull', {
    category: FunctionCategory.Function,
    native: 'value === null',
    description: 'Check if value is null',
    example: {
      lodash: '_.isNull(value)',
      native: 'value === null',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isUndefined', {
    category: FunctionCategory.Function,
    native: 'value === undefined',
    description: 'Check if value is undefined',
    example: {
      lodash: '_.isUndefined(value)',
      native: 'value === undefined',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isNil', {
    category: FunctionCategory.Function,
    native: 'value == null',
    description: 'Check if value is null or undefined',
    example: {
      lodash: '_.isNil(value)',
      native: 'value == null',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isBoolean', {
    category: FunctionCategory.Function,
    native: 'typeof value === "boolean"',
    description: 'Check if value is boolean',
    example: {
      lodash: '_.isBoolean(value)',
      native: 'typeof value === "boolean"',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isNumber', {
    category: FunctionCategory.Function,
    native: 'typeof value === "number"',
    description: 'Check if value is number',
    example: {
      lodash: '_.isNumber(value)',
      native: 'typeof value === "number"',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    notes: ['Consider Number.isFinite() for finite numbers'],
  }],

  ['isString', {
    category: FunctionCategory.Function,
    native: 'typeof value === "string"',
    description: 'Check if value is string',
    example: {
      lodash: '_.isString(value)',
      native: 'typeof value === "string"',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isFunction', {
    category: FunctionCategory.Function,
    native: 'typeof value === "function"',
    description: 'Check if value is function',
    example: {
      lodash: '_.isFunction(value)',
      native: 'typeof value === "function"',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isObject', {
    category: FunctionCategory.Function,
    native: 'typeof value === "object" && value !== null',
    description: 'Check if value is object',
    example: {
      lodash: '_.isObject(value)',
      native: 'typeof value === "object" && value !== null',
    },
    safety: {
      level: SafetyLevel.Caution,
      concerns: ['Different behavior - lodash includes functions'],
      mitigation: 'Use (typeof value === "object" && value !== null) || typeof value === "function" for exact lodash behavior',
    },
    migration: {
      difficulty: MigrationDifficulty.Medium,
      challenges: ['Behavioral difference with functions'],
    },
    notes: ['Lodash isObject also returns true for functions'],
  }],

  ['isFinite', {
    category: FunctionCategory.Number,
    native: 'Number.isFinite',
    description: 'Check if value is finite number',
    example: {
      lodash: '_.isFinite(value)',
      native: 'Number.isFinite(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isInteger', {
    category: FunctionCategory.Number,
    native: 'Number.isInteger',
    description: 'Check if value is integer',
    example: {
      lodash: '_.isInteger(value)',
      native: 'Number.isInteger(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['isNaN', {
    category: FunctionCategory.Number,
    native: 'Number.isNaN',
    description: 'Check if value is NaN',
    example: {
      lodash: '_.isNaN(value)',
      native: 'Number.isNaN(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  // String Methods
  ['startsWith', {
    category: FunctionCategory.String,
    native: 'String.prototype.startsWith',
    description: 'Check if string starts with target',
    example: {
      lodash: '_.startsWith(string, target)',
      native: 'string.startsWith(target)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['endsWith', {
    category: FunctionCategory.String,
    native: 'String.prototype.endsWith',
    description: 'Check if string ends with target',
    example: {
      lodash: '_.endsWith(string, target)',
      native: 'string.endsWith(target)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['repeat', {
    category: FunctionCategory.String,
    native: 'String.prototype.repeat',
    description: 'Repeat string n times',
    example: {
      lodash: '_.repeat(string, n)',
      native: 'string.repeat(n)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['trim', {
    category: FunctionCategory.String,
    native: 'String.prototype.trim',
    description: 'Remove whitespace from both ends',
    example: {
      lodash: '_.trim(string)',
      native: 'string.trim()',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['trimStart', {
    category: FunctionCategory.String,
    native: 'String.prototype.trimStart',
    description: 'Remove whitespace from start',
    example: {
      lodash: '_.trimStart(string)',
      native: 'string.trimStart()',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['trimEnd', {
    category: FunctionCategory.String,
    native: 'String.prototype.trimEnd',
    description: 'Remove whitespace from end',
    example: {
      lodash: '_.trimEnd(string)',
      native: 'string.trimEnd()',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['toLower', {
    category: FunctionCategory.String,
    native: 'String.prototype.toLowerCase',
    description: 'Convert string to lowercase',
    example: {
      lodash: '_.toLower(string)',
      native: 'string.toLowerCase()',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['toUpper', {
    category: FunctionCategory.String,
    native: 'String.prototype.toUpperCase',
    description: 'Convert string to uppercase',
    example: {
      lodash: '_.toUpper(string)',
      native: 'string.toUpperCase()',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['replace', {
    category: FunctionCategory.String,
    native: 'String.prototype.replace',
    description: 'Replace substring',
    example: {
      lodash: '_.replace(string, pattern, replacement)',
      native: 'string.replace(pattern, replacement)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['split', {
    category: FunctionCategory.String,
    native: 'String.prototype.split',
    description: 'Split string into array',
    example: {
      lodash: '_.split(string, separator)',
      native: 'string.split(separator)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  // Math methods
  ['max', {
    category: FunctionCategory.Number,
    native: 'Math.max',
    description: 'Get maximum value',
    example: {
      lodash: '_.max(array)',
      native: 'Math.max(...array)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    notes: ['Use spread operator with native Math.max'],
  }],

  ['min', {
    category: FunctionCategory.Number,
    native: 'Math.min',
    description: 'Get minimum value',
    example: {
      lodash: '_.min(array)',
      native: 'Math.min(...array)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    notes: ['Use spread operator with native Math.min'],
  }],

  ['ceil', {
    category: FunctionCategory.Number,
    native: 'Math.ceil',
    description: 'Round up to nearest integer',
    example: {
      lodash: '_.ceil(number)',
      native: 'Math.ceil(number)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['floor', {
    category: FunctionCategory.Number,
    native: 'Math.floor',
    description: 'Round down to nearest integer',
    example: {
      lodash: '_.floor(number)',
      native: 'Math.floor(number)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['round', {
    category: FunctionCategory.Number,
    native: 'Math.round',
    description: 'Round to nearest integer',
    example: {
      lodash: '_.round(number)',
      native: 'Math.round(number)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  // Utility
  ['now', {
    category: FunctionCategory.Date,
    native: 'Date.now',
    description: 'Get current timestamp',
    example: {
      lodash: '_.now()',
      native: 'Date.now()',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  ['toNumber', {
    category: FunctionCategory.Function,
    native: 'Number',
    description: 'Convert value to number',
    example: {
      lodash: '_.toNumber(value)',
      native: 'Number(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    notes: ['Consider parseFloat() or parseInt() for strings'],
  }],

  ['toString', {
    category: FunctionCategory.Function,
    native: 'String',
    description: 'Convert value to string',
    example: {
      lodash: '_.toString(value)',
      native: 'String(value)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
    notes: ['Consider .toString() method for objects'],
  }],

  // String Methods
  ['padStart', {
    category: FunctionCategory.String,
    native: 'String.prototype.padStart',
    description: 'Pad string to target length from start',
    example: {
      lodash: '_.padStart(string, length, chars)',
      native: 'string.padStart(length, chars)',
    },
    safety: {
      level: SafetyLevel.Safe,
    },
    migration: {
      difficulty: MigrationDifficulty.Easy,
    },
  }],

  // More Complex Cases
  ['isEmpty', {
    category: FunctionCategory.Collection,
    native: 'Various approaches',
    description: 'Check if collection is empty',
    example: {
      lodash: '_.isEmpty(value)',
      native: '!value || Object.keys(value).length === 0',
    },
    safety: {
      level: SafetyLevel.Unsafe,
      concerns: [
        'No single native equivalent',
        'Different behavior for different types',
        'Type checking complexity',
      ],
      mitigation: 'Create utility function or use multiple checks based on expected types',
    },
    migration: {
      difficulty: MigrationDifficulty.Hard,
      challenges: [
        'No direct equivalent',
        'Type-specific logic needed',
        'Edge case handling',
      ],
      steps: [
        'Identify all usage patterns',
        'Create type-specific checks',
        'Consider creating utility function',
        'Test thoroughly with edge cases',
      ],
    },
    excludeByDefault: true,
    notes: [
      'lodash isEmpty handles many edge cases',
      'Consider if you really need such generic empty checking',
    ],
  }],
] as const)
