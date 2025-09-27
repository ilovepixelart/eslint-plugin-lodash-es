/**
 * TypeScript utility types for enhanced developer experience
 * Provides convenient type helpers for plugin development
 */
import type { LodashFunctionName, EnforceFunctionsRuleOptions } from './core'

/**
 * Enhanced utility types with better IntelliSense
 */

// Standard TypeScript utilities re-exported for convenience
export type Partial<T> = { [P in keyof T]?: T[P] }
export type Required<T> = { [P in keyof T]-?: T[P] }
export type Pick<T, K extends keyof T> = { [P in K]: T[P] }
export type Omit<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RecordType<K extends keyof any, T> = Record<K, T>

/**
 * Plugin-specific utility types
 */

/** Create a strict subset of lodash functions */
export type LodashFunctionSubset<T extends readonly LodashFunctionName[]> = T[number]

/** Make all properties of EnforceFunctionsRuleOptions required */
export type StrictEnforceFunctionsOptions = Required<EnforceFunctionsRuleOptions>

/** Create a configuration with only include option */
export type IncludeOnlyConfig = Pick<EnforceFunctionsRuleOptions, 'include'>

/** Create a configuration with only exclude option */
export type ExcludeOnlyConfig = Pick<EnforceFunctionsRuleOptions, 'exclude'>

/** Array method function names */
export type ArrayMethodName = Extract<LodashFunctionName,
  | 'map' | 'filter' | 'some' | 'every' | 'reduce' | 'forEach'
  | 'includes' | 'indexOf' | 'slice' | 'concat' | 'join' | 'reverse'
>

/** String method function names */
export type StringMethodName = Extract<LodashFunctionName,
  | 'trim' | 'toLower' | 'toUpper' | 'startsWith' | 'endsWith'
  | 'repeat' | 'replace' | 'split' | 'padStart' | 'padEnd'
>

/** Type checking function names */
export type TypeCheckingName = Extract<LodashFunctionName,
  | 'isArray' | 'isString' | 'isNumber' | 'isBoolean' | 'isFunction'
  | 'isObject' | 'isNull' | 'isUndefined' | 'isNil'
>

/** Object utility function names */
export type ObjectUtilityName = Extract<LodashFunctionName,
  | 'keys' | 'values' | 'entries' | 'assign' | 'merge' | 'pick' | 'omit' | 'get' | 'has'
>

/** Math utility function names */
export type MathUtilityName = Extract<LodashFunctionName,
  | 'max' | 'min' | 'ceil' | 'floor' | 'round'
>

/**
 * Function category mapping
 */
export interface FunctionCategoryMap {
  array: ArrayMethodName[]
  string: StringMethodName[]
  typeChecking: TypeCheckingName[]
  object: ObjectUtilityName[]
  math: MathUtilityName[]
}

/**
 * Configuration builder helpers
 */
export interface ConfigurationBuilder {
  /** Create exclude-only configuration */
  exclude: <T extends readonly LodashFunctionName[]>(...functions: T) => ExcludeOnlyConfig
  /** Create include-only configuration */
  include: <T extends readonly LodashFunctionName[]>(...functions: T) => IncludeOnlyConfig
  /** Create configuration for specific category */
  category: <K extends keyof FunctionCategoryMap>(category: K) => EnforceFunctionsRuleOptions
}

/**
 * Type guards for runtime type checking
 */
export interface TypeGuards {
  /** Check if value is a valid lodash function name */
  isLodashFunction: (value: string) => value is LodashFunctionName
  /** Check if configuration is exclude-only */
  isExcludeConfig: (config: EnforceFunctionsRuleOptions) => config is ExcludeOnlyConfig
  /** Check if configuration is include-only */
  isIncludeConfig: (config: EnforceFunctionsRuleOptions) => config is IncludeOnlyConfig
}

/**
 * Template types for test creation
 */
export interface TestTemplate<T extends LodashFunctionName> {
  function: T
  input: string
  expected: string
  description?: string
}

export type TestSuite<T extends readonly LodashFunctionName[]> = {
  [K in T[number]]: TestTemplate<K>[]
}

/**
 * Advanced type utilities for plugin authors
 */

/** Extract function names that have native alternatives */
export type FunctionsWithNatives = LodashFunctionName // All functions have natives in this plugin

/** Extract functions by safety level */
export type SafeFunctions = LodashFunctionName // Plugin-specific implementation needed

/** Extract functions by migration difficulty */
export type EasyMigrationFunctions = LodashFunctionName // Plugin-specific implementation needed

/**
 * Conditional types for advanced scenarios
 */

/** Configuration validator */
export type ValidateConfig<T extends EnforceFunctionsRuleOptions>
  = T extends { include: unknown, exclude: unknown }
    ? never // Invalid: cannot have both include and exclude
    : T

/** Function list validator */
export type ValidateFunctionList<T extends readonly string[]>
  = T extends readonly LodashFunctionName[] ? T : never

/**
 * Branded types for enhanced type safety
 */

/** Branded type for validated configurations */
export type ValidatedConfig = EnforceFunctionsRuleOptions & { __validated: true }

/** Branded type for test configurations */
export type TestConfig = EnforceFunctionsRuleOptions & { __test: true }
