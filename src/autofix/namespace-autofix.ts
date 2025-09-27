/**
 * Autofix functionality for namespace lodash imports
 * Transforms: _.map(array, fn) -> array.map(fn)
 * Transforms: lodash.map(array, fn) -> array.map(fn)
 */
import type { SourceCode } from 'eslint'
import type { Usage, LodashFunctionName } from '../types'
import { getNativeAlternative } from '../utils'
import { findClosingParenthesis } from './parameter-parser'
import {
  type FixResult,
  type CallInfo,
  createAutofixRouting,
} from './shared-transforms'

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
  const fullText = sourceCode.getText()
  const callStart = usage.start
  const callEnd = findClosingParenthesis(fullText, usage.end)
  const fullCall = fullText.slice(callStart, callEnd)

  // Extract parameters from namespace call: _.map(array, fn) or lodash.map(array, fn)
  const regex = new RegExp(`^[\\w$]+\\.${functionName}\\s*\\((.*)\\)$`, 's')
  const match = regex.exec(fullCall)
  if (!match) return null

  const callInfo: CallInfo = {
    fullText,
    callStart,
    callEnd,
    params: match[1]?.trim() || '',
  }

  const nativeAlternative = getNativeAlternative(functionName as LodashFunctionName)
  if (!nativeAlternative) return null

  const nativeMethod = nativeAlternative.native

  return createAutofixRouting(callInfo, nativeMethod, functionName)
}
