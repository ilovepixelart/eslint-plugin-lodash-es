/**
 * TypeScript types for the lodash-es ESLint plugin
 */
import { lodashModules, lodashFunctions, nativeAlternatives } from './constants'
import type { NativeAlternative } from './shared'

import type { Rule } from 'eslint'

// Re-export commonly used types from shared
export type {
  NativeAlternative,
  AlternativeFilterConfig,
  SafetyLevel,
  MigrationDifficulty,
  FunctionCategory,
  NativeExample,
  SafetyInfo,
  MigrationInfo,
} from './shared'

export type LodashModuleName = typeof lodashModules extends Set<infer T> ? T : never
export type LodashFunctionName = typeof lodashFunctions extends Set<infer T> ? T : never
export type LodashAlternativeFunctionName = typeof nativeAlternatives extends Map<infer K, NativeAlternative> ? K : never

export interface Usage {
  start: number
  end: number
  fullMatch: string
  functionName: LodashFunctionName
  originalText: string
}

export interface FlatConfig {
  name?: string
  plugins?: Record<string, ESLintPlugin>
  rules?: Record<string, string | string[]>
}

export interface LegacyConfig {
  plugins: string[]
  rules: Record<string, string>
}

export interface ESLintPlugin {
  rules: Record<string, Rule.RuleModule>
  configs: {
    'base': FlatConfig[]
    'recommended': FlatConfig[]
    'all': FlatConfig[]
    'recommended-legacy': LegacyConfig
  }
}

export interface EnforceFunctionsRuleOptions {
  exclude?: LodashFunctionName[]
  include?: LodashFunctionName[]
}

export interface SuggestNativeAlternativesRuleOptions {
  includeAll?: boolean
  excludeUnsafe?: boolean
}
