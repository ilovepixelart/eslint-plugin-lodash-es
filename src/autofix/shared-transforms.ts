/**
 * Shared transformation utilities for both destructured and namespace autofix
 */
import { findFirstTopLevelComma, extractMethodName, needsParentheses, isArrayLikeObject, extractStaticMethodInfo, isZeroParamStaticMethod, isExpressionAlternative, isConstructorCall, isStaticMethod } from './parameter-parser'
import { createPatternBasedTransform } from './transform-patterns'
import { RegexCache } from '../regex-cache'

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
 * Handle "has" function: has(object, key) -> key in object
 */
function createHasFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const object = callInfo.params.slice(0, commaIndex).trim()
  const key = callInfo.params.slice(commaIndex + 1).trim()

  const safeObject = needsParentheses(object) ? `(${object})` : object
  const expression = `${key} in ${safeObject}`
  const { start, text } = handleNegationOperator(callInfo, expression)

  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle uniq function: uniq(array) -> [...new Set(array)]
 */
function createUniqFix(callInfo: CallInfo, nativeAlternative: string): FixResult | null {
  const expression = nativeAlternative.replaceAll('array', callInfo.params)
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle compact function: compact(array) -> array.filter(Boolean)
 */
function createCompactFix(callInfo: CallInfo): FixResult | null {
  const targetParam = needsParentheses(callInfo.params) ? `(${callInfo.params})` : callInfo.params
  const expression = `${targetParam}.filter(Boolean)`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle pick/omit functions with Object.fromEntries patterns
 */
function createPickOmitFix(callInfo: CallInfo, nativeAlternative: string): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const obj = callInfo.params.slice(0, commaIndex).trim()
  const keys = callInfo.params.slice(commaIndex + 1).trim()

  let expression: string
  if (nativeAlternative.includes('Object.entries(')) {
    // omit pattern
    expression = nativeAlternative.replaceAll(/\bobj\b/g, obj).replaceAll(/\bkeys\b/g, keys)
  } else {
    // pick pattern
    const safeObj = needsParentheses(obj) ? `(${obj})` : obj
    expression = nativeAlternative.replaceAll(/\bkeys\b/g, keys).replaceAll(/\bobj\b/g, safeObj)
  }

  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle sortBy function with toSorted
 */
function createSortByFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  const targetParam = commaIndex === -1 ? callInfo.params : callInfo.params.slice(0, commaIndex).trim()
  const safeTargetParam = needsParentheses(targetParam) ? `(${targetParam})` : targetParam

  let expression: string
  if (commaIndex === -1) {
    expression = `${safeTargetParam}.toSorted()`
  } else {
    const fn = callInfo.params.slice(commaIndex + 1).trim()
    if (fn.includes('=>')) {
      expression = `${safeTargetParam}.toSorted((a, b) => (${fn})(a) - (${fn})(b))`
    } else {
      expression = `${safeTargetParam}.toSorted((a, b) => ${fn}(a) - ${fn}(b))`
    }
  }

  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle merge function: merge(target, ...sources) -> Object.assign({}, target, ...sources)
 */
function createMergeFix(callInfo: CallInfo): FixResult | null {
  const expression = `Object.assign({}, ${callInfo.params})`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle get function with optional chaining
 */
function createGetFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const obj = callInfo.params.slice(0, commaIndex).trim()
  const path = callInfo.params.slice(commaIndex + 1).trim()

  // Simple path conversion for common cases like "a.b.c"
  if ((path.startsWith('"') && path.endsWith('"')) || (path.startsWith('\'') && path.endsWith('\''))) {
    const pathStr = path.slice(1, -1)
    if (RegexCache.getSimplePropertyPathRegex().test(pathStr)) {
      const optionalChainPath = pathStr.replaceAll('.', '?.')
      const safeObj = needsParentheses(obj) ? `(${obj})` : obj
      const expression = `${safeObj}?.${optionalChainPath}`
      const { start, text } = handleNegationOperator(callInfo, expression)
      return { range: [start, callInfo.callEnd], text }
    }
  }
  return null
}

/**
 * Handle clone function: clone(obj) -> {...obj}
 */
function createCloneFix(callInfo: CallInfo): FixResult | null {
  const targetParam = needsParentheses(callInfo.params) ? `(${callInfo.params})` : callInfo.params
  const expression = `{...${targetParam}}`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle cloneDeep function: cloneDeep(obj) -> structuredClone(obj)
 */
function createCloneDeepFix(callInfo: CallInfo): FixResult | null {
  const expression = `structuredClone(${callInfo.params})`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle groupBy function with Object.groupBy
 */
function createGroupByFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const array = callInfo.params.slice(0, commaIndex).trim()
  const keyFn = callInfo.params.slice(commaIndex + 1).trim()

  // Convert string path to function if needed
  let actualKeyFn = keyFn
  if ((keyFn.startsWith('"') && keyFn.endsWith('"')) || (keyFn.startsWith('\'') && keyFn.endsWith('\''))) {
    const propPath = keyFn.slice(1, -1)
    actualKeyFn = `item => item.${propPath}`
  }

  const expression = `Object.groupBy(${array}, ${actualKeyFn})`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle countBy function with reduce pattern
 */
function createCountByFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const array = callInfo.params.slice(0, commaIndex).trim()
  const keyFn = callInfo.params.slice(commaIndex + 1).trim()

  // Convert string path to function if needed
  let actualKeyFn = keyFn
  if ((keyFn.startsWith('"') && keyFn.endsWith('"')) || (keyFn.startsWith('\'') && keyFn.endsWith('\''))) {
    const propPath = keyFn.slice(1, -1)
    actualKeyFn = `item => item.${propPath}`
  }

  const safeArray = needsParentheses(array) ? `(${array})` : array
  const expression = `${safeArray}.reduce((acc, item) => { const key = (${actualKeyFn})(item); acc[key] = (acc[key] || 0) + 1; return acc; }, {})`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle chunk function with Array.from pattern
 */
function createChunkFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const array = callInfo.params.slice(0, commaIndex).trim()
  const size = callInfo.params.slice(commaIndex + 1).trim()

  const safeArray = needsParentheses(array) ? `(${array})` : array
  const expression = `Array.from({length: Math.ceil(${safeArray}.length / ${size})}, (_, i) => ${safeArray}.slice(i * ${size}, (i + 1) * ${size}))`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Get specialized handler result using elegant pattern system
 */
function trySpecializedHandlers(callInfo: CallInfo, nativeAlternative: string): FixResult | null {
  // Try the new pattern-based system first
  const patternResult = createPatternBasedTransform(callInfo, nativeAlternative)
  if (patternResult) return patternResult

  // Fallback to legacy handlers for any patterns not yet migrated
  if (nativeAlternative.includes('[...new Set(')) return createUniqFix(callInfo, nativeAlternative)
  if (nativeAlternative.includes('.filter(Boolean)')) return createCompactFix(callInfo)
  if (nativeAlternative.includes('Object.fromEntries(') && nativeAlternative.includes('.map(')) return createPickOmitFix(callInfo, nativeAlternative)
  if (nativeAlternative.includes('.toSorted(')) return createSortByFix(callInfo)
  if (nativeAlternative.includes('Object.assign({}, ')) return createMergeFix(callInfo)
  if (nativeAlternative.includes('?.')) return createGetFix(callInfo)
  if (nativeAlternative.includes('{...')) return createCloneFix(callInfo)
  if (nativeAlternative.includes('structuredClone(')) return createCloneDeepFix(callInfo)
  if (nativeAlternative.includes('Object.groupBy(')) return createGroupByFix(callInfo)
  if (nativeAlternative.includes('.reduce((acc, item)')) return createCountByFix(callInfo)
  if (nativeAlternative.includes('Array.from({length:')) return createChunkFix(callInfo)

  return null
}

/**
 * Create standard single-parameter expression fix
 */
function createStandardExpressionFix(callInfo: CallInfo, nativeAlternative: string): FixResult {
  const safeParam = needsParentheses(callInfo.params) ? `(${callInfo.params})` : callInfo.params
  const expression = nativeAlternative.replaceAll(/\bvalue\b/g, safeParam)
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Create fix for expression alternatives (e.g., isNull -> value === null)
 */
export function createExpressionFix(callInfo: CallInfo, nativeAlternative: string): FixResult | null {
  if (!callInfo.params) return null

  // Check for specialized patterns that need specific handling
  if (nativeAlternative === 'key in object') {
    return createHasFix(callInfo)
  }
  if (nativeAlternative === 'value.toSorted((a, b) => iteratee(a) - iteratee(b))') {
    return createOrderByFix(callInfo)
  }
  if (nativeAlternative === 'Object.fromEntries(value.map(item => [iteratee(item), item]))') {
    return createKeyByFix(callInfo)
  }

  const specializedResult = trySpecializedHandlers(callInfo, nativeAlternative)
  if (specializedResult) {
    return specializedResult
  }

  return createStandardExpressionFix(callInfo, nativeAlternative)
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
 * Check if native alternative is a fixed-parameter prototype method
 */
export function isFixedParamPrototypeMethod(nativeAlternative: string): boolean {
  return RegexCache.getFixedParamPrototypeRegex().test(nativeAlternative)
}

/**
 * Create fix for keyBy function
 */
export function createKeyByFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const array = callInfo.params.slice(0, commaIndex).trim()
  const keyFn = callInfo.params.slice(commaIndex + 1).trim()

  // Convert string path to function if needed
  let actualKeyFn = keyFn
  if ((keyFn.startsWith('"') && keyFn.endsWith('"')) || (keyFn.startsWith('\'') && keyFn.endsWith('\''))) {
    const propPath = keyFn.slice(1, -1)
    actualKeyFn = `item => item.${propPath}`
  }

  const expression = `Object.fromEntries(${array}.map(item => [(${actualKeyFn})(item), item]))`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return {
    range: [start, callInfo.callEnd],
    text,
  }
}

/**
 * Create fix for orderBy function
 */
export function createOrderByFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const array = callInfo.params.slice(0, commaIndex).trim()
  const iterateeFn = callInfo.params.slice(commaIndex + 1).trim()

  // Convert string path to function if needed
  let actualIteratee = iterateeFn
  if ((iterateeFn.startsWith('"') && iterateeFn.endsWith('"')) || (iterateeFn.startsWith('\'') && iterateeFn.endsWith('\''))) {
    const propPath = iterateeFn.slice(1, -1)
    actualIteratee = `item => item.${propPath}`
  }

  const expression = `${array}.toSorted((a, b) => (${actualIteratee})(a) - (${actualIteratee})(b))`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return {
    range: [start, callInfo.callEnd],
    text,
  }
}

/**
 * Create fix for omit function
 */
export function createOmitFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const obj = callInfo.params.slice(0, commaIndex).trim()
  const keys = callInfo.params.slice(commaIndex + 1).trim()

  const expression = `Object.fromEntries(Object.entries(${obj}).filter(([k]) => !${keys}.includes(k)))`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return {
    range: [start, callInfo.callEnd],
    text,
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
 * Extract fixed parameters from encoded native alternative
 */
export function extractFixedParams(nativeAlternative: string): string | null {
  const match = /\[([^\]]{1,20})\]$/.exec(nativeAlternative)
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

/**
 * Common autofix routing logic shared between destructured and namespace fixes
 */
export function createAutofixRouting(callInfo: CallInfo, nativeMethod: string, functionName: string): FixResult | null {
  // Route to appropriate fix creator based on alternative type
  if (isZeroParamStaticMethod(nativeMethod)) {
    return createZeroParamStaticFix(callInfo, nativeMethod)
  }

  // Handle specific dual-parameter templates first
  if (nativeMethod === 'Object.fromEntries(value.map(item => [iteratee(item), item]))') {
    return createKeyByFix(callInfo)
  }

  if (nativeMethod === 'value.toSorted((a, b) => iteratee(a) - iteratee(b))') {
    return createOrderByFix(callInfo)
  }

  if (nativeMethod === 'Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))') {
    return createOmitFix(callInfo)
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
