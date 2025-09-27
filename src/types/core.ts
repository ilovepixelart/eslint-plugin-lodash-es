/**
 * Ultra-simplified core type definitions for better developer experience
 * Eliminates complex type derivations and improves IntelliSense
 */

// Re-export commonly used types from shared for convenience
export type {
  NativeAlternative,
  SafetyLevel,
  MigrationDifficulty,
  FunctionCategory,
  NativeExample,
  SafetyInfo,
  MigrationInfo,
  AlternativeFilterConfig,
} from '../shared'

/**
 * Simplified Lodash function names - comprehensive list for better autocompletion
 */
export type LodashFunctionName
  // Array functions
  = | 'chunk' | 'compact' | 'concat' | 'difference' | 'drop' | 'fill' | 'findIndex'
    | 'findLastIndex' | 'first' | 'flatten' | 'flattenDeep' | 'head' | 'indexOf'
    | 'initial' | 'join' | 'last' | 'lastIndexOf' | 'nth' | 'reverse' | 'slice'
    | 'sortBy' | 'tail' | 'take' | 'uniq' | 'without'
  // Collection functions
    | 'countBy' | 'each' | 'every' | 'filter' | 'findLast' | 'flatMap'
    | 'forEach' | 'groupBy' | 'includes' | 'keyBy' | 'map' | 'orderBy' | 'partition'
    | 'reduce' | 'reduceRight' | 'reject' | 'sample' | 'shuffle' | 'size' | 'some'
  // String functions
    | 'camelCase' | 'capitalize' | 'endsWith' | 'escape' | 'kebabCase' | 'lowerCase'
    | 'pad' | 'padEnd' | 'padStart' | 'repeat' | 'replace' | 'split' | 'startCase'
    | 'startsWith' | 'toLower' | 'toUpper' | 'trim' | 'trimEnd' | 'trimStart'
  // Object functions
    | 'assign' | 'defaults' | 'entries' | 'get' | 'has' | 'keys' | 'merge' | 'omit'
    | 'pick' | 'set' | 'values'
  // Type checking functions
    | 'isArray' | 'isBoolean' | 'isFunction' | 'isNull' | 'isNumber' | 'isObject'
    | 'isString' | 'isUndefined' | 'isNil'
  // Math functions
    | 'ceil' | 'floor' | 'max' | 'min' | 'round'
  // Date functions
    | 'now'
  // Utility functions
    | 'clone' | 'cloneDeep' | 'identity' | 'noop' | 'toNumber' | 'toString'

/**
 * Simplified Lodash module names
 */
export type LodashModuleName = 'lodash' | 'lodash-es'

/**
 * Configuration options for enforce-functions rule
 */
export interface EnforceFunctionsRuleOptions {
  /** Array of function names to exclude/disallow */
  exclude?: LodashFunctionName[]
  /** Array of function names to include/allow (if provided, only these are allowed) */
  include?: LodashFunctionName[]
}

/**
 * Usage information for a lodash function call
 */
export interface Usage {
  /** Start position in source code */
  start: number
  /** End position in source code */
  end: number
  /** Full matched text */
  fullMatch: string
  /** Name of the lodash function */
  functionName: LodashFunctionName
  /** Original text that was matched */
  originalText: string
}

/**
 * ESLint flat configuration format
 */
export interface FlatConfig {
  /** Configuration name */
  name?: string
  /** Plugin definitions */
  plugins?: Record<string, ESLintPlugin>
  /** Rule configurations */
  rules?: Record<string, RuleConfig>
}

/**
 * ESLint legacy configuration format
 */
export interface LegacyConfig {
  /** Plugin names */
  plugins: string[]
  /** Rule configurations */
  rules: Record<string, string>
}

/**
 * ESLint plugin structure
 */
export interface ESLintPlugin {
  /** Available rules */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules: Record<string, any>
  /** Pre-defined configurations */
  configs: {
    'base': FlatConfig[]
    'recommended': FlatConfig[]
    'all': FlatConfig[]
    'recommended-legacy': LegacyConfig
  }
}

/**
 * Rule configuration value types
 */
export type RuleConfig
  = | 'off' | 0
    | 'warn' | 1
    | 'error' | 2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | [RuleLevel, ...any[]]

export type RuleLevel = 'off' | 'warn' | 'error' | 0 | 1 | 2

import type { CallInfo, FixResult } from '../autofix/parameter-parser'

/**
 * Transform pattern for pattern-based autofix system
 */
export interface TransformPattern {
  /** Pattern name for debugging */
  name: string
  /** Detection function */
  detect: (alternative: string) => boolean
  /** Transform function */
  transform: (callInfo: CallInfo, alternative?: string) => FixResult | null
}

/**
 * Test utilities types
 */
export interface TransformTest {
  /** Test name */
  name: string
  /** Input code */
  input: string
  /** Expected output */
  expected: string
  /** Function name being tested */
  functionName?: LodashFunctionName
  /** Rule options */
  options?: EnforceFunctionsRuleOptions | undefined
}

export interface TestConfig {
  /** ECMAScript version */
  ecmaVersion?: 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 'latest'
  /** Source type */
  sourceType?: 'script' | 'module'
  /** ESLint rule to test */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rule?: any
}
