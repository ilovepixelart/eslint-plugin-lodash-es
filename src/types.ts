/**
 * TypeScript types for the lodash-es ESLint plugin
 */
import { lodashModules, lodashFunctions, nativeAlternatives, SafetyLevel, MigrationDifficulty, FunctionCategory } from './constants'

import type { Rule } from 'eslint'

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
