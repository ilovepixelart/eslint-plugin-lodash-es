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

interface RuleOptions {
  exclude?: string[]
  include?: string[]
}

function findBlockedFunctions(sourceCode: string, importName: string, options: RuleOptions): Usage[] {
  const allUsages = findLodashUsages(sourceCode, importName)

  return allUsages.filter((usage) => {
    const functionName = usage.functionName
    return (options.include && !options.include.includes(functionName))
      || (options.exclude && options.exclude.includes(functionName))
  })
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
