/**
 * ESLint rule to suggest native JavaScript alternatives to lodash functions
 */
import { getSourceCode, isLodashModule, findLodashUsages, hasNativeAlternative, getNativeAlternative } from '../utils'

import type {
  ImportDeclaration,
  ImportSpecifier,
} from 'estree'
import type { Rule } from 'eslint'
import type { Usage, SuggestNativeAlternativesRuleOptions } from '../types'

function findNativeAlternativeUsages(sourceCode: string, importName: string, options: SuggestNativeAlternativesRuleOptions): Usage[] {
  const alternativeUsages: Usage[] = []
  const allUsages = findLodashUsages(sourceCode, importName)

  for (const usage of allUsages) {
    if (hasNativeAlternative(usage.functionName)) {
      const alternative = getNativeAlternative(usage.functionName)

      if (!alternative) {
        continue
      }

      // Skip unsafe alternatives unless explicitly included
      if (options.excludeUnsafe && alternative.notes?.includes('different behavior')) {
        continue
      }

      alternativeUsages.push(usage)
    }
  }

  return alternativeUsages
}

function findNativeAlternativeDestructuredFunctions(
  destructuredFunctions: string[],
  options: SuggestNativeAlternativesRuleOptions,
): { functionName: string, hasAlternative: boolean }[] {
  return destructuredFunctions.map((functionName) => {
    const hasAlternative = hasNativeAlternative(functionName)

    if (!hasAlternative) {
      return { functionName, hasAlternative: false }
    }

    // Check if we should exclude unsafe alternatives
    if (options.excludeUnsafe) {
      const alternative = getNativeAlternative(functionName)
      if (alternative?.notes?.includes('different behavior')) {
        return { functionName, hasAlternative: false }
      }
    }

    return { functionName, hasAlternative: true }
  })
}

const suggestNativeAlternatives: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Suggest native JavaScript alternatives to lodash functions when available',
      category: 'Best Practices',
      recommended: false,
    },
    schema: [
      {
        type: 'object',
        properties: {
          includeAll: {
            type: 'boolean',
            description: 'Include all alternatives, even if not perfect replacements',
            default: false,
          },
          excludeUnsafe: {
            type: 'boolean',
            description: 'Exclude alternatives that have different behavior',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context: Rule.RuleContext) {
    const sourceCode = getSourceCode(context)
    const options: SuggestNativeAlternativesRuleOptions = {
      includeAll: false,
      excludeUnsafe: true,
      ...context.options[0],
    }

    /**
     * Handle default/namespace imports reporting
     */
    function handleDefaultImports(node: ImportDeclaration, importName: string): void {
      const fullSourceCode = sourceCode.getText()
      const alternativeUsages = findNativeAlternativeUsages(fullSourceCode, importName, options)

      for (const usage of alternativeUsages) {
        const alternative = getNativeAlternative(usage.functionName)

        if (!alternative) {
          continue
        }

        context.report({
          node,
          loc: {
            start: sourceCode.getLocFromIndex(usage.start),
            end: sourceCode.getLocFromIndex(usage.end),
          },
          message: `Consider using native '${alternative.example?.native || alternative.native}' instead of lodash '${usage.functionName}'. ${alternative.description}.`,
        })
      }
    }

    /**
     * Handle destructured imports reporting
     */
    function handleDestructuredImports(destructuredSpecifiers: ImportSpecifier[]): void {
      const destructuredFunctions = destructuredSpecifiers
        .map(spec => (spec.imported.type === 'Identifier' ? spec.imported.name : ''))
        .filter(name => name !== '')

      const alternativeFunctions = findNativeAlternativeDestructuredFunctions(destructuredFunctions, options)

      for (const { functionName, hasAlternative } of alternativeFunctions) {
        if (!hasAlternative) continue

        const alternative = getNativeAlternative(functionName)

        if (!alternative) {
          continue
        }

        const specifier = destructuredSpecifiers.find(spec =>
          spec.imported.type === 'Identifier' && spec.imported.name === functionName,
        )

        if (!specifier) continue

        const noteText = alternative.notes ? ` Note: ${alternative.notes}` : ''
        const message = `Consider using native '${alternative.example?.native || alternative.native}' instead of lodash '${functionName}'. ${alternative.description}.${noteText}`

        context.report({
          node: specifier,
          message,
        })
      }
    }

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        const source = node.source.value as string
        if (!isLodashModule(source)) return

        // Check for default or namespace imports
        const defaultOrNamespaceSpecifier = node.specifiers.find(spec =>
          spec.type === 'ImportDefaultSpecifier' || spec.type === 'ImportNamespaceSpecifier',
        )

        if (defaultOrNamespaceSpecifier) {
          handleDefaultImports(node, defaultOrNamespaceSpecifier.local.name)
        }

        // Check destructured imports
        const destructuredSpecifiers = node.specifiers.filter(spec =>
          spec.type === 'ImportSpecifier',
        )

        if (destructuredSpecifiers.length > 0) {
          handleDestructuredImports(destructuredSpecifiers)
        }
      },
    }
  },
}

export default suggestNativeAlternatives
