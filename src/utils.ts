/**
 * Shared utility functions for lodash-es ESLint rules
 */
import { lodashModules, lodashFunctions, nativeAlternatives } from './constants'

import type { Rule, SourceCode } from 'eslint'
import type { Usage, NativeAlternative, FunctionCategory, MigrationDifficulty, AlternativeFilterConfig, LodashFunctionName, LodashModuleName, LodashAlternativeFunctionName } from './types'

/**
 * Get source code from ESLint context (handles deprecated API)
 */
export function getSourceCode(context: Rule.RuleContext): SourceCode {
  return context.sourceCode ?? context.getSourceCode()
}

/**
 * Check if import source is a lodash module
 */
export function isLodashModule(source: LodashModuleName): boolean {
  return lodashModules.has(source)
}

/**
 * Check if function name is a valid lodash function
 */
export function isLodashFunction(functionName: LodashFunctionName): boolean {
  return lodashFunctions.has(functionName)
}

/**
 * Create regex pattern for finding lodash member expressions
 */
export function createLodashMemberRegex(importName: string): RegExp {
  return new RegExp(`\\b${importName}\\.(\\w+)`, 'g')
}

/**
 * Find all lodash function usages in source code
 */
export function findLodashUsages(sourceCode: string, importName: string): Usage[] {
  const usages: Usage[] = []
  const regex = createLodashMemberRegex(importName)
  let match

  while ((match = regex.exec(sourceCode)) !== null) {
    const functionName = match[1] as LodashFunctionName
    if (functionName && isLodashFunction(functionName)) {
      usages.push({
        start: match.index,
        end: match.index + match[0].length,
        fullMatch: match[0],
        functionName: functionName,
        originalText: match[0],
      })
    }
  }

  return usages
}

/**
 * Extract unique function names from lodash usage patterns
 */
export function extractFunctionNames(sourceCode: string, importName: string): LodashFunctionName[] {
  const functionNames = new Set<LodashFunctionName>()
  const regex = createLodashMemberRegex(importName)
  let match

  while ((match = regex.exec(sourceCode)) !== null) {
    const functionName = match[1] as LodashFunctionName
    if (functionName && isLodashFunction(functionName)) {
      functionNames.add(functionName)
    }
  }

  return Array.from(functionNames).sort((a, b) => a.localeCompare(b))
}

/**
 * Get native alternative for a lodash function
 */
export function getNativeAlternative(functionName: LodashAlternativeFunctionName | LodashFunctionName): NativeAlternative | undefined {
  if (!isLodashFunction(functionName)) return undefined
  return nativeAlternatives.get(functionName as LodashAlternativeFunctionName)
}

/**
 * Check if a lodash function has a native alternative
 */
export function hasNativeAlternative(functionName: LodashAlternativeFunctionName | LodashFunctionName): boolean {
  if (!isLodashFunction(functionName)) return false
  return nativeAlternatives.has(functionName as LodashAlternativeFunctionName)
}

// Utility functions for working with alternatives structure

/**
 * Get alternatives by function category (array, object, string, etc.)
 */
export function getAlternativesByCategory(category: FunctionCategory): Partial<Record<LodashAlternativeFunctionName, NativeAlternative>> {
  const result: Partial<Record<LodashAlternativeFunctionName, NativeAlternative>> = {}
  for (const [key, alt] of nativeAlternatives) {
    if (alt.category === category) {
      result[key] = alt
    }
  }
  return result
}

/**
 * Get only safe alternatives (no behavioral differences)
 */
export function getSafeAlternatives(): Partial<Record<LodashAlternativeFunctionName, NativeAlternative>> {
  const result: Partial<Record<LodashAlternativeFunctionName, NativeAlternative>> = {}
  for (const [key, alt] of nativeAlternatives) {
    if (alt.safety.level === 'safe') {
      result[key] = alt
    }
  }
  return result
}

/**
 * Get alternatives by migration difficulty level
 */
export function getAlternativesByDifficulty(difficulty: MigrationDifficulty): Partial<Record<LodashAlternativeFunctionName, NativeAlternative>> {
  const result: Partial<Record<LodashAlternativeFunctionName, NativeAlternative>> = {}
  for (const [key, alt] of nativeAlternatives) {
    if (alt.migration.difficulty === difficulty) {
      result[key] = alt
    }
  }
  return result
}

/**
 * Get filtered alternatives based on configuration
 */
export function getFilteredAlternatives(config: AlternativeFilterConfig): Partial<Record<string, NativeAlternative>> {
  const result: Partial<Record<string, NativeAlternative>> = {}
  for (const [key, alt] of nativeAlternatives) {
    if (config.categories && !config.categories.includes(alt.category)) continue
    if (config.safetyLevels && !config.safetyLevels.includes(alt.safety.level)) continue
    if (config.excludeByDefault === false && alt.excludeByDefault) continue
    if (config.maxDifficulty) {
      const difficultyOrder = { easy: 0, medium: 1, hard: 2 }
      const maxLevel = difficultyOrder[config.maxDifficulty]
      const altLevel = difficultyOrder[alt.migration.difficulty]
      if (altLevel > maxLevel) continue
    }
    result[key] = alt
  }
  return result
}
