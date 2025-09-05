/**
 * ESLint rule to enforce destructured imports from lodash-es and auto-fix them
 */
import type { Rule } from 'eslint'
import type {
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
} from 'estree'

const LODASH_MODULES = new Set([
  'lodash',
  'lodash-es',
])

const COMMON_LODASH_FUNCTIONS = [
  // Array
  'chunk', 'compact', 'concat', 'difference', 'differenceBy', 'differenceWith',
  'drop', 'dropRight', 'dropRightWhile', 'dropWhile', 'fill', 'findIndex',
  'findLastIndex', 'first', 'flatten', 'flattenDeep', 'flattenDepth',
  'fromPairs', 'head', 'indexOf', 'initial', 'intersection', 'intersectionBy',
  'intersectionWith', 'join', 'last', 'lastIndexOf', 'nth', 'pull', 'pullAll',
  'pullAllBy', 'pullAllWith', 'pullAt', 'remove', 'reverse', 'slice', 'sortBy',
  'sortedIndex', 'sortedIndexBy', 'sortedIndexOf', 'sortedLastIndex',
  'sortedLastIndexBy', 'sortedLastIndexOf', 'sortedUniq', 'sortedUniqBy',
  'tail', 'take', 'takeRight', 'takeRightWhile', 'takeWhile', 'union',
  'unionBy', 'unionWith', 'uniq', 'uniqBy', 'uniqWith', 'unzip', 'unzipWith',
  'without', 'xor', 'xorBy', 'xorWith', 'zip', 'zipObject', 'zipObjectDeep',
  'zipWith',

  // Collection
  'countBy', 'each', 'eachRight', 'every', 'filter', 'find', 'findLast',
  'flatMap', 'flatMapDeep', 'flatMapDepth', 'forEach', 'forEachRight',
  'groupBy', 'includes', 'invokeMap', 'keyBy', 'map', 'orderBy', 'partition',
  'reduce', 'reduceRight', 'reject', 'sample', 'sampleSize', 'shuffle',
  'size', 'some', 'sortBy',

  // Date
  'now',

  // Function
  'after', 'ary', 'before', 'bind', 'bindKey', 'curry', 'curryRight',
  'debounce', 'defer', 'delay', 'flip', 'memoize', 'negate', 'once',
  'overArgs', 'partial', 'partialRight', 'rearg', 'rest', 'spread',
  'throttle', 'unary', 'wrap',

  // Lang
  'castArray', 'clone', 'cloneDeep', 'cloneDeepWith', 'cloneWith',
  'conformsTo', 'eq', 'gt', 'gte', 'isArguments', 'isArray', 'isArrayBuffer',
  'isArrayLike', 'isArrayLikeObject', 'isBoolean', 'isBuffer', 'isDate',
  'isElement', 'isEmpty', 'isEqual', 'isEqualWith', 'isError', 'isFinite',
  'isFunction', 'isInteger', 'isLength', 'isMap', 'isMatch', 'isMatchWith',
  'isNaN', 'isNative', 'isNil', 'isNull', 'isNumber', 'isObject',
  'isObjectLike', 'isPlainObject', 'isRegExp', 'isSafeInteger', 'isSet',
  'isString', 'isSymbol', 'isTypedArray', 'isUndefined', 'isWeakMap',
  'isWeakSet', 'lt', 'lte', 'toArray', 'toFinite', 'toInteger', 'toLength',
  'toNumber', 'toPlainObject', 'toSafeInteger', 'toString',

  // Math
  'add', 'ceil', 'divide', 'floor', 'max', 'maxBy', 'mean', 'meanBy',
  'min', 'minBy', 'multiply', 'round', 'subtract', 'sum', 'sumBy',

  // Number
  'clamp', 'inRange', 'random',

  // Object
  'assign', 'assignIn', 'assignInWith', 'assignWith', 'at', 'create',
  'defaults', 'defaultsDeep', 'entries', 'entriesIn', 'extend', 'extendWith',
  'findKey', 'findLastKey', 'forIn', 'forInRight', 'forOwn', 'forOwnRight',
  'functions', 'functionsIn', 'get', 'has', 'hasIn', 'invert', 'invertBy',
  'invoke', 'keys', 'keysIn', 'mapKeys', 'mapValues', 'merge', 'mergeWith',
  'omit', 'omitBy', 'pick', 'pickBy', 'result', 'set', 'setWith', 'toPairs',
  'toPairsIn', 'transform', 'unset', 'update', 'updateWith', 'values',
  'valuesIn',

  // Seq
  'chain', 'tap', 'thru', 'value',

  // String
  'camelCase', 'capitalize', 'deburr', 'endsWith', 'escape', 'escapeRegExp',
  'kebabCase', 'lowerCase', 'lowerFirst', 'pad', 'padEnd', 'padStart',
  'parseInt', 'repeat', 'replace', 'snakeCase', 'split', 'startCase',
  'startsWith', 'template', 'toLower', 'toUpper', 'trim', 'trimEnd',
  'trimStart', 'truncate', 'unescape', 'upperCase', 'upperFirst', 'words',

  // Util
  'attempt', 'bindAll', 'cond', 'conforms', 'constant', 'defaultTo',
  'flow', 'flowRight', 'identity', 'iteratee', 'matches', 'matchesProperty',
  'method', 'methodOf', 'mixin', 'noConflict', 'noop', 'nthArg', 'over',
  'overEvery', 'overSome', 'property', 'propertyOf', 'range', 'rangeRight',
  'stubArray', 'stubFalse', 'stubObject', 'stubString', 'stubTrue', 'times',
  'toPath', 'uniqueId',
]

interface Usage {
  start: number
  end: number
  fullMatch: string
  functionName: string
  originalText: string
}

function extractUsedFunctions(sourceCode: string, importNode: ImportDefaultSpecifier | ImportNamespaceSpecifier): string[] {
  const usedFunctions = new Set<string>()
  const importName = importNode.local.name

  // Find all member expressions using the import
  const regex = new RegExp(`\\b${importName}\\.(\\w+)`, 'g')
  let match

  while ((match = regex.exec(sourceCode)) !== null) {
    const functionName = match[1]
    if (functionName && COMMON_LODASH_FUNCTIONS.includes(functionName)) {
      usedFunctions.add(functionName)
    }
  }

  return Array.from(usedFunctions).sort()
}

function findAllLodashUsages(sourceCode: string, importName: string): Usage[] {
  const usages: Usage[] = []
  const regex = new RegExp(`\\b${importName}\\.(\\w+)`, 'g')
  let match

  while ((match = regex.exec(sourceCode)) !== null) {
    const functionName = match[1]
    if (functionName && COMMON_LODASH_FUNCTIONS.includes(functionName)) {
      usages.push({
        start: match.index,
        end: match.index + match[0].length,
        fullMatch: match[0], // e.g., "_.first"
        functionName: functionName, // e.g., "first"
        originalText: match[0],
      })
    }
  }

  return usages
}

const enforceLodashDestructuring: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce destructured imports from lodash-es',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
  },

  create(context: Rule.RuleContext) {
    const sourceCode = context.getSourceCode()

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        const source = node.source.value as string

        if (!LODASH_MODULES.has(source)) {
          return
        }

        // Check for default or namespace imports
        const hasDefaultImport = node.specifiers.some(spec =>
          spec.type === 'ImportDefaultSpecifier',
        )

        const hasNamespaceImport = node.specifiers.some(spec =>
          spec.type === 'ImportNamespaceSpecifier',
        )

        if (hasDefaultImport || hasNamespaceImport) {
          const importSpecifier = node.specifiers.find(spec =>
            spec.type === 'ImportDefaultSpecifier' || spec.type === 'ImportNamespaceSpecifier',
          ) as ImportDefaultSpecifier | ImportNamespaceSpecifier

          context.report({
            node,
            message: `Use destructured imports from lodash-es instead of ${hasDefaultImport ? 'default' : 'namespace'} import.`,
            fix(fixer: Rule.RuleFixer) {
              try {
                const fullSourceCode = sourceCode.getText()
                const usedFunctions = extractUsedFunctions(fullSourceCode, importSpecifier)
                const allUsages = findAllLodashUsages(fullSourceCode, importSpecifier.local.name)

                if (usedFunctions.length === 0) {
                  // If no functions are detected, just remove the import
                  return fixer.remove(node)
                }

                // Create array of fixes
                const fixes: Rule.Fix[] = []

                // 1. Replace the import statement
                const newImport = `import { ${usedFunctions.join(', ')} } from 'lodash-es';`
                fixes.push(fixer.replaceText(node, newImport))

                // 2. Replace all usages in the code (_.functionName -> functionName)
                // Sort usages in reverse order to avoid offset issues when replacing
                const sortedUsages = allUsages.sort((a, b) => b.start - a.start)

                for (const usage of sortedUsages) {
                  const range: [number, number] = [usage.start, usage.end]
                  fixes.push(fixer.replaceTextRange(range, usage.functionName))
                }

                return fixes
              }
              catch (error) {
                console.error('Auto-fix error:', error)
                // Fallback if auto-detection fails
                return fixer.replaceText(node, `import { /* Add specific functions here */ } from 'lodash-es';`)
              }
            },
          })
        }
      },
    }
  },
}

export default enforceLodashDestructuring
