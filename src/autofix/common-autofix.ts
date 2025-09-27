/**
 * Common autofix logic shared between destructured and namespace autofixes
 */
import type { SourceCode } from 'eslint'
import type { Usage, LodashFunctionName } from '../types'
import { getNativeAlternative } from '../utils'
import { RegexCache } from '../regex-cache'
import { findClosingParenthesis, CallInfo, FixResult } from './parameter-parser'
import {
  createAutofixRouting,
} from './shared-transforms'

/**
 * Common autofix creation logic
 * @param sourceCode ESLint source code object
 * @param usage Usage information from ESLint node
 * @param functionName Name of the lodash function
 * @param parameterRegex Regex to extract parameters from the function call
 * @returns Fix result or null if no fix possible
 */
export function createCommonAutofix(
  sourceCode: SourceCode,
  usage: Usage,
  functionName: string,
  parameterRegex: RegExp,
): FixResult | null {
  const fullText = sourceCode.getText()
  const callStart = usage.start
  const callEnd = findClosingParenthesis(fullText, usage.end)
  const fullCall = fullText.slice(callStart, callEnd)

  // Extract parameters using provided regex
  const match = parameterRegex.exec(fullCall)
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

/**
 * Create regex for destructured function calls
 * @param functionName Name of the function
 * @returns Cached regex pattern for extracting parameters
 */
export function createDestructuredRegex(functionName: string): RegExp {
  return RegexCache.getFunctionCallRegex(functionName)
}

/**
 * Create regex for namespace function calls (_.func or lodash.func)
 * @param functionName Name of the function
 * @returns Cached regex pattern for extracting parameters
 */
export function createNamespaceRegex(functionName: string): RegExp {
  return RegexCache.getNamespaceFunctionRegex(functionName)
}
