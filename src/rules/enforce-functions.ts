/**
 * ESLint rule to enforce specific lodash-es function usage policies
 */
import { getSourceCode, isLodashModule, findLodashUsages, getNativeAlternative } from '../utils'

import type {
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
} from 'estree'
import type { Rule } from 'eslint'
import type { Usage, EnforceFunctionsRuleOptions, LodashFunctionName, LodashModuleName } from '../types'

function createErrorMessage(functionName: LodashFunctionName, reason: string): string {
  const nativeAlternative = getNativeAlternative(functionName)
  const nativeExample = nativeAlternative?.example?.native || ''

  return nativeAlternative
    ? `Lodash function '${functionName}' is ${reason}. Consider using native ${nativeAlternative.native}: ${nativeExample}`
    : `Lodash function '${functionName}' is ${reason}.`
}

function getReason(options: EnforceFunctionsRuleOptions): string {
  return options.exclude
    ? 'excluded by configuration'
    : 'not in the allowed functions list'
}

function handleDefaultOrNamespaceImports(
  node: ImportDeclaration,
  defaultOrNamespaceSpecifier: ImportDefaultSpecifier | ImportNamespaceSpecifier,
  sourceCode: ReturnType<typeof getSourceCode>,
  options: EnforceFunctionsRuleOptions,
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
      message: createErrorMessage(usage.functionName, reason),
    })
  }
}

function handleDestructuredImports(
  destructuredSpecifiers: ImportSpecifier[],
  options: EnforceFunctionsRuleOptions,
  context: Rule.RuleContext,
): void {
  const destructuredFunctions = destructuredSpecifiers.map((spec) => {
    return spec.imported.type === 'Identifier' ? spec.imported.name : ''
  }).filter(name => name !== '') as LodashFunctionName[]
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
          message: createErrorMessage(functionName, reason),
        })
      }
    }
  }
}

function findBlockedFunctions(sourceCode: string, importName: string, options: EnforceFunctionsRuleOptions): Usage[] {
  const allUsages = findLodashUsages(sourceCode, importName)

  return allUsages.filter((usage) => {
    const functionName = usage.functionName
    return (options.include && !options.include.includes(functionName))
      || (options.exclude?.includes(functionName))
  })
}

function findBlockedDestructuredFunctions(
  destructuredFunctions: LodashFunctionName[],
  options: EnforceFunctionsRuleOptions,
): { functionName: LodashFunctionName, isBlocked: boolean }[] {
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
    const options: EnforceFunctionsRuleOptions = context.options[0] || {}

    // Validate that only include OR exclude is used, not both
    if (options.include && options.exclude) {
      throw new Error('Cannot specify both "include" and "exclude" options. Use only one.')
    }

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        const source = node.source.value as LodashModuleName
        if (typeof source !== 'string') return

        if (!isLodashModule(source)) {
          return
        }

        // Check for default or namespace imports
        const defaultOrNamespaceSpecifier = node.specifiers.find(spec =>
          spec.type === 'ImportDefaultSpecifier' || spec.type === 'ImportNamespaceSpecifier',
        )

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
