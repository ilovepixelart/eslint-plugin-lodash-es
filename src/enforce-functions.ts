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
import { Usage, getSourceCode, isLodashModule, findLodashUsages } from './utils'
import { getNativeAlternative } from './native-alternatives'

interface RuleOptions {
  exclude?: string[]
  include?: string[]
}

function createEnhancedErrorMessage(functionName: string, reason: string): string {
  const baseMessage = `Lodash function '${functionName}' is ${reason}.`
  const nativeAlternative = getNativeAlternative(functionName)

  if (nativeAlternative) {
    return `${baseMessage} Consider using native ${nativeAlternative.native}: ${nativeAlternative.example?.native || ''}`
  }

  return baseMessage
}

function getReason(options: RuleOptions): string {
  return options.exclude
    ? 'excluded by configuration'
    : 'not in the allowed functions list'
}

function handleDefaultOrNamespaceImports(
  node: ImportDeclaration,
  defaultOrNamespaceSpecifier: ImportDefaultSpecifier | ImportNamespaceSpecifier,
  sourceCode: ReturnType<typeof getSourceCode>,
  options: RuleOptions,
  context: Rule.RuleContext,
): void {
  const fullSourceCode = sourceCode.getText()
  const blockedUsages = findBlockedFunctions(fullSourceCode, defaultOrNamespaceSpecifier.local.name, options)
  const reason = getReason(options)

  for (const usage of blockedUsages) {
    context.report({
      node,
      loc: {
        start: sourceCode.getLocFromIndex(usage.start),
        end: sourceCode.getLocFromIndex(usage.end),
      },
      message: createEnhancedErrorMessage(usage.functionName, reason),
    })
  }
}

function handleDestructuredImports(
  destructuredSpecifiers: ImportSpecifier[],
  options: RuleOptions,
  context: Rule.RuleContext,
): void {
  const destructuredFunctions = destructuredSpecifiers.map((spec) => {
    return spec.imported.type === 'Identifier' ? spec.imported.name : ''
  }).filter(name => name !== '')
  const blockedFunctions = findBlockedDestructuredFunctions(destructuredFunctions, options)
  const reason = getReason(options)

  for (const { functionName, isBlocked } of blockedFunctions) {
    if (isBlocked) {
      const specifier = destructuredSpecifiers.find(spec =>
        spec.imported.type === 'Identifier' && spec.imported.name === functionName,
      )
      if (specifier) {
        context.report({
          node: specifier,
          message: createEnhancedErrorMessage(functionName, reason),
        })
      }
    }
  }
}

function findBlockedFunctions(sourceCode: string, importName: string, options: RuleOptions): Usage[] {
  const allUsages = findLodashUsages(sourceCode, importName)

  return allUsages.filter((usage) => {
    const functionName = usage.functionName
    return (options.include && !options.include.includes(functionName))
      || (options.exclude?.includes(functionName))
  })
}

function findBlockedDestructuredFunctions(
  destructuredFunctions: string[],
  options: RuleOptions,
): { functionName: string, isBlocked: boolean }[] {
  return destructuredFunctions.map((functionName) => {
    const isBlocked = Boolean((options.include && !options.include.includes(functionName))
      || (options.exclude?.includes(functionName)))

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
    const sourceCode = getSourceCode(context)
    const options: RuleOptions = context.options[0] || {}

    // Validate that only include OR exclude is used, not both
    if (options.include && options.exclude) {
      throw new Error('Cannot specify both "include" and "exclude" options. Use only one.')
    }

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        const source = node.source.value as string

        if (!isLodashModule(source)) {
          return
        }

        // Check for default or namespace imports
        const defaultOrNamespaceSpecifier = node.specifiers.find(spec =>
          spec.type === 'ImportDefaultSpecifier' || spec.type === 'ImportNamespaceSpecifier',
        ) as ImportDefaultSpecifier | ImportNamespaceSpecifier

        if (defaultOrNamespaceSpecifier) {
          handleDefaultOrNamespaceImports(node, defaultOrNamespaceSpecifier, sourceCode, options, context)
        }

        // Check destructured imports: import { map, filter } from 'lodash-es'
        const destructuredSpecifiers = node.specifiers.filter((spec): spec is ImportSpecifier =>
          spec.type === 'ImportSpecifier',
        )

        if (destructuredSpecifiers.length > 0) {
          handleDestructuredImports(destructuredSpecifiers, options, context)
        }
      },
    }
  },
}

export default enforceFunctions
