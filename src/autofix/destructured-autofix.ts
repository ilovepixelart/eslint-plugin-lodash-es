/**
 * Autofix functionality for destructured lodash imports
 * Transforms: map(array, fn) -> array.map(fn)
 */
import type { SourceCode } from 'eslint'
import type { Usage, LodashFunctionName } from '../types'
import { getNativeAlternative } from '../utils'
import { findClosingParenthesis, isStaticMethod, isConstructorCall, isExpressionAlternative, isZeroParamStaticMethod } from './parameter-parser'
import {
  type FixResult,
  type CallInfo,
  createZeroParamStaticFix,
  createExpressionFix,
  createConstructorFix,
  createStaticMethodFix,
  createPrototypeMethodFix,
  isFixedParamPrototypeMethod,
  createFixedParamPrototypeMethodFix,
} from './shared-transforms'

/**
 * Create a fix for destructured lodash function calls
 * Transforms: map(array, fn) -> array.map(fn)
 */
export function createDestructuredFix(
  sourceCode: SourceCode,
  usage: Usage,
  functionName: string,
): FixResult | null {
  const fullText = sourceCode.getText()
  const callStart = usage.start
  const callEnd = findClosingParenthesis(fullText, usage.end)
  const fullCall = fullText.slice(callStart, callEnd)

  // Extract parameters using regex
  const regex = new RegExp(`^${functionName}\\s*\\((.*)\\)$`, 's')
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

  // Route to appropriate fix creator based on alternative type
  if (isZeroParamStaticMethod(nativeMethod)) {
    return createZeroParamStaticFix(callInfo, nativeMethod)
  }

  if (isExpressionAlternative(nativeMethod)) {
    return createExpressionFix(callInfo, nativeMethod)
  }

  if (isConstructorCall(nativeMethod, functionName)) {
    return createConstructorFix(callInfo, nativeMethod)
  }

  if (isStaticMethod(nativeMethod)) {
    return createStaticMethodFix(callInfo, nativeMethod)
  }

  if (isFixedParamPrototypeMethod(nativeMethod)) {
    return createFixedParamPrototypeMethodFix(callInfo, nativeMethod)
  }

  // Default to prototype method
  return createPrototypeMethodFix(callInfo, nativeMethod, functionName)
}
