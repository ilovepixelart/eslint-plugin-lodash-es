/**
 * ESLint rule to suggest native JavaScript alternatives to lodash functions
 */
import type { Rule } from 'eslint'
import type {
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
} from 'estree'
import { Usage, getSourceCode, isLodashModule, findLodashUsages } from './utils'
import { hasNativeAlternative, getNativeAlternative } from './native-alternatives'

interface RuleOptions {
  includeAll?: boolean // Include all alternatives, even if not perfect replacements
  excludeUnsafe?: boolean // Exclude alternatives that have different behavior
}

function findNativeAlternativeUsages(sourceCode: string, importName: string, options: RuleOptions): Usage[] {
  const alternativeUsages: Usage[] = []
  const allUsages = findLodashUsages(sourceCode, importName)

  for (const usage of allUsages) {
    if (hasNativeAlternative(usage.functionName)) {
      const alternative = getNativeAlternative(usage.functionName)!

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
  options: RuleOptions,
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
    hasSuggestions: true,
  },

  create(context: Rule.RuleContext) {
    const sourceCode = getSourceCode(context)
    const options: RuleOptions = {
      includeAll: false,
      excludeUnsafe: true,
      ...context.options[0],
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
          // Handle default/namespace imports: _.isArray(), lodash.isArray()
          const fullSourceCode = sourceCode.getText()
          const alternativeUsages = findNativeAlternativeUsages(
            fullSourceCode,
            defaultOrNamespaceSpecifier.local.name,
            options,
          )

          for (const usage of alternativeUsages) {
            const alternative = getNativeAlternative(usage.functionName)!

            context.report({
              node,
              loc: {
                start: sourceCode.getLocFromIndex(usage.start),
                end: sourceCode.getLocFromIndex(usage.end),
              },
              message: `Consider using native '${alternative.native}' instead of lodash '${usage.functionName}'. ${alternative.description}.`,
              suggest: [
                {
                  desc: `Replace with native ${alternative.native}`,
                  fix: (fixer: Rule.RuleFixer): Rule.Fix => {
                    const range: [number, number] = [usage.start, usage.end]
                    // For simple replacements like _.isArray(x) -> Array.isArray(x)
                    const replacement = usage.fullMatch.replace(
                      new RegExp(`${defaultOrNamespaceSpecifier.local.name}\\.${usage.functionName}`),
                      alternative.native,
                    )
                    return fixer.replaceTextRange(range, replacement)
                  },
                },
              ],
            })
          }
        }

        // Check destructured imports: import { isArray, map } from 'lodash-es'
        const destructuredSpecifiers = node.specifiers.filter(spec =>
          spec.type === 'ImportSpecifier',
        ) as ImportSpecifier[]

        if (destructuredSpecifiers.length > 0) {
          const destructuredFunctions = destructuredSpecifiers.map((spec) => {
            return spec.imported.type === 'Identifier' ? spec.imported.name : ''
          }).filter(name => name !== '')

          const alternativeFunctions = findNativeAlternativeDestructuredFunctions(destructuredFunctions, options)

          for (const { functionName, hasAlternative } of alternativeFunctions) {
            if (hasAlternative) {
              const alternative = getNativeAlternative(functionName)!
              const specifier = destructuredSpecifiers.find(spec =>
                spec.imported.type === 'Identifier' && spec.imported.name === functionName,
              )

              if (specifier) {
                let message = `Consider using native '${alternative.native}' instead of lodash '${functionName}'. ${alternative.description}.`

                if (alternative.notes) {
                  message += ` Note: ${alternative.notes}`
                }

                context.report({
                  node: specifier,
                  message,
                  suggest: [
                    {
                      desc: `See example: ${alternative.example?.lodash} → ${alternative.example?.native}`,
                      fix: (): Rule.Fix[] => {
                        // For destructured imports, we can't auto-fix easily since we need to
                        // find all usages and replace them, plus remove from import.
                        // This would require complex analysis, so we provide guidance only.
                        return []
                      },
                    },
                  ],
                })
              }
            }
          }
        }
      },
    }
  },
}

export default suggestNativeAlternatives
