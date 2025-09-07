/**
 * TypeScript types for the lodash-es ESLint plugin
 */
import type { Rule } from 'eslint'

export interface Usage {
  start: number
  end: number
  fullMatch: string
  functionName: LodashFunctionName
  originalText: string
}

import type { LodashFunctionName } from './constants'

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
  exclude?: string[]
  include?: string[]
}

export interface SuggestNativeAlternativesRuleOptions {
  includeAll?: boolean
  excludeUnsafe?: boolean
}

export const safetyLevels = ['safe', 'caution', 'unsafe'] as const
export const migrationDifficulties = ['easy', 'medium', 'hard'] as const
export const functionCategories = ['array', 'object', 'string', 'number', 'date', 'function', 'collection'] as const

// Native alternatives types
export type SafetyLevel = typeof safetyLevels[number]
export type MigrationDifficulty = typeof migrationDifficulties[number]
export type FunctionCategory = typeof functionCategories[number]

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
