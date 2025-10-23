/**
 * Parameter parsing utilities for autofix functionality
 */

export interface CallInfo {
  fullText: string
  callStart: number
  callEnd: number
  params: string
}

export interface FixResult {
  range: [number, number]
  text: string
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

interface ParseState {
  parenLevel: number
  braceLevel: number
  bracketLevel: number
  inString: boolean
  stringChar: string
  inTemplate: boolean
  templateLevel: number
}

function handleTemplateLiteral(char: string, prevChar: string | undefined, state: ParseState): void {
  if (!state.inString && char === '`') {
    if (!state.inTemplate) {
      state.inTemplate = true
      state.templateLevel = 0
    } else if (state.templateLevel === 0) {
      state.inTemplate = false
    }
  } else if (state.inTemplate && char === '{' && prevChar === '$') {
    state.templateLevel++
  } else if (state.inTemplate && char === '}' && state.templateLevel > 0) {
    state.templateLevel--
  }
}

function handleStringLiteral(char: string, prevChar: string | undefined, state: ParseState): void {
  if (!state.inTemplate && !state.inString && ['"', '\''].includes(char)) {
    state.inString = true
    state.stringChar = char
  } else if (!state.inTemplate && state.inString && char === state.stringChar && prevChar !== '\\') {
    state.inString = false
    state.stringChar = ''
  }
}

function handleNestingLevels(char: string, state: ParseState): boolean {
  switch (char) {
    case '(':
      state.parenLevel++
      break
    case ')':
      state.parenLevel--
      break
    case '{':
      state.braceLevel++
      break
    case '}':
      state.braceLevel--
      break
    case '[':
      state.bracketLevel++
      break
    case ']':
      state.bracketLevel--
      break
    case ',':
      return state.parenLevel === 0 && state.braceLevel === 0 && state.bracketLevel === 0
  }
  return false
}

/**
 * Find the first comma at the top level (not inside parentheses, brackets, or braces)
 * Refactored to reduce cognitive complexity
 */
export function findFirstTopLevelComma(text: string): number {
  if (!text) return -1

  const state: ParseState = {
    parenLevel: 0,
    braceLevel: 0,
    bracketLevel: 0,
    inString: false,
    stringChar: '',
    inTemplate: false,
    templateLevel: 0,
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (!char) continue
    const prevChar = i > 0 ? text[i - 1] : undefined

    handleTemplateLiteral(char, prevChar, state)
    handleStringLiteral(char, prevChar, state)

    if (!state.inString && !state.inTemplate) {
      if (handleNestingLevels(char, state)) {
        return i
      }
    }
  }

  return -1
}

/**
 * Extract method name from native alternative string
 * Examples:
 * - "Array.prototype.map" -> "map"
 * - "array.map(fn)" -> "map"
 */
export function extractMethodName(nativeAlternative: string): string | null {
  // Handle cases like "Array.prototype.map" -> "map"
  // Also handle "Array.prototype.at[0]" -> "at"
  if (nativeAlternative.includes('.prototype.')) {
    const parts = nativeAlternative.split('.prototype.')
    const methodPart = parts[1] || null
    if (!methodPart) return null

    // Remove fixed parameters in brackets (e.g., "at[0]" -> "at")
    return methodPart.split('[')[0] || null
  }

  // Handle cases like "array.map(fn)" -> "map"
  if (nativeAlternative.includes('.')) {
    const parts = nativeAlternative.split('.')
    const methodPart = parts.at(-1)
    // Remove any parentheses
    return methodPart?.split('(')[0] || null
  }

  return null
}

/**
 * Check if a native alternative is a static method (e.g., "Object.keys", "Math.max")
 * Excludes prototype methods like "Array.prototype.map"
 */
export function isStaticMethod(nativeAlternative: string): boolean {
  // Exclude prototype methods
  if (nativeAlternative.includes('.prototype.')) {
    return false
  }

  const staticObjectPatterns = /^(Object|Math|Array|Number|Date|JSON|Reflect|Promise|Proxy)\./
  return staticObjectPatterns.test(nativeAlternative)
}

/**
 * Check if a native alternative is a constructor call (e.g., "Number.toNumber" should be "Number")
 */
export function isConstructorCall(nativeAlternative: string, functionName: string): boolean {
  // Constructor cases where the "static method" should actually be a constructor call
  const constructorCases = [
    { functionName: 'toNumber', alternative: 'Number.toNumber' },
  ]

  return constructorCases.some(({ functionName: fn, alternative }) =>
    functionName === fn && nativeAlternative === alternative,
  )
}

/**
 * Check if a native alternative is an expression (e.g., "value === null", "typeof value === 'string'")
 */
export function isExpressionAlternative(nativeAlternative: string): boolean {
  // Expression alternatives contain operators or keywords like typeof
  return nativeAlternative.includes('===')
    || nativeAlternative.includes('==')
    || nativeAlternative.includes('typeof')
    || nativeAlternative.includes('&&')
    || nativeAlternative.includes('||')
    || nativeAlternative.includes('value.') // Property access like "value.length"
    || nativeAlternative.includes(' in ') // "in" operator for property existence
    // Quick Wins expression patterns
    || nativeAlternative.includes('[...new Set(') // uniq pattern
    || nativeAlternative.includes('.filter(Boolean)') // compact pattern
    || nativeAlternative.includes('Object.fromEntries(') // pick/omit patterns
    || nativeAlternative.includes('.toSorted(') // sortBy pattern
    // Object Utilities expression patterns
    || nativeAlternative.includes('Object.assign({}, ') // merge pattern
    || nativeAlternative.includes('?.') // optional chaining for get pattern
    || nativeAlternative.includes('{...') // spread operator for clone pattern
    || nativeAlternative.includes('structuredClone(') // deep clone pattern
    // Collection Processing expression patterns
    || nativeAlternative.includes('Object.groupBy(') // ES2024 groupBy pattern
    || nativeAlternative.includes('.reduce((acc, item)') // countBy pattern
    || nativeAlternative.includes('Array.from({length:') // chunk pattern
    // Array slice patterns
    || nativeAlternative.includes('array.slice(') // drop, take, dropRight, takeRight patterns
    // Arithmetic operation patterns
    || nativeAlternative === 'a + b'
    || nativeAlternative === 'a - b'
    || nativeAlternative === 'a * b'
    || nativeAlternative === 'a / b'
    // Array aggregation patterns
    || nativeAlternative === 'array.reduce((sum, n) => sum + n, 0)'
    || nativeAlternative === 'array.reduce((sum, n) => sum + n, 0) / array.length'
    // Number operation patterns
    || nativeAlternative === 'Math.min(Math.max(number, lower), upper)'
    || nativeAlternative === 'number >= start && number < end'
    || nativeAlternative === 'Math.random() * (max - min) + min'
    // String transformation patterns
    || nativeAlternative === 'string.at(0).toUpperCase() + string.slice(1).toLowerCase()'
    || nativeAlternative === 'string.at(0).toLowerCase() + string.slice(1)'
    || nativeAlternative === 'string.at(0).toUpperCase() + string.slice(1)'
    // Lang comparison operators
    || nativeAlternative === 'value > other'
    || nativeAlternative === 'value >= other'
    || nativeAlternative === 'value < other'
    || nativeAlternative === 'value <= other'
    // Lang instanceof patterns
    || nativeAlternative === 'value instanceof Date'
    || nativeAlternative === 'value instanceof RegExp'
    || nativeAlternative === 'value instanceof Error'
    || nativeAlternative === 'value instanceof Set'
    || nativeAlternative === 'value instanceof WeakMap'
    || nativeAlternative === 'value instanceof WeakSet'
    // Util stub/helper patterns
    || nativeAlternative === '[]'
    || nativeAlternative === 'false'
    || nativeAlternative === 'true'
    || nativeAlternative === '{}'
    || nativeAlternative === '\'\''
    || nativeAlternative === 'undefined'
    // Lang type conversion patterns
    || nativeAlternative === 'Array.isArray(value) ? value : [value]' // castArray
    || nativeAlternative === 'Number(value) || 0' // toFinite
    || nativeAlternative === 'Math.trunc(Number(value)) || 0' // toInteger
    || nativeAlternative === 'Math.min(Math.max(Math.trunc(Number(value)) || 0, -Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER)' // toSafeInteger
    // Function utility patterns
    || nativeAlternative === 'setTimeout(func, wait, ...args)' // delay
    || nativeAlternative === 'setTimeout(func, 0, ...args)' // defer
    // Util function generators and array builders
    || nativeAlternative === '() => value' // constant
    || nativeAlternative === 'Array.from({length: n}, (_, i) => fn(i))' // times
    || nativeAlternative === 'Array.from({length: end - start}, (_, i) => start + i)' // range
    || nativeAlternative === 'Array.from({length: end - start}, (_, i) => end - i - 1)' // rangeRight
    // String parsing
    || nativeAlternative === 'parseInt(string, radix)' // parseInt
    // Lang array-like validation
    || nativeAlternative === 'Number.isInteger(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER' // isLength
    || nativeAlternative === 'value != null && typeof value.length === \'number\' && value.length >= 0 && value.length <= Number.MAX_SAFE_INTEGER' // isArrayLike
}

/**
 * Check if a native alternative is a zero-parameter static method (e.g., "Date.now")
 */
export function isZeroParamStaticMethod(nativeAlternative: string): boolean {
  // These are static methods that take no parameters
  const zeroParamMethods = ['Date.now']
  return zeroParamMethods.includes(nativeAlternative)
}

/**
 * Extract static object and method from native alternative
 * Examples:
 * - "Object.keys" -> { object: "Object", method: "keys" }
 * - "Math.max" -> { object: "Math", method: "max" }
 */
export function extractStaticMethodInfo(nativeAlternative: string): { object: string, method: string } | null {
  if (!isStaticMethod(nativeAlternative)) return null

  const parts = nativeAlternative.split('.')
  if (parts.length < 2) return null

  const object = parts[0]
  const methodPart = parts[1]
  // Remove any parentheses from method name
  const method = methodPart?.split('(')[0]

  if (!object || !method) return null

  return { object, method }
}

/**
 * Find the closing parenthesis of a function call starting from a given position
 */
export function findClosingParenthesis(text: string, startIndex: number): number {
  let parenCount = 0
  let foundOpenParen = false

  for (let i = startIndex; i < text.length; i++) {
    const char = text[i]
    if (!char) continue // Skip if undefined

    if (char === '(') {
      foundOpenParen = true
      parenCount++
    } else if (char === ')') {
      parenCount--
      if (foundOpenParen && parenCount === 0) {
        return i + 1
      }
    }
  }

  return startIndex
}

function processCharacter(char: string, prevChar: string | undefined, nextChar: string | undefined, state: ParseState): boolean {
  handleTemplateLiteral(char, prevChar, state)
  handleStringLiteral(char, prevChar, state)

  if (!state.inString && !state.inTemplate) {
    if (char === '(') {
      state.parenLevel++
    } else if (char === ')') {
      state.parenLevel--
    } else if (state.parenLevel === 0) {
      return hasLowPrecedenceOperator(char, prevChar, nextChar)
    }
  }
  return false
}

function hasLowPrecedenceOperator(char: string, prevChar: string | undefined, nextChar: string | undefined): boolean {
  // Two-character operators with lower precedence than method call
  if (nextChar) {
    const twoChar = char + nextChar
    if (['||', '&&', '??'].includes(twoChar)) {
      return true
    }
  }

  // Ternary operator (but not optional chaining or nullish coalescing)
  if (char === '?' && nextChar !== '.' && prevChar !== '?') {
    return true
  }

  // Assignment operator (but not comparison operators)
  if (char === '=' && nextChar !== '=' && prevChar !== '='
    && prevChar !== '!' && prevChar !== '<' && prevChar !== '>') {
    return true
  }

  return false
}

/**
 * Check if expression needs parentheses to maintain operator precedence
 * when used as receiver of method call
 * Refactored to reduce cognitive complexity
 */
export function needsParentheses(expression: string): boolean {
  const trimmed = expression.trim()
  if (!trimmed) return false

  const state: ParseState = {
    parenLevel: 0,
    braceLevel: 0,
    bracketLevel: 0,
    inString: false,
    stringChar: '',
    inTemplate: false,
    templateLevel: 0,
  }

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i]
    if (!char) continue
    const prevChar = i > 0 ? trimmed[i - 1] : undefined
    const nextChar = i < trimmed.length - 1 ? trimmed[i + 1] : undefined

    if (processCharacter(char, prevChar, nextChar, state)) {
      return true
    }
  }

  return false
}

/**
 * Check if an expression represents an array-like object that doesn't have native array methods
 * Optimized version with string matching for common cases
 */
export function isArrayLikeObject(expression: string): boolean {
  const trimmed = expression.trim()
  if (!trimmed) return false

  // Fast string-based checks for most common cases
  if (trimmed === 'arguments') return true

  // Check for common DOM patterns
  if (trimmed.includes('.')) {
    const parts = trimmed.split('.')
    const lastPart = parts.at(-1)

    // Fast checks for property access patterns
    if (lastPart && ['children', 'childNodes', 'classList', 'style', 'files'].includes(lastPart)) {
      return true
    }

    // Method call patterns
    if (lastPart && (lastPart.startsWith('querySelectorAll(')
      || lastPart.startsWith('getElementsBy'))) {
      return true
    }
  }

  // Fallback to regex for complex patterns (only if simple checks fail)
  const complexPatterns = [
    /^document\.getElementsBy\w{1,50}\(/,
    /^element\.getElementsBy\w{1,50}\(/,
    /^\w{1,50}\.getElementsBy\w{1,50}\(/,
  ]

  return complexPatterns.some(pattern => pattern.test(trimmed))
}
