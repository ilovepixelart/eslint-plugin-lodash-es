/**
 * TypeScript types for the lodash-es ESLint plugin
 */
import type { Rule } from 'eslint'

export interface Usage {
  start: number
  end: number
  fullMatch: string
  functionName: string
  originalText: string
}

export interface NativeAlternative {
  native: string
  description: string
  example?: {
    lodash: string
    native: string
  }
  notes?: string
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
  exclude?: string[]
  include?: string[]
}

export interface SuggestNativeAlternativesRuleOptions {
  includeAll?: boolean
  excludeUnsafe?: boolean
}
