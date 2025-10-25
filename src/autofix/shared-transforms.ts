/**
 * Shared transformation utilities for both destructured and namespace autofix
 */
import { findFirstTopLevelComma, extractMethodName, needsParentheses, isArrayLikeObject, extractStaticMethodInfo, isZeroParamStaticMethod, isExpressionAlternative, isConstructorCall, isStaticMethod, handleNegationOperator, CallInfo, FixResult } from './parameter-parser'
import { createPatternBasedTransform } from './transform-patterns'
import { RegexCache } from '../regex-cache'

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
 * Handle drop function - drop(array, n) → array.slice(n)
 */
function createDropFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const array = callInfo.params.slice(0, commaIndex).trim()
  const n = callInfo.params.slice(commaIndex + 1).trim()

  const safeArray = needsParentheses(array) ? `(${array})` : array
  const expression = `${safeArray}.slice(${n})`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle dropRight function - dropRight(array, n) → array.slice(0, -n)
 */
function createDropRightFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const array = callInfo.params.slice(0, commaIndex).trim()
  const n = callInfo.params.slice(commaIndex + 1).trim()

  const safeArray = needsParentheses(array) ? `(${array})` : array
  const expression = `${safeArray}.slice(0, -${n})`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle take function - take(array, n) → array.slice(0, n)
 */
function createTakeFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const array = callInfo.params.slice(0, commaIndex).trim()
  const n = callInfo.params.slice(commaIndex + 1).trim()

  const safeArray = needsParentheses(array) ? `(${array})` : array
  const expression = `${safeArray}.slice(0, ${n})`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle takeRight function - takeRight(array, n) → array.slice(-n)
 */
function createTakeRightFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const array = callInfo.params.slice(0, commaIndex).trim()
  const n = callInfo.params.slice(commaIndex + 1).trim()

  const safeArray = needsParentheses(array) ? `(${array})` : array
  const expression = `${safeArray}.slice(-${n})`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle arithmetic operations - add(a, b) → a + b, subtract(a, b) → a - b, etc.
 */
function createArithmeticFix(callInfo: CallInfo, operator: string): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null

  const first = callInfo.params.slice(0, commaIndex).trim()
  const second = callInfo.params.slice(commaIndex + 1).trim()

  const expression = `${first} ${operator} ${second}`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle sum function - sum(array) → array.reduce((sum, n) => sum + n, 0)
 */
function createSumFix(callInfo: CallInfo): FixResult | null {
  const safeParam = needsParentheses(callInfo.params) ? `(${callInfo.params})` : callInfo.params
  const expression = `${safeParam}.reduce((sum, n) => sum + n, 0)`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle mean function - mean(array) → array.reduce((sum, n) => sum + n, 0) / array.length
 */
function createMeanFix(callInfo: CallInfo): FixResult | null {
  const safeParam = needsParentheses(callInfo.params) ? `(${callInfo.params})` : callInfo.params
  const expression = `${safeParam}.reduce((sum, n) => sum + n, 0) / ${safeParam}.length`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle clamp function - clamp(number, lower, upper) → Math.min(Math.max(number, lower), upper)
 */
function createClampFix(callInfo: CallInfo): FixResult | null {
  const params = callInfo.params.split(',').map(p => p.trim())
  if (params.length !== 3) return null

  const [number, lower, upper] = params
  const expression = `Math.min(Math.max(${number}, ${lower}), ${upper})`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Handle inRange function - inRange(number, start, end) → number >= start && number < end
 */
function createInRangeFix(callInfo: CallInfo): FixResult | null {
  const params = callInfo.params.split(',').map(p => p.trim())
  if (params.length !== 3) return null

  const [number, start, end] = params
  const expression = `${number} >= ${start} && ${number} < ${end}`
  const { start: fixStart, text } = handleNegationOperator(callInfo, expression)
  return { range: [fixStart, callInfo.callEnd], text }
}

/**
 * Handle random function - random(lower, upper) → Math.random() * (upper - lower) + lower
 * Or random(max) → Math.random() * max
 */
function createRandomFix(callInfo: CallInfo): FixResult | null {
  const params = callInfo.params.split(',').map(p => p.trim())

  let expression: string
  if (params.length === 1) {
    // random(max) → Math.random() * max
    expression = `Math.random() * ${params[0]}`
  } else if (params.length === 2) {
    // random(min, max) → Math.random() * (max - min) + min
    const [lower, upper] = params
    expression = `Math.random() * (${upper} - ${lower}) + ${lower}`
  } else {
    return null
  }

  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * String transformation handlers
 */
function createCapitalizeFix(callInfo: CallInfo): FixResult | null {
  const str = callInfo.params
  const expression = `${str}.at(0).toUpperCase() + ${str}.slice(1).toLowerCase()`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

function createLowerFirstFix(callInfo: CallInfo): FixResult | null {
  const str = callInfo.params
  const expression = `${str}.at(0).toLowerCase() + ${str}.slice(1)`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

function createUpperFirstFix(callInfo: CallInfo): FixResult | null {
  const str = callInfo.params
  const expression = `${str}.at(0).toUpperCase() + ${str}.slice(1)`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Lang comparison operators
 */
function createComparisonFix(callInfo: CallInfo, operator: string): FixResult | null {
  const params = callInfo.params.split(',').map(p => p.trim())
  if (params.length !== 2) return null

  const [first, second] = params
  const expression = `${first} ${operator} ${second}`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Lang type checking with instanceof
 */
function createInstanceOfFix(callInfo: CallInfo, className: string): FixResult | null {
  const value = callInfo.params
  const expression = `${value} instanceof ${className}`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Util stub functions - return literals
 */
function createStubFix(callInfo: CallInfo, literal: string): FixResult | null {
  const { start, text } = handleNegationOperator(callInfo, literal)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Lang type conversion - castArray
 */
function createCastArrayFix(callInfo: CallInfo): FixResult | null {
  const value = callInfo.params
  const expression = `Array.isArray(${value}) ? ${value} : [${value}]`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Lang type conversion - toFinite
 */
function createToFiniteFix(callInfo: CallInfo): FixResult | null {
  const value = callInfo.params
  const expression = `Number(${value}) || 0`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Lang type conversion - toInteger
 */
function createToIntegerFix(callInfo: CallInfo): FixResult | null {
  const value = callInfo.params
  const expression = `Math.trunc(Number(${value})) || 0`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Lang type conversion - toSafeInteger
 */
function createToSafeIntegerFix(callInfo: CallInfo): FixResult | null {
  const value = callInfo.params
  const expression = `Math.min(Math.max(Math.trunc(Number(${value})) || 0, -Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER)`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Function utility - delay
 */
function createDelayFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null
  const func = callInfo.params.slice(0, commaIndex).trim()
  const restParams = callInfo.params.slice(commaIndex + 1).trim()
  const expression = `setTimeout(${func}, ${restParams})`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Function utility - defer
 */
function createDeferFix(callInfo: CallInfo): FixResult | null {
  const func = callInfo.params
  const expression = `setTimeout(${func}, 0)`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Util - constant
 */
function createConstantFix(callInfo: CallInfo): FixResult | null {
  const value = callInfo.params
  const expression = `() => ${value}`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Util - times
 */
function createTimesFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) return null
  const n = callInfo.params.slice(0, commaIndex).trim()
  const fn = callInfo.params.slice(commaIndex + 1).trim()
  const expression = `Array.from({length: ${n}}, (_, i) => ${fn}(i))`
  const { start, text } = handleNegationOperator(callInfo, expression)
  return { range: [start, callInfo.callEnd], text }
}

/**
 * Util - range
 */
function createRangeFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) {
    // Single param: range(end) means range(0, end)
    const end = callInfo.params.trim()
    const expression = `Array.from({length: ${end}}, (_, i) => i)`
    const { start, text } = handleNegationOperator(callInfo, expression)
    return { range: [start, callInfo.callEnd], text }
  }
  const start = callInfo.params.slice(0, commaIndex).trim()
  const end = callInfo.params.slice(commaIndex + 1).trim()
  const expression = `Array.from({length: ${end} - ${start}}, (_, i) => ${start} + i)`
  const { start: actualStart, text } = handleNegationOperator(callInfo, expression)
  return { range: [actualStart, callInfo.callEnd], text }
}

/**
 * Util - rangeRight
 */
function createRangeRightFix(callInfo: CallInfo): FixResult | null {
  const commaIndex = findFirstTopLevelComma(callInfo.params)
  if (commaIndex === -1) {
    // Single param: rangeRight(end) means rangeRight(0, end)
    const end = callInfo.params.trim()
    const expression = `Array.from({length: ${end}}, (_, i) => ${end} - i - 1)`
    const { start, text } = handleNegationOperator(callInfo, expression)
    return { range: [start, callInfo.callEnd], text }
  }
  const start = callInfo.params.slice(0, commaIndex).trim()
  const end = callInfo.params.slice(commaIndex + 1).trim()
  const expression = `Array.from({length: ${end} - ${start}}, (_, i) => ${end} - i - 1)`
  const { start: actualStart, text } = handleNegationOperator(callInfo, expression)
  return { range: [actualStart, callInfo.callEnd], text }
}

/**
 * String - parseInt
 */
function createParseIntFix(callInfo: CallInfo): FixResult | null {
  const params = callInfo.params
  const expression = `parseInt(${params})`
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
  // Util function generators and array builders - must come before generic Array.from check
  if (nativeAlternative === 'Array.from({length: n}, (_, i) => fn(i))') return createTimesFix(callInfo)
  if (nativeAlternative === 'Array.from({length: end - start}, (_, i) => start + i)') return createRangeFix(callInfo)
  if (nativeAlternative === 'Array.from({length: end - start}, (_, i) => end - i - 1)') return createRangeRightFix(callInfo)
  // Generic Array.from pattern for chunk - must come after specific patterns
  if (nativeAlternative.includes('Array.from({length:')) return createChunkFix(callInfo)
  // Array slice patterns - order matters! More specific patterns first
  if (nativeAlternative.includes('.slice(0, -n)') || nativeAlternative === 'array.slice(0, -n)') return createDropRightFix(callInfo)
  if (nativeAlternative.includes('.slice(0, n)') || nativeAlternative === 'array.slice(0, n)') return createTakeFix(callInfo)
  if (nativeAlternative.includes('.slice(-n)') || nativeAlternative === 'array.slice(-n)') return createTakeRightFix(callInfo)
  if (nativeAlternative.includes('.slice(n)') || nativeAlternative === 'array.slice(n)') return createDropFix(callInfo)
  // Arithmetic operation patterns
  if (nativeAlternative === 'a + b') return createArithmeticFix(callInfo, '+')
  if (nativeAlternative === 'a - b') return createArithmeticFix(callInfo, '-')
  if (nativeAlternative === 'a * b') return createArithmeticFix(callInfo, '*')
  if (nativeAlternative === 'a / b') return createArithmeticFix(callInfo, '/')
  // Array aggregation patterns
  if (nativeAlternative === 'array.reduce((sum, n) => sum + n, 0)') return createSumFix(callInfo)
  if (nativeAlternative === 'array.reduce((sum, n) => sum + n, 0) / array.length') return createMeanFix(callInfo)
  // Number operation patterns
  if (nativeAlternative === 'Math.min(Math.max(number, lower), upper)') return createClampFix(callInfo)
  if (nativeAlternative === 'number >= start && number < end') return createInRangeFix(callInfo)
  if (nativeAlternative === 'Math.random() * (max - min) + min') return createRandomFix(callInfo)
  // String transformation patterns
  if (nativeAlternative === 'string.at(0).toUpperCase() + string.slice(1).toLowerCase()') return createCapitalizeFix(callInfo)
  if (nativeAlternative === 'string.at(0).toLowerCase() + string.slice(1)') return createLowerFirstFix(callInfo)
  if (nativeAlternative === 'string.at(0).toUpperCase() + string.slice(1)') return createUpperFirstFix(callInfo)
  // Lang comparison operators
  if (nativeAlternative === 'value > other') return createComparisonFix(callInfo, '>')
  if (nativeAlternative === 'value >= other') return createComparisonFix(callInfo, '>=')
  if (nativeAlternative === 'value < other') return createComparisonFix(callInfo, '<')
  if (nativeAlternative === 'value <= other') return createComparisonFix(callInfo, '<=')
  // Lang type checking with instanceof
  if (nativeAlternative === 'value instanceof Date') return createInstanceOfFix(callInfo, 'Date')
  if (nativeAlternative === 'value instanceof RegExp') return createInstanceOfFix(callInfo, 'RegExp')
  if (nativeAlternative === 'value instanceof Error') return createInstanceOfFix(callInfo, 'Error')
  if (nativeAlternative === 'value instanceof Set') return createInstanceOfFix(callInfo, 'Set')
  if (nativeAlternative === 'value instanceof WeakMap') return createInstanceOfFix(callInfo, 'WeakMap')
  if (nativeAlternative === 'value instanceof WeakSet') return createInstanceOfFix(callInfo, 'WeakSet')
  // Util stub functions
  if (nativeAlternative === '[]') return createStubFix(callInfo, '[]')
  if (nativeAlternative === 'false') return createStubFix(callInfo, 'false')
  if (nativeAlternative === 'true') return createStubFix(callInfo, 'true')
  if (nativeAlternative === '{}') return createStubFix(callInfo, '{}')
  if (nativeAlternative === '\'\'') return createStubFix(callInfo, '\'\'')
  if (nativeAlternative === 'undefined') return createStubFix(callInfo, 'undefined')
  // Util helper functions
  if (nativeAlternative === 'value') return createStubFix(callInfo, callInfo.params) // identity just returns the param
  // Lang type conversion patterns
  if (nativeAlternative === 'Array.isArray(value) ? value : [value]') return createCastArrayFix(callInfo)
  if (nativeAlternative === 'Number(value) || 0') return createToFiniteFix(callInfo)
  if (nativeAlternative === 'Math.trunc(Number(value)) || 0') return createToIntegerFix(callInfo)
  if (nativeAlternative === 'Math.min(Math.max(Math.trunc(Number(value)) || 0, -Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER)') return createToSafeIntegerFix(callInfo)
  // Function utility patterns
  if (nativeAlternative === 'setTimeout(func, wait, ...args)') return createDelayFix(callInfo)
  if (nativeAlternative === 'setTimeout(func, 0, ...args)') return createDeferFix(callInfo)
  // Util function generators
  if (nativeAlternative === '() => value') return createConstantFix(callInfo)
  // String parsing
  if (nativeAlternative === 'parseInt(string, radix)') return createParseIntFix(callInfo)

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

  // Handle zero-parameter literal returns (stub functions)
  if (nativeMethod === '[]' || nativeMethod === 'false' || nativeMethod === 'true'
    || nativeMethod === '{}' || nativeMethod === '\'\'' || nativeMethod === 'undefined') {
    return {
      range: [callInfo.callStart, callInfo.callEnd],
      text: nativeMethod,
    }
  }

  // Handle identity function - just return the parameter as-is
  if (nativeMethod === 'value' && functionName === 'identity') {
    return {
      range: [callInfo.callStart, callInfo.callEnd],
      text: callInfo.params,
    }
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
