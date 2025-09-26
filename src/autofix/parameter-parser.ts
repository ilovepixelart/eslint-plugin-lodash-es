/**
 * Parameter parsing utilities for autofix functionality
 */

/**
 * Common state for tracking string/template literals and nesting levels
 */
interface CommonState {
  parenLevel: number
  braceLevel: number
  bracketLevel: number
  inString: boolean
  stringChar: string
  inTemplate: boolean
  templateLevel: number
}

/**
 * Create initial common state
 */
function createCommonState(): CommonState {
  return {
    parenLevel: 0,
    braceLevel: 0,
    bracketLevel: 0,
    inString: false,
    stringChar: '',
    inTemplate: false,
    templateLevel: 0,
  }
}

/**
 * Handle template literal state changes
 */
function handleTemplateLiteral(state: CommonState, char: string, prevChar: string): void {
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

/**
 * Handle string literal state changes
 */
function handleStringLiteral(state: CommonState, char: string, prevChar: string): void {
  if (!state.inTemplate && !state.inString && (char === '"' || char === '\'')) {
    state.inString = true
    state.stringChar = char
  } else if (!state.inTemplate && state.inString && char === state.stringChar && prevChar !== '\\') {
    state.inString = false
    state.stringChar = ''
  }
}

/**
 * Handle nesting level changes (parentheses, braces, brackets)
 */
function handleNestingLevels(state: CommonState, char: string): void {
  if (state.inString || state.inTemplate) return

  if (char === '(') state.parenLevel++
  else if (char === ')') state.parenLevel--
  else if (char === '{') state.braceLevel++
  else if (char === '}') state.braceLevel--
  else if (char === '[') state.bracketLevel++
  else if (char === ']') state.bracketLevel--
}

/**
 * Check if we're at the top level (not inside any nesting)
 */
function isAtTopLevel(state: CommonState): boolean {
  return !state.inString && !state.inTemplate
    && state.parenLevel === 0 && state.braceLevel === 0 && state.bracketLevel === 0
}

/**
 * Process character and update parser state
 */
function processCharacter(state: CommonState, char: string, prevChar: string): void {
  handleTemplateLiteral(state, char, prevChar)
  handleStringLiteral(state, char, prevChar)
  handleNestingLevels(state, char)
}

/**
 * Find the first comma at the top level (not inside parentheses, brackets, or braces)
 */
export function findFirstTopLevelComma(text: string): number {
  const state = createCommonState()

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (!char) continue // Skip if undefined

    const prevChar = i > 0 ? text[i - 1] || '' : ''

    processCharacter(state, char, prevChar)

    if (char === ',' && isAtTopLevel(state)) {
      return i
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
  if (nativeAlternative.includes('.prototype.')) {
    const parts = nativeAlternative.split('.prototype.')
    return parts[1] || null
  }

  // Handle cases like "array.map(fn)" -> "map"
  if (nativeAlternative.includes('.')) {
    const parts = nativeAlternative.split('.')
    const methodPart = parts[parts.length - 1]
    // Remove any parentheses
    return methodPart?.split('(')[0] || null
  }

  return null
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

/**
 * Process character for operator checking and update state
 */
function processOperatorCharacter(state: CommonState, char: string, prevChar: string): void {
  handleTemplateLiteral(state, char, prevChar)
  handleStringLiteral(state, char, prevChar)

  if (!state.inString && !state.inTemplate) {
    if (char === '(') state.parenLevel++
    else if (char === ')') state.parenLevel--
  }
}

/**
 * Check for operators that require parentheses
 */
function hasLowPrecedenceOperator(char: string, nextChar: string, prevChar: string): boolean {
  // Two-character operators with lower precedence than method call
  const twoChar = char + nextChar
  if (['||', '&&', '??'].includes(twoChar)) {
    return true
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
 */
export function needsParentheses(expression: string): boolean {
  const trimmed = expression.trim()
  const state = createCommonState()

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i]
    if (!char) continue // Skip if undefined

    const prevChar = i > 0 ? trimmed[i - 1] || '' : ''
    const nextChar = i < trimmed.length - 1 ? trimmed[i + 1] || '' : ''

    processOperatorCharacter(state, char, prevChar)

    // Only check operators at top level (not inside parentheses or strings)
    if (!state.inString && !state.inTemplate && state.parenLevel === 0) {
      if (hasLowPrecedenceOperator(char, nextChar, prevChar)) {
        return true
      }
    }
  }

  return false
}

/**
 * Check if an expression represents an array-like object that doesn't have native array methods
 */
export function isArrayLikeObject(expression: string): boolean {
  const trimmed = expression.trim()

  // Known array-like objects that don't have native array methods
  const arrayLikePatterns = [
    /^arguments$/, // arguments object
    /^document\.querySelectorAll\(/, // NodeList
    /^element\.children$/, // HTMLCollection
    /^element\.childNodes$/, // NodeList
    /^document\.getElementsBy\w+\(/, // HTMLCollection
    /^element\.getElementsBy\w+\(/, // HTMLCollection
    /^input\.files$/, // FileList
    /^element\.classList$/, // DOMTokenList
    /^element\.style$/, // CSSStyleDeclaration
    /^\w+\.querySelectorAll\(/, // NodeList from any element
    /^\w+\.children$/, // HTMLCollection from any element
    /^\w+\.childNodes$/, // NodeList from any element
  ]

  return arrayLikePatterns.some(pattern => pattern.test(trimmed))
}
