/**
 * Autofix functionality for destructured lodash imports
 * Transforms: map(array, fn) -> array.map(fn)
 */
import type { SourceCode } from 'eslint'
import type { Usage } from '../types'
import type { FixResult } from './parameter-parser'
import { createCommonAutofix, createDestructuredRegex } from './common-autofix'

/**
 * Create a fix for destructured lodash function calls
 * Transforms: map(array, fn) -> array.map(fn)
 */
export function createDestructuredFix(
  sourceCode: SourceCode,
  usage: Usage,
  functionName: string,
): FixResult | null {
  const regex = createDestructuredRegex(functionName)
  return createCommonAutofix(sourceCode, usage, functionName, regex)
}
