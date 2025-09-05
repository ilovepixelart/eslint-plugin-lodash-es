/**
 * Shared utility functions for lodash-es ESLint rules
 */
import type { Rule, SourceCode } from 'eslint'
import { lodashModules, lodashFunctions } from './constants'

export interface Usage {
  start: number
  end: number
  fullMatch: string
  functionName: string
  originalText: string
}

/**
 * Get source code from ESLint context (handles deprecated API)
 */
export function getSourceCode(context: Rule.RuleContext): SourceCode {
  return context.sourceCode ?? context.getSourceCode()
}

/**
 * Check if import source is a lodash module
 */
export function isLodashModule(source: string): boolean {
  return lodashModules.has(source)
}

/**
 * Check if function name is a valid lodash function
 */
export function isLodashFunction(functionName: string): boolean {
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
    const functionName = match[1]
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
export function extractFunctionNames(sourceCode: string, importName: string): string[] {
  const functionNames = new Set<string>()
  const regex = createLodashMemberRegex(importName)
  let match

  while ((match = regex.exec(sourceCode)) !== null) {
    const functionName = match[1]
    if (functionName && isLodashFunction(functionName)) {
      functionNames.add(functionName)
    }
  }

  return Array.from(functionNames).sort((a, b) => a.localeCompare(b))
}
