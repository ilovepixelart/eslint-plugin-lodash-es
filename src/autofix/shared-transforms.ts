/**
 * Shared transformation utilities for both destructured and namespace autofix
 */
import { findFirstTopLevelComma, extractMethodName, needsParentheses, isArrayLikeObject, extractStaticMethodInfo } from './parameter-parser'

export interface FixResult {
  range: [number, number]
  text: string
}

export interface CallInfo {
  fullText: string
  callStart: number
  callEnd: number
  params: string
}

/**
 * Check for negation operator before function call and adjust range/expression accordingly
 */
export function handleNegationOperator(callInfo: CallInfo, expression: string): { start: number, text: string } {
  let actualStart = callInfo.callStart
  let actualExpression = expression

  // Look backward from callStart to check for negation operator
  let checkPos = callInfo.callStart - 1
  while (checkPos >= 0 && /\s/.test(callInfo.fullText[checkPos] ?? '')) {
    checkPos-- // Skip whitespace
  }

  if (checkPos >= 0 && callInfo.fullText[checkPos] === '!') {
    // Include the negation operator and wrap the expression in parentheses
    actualStart = checkPos
    actualExpression = `!(${expression})`
  }

  return { start: actualStart, text: actualExpression }
}

/**
 * Create fix for zero-parameter static methods (e.g., now -> Date.now)
 */
export function createZeroParamStaticFix(callInfo: CallInfo, nativeAlternative: string): FixResult {
  return {
    range: [callInfo.callStart, callInfo.callEnd],
    text: `${nativeAlternative}()`,
  }
}

/**
 * Create fix for expression alternatives (e.g., isNull -> value === null)
 */
export function createExpressionFix(callInfo: CallInfo, nativeAlternative: string): FixResult | null {
  if (!callInfo.params) return null

  // Special handling for "has" function: has(object, key) -> key in object
  if (nativeAlternative === 'key in object') {
    const commaIndex = findFirstTopLevelComma(callInfo.params)
    if (commaIndex === -1) return null

    const object = callInfo.params.slice(0, commaIndex).trim()
    const key = callInfo.params.slice(commaIndex + 1).trim()

    // Handle parameters that might need parentheses
    let safeObject = object
    if (needsParentheses(object)) {
      safeObject = `(${object})`
    }

    const expression = `${key} in ${safeObject}`
    const { start, text } = handleNegationOperator(callInfo, expression)

    return {
      range: [start, callInfo.callEnd],
      text,
    }
  }

  // Handle standard single-parameter expression alternatives
  let safeParam = callInfo.params
  if (needsParentheses(callInfo.params)) {
    safeParam = `(${callInfo.params})`
  }

  // Replace "value" placeholder with actual parameter
  const expression = nativeAlternative.replace(/\bvalue\b/g, safeParam)

  // Handle negation operator
  const { start, text } = handleNegationOperator(callInfo, expression)

  return {
    range: [start, callInfo.callEnd],
    text,
  }
}

/**
 * Create fix for constructor calls (e.g., toNumber -> Number)
 */
export function createConstructorFix(callInfo: CallInfo, nativeAlternative: string): FixResult | null {
  if (!callInfo.params) return null

  const constructorName = nativeAlternative.split('.')[0] // Extract "Number" from "Number.toNumber"
  return {
    range: [callInfo.callStart, callInfo.callEnd],
    text: `${constructorName}(${callInfo.params})`,
  }
}

/**
 * Create fix for static methods (e.g., Object.keys, Math.max)
 */
export function createStaticMethodFix(callInfo: CallInfo, nativeAlternative: string): FixResult | null {
  const staticInfo = extractStaticMethodInfo(nativeAlternative)
  if (!staticInfo) return null

  let transformedParams = callInfo.params

  // Special handling for Math functions that need spread operator
  if (staticInfo.object === 'Math' && ['max', 'min'].includes(staticInfo.method)) {
    const trimmedParams = callInfo.params.trim()
    if (!trimmedParams.startsWith('...')) {
      transformedParams = `...${trimmedParams}`
    }
  }

  return {
    range: [callInfo.callStart, callInfo.callEnd],
    text: `${staticInfo.object}.${staticInfo.method}(${transformedParams})`,
  }
}

/**
 * Check if native alternative is a fixed-parameter prototype method
 */
export function isFixedParamPrototypeMethod(nativeAlternative: string): boolean {
  return /\w+\.prototype\.\w+\[.+\]$/.test(nativeAlternative)
}

/**
 * Extract fixed parameters from encoded native alternative
 */
export function extractFixedParams(nativeAlternative: string): string | null {
  const match = RegExp(/\[(.+)\]$/).exec(nativeAlternative)
  return match ? match[1] ?? null : null
}

/**
 * Create fix for fixed-parameter prototype methods (e.g., first -> array.at(0))
 */
export function createFixedParamPrototypeMethodFix(callInfo: CallInfo, nativeAlternative: string): FixResult | null {
  const nativeMethod = extractMethodName(nativeAlternative)
  if (!nativeMethod) return null

  const fixedParams = extractFixedParams(nativeAlternative)
  if (!fixedParams) return null

  // For fixed-param methods, the entire callInfo.params is the target object
  const targetParam = callInfo.params

  // Handle array-like objects that don't have native array methods
  let safeTargetParam: string
  if (isArrayLikeObject(targetParam)) {
    safeTargetParam = `Array.from(${targetParam})`
  } else {
    safeTargetParam = needsParentheses(targetParam) ? `(${targetParam})` : targetParam
  }

  const replacement = `${safeTargetParam}.${nativeMethod}(${fixedParams})`

  return {
    range: [callInfo.callStart, callInfo.callEnd],
    text: replacement,
  }
}

/**
 * Create fix for prototype methods (e.g., map -> array.map)
 */
export function createPrototypeMethodFix(callInfo: CallInfo, nativeAlternative: string, functionName?: string): FixResult | null {
  const nativeMethod = extractMethodName(nativeAlternative)
  if (!nativeMethod) return null

  // Find the first comma to separate target parameter from rest
  const firstCommaIndex = findFirstTopLevelComma(callInfo.params)

  let targetParam: string
  let restParams: string

  if (firstCommaIndex === -1) {
    // Single parameter function (e.g., trim(string))
    targetParam = callInfo.params
    restParams = ''
  } else {
    // Multi-parameter function (e.g., map(array, fn))
    targetParam = callInfo.params.slice(0, firstCommaIndex).trim()
    restParams = callInfo.params.slice(firstCommaIndex + 1).trim()
  }

  // Handle array-like objects that don't have native array methods
  let safeTargetParam: string
  if (isArrayLikeObject(targetParam)) {
    safeTargetParam = `Array.from(${targetParam})`
  } else {
    safeTargetParam = needsParentheses(targetParam) ? `(${targetParam})` : targetParam
  }

  // Special handling for reject function - needs predicate inversion
  if (functionName === 'reject' && nativeMethod === 'filter') {
    if (!restParams) return null

    // Check if predicate is an arrow function - needs special handling
    const isArrowFunction = restParams.includes('=>')
    const replacement = isArrowFunction
      ? `${safeTargetParam}.filter(item => !(${restParams})(item))`
      : `${safeTargetParam}.filter(item => !${restParams}(item))`

    return {
      range: [callInfo.callStart, callInfo.callEnd],
      text: replacement,
    }
  }

  const replacement = restParams
    ? `${safeTargetParam}.${nativeMethod}(${restParams})`
    : `${safeTargetParam}.${nativeMethod}()`

  return {
    range: [callInfo.callStart, callInfo.callEnd],
    text: replacement,
  }
}
