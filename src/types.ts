/**
 * Simplified TypeScript types for the lodash-es ESLint plugin
 * Ultra-elegant type definitions with improved developer experience
 */

// Import and re-export all core types for convenience
export type {
  // Core types
  LodashFunctionName,
  LodashModuleName,
  LodashAlternativeFunctionName,

  // Configuration types
  EnforceFunctionsRuleOptions,
  FlatConfig,
  LegacyConfig,
  ESLintPlugin,
  RuleConfig,
  RuleLevel,

  // Usage and autofix types
  Usage,
  FixResult,
  CallInfo,
  TransformPattern,

  // Test utility types
  TransformTest,
  TestConfig,

  // Alternative types from shared
  NativeAlternative,
  AlternativeFilterConfig,
  SafetyLevel,
  MigrationDifficulty,
  FunctionCategory,
  NativeExample,
  SafetyInfo,
  MigrationInfo,
} from './types/core'

export interface SuggestNativeAlternativesRuleOptions {
  includeAll?: boolean
  excludeUnsafe?: boolean
}
