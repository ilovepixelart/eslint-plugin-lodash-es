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

  // Quick Wins patterns: Handle multi-parameter functions with specific transformations
  if (nativeAlternative.includes('[...new Set(')) {
    // uniq(array) -> [...new Set(array)]
    const expression = nativeAlternative.replace(/array/g, callInfo.params)
    const { start, text } = handleNegationOperator(callInfo, expression)
    return {
      range: [start, callInfo.callEnd],
      text,
    }
  }

  if (nativeAlternative.includes('.filter(Boolean)')) {
    // compact(array) -> array.filter(Boolean)
    const targetParam = needsParentheses(callInfo.params) ? `(${callInfo.params})` : callInfo.params
    const expression = `${targetParam}.filter(Boolean)`
    const { start, text } = handleNegationOperator(callInfo, expression)
    return {
      range: [start, callInfo.callEnd],
      text,
    }
  }

  if (nativeAlternative.includes('Object.fromEntries(') && nativeAlternative.includes('.map(')) {
    // pick(obj, keys) -> Object.fromEntries(keys.map(k => [k, obj[k]]))
    // omit(obj, keys) -> Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k)))
    const commaIndex = findFirstTopLevelComma(callInfo.params)
    if (commaIndex === -1) return null

    const obj = callInfo.params.slice(0, commaIndex).trim()
    const keys = callInfo.params.slice(commaIndex + 1).trim()

    let expression: string
    if (nativeAlternative.includes('Object.entries(')) {
      // omit pattern - substitute actual parameters into template
      expression = nativeAlternative
        .replace(/\bobj\b/g, obj)
        .replace(/\bkeys\b/g, keys)
    } else {
      // pick pattern - substitute actual parameters into template
      const safeObj = needsParentheses(obj) ? `(${obj})` : obj
      expression = nativeAlternative
        .replace(/\bkeys\b/g, keys)
        .replace(/\bobj\b/g, safeObj)
    }

    const { start, text } = handleNegationOperator(callInfo, expression)
    return {
      range: [start, callInfo.callEnd],
      text,
    }
  }

  if (nativeAlternative.includes('.toSorted(')) {
    // sortBy(array, fn) -> array.toSorted((a, b) => fn(a) - fn(b))
    // sortBy(array) -> array.toSorted()
    const commaIndex = findFirstTopLevelComma(callInfo.params)
    const targetParam = commaIndex === -1 ? callInfo.params : callInfo.params.slice(0, commaIndex).trim()
    const safeTargetParam = needsParentheses(targetParam) ? `(${targetParam})` : targetParam

    let expression: string
    if (commaIndex === -1) {
      // No callback function provided
      expression = `${safeTargetParam}.toSorted()`
    } else {
      // Callback function provided
      const fn = callInfo.params.slice(commaIndex + 1).trim()
      // Check if fn is an arrow function
      if (fn.includes('=>')) {
        expression = `${safeTargetParam}.toSorted((a, b) => (${fn})(a) - (${fn})(b))`
      } else {
        expression = `${safeTargetParam}.toSorted((a, b) => ${fn}(a) - ${fn}(b))`
      }
    }

    const { start, text } = handleNegationOperator(callInfo, expression)
    return {
      range: [start, callInfo.callEnd],
      text,
    }
  }

  // Object Utilities patterns
  if (nativeAlternative.includes('Object.assign({}, ')) {
    // merge(target, ...sources) -> Object.assign({}, target, ...sources)
    const expression = `Object.assign({}, ${callInfo.params})`
    const { start, text } = handleNegationOperator(callInfo, expression)
    return {
      range: [start, callInfo.callEnd],
      text,
    }
  }

  if (nativeAlternative.includes('?.')) {
    // get(obj, path) -> obj?.path (simplified for common cases)
    // This is a complex transformation, for now we'll handle simple cases
    const commaIndex = findFirstTopLevelComma(callInfo.params)
    if (commaIndex === -1) return null

    const obj = callInfo.params.slice(0, commaIndex).trim()
    const path = callInfo.params.slice(commaIndex + 1).trim()

    // Simple path conversion for common cases like "a.b.c"
    if ((path.startsWith('"') && path.endsWith('"')) || (path.startsWith('\'') && path.endsWith('\''))) {
      const pathStr = path.slice(1, -1) // Remove quotes
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*(\.[a-zA-Z_$][a-zA-Z0-9_$]*)*$/.test(pathStr)) {
        // Simple dot notation path
        const optionalChainPath = pathStr.replace(/\./g, '?.')
        const safeObj = needsParentheses(obj) ? `(${obj})` : obj
        const expression = `${safeObj}?.${optionalChainPath}`
        const { start, text } = handleNegationOperator(callInfo, expression)
        return {
          range: [start, callInfo.callEnd],
          text,
        }
      }
    }
    // For complex paths, fall back to no transformation for now
    return null
  }

  if (nativeAlternative.includes('{...')) {
    // clone(obj) -> {...obj}
    const targetParam = needsParentheses(callInfo.params) ? `(${callInfo.params})` : callInfo.params
    const expression = `{...${targetParam}}`
    const { start, text } = handleNegationOperator(callInfo, expression)
    return {
      range: [start, callInfo.callEnd],
      text,
    }
  }

  if (nativeAlternative.includes('structuredClone(')) {
    // cloneDeep(obj) -> structuredClone(obj)
    const expression = `structuredClone(${callInfo.params})`
    const { start, text } = handleNegationOperator(callInfo, expression)
    return {
      range: [start, callInfo.callEnd],
      text,
    }
  }

  // Collection Processing patterns (ES2024+ Modern Features)
  if (nativeAlternative.includes('Object.groupBy(')) {
    // groupBy(array, keyFn) -> Object.groupBy(array, keyFn)
    // Handle string paths: groupBy(array, 'prop') -> Object.groupBy(array, item => item.prop)
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
    return {
      range: [start, callInfo.callEnd],
      text,
    }
  }

  if (nativeAlternative.includes('.reduce((acc, item)')) {
    // countBy(array, keyFn) -> array.reduce((acc, item) => { const key = keyFn(item); acc[key] = (acc[key] || 0) + 1; return acc; }, {})
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
    return {
      range: [start, callInfo.callEnd],
      text,
    }
  }

  if (nativeAlternative.includes('Array.from({length:')) {
    // chunk(array, size) -> Array.from({length: Math.ceil(array.length / size)}, (_, i) => array.slice(i * size, (i + 1) * size))
    const commaIndex = findFirstTopLevelComma(callInfo.params)
    if (commaIndex === -1) return null

    const array = callInfo.params.slice(0, commaIndex).trim()
    const size = callInfo.params.slice(commaIndex + 1).trim()

    const safeArray = needsParentheses(array) ? `(${array})` : array
    const expression = `Array.from({length: Math.ceil(${safeArray}.length / ${size})}, (_, i) => ${safeArray}.slice(i * ${size}, (i + 1) * ${size}))`
    const { start, text } = handleNegationOperator(callInfo, expression)
    return {
      range: [start, callInfo.callEnd],
      text,
    }
  }

  // Handle orderBy pattern specifically: value.toSorted((a, b) => iteratee(a) - iteratee(b))
  if (nativeAlternative === 'value.toSorted((a, b) => iteratee(a) - iteratee(b))') {
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

  // Handle keyBy pattern specifically: Object.fromEntries(value.map(item => [iteratee(item), item]))
  if (nativeAlternative === 'Object.fromEntries(value.map(item => [iteratee(item), item]))') {
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
 * Check if native alternative is a fixed-parameter prototype method
 */
export function isFixedParamPrototypeMethod(nativeAlternative: string): boolean {
  return /\w+\.prototype\.\w+\[[^\]]+\]$/.test(nativeAlternative)
}

/**
 * Extract fixed parameters from encoded native alternative
 */
export function extractFixedParams(nativeAlternative: string): string | null {
  const match = RegExp(/\[([^\]]+)\]$/).exec(nativeAlternative)
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
