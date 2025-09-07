/**
 * ESLint rule to suggest native JavaScript alternatives to lodash functions
 */
import { getSourceCode, isLodashModule, findLodashUsages, hasNativeAlternative, getNativeAlternative } from '../utils'

import type { ImportDeclaration, ImportSpecifier } from 'estree'
import type { Rule } from 'eslint'
import type { Usage, SuggestNativeAlternativesRuleOptions, LodashFunctionName, LodashModuleName } from '../types'

/**
 * Create message with null safety warnings and context
 */
function createMessage(functionName: LodashFunctionName, alternative: { example?: { native?: string }, native: string, description: string, notes?: readonly string[] }): string {
  const baseExample = alternative.example?.native || alternative.native
  const description = alternative.description

  // Add null safety warning for functions that lose lodash's null safety
  const nullSafeFunctions = ['keys', 'values', 'entries', 'size', 'isEmpty']
  const needsNullSafety = nullSafeFunctions.includes(functionName)

  // Add mutation warning for functions with different behavior
  const mutatingFunctions = ['reverse']
  const hasMutationRisk = mutatingFunctions.includes(functionName)

  const nullSafetyWarning = needsNullSafety ? ' ⚠️  Add null safety: use `obj || {}` to prevent runtime errors.' : ''
  const mutationWarning = hasMutationRisk ? ' ⚠️  Native version mutates the original array.' : ''
  const notesText = alternative.notes?.length ? ` Note: ${alternative.notes.join('. ')}` : ''

  return `Consider native '${baseExample}' instead of '_.${functionName}()'. ${description}.${nullSafetyWarning}${mutationWarning}${notesText}`
}

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
      if (options.excludeUnsafe && alternative.excludeByDefault) {
        continue
      }

      alternativeUsages.push(usage)
    }
  }

  return alternativeUsages
}

function findNativeAlternativeDestructuredFunctions(
  destructuredFunctions: LodashFunctionName[],
  options: SuggestNativeAlternativesRuleOptions,
): { functionName: LodashFunctionName, hasAlternative: boolean }[] {
  return destructuredFunctions.map((functionName) => {
    const hasAlternative = hasNativeAlternative(functionName)

    if (!hasAlternative) {
      return { functionName, hasAlternative: false }
    }

    // Check if we should exclude unsafe alternatives
    if (options.excludeUnsafe) {
      const alternative = getNativeAlternative(functionName)
      if (alternative?.excludeByDefault) {
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
          message: createMessage(usage.functionName, alternative),
        })
      }
    }

    /**
     * Handle destructured imports reporting
     */
    function handleDestructuredImports(destructuredSpecifiers: ImportSpecifier[]): void {
      const destructuredFunctions = destructuredSpecifiers
        .map(spec => (spec.imported.type === 'Identifier' ? spec.imported.name : ''))
        .filter(name => name !== '') as LodashFunctionName[]

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

        context.report({
          node: specifier,
          message: createMessage(functionName, alternative),
        })
      }
    }

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        const source = node.source.value as LodashModuleName
        if (typeof source !== 'string') return
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
