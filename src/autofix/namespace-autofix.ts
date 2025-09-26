/**
 * Autofix functionality for namespace lodash imports
 * Transforms: _.map(array, fn) -> array.map(fn)
 * Transforms: lodash.map(array, fn) -> array.map(fn)
 */
import type { SourceCode } from 'eslint'
import type { Usage, LodashFunctionName } from '../types'
import { getNativeAlternative } from '../utils'
import { findFirstTopLevelComma, extractMethodName, findClosingParenthesis, needsParentheses, isArrayLikeObject } from './parameter-parser'

/**
 * Create a fix for namespace/default lodash function calls
 * Transforms: _.map(array, fn) -> array.map(fn)
 * Transforms: lodash.map(array, fn) -> array.map(fn)
 */
export function createNamespaceFix(
  sourceCode: SourceCode,
  usage: Usage,
  functionName: string,
): { range: [number, number], text: string } | null {
  const fullText = sourceCode.getText()

  // Find the full function call including parameters
  const callStart = usage.start
  const callEnd = findClosingParenthesis(fullText, usage.end)

  const fullCall = fullText.slice(callStart, callEnd)

  // Extract parameters from namespace call: _.map(array, fn) or lodash.map(array, fn)
  const regex = new RegExp(`^[\\w$]+\\.${functionName}\\s*\\((.*)\\)$`, 's')
  const match = regex.exec(fullCall)
  if (!match) return null

  const params = match[1]?.trim()
  if (!params) return null

  const nativeAlternative = getNativeAlternative(functionName as LodashFunctionName)
  if (!nativeAlternative) return null

  const nativeMethod = extractMethodName(nativeAlternative.native)
  if (!nativeMethod) return null

  // Use the same approach as destructured fix
  const firstCommaIndex = findFirstTopLevelComma(params)
  if (firstCommaIndex === -1) return null

  const arrayParam = params.slice(0, firstCommaIndex).trim()
  const restParams = params.slice(firstCommaIndex + 1).trim()

  // Handle array-like objects that don't have native array methods
  let safeArrayParam: string
  if (isArrayLikeObject(arrayParam)) {
    // Transform array-like objects to Array.from(arrayLike)
    safeArrayParam = `Array.from(${arrayParam})`
  } else {
    // Wrap array parameter in parentheses if it contains operators that need precedence protection
    safeArrayParam = needsParentheses(arrayParam) ? `(${arrayParam})` : arrayParam
  }

  const replacement = `${safeArrayParam}.${nativeMethod}(${restParams})`

  return {
    range: [callStart, callEnd],
    text: replacement,
  }
}
