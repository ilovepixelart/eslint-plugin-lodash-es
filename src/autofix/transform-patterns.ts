/**
 * Ultra-elegant pattern-based transform system
 * Consolidates all specialized transform functions into declarative patterns
 */
import { findFirstTopLevelComma, needsParentheses, handleNegationOperator, CallInfo, FixResult } from './parameter-parser'
import { RegexCache } from '../regex-cache'

export interface TransformPattern {
  name: string
  detect: (alternative: string) => boolean
  transform: (callInfo: CallInfo, alternative?: string) => FixResult | null
}

/**
 * Two-parameter transform factory for functions like pick, omit, groupBy
 */
function createTwoParamTransform(
  template: string,
  paramProcessors?: {
    first?: (param: string) => string
    second?: (param: string) => string
  },
) {
  return (callInfo: CallInfo): FixResult | null => {
    const commaIndex = findFirstTopLevelComma(callInfo.params)
    if (commaIndex === -1) return null

    let firstParam = callInfo.params.slice(0, commaIndex).trim()
    let secondParam = callInfo.params.slice(commaIndex + 1).trim()

    // Apply parameter processors if provided
    if (paramProcessors?.first) firstParam = paramProcessors.first(firstParam)
    if (paramProcessors?.second) secondParam = paramProcessors.second(secondParam)

    const expression = template
      .replaceAll('$FIRST$', firstParam)
      .replaceAll('$SECOND$', secondParam)

    const { start, text } = handleNegationOperator(callInfo, expression)
    return { range: [start, callInfo.callEnd], text }
  }
}

/**
 * Single-parameter transform factory with optional preprocessing
 */
function createSingleParamTransform(
  template: string,
  paramProcessor?: (param: string) => string,
) {
  return (callInfo: CallInfo): FixResult | null => {
    let param = callInfo.params

    if (paramProcessor) {
      param = paramProcessor(param)
    }

    const expression = template.replaceAll('$PARAM$', param)
    const { start, text } = handleNegationOperator(callInfo, expression)
    return { range: [start, callInfo.callEnd], text }
  }
}

/**
 * Safe parameter processor - adds parentheses if needed
 */
const safeParam = (param: string): string =>
  needsParentheses(param) ? `(${param})` : param

/**
 * String path to function processor - converts "prop" to item => item.prop
 */
const stringPathToFunction = (param: string): string => {
  if (isQuotedString(param)) {
    const propPath = unquote(param)
    return `item => item.${propPath}`
  }
  return param
}

/**
 * Helper to create arithmetic operator patterns
 */
function createArithmeticPatterns(
  operators: [string, string, string][],
): TransformPattern[] {
  return operators.map(([name, pattern, operator]) => ({
    name,
    detect: (alt: string) => alt === pattern,
    transform: createTwoParamTransform(`$FIRST$ ${operator} $SECOND$`),
  }))
}

/**
 * Helper to check if parameter is a quoted string
 */
const isQuotedString = (param: string): boolean =>
  (param.startsWith('"') && param.endsWith('"')) || (param.startsWith('\'') && param.endsWith('\''))

/**
 * Helper to extract string content from quotes
 */
const unquote = (param: string): string => param.slice(1, -1)

/**
 * Factory for Array.from range patterns with shared logic
 */
function createRangeTransform(
  expressionTemplate: (params: { start: string, end: string }) => string,
  singleParamTemplate: (end: string) => string,
) {
  return (callInfo: CallInfo): FixResult | null => {
    const commaIndex = findFirstTopLevelComma(callInfo.params)

    let expression: string
    if (commaIndex === -1) {
      const end = callInfo.params.trim()
      expression = singleParamTemplate(end)
    } else {
      const start = callInfo.params.slice(0, commaIndex).trim()
      const end = callInfo.params.slice(commaIndex + 1).trim()
      expression = expressionTemplate({ start, end })
    }

    const { start, text } = handleNegationOperator(callInfo, expression)
    return { range: [start, callInfo.callEnd], text }
  }
}

/**
 * Declarative transform patterns - the heart of the elegant system
 */
export const TRANSFORM_PATTERNS: TransformPattern[] = [
  // Array spread patterns
  {
    name: 'uniq-spread',
    detect: alt => alt.includes('[...new Set('),
    transform: createSingleParamTransform('[...new Set($PARAM$)]'),
  },

  // Method chain patterns
  {
    name: 'compact-filter',
    detect: alt => alt.includes('.filter(Boolean)'),
    transform: createSingleParamTransform('$PARAM$.filter(Boolean)', safeParam),
  },

  // Object utility patterns
  {
    name: 'pick-fromEntries',
    detect: alt => alt.includes('Object.fromEntries(') && alt.includes('.map(') && !alt.includes('Object.entries('),
    transform: createTwoParamTransform(
      'Object.fromEntries($SECOND$.map(k => [k, $FIRST$[k]]))',
      { first: safeParam },
    ),
  },

  {
    name: 'omit-fromEntries',
    detect: alt => alt.includes('Object.fromEntries(Object.entries(') && alt.includes('.filter('),
    transform: createTwoParamTransform(
      'Object.fromEntries(Object.entries($FIRST$).filter(([k]) => !$SECOND$.includes(k)))',
    ),
  },

  // ES2023 immutable methods
  {
    name: 'sortBy-toSorted',
    detect: alt => alt.includes('.toSorted('),
    transform: (callInfo: CallInfo): FixResult | null => {
      const commaIndex = findFirstTopLevelComma(callInfo.params)
      const targetParam = commaIndex === -1 ? callInfo.params : callInfo.params.slice(0, commaIndex).trim()
      const safeTargetParam = safeParam(targetParam)

      let expression: string
      if (commaIndex === -1) {
        expression = `${safeTargetParam}.toSorted()`
      } else {
        const fn = callInfo.params.slice(commaIndex + 1).trim()
        const compareFn = fn.includes('=>')
          ? `(a, b) => (${fn})(a) - (${fn})(b)`
          : `(a, b) => ${fn}(a) - ${fn}(b)`
        expression = `${safeTargetParam}.toSorted(${compareFn})`
      }

      const { start, text } = handleNegationOperator(callInfo, expression)
      return { range: [start, callInfo.callEnd], text }
    },
  },

  // Object.assign patterns
  {
    name: 'merge-assign',
    detect: alt => alt.includes('Object.assign({}, '),
    transform: createSingleParamTransform('Object.assign({}, $PARAM$)'),
  },

  // Optional chaining patterns
  {
    name: 'get-optionalChaining',
    detect: alt => alt.includes('?.'),
    transform: (callInfo: CallInfo): FixResult | null => {
      const commaIndex = findFirstTopLevelComma(callInfo.params)
      if (commaIndex === -1) return null

      const obj = callInfo.params.slice(0, commaIndex).trim()
      const path = callInfo.params.slice(commaIndex + 1).trim()

      // Simple path conversion for common cases
      if (isQuotedString(path)) {
        const pathStr = unquote(path)
        if (RegexCache.getSimplePropertyPathRegex().test(pathStr)) {
          const optionalChainPath = pathStr.replaceAll('.', '?.')
          const safeObj = safeParam(obj)
          const expression = `${safeObj}?.${optionalChainPath}`
          const { start, text } = handleNegationOperator(callInfo, expression)
          return { range: [start, callInfo.callEnd], text }
        }
      }
      return null
    },
  },

  // Spread object patterns
  {
    name: 'clone-spread',
    detect: alt => alt.includes('{...'),
    transform: createSingleParamTransform('{...$PARAM$}', safeParam),
  },

  // Modern native functions
  {
    name: 'cloneDeep-structuredClone',
    detect: alt => alt.includes('structuredClone('),
    transform: createSingleParamTransform('structuredClone($PARAM$)'),
  },

  // ES2024 Object.groupBy
  {
    name: 'groupBy-objectGroupBy',
    detect: alt => alt.includes('Object.groupBy('),
    transform: createTwoParamTransform(
      'Object.groupBy($FIRST$, $SECOND$)',
      { second: stringPathToFunction },
    ),
  },

  // Reduce patterns
  {
    name: 'countBy-reduce',
    detect: alt => alt.includes('.reduce((acc, item)'),
    transform: createTwoParamTransform(
      '$FIRST$.reduce((acc, item) => { const key = ($SECOND$)(item); acc[key] = (acc[key] || 0) + 1; return acc; }, {})',
      {
        first: safeParam,
        second: stringPathToFunction,
      },
    ),
  },

  // Array.from patterns - specific patterns must come before generic ones
  {
    name: 'times-arrayFrom',
    detect: alt => alt === 'Array.from({length: n}, (_, i) => fn(i))',
    transform: (callInfo: CallInfo): FixResult | null => {
      const commaIndex = findFirstTopLevelComma(callInfo.params)
      if (commaIndex === -1) return null
      const n = callInfo.params.slice(0, commaIndex).trim()
      const fn = callInfo.params.slice(commaIndex + 1).trim()
      const expression = `Array.from({length: ${n}}, (_, i) => ${fn}(i))`
      const { start, text } = handleNegationOperator(callInfo, expression)
      return { range: [start, callInfo.callEnd], text }
    },
  },

  {
    name: 'range-arrayFrom',
    detect: alt => alt === 'Array.from({length: end - start}, (_, i) => start + i)',
    transform: createRangeTransform(
      ({ start, end }) => `Array.from({length: ${end} - ${start}}, (_, i) => ${start} + i)`,
      end => `Array.from({length: ${end}}, (_, i) => i)`,
    ),
  },

  {
    name: 'rangeRight-arrayFrom',
    detect: alt => alt === 'Array.from({length: end - start}, (_, i) => end - i - 1)',
    transform: createRangeTransform(
      ({ start, end }) => `Array.from({length: ${end} - ${start}}, (_, i) => ${end} - i - 1)`,
      end => `Array.from({length: ${end}}, (_, i) => ${end} - i - 1)`,
    ),
  },

  {
    name: 'chunk-arrayFrom',
    detect: alt => alt.includes('Array.from({length:'),
    transform: createTwoParamTransform(
      'Array.from({length: Math.ceil($FIRST$.length / $SECOND$)}, (_, i) => $FIRST$.slice(i * $SECOND$, (i + 1) * $SECOND$))',
      { first: safeParam },
    ),
  },

  // Arithmetic operation patterns (two parameters)
  ...createArithmeticPatterns([
    ['add-operator', 'a + b', '+'],
    ['subtract-operator', 'a - b', '-'],
    ['multiply-operator', 'a * b', '*'],
    ['divide-operator', 'a / b', '/'],
  ]),
]

/**
 * Ultra-elegant unified transform function
 */
export function createPatternBasedTransform(callInfo: CallInfo, nativeAlternative: string): FixResult | null {
  // Try each pattern in order
  for (const pattern of TRANSFORM_PATTERNS) {
    if (pattern.detect(nativeAlternative)) {
      const result = pattern.transform(callInfo, nativeAlternative)
      if (result) return result
    }
  }

  return null
}

/**
 * Get pattern name for debugging/logging
 */
export function getMatchingPatternName(nativeAlternative: string): string | null {
  for (const pattern of TRANSFORM_PATTERNS) {
    if (pattern.detect(nativeAlternative)) {
      return pattern.name
    }
  }
  return null
}
