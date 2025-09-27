/**
 * Autofix functionality for namespace lodash imports
 * Transforms: _.map(array, fn) -> array.map(fn)
 * Transforms: lodash.map(array, fn) -> array.map(fn)
 */
import type { SourceCode } from 'eslint'
import type { Usage } from '../types'
import type { FixResult } from './shared-transforms'
import { createCommonAutofix, createNamespaceRegex } from './common-autofix'

/**
 * Create a fix for namespace/default lodash function calls
 * Transforms: _.map(array, fn) -> array.map(fn)
 * Transforms: lodash.map(array, fn) -> array.map(fn)
 */
export function createNamespaceFix(
  sourceCode: SourceCode,
  usage: Usage,
  functionName: string,
): FixResult | null {
  const regex = createNamespaceRegex(functionName)
  return createCommonAutofix(sourceCode, usage, functionName, regex)
}
