/**
 * Autofix functionality for namespace lodash imports
 * Transforms: _.map(array, fn) -> array.map(fn)
 * Transforms: lodash.map(array, fn) -> array.map(fn)
 */
import type { SourceCode } from 'eslint'
import type { Usage, LodashFunctionName } from '../types'
import { getNativeAlternative } from '../utils'
import { findFirstTopLevelComma, extractMethodName, findClosingParenthesis, needsParentheses, isArrayLikeObject, isStaticMethod, extractStaticMethodInfo, isConstructorCall } from './parameter-parser'

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

  // Check if this is a constructor call (e.g., _.toNumber -> Number)
  if (isConstructorCall(nativeAlternative.native, functionName)) {
    // For constructor calls: _.toNumber(str) -> Number(str)
    const constructorName = nativeAlternative.native.split('.')[0] // Extract "Number" from "Number.toNumber"
    const replacement = `${constructorName}(${params})`
    return {
      range: [callStart, callEnd],
      text: replacement,
    }
  }

  // Check if this is a static method (e.g., Object.keys, Math.max)
  if (isStaticMethod(nativeAlternative.native)) {
    const staticInfo = extractStaticMethodInfo(nativeAlternative.native)
    if (!staticInfo) return null

    // For static methods, all parameters are arguments to the static method
    // Transform: _.keys(obj) -> Object.keys(obj)
    // Transform: _.max(numbers) -> Math.max(...numbers) (special case for Math functions)
    let transformedParams = params

    // Special handling for Math functions that need spread operator
    if (staticInfo.object === 'Math' && ['max', 'min'].includes(staticInfo.method)) {
      // Check if the parameter looks like an array that should be spread
      const trimmedParams = params.trim()
      if (!trimmedParams.startsWith('...')) {
        transformedParams = `...${trimmedParams}`
      }
    }

    const replacement = `${staticInfo.object}.${staticInfo.method}(${transformedParams})`
    return {
      range: [callStart, callEnd],
      text: replacement,
    }
  }

  // Handle prototype methods (existing logic)
  const nativeMethod = extractMethodName(nativeAlternative.native)
  if (!nativeMethod) return null

  // Handle both single and multi-parameter functions
  const firstCommaIndex = findFirstTopLevelComma(params)

  let targetParam: string
  let restParams: string

  if (firstCommaIndex === -1) {
    // Single parameter function (e.g., trim(string))
    targetParam = params
    restParams = ''
  } else {
    // Multi-parameter function (e.g., map(array, fn))
    targetParam = params.slice(0, firstCommaIndex).trim()
    restParams = params.slice(firstCommaIndex + 1).trim()
  }

  // Handle array-like objects that don't have native array methods
  let safeTargetParam: string
  if (isArrayLikeObject(targetParam)) {
    // Transform array-like objects to Array.from(arrayLike)
    safeTargetParam = `Array.from(${targetParam})`
  } else {
    // Wrap target parameter in parentheses if it contains operators that need precedence protection
    safeTargetParam = needsParentheses(targetParam) ? `(${targetParam})` : targetParam
  }

  const replacement = restParams
    ? `${safeTargetParam}.${nativeMethod}(${restParams})`
    : `${safeTargetParam}.${nativeMethod}()`

  return {
    range: [callStart, callEnd],
    text: replacement,
  }
}
