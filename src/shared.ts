/**
 * Shared enums and constants used across the lodash-es plugin
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

// Common safety configurations
export const safetyConfigs = {
  safe: {
    level: SafetyLevel.Safe,
    concerns: [],
    mitigation: 'Direct replacement with no safety concerns',
  },
  nullUndefinedThrows: {
    level: SafetyLevel.Caution,
    concerns: ['Throws on null/undefined input'],
    mitigation: 'Use Object.method(object || {}) for null safety',
  },
  mutatesOriginal: {
    level: SafetyLevel.Caution,
    concerns: ['Mutates original array'],
    mitigation: 'Use [...array].method() or array.slice().method() for immutable version',
  },
} as const

// Common migration configurations
export const migrationConfigs = {
  easy: {
    difficulty: MigrationDifficulty.Easy,
    challenges: ['Direct replacement'],
    steps: [
      'Replace lodash function with native equivalent',
      'Test functionality',
    ],
  },
  nullSafetyHandling: {
    difficulty: MigrationDifficulty.Medium,
    challenges: ['Null safety handling'],
    steps: [
      'Add null checks: Object.method(object || {})',
      'Test with null/undefined values',
    ],
  },
  mutabilityConcerns: {
    difficulty: MigrationDifficulty.Medium,
    challenges: ['Behavioral difference - mutable vs immutable'],
    steps: [
      'Decide if mutation is acceptable',
      'Use [...array].method() for immutable version',
      'Or use array.slice().method() for older browser support',
    ],
  },
} as const

// Function classification arrays for special handling
export const functionClassifications = {
  nullSafe: ['keys', 'values', 'entries', 'size', 'isEmpty'] as const,
  mutating: ['reverse'] as const,
} as const

// Common related function groups to reduce duplication
export const relatedFunctions = {
  arrayIterators: ['map', 'filter', 'forEach'] as const,
  arrayFinders: ['find', 'findIndex', 'indexOf'] as const,
  arrayTests: ['some', 'every', 'filter'] as const,
  arrayReducers: ['map', 'filter', 'reduce'] as const,
  arrayMutators: ['sort', 'reverse'] as const,
  arrayDeduplication: ['uniq', 'uniqBy'] as const,
  arrayFilters: ['filter', 'compact', 'reject'] as const,
  arraySorting: ['sort', 'sortBy', 'orderBy'] as const,
  objectManipulation: ['pick', 'omit', 'merge', 'assign'] as const,
} as const

// Common description templates to reduce duplication
export const descriptions = {
  // Array descriptions
  iterateElements: (type: string) => `Iterate over ${type} elements (native is faster)`,
  transformElements: (type: string) => `Transform ${type} elements using a callback function`,
  filterElements: (type: string) => `Filter ${type} elements (native is faster)`,
  findElement: 'Find first matching element',
  findIndex: 'Find index of first matching element',
  checkIncludes: (type: string) => `Check if ${type} includes a value`,
  reduceToValue: 'Reduce array to single value',
  testSome: 'Test if some elements match predicate',
  testAll: 'Test if all elements match predicate',

  // String descriptions
  checkStringStarts: 'Check if string starts with target',
  checkStringEnds: 'Check if string ends with target',
  repeatString: 'Repeat string n times',
  removeWhitespace: (location: string) => `Remove whitespace from ${location}`,
  convertStringCase: (direction: string) => `Convert string to ${direction}`,
  replaceSubstring: 'Replace substring',
  splitStringToArray: 'Split string into array',
  padString: (direction: string) => `Pad string to target length from ${direction}`,

  // General descriptions
  checkIfArray: 'Check if value is an array (reliable & performant)',
} as const

export interface NativeExample {
  lodash: string
  native: string
}

export interface SafetyInfo {
  level: SafetyLevel
  concerns?: readonly string[] // What makes it unsafe
  mitigation?: string // How to make it safer
}

export interface MigrationInfo {
  difficulty: MigrationDifficulty
  challenges?: readonly string[] // What makes it difficult
  steps?: readonly string[] // Step-by-step migration guide
}

export interface NativeAlternative {
  category: FunctionCategory // Category for grouping
  native: string // Native JavaScript equivalent
  description: string // Human readable description
  example: NativeExample // Code examples
  safety: SafetyInfo // Safety assessment
  migration: MigrationInfo // How difficult is migration
  notes?: readonly string[] // Additional contextual notes
  related?: readonly string[] // Related functions that might be alternatives
  excludeByDefault?: boolean // If this alternative should be excluded by default in certain configs
}

export interface AlternativeFilterConfig {
  categories?: FunctionCategory[]
  safetyLevels?: SafetyLevel[]
  maxDifficulty?: MigrationDifficulty
  excludeByDefault?: boolean
}

export interface CreateAlternativeOptions {
  category: FunctionCategory
  native: string
  description: string
  example: {
    lodash: string
    native: string
  }
  safety?: {
    level?: SafetyLevel
    concerns?: readonly string[]
    mitigation?: string
  }
  migration?: {
    difficulty?: MigrationDifficulty
    challenges?: readonly string[]
    steps?: readonly string[]
  }
  notes?: readonly string[]
  related?: readonly string[]
  excludeByDefault?: boolean
}

/**
 * Helper function to create a NativeAlternative with common patterns
 */
export function createAlternative(options: CreateAlternativeOptions): NativeAlternative {
  const safety: SafetyInfo = {
    level: options.safety?.level ?? SafetyLevel.Safe,
  }
  if (options.safety?.concerns) {
    safety.concerns = options.safety.concerns
  }
  if (options.safety?.mitigation) {
    safety.mitigation = options.safety.mitigation
  }

  const migration: MigrationInfo = {
    difficulty: options.migration?.difficulty ?? MigrationDifficulty.Easy,
  }
  if (options.migration?.challenges) {
    migration.challenges = options.migration.challenges
  }
  if (options.migration?.steps) {
    migration.steps = options.migration.steps
  }

  const result: NativeAlternative = {
    category: options.category,
    native: options.native,
    description: options.description,
    example: options.example,
    safety,
    migration,
  }

  if (options.notes) {
    result.notes = options.notes
  }
  if (options.related) {
    result.related = options.related
  }
  if (options.excludeByDefault !== undefined) {
    result.excludeByDefault = options.excludeByDefault
  }

  return result
}

/**
 * Creates alternatives for prototype methods (array.method(), string.method())
 *
 * @example
 * // Creates: _.map(array, fn) → array.map(fn)
 * createPrototypeMethodAlternative(FunctionCategory.Array, 'map', 'Transform elements', 'fn')
 *
 * // Creates: _.trim(string) → string.trim()
 * createPrototypeMethodAlternative(FunctionCategory.String, 'trim', 'Remove whitespace')
 */
export function createPrototypeMethodAlternative(
  category: FunctionCategory,
  methodName: string,
  description: string,
  params?: string,
  options?: Partial<CreateAlternativeOptions>,
): NativeAlternative {
  // Determine object name and prototype prefix based on category
  const objectName = category === FunctionCategory.Array ? 'array' : 'string'
  const prototypePrefix = category === FunctionCategory.Array ? 'Array.prototype' : 'String.prototype'

  const paramSuffix = params ? `, ${params}` : ''
  const paramsList = params || ''

  return createAlternative({
    category,
    native: `${prototypePrefix}.${methodName}`,
    description,
    example: {
      lodash: `_.${methodName}(${objectName}${paramSuffix})`,
      native: `${objectName}.${methodName}(${paramsList})`,
    },
    ...options,
  })
}

/**
 * Creates alternatives for prototype methods with fixed parameters
 * Used when lodash function takes only target object but native method needs fixed params
 *
 * @example
 * // Creates: _.first(array) → array.at(0)
 * createFixedParamPrototypeMethodAlternative(FunctionCategory.Array, 'first', 'at', '0', 'Get first element')
 *
 * // Creates: _.last(array) → array.at(-1)
 * createFixedParamPrototypeMethodAlternative(FunctionCategory.Array, 'last', 'at', '-1', 'Get last element')
 */
export function createFixedParamPrototypeMethodAlternative(
  category: FunctionCategory,
  lodashName: string,
  methodName: string,
  fixedParams: string,
  description: string,
  options?: Partial<CreateAlternativeOptions>,
): NativeAlternative {
  // Determine object name and prototype prefix based on category
  const objectName = category === FunctionCategory.Array ? 'array' : 'string'
  const prototypePrefix = category === FunctionCategory.Array ? 'Array.prototype' : 'String.prototype'

  return createAlternative({
    category,
    native: `${prototypePrefix}.${methodName}[${fixedParams}]`, // Encode fixed params in brackets
    description,
    example: {
      lodash: `_.${lodashName}(${objectName})`,
      native: `${objectName}.${methodName}(${fixedParams})`,
    },
    ...options,
  })
}

/**
 * Creates alternatives for static methods (Array.isArray(), Object.keys(), Math.max())
 *
 * @example
 * // Creates: _.isArray(value) → Array.isArray(value)
 * createStaticMethodAlternative(FunctionCategory.Array, 'isArray', 'Array', 'Check if array')
 *
 * // Creates: _.max(numbers) → Math.max(...numbers)
 * createStaticMethodAlternative(FunctionCategory.Number, 'max', 'Math', 'Get maximum', '...numbers')
 */
export function createStaticMethodAlternative(
  category: FunctionCategory,
  lodashName: string,
  nativeObject: string,
  description: string,
  params = 'value',
  options?: Partial<CreateAlternativeOptions>,
): NativeAlternative {
  return createAlternative({
    category,
    native: `${nativeObject}.${lodashName}`,
    description,
    example: {
      lodash: `_.${lodashName}(${params})`,
      native: `${nativeObject}.${lodashName}(${params})`,
    },
    ...options,
  })
}

/**
 * Creates alternatives for direct expressions (typeof checks, comparisons)
 *
 * @example
 * // Creates: _.isNull(value) → value === null
 * createExpressionAlternative(FunctionCategory.Function, 'isNull', 'value === null', 'Check if null')
 *
 * // Creates: _.isString(value) → typeof value === "string"
 * createExpressionAlternative(FunctionCategory.Function, 'isString', 'typeof value === "string"', 'Check if string')
 */
export function createExpressionAlternative(
  category: FunctionCategory,
  lodashName: string,
  nativeExpression: string,
  description: string,
  options?: Partial<CreateAlternativeOptions>,
): NativeAlternative {
  return createAlternative({
    category,
    native: nativeExpression,
    description,
    example: {
      lodash: `_.${lodashName}(value)`,
      native: nativeExpression,
    },
    ...options,
  })
}

/**
 * Helper function for Object static methods with null safety concerns
 */
export function createObjectStaticMethodWithNullSafety(
  methodName: string,
  description: string,
  customParam?: string,
  options?: Partial<CreateAlternativeOptions>,
): NativeAlternative {
  return createStaticMethodAlternative(
    FunctionCategory.Object,
    methodName,
    'Object',
    description,
    customParam || 'object || {}',
    {
      safety: safetyConfigs.nullUndefinedThrows,
      migration: migrationConfigs.nullSafetyHandling,
      ...options,
    },
  )
}

/**
 * Helper function for simple array prototype methods with standard patterns
 */
export function createSimpleArrayMethod(
  methodName: string,
  description: string,
  params: string,
  relatedGroup: string[],
): NativeAlternative {
  return createPrototypeMethodAlternative(
    FunctionCategory.Array,
    methodName,
    description,
    params,
    { related: relatedGroup },
  )
}
