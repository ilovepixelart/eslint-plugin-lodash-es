/**
 * ESLint rule to enforce specific lodash-es function usage policies
 */
import type { Rule } from 'eslint'
import type {
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
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

interface RuleOptions {
  exclude?: string[]
  include?: string[]
}

interface Usage {
  start: number
  end: number
  fullMatch: string
  functionName: string
  originalText: string
}

function findBlockedFunctions(sourceCode: string, importName: string, options: RuleOptions): Usage[] {
  const blockedUsages: Usage[] = []
  const regex = new RegExp(`\\b${importName}\\.(\\w+)`, 'g')
  let match

  while ((match = regex.exec(sourceCode)) !== null) {
    const functionName = match[1]
    if (functionName && COMMON_LODASH_FUNCTIONS.includes(functionName)) {
      // Check if function is blocked by include/exclude filters
      const isBlocked = (options.include && !options.include.includes(functionName))
        || (options.exclude && options.exclude.includes(functionName))

      if (isBlocked) {
        blockedUsages.push({
          start: match.index,
          end: match.index + match[0].length,
          fullMatch: match[0], // e.g., "_.map"
          functionName: functionName, // e.g., "map"
          originalText: match[0],
        })
      }
    }
  }

  return blockedUsages
}

function findBlockedDestructuredFunctions(
  destructuredFunctions: string[],
  options: RuleOptions,
): { functionName: string, isBlocked: boolean }[] {
  return destructuredFunctions.map((functionName) => {
    const isBlocked = Boolean((options.include && !options.include.includes(functionName))
      || (options.exclude && options.exclude.includes(functionName)))

    return { functionName, isBlocked }
  })
}

const enforceFunctions: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce specific lodash-es function usage policies based on include/exclude configuration',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          exclude: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'List of lodash functions to exclude/disallow',
          },
          include: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'List of lodash functions to include/allow (if provided, only these functions are allowed)',
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context: Rule.RuleContext) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()
    const options: RuleOptions = context.options[0] || {}

    // Validate that only include OR exclude is used, not both
    if (options.include && options.exclude) {
      throw new Error('Cannot specify both "include" and "exclude" options. Use only one.')
    }

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        const source = node.source.value as string

        if (!LODASH_MODULES.has(source)) {
          return
        }

        // Check for default or namespace imports
        const defaultOrNamespaceSpecifier = node.specifiers.find(spec =>
          spec.type === 'ImportDefaultSpecifier' || spec.type === 'ImportNamespaceSpecifier',
        ) as ImportDefaultSpecifier | ImportNamespaceSpecifier

        if (defaultOrNamespaceSpecifier) {
          // Handle default/namespace imports: _.map(), lodash.map()
          const fullSourceCode = sourceCode.getText()
          const blockedUsages = findBlockedFunctions(fullSourceCode, defaultOrNamespaceSpecifier.local.name, options)

          const reason = options.exclude
            ? 'excluded by configuration'
            : 'not in the allowed functions list'

          for (const usage of blockedUsages) {
            context.report({
              node,
              loc: {
                start: sourceCode.getLocFromIndex(usage.start),
                end: sourceCode.getLocFromIndex(usage.end),
              },
              message: `Lodash function '${usage.functionName}' is ${reason}.`,
            })
          }
        }

        // Check destructured imports: import { map, filter } from 'lodash-es'
        const destructuredSpecifiers = node.specifiers.filter(spec =>
          spec.type === 'ImportSpecifier',
        ) as ImportSpecifier[]

        if (destructuredSpecifiers.length > 0) {
          const destructuredFunctions = destructuredSpecifiers.map((spec) => {
            // For ImportSpecifier, imported is always an Identifier in normal cases
            return spec.imported.type === 'Identifier' ? spec.imported.name : ''
          }).filter(name => name !== '')
          const blockedFunctions = findBlockedDestructuredFunctions(destructuredFunctions, options)

          const reason = options.exclude
            ? 'excluded by configuration'
            : 'not in the allowed functions list'

          for (const { functionName, isBlocked } of blockedFunctions) {
            if (isBlocked) {
              const specifier = destructuredSpecifiers.find(spec =>
                spec.imported.type === 'Identifier' && spec.imported.name === functionName,
              )
              if (specifier) {
                context.report({
                  node: specifier,
                  message: `Lodash function '${functionName}' is ${reason}.`,
                })
              }
            }
          }
        }
      },
    }
  },
}

export default enforceFunctions
