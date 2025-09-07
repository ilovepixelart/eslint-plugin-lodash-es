/**
 * ESLint rule to prevent deprecated per-method lodash imports
 * These bypass destructuring rules and will be removed in lodash v5
 */
import { isLodashFunction } from '../utils'

import type { ImportDeclaration, ImportDefaultSpecifier } from 'estree'
import type { Rule } from 'eslint'
import type { LodashFunctionName } from '../types'

/**
 * Patterns that indicate per-method imports (deprecated/being removed)
 */
const PER_METHOD_PATTERNS = [
  /^lodash\/[a-zA-Z]+$/, // lodash/map, lodash/filter
  /^lodash\.[a-zA-Z]+$/, // lodash.map, lodash.filter
  /^lodash\/fp\/[a-zA-Z]+$/, // lodash/fp/map
] as const

/**
 * Check if import source is a deprecated per-method pattern
 */
function isPerMethodImport(source: string): boolean {
  return PER_METHOD_PATTERNS.some(pattern => pattern.test(source))
}

/**
 * Extract function name from per-method import path
 */
function extractFunctionName(source: string): LodashFunctionName {
  // lodash/map -> map
  // lodash.map -> map
  // lodash/fp/map -> map
  const slashMatch = /\/([a-zA-Z]+)$/.exec(source)
  const dotMatch = /\.([a-zA-Z]+)$/.exec(source)
  const match = slashMatch || dotMatch
  return (match?.[1] || '') as LodashFunctionName
}

/**
 * Find all per-method imports in the source and group by function
 */
function analyzePerMethodImports(
  perMethodImports: {
    node: ImportDeclaration
    source: string
    functionName: LodashFunctionName
    localName: string
  }[],
): {
  functions: LodashFunctionName[]
  invalidSources: string[]
} {
  const functions: LodashFunctionName[] = []
  const invalidSources: string[] = []

  for (const { source, functionName } of perMethodImports) {
    if (isLodashFunction(functionName)) {
      functions.push(functionName)
    }
    else {
      invalidSources.push(source)
    }
  }

  // Remove duplicates and sort
  return {
    functions: [...new Set(functions)].sort((a, b) => a.localeCompare(b)),
    invalidSources: [...new Set(invalidSources)],
  }
}

const noMethodImports: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent deprecated per-method lodash imports that bypass tree-shaking and will be removed in v5',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [],
    messages: {
      perMethodDeprecated: 'Per-method lodash imports are deprecated and will be removed in v5. Use destructured imports from lodash-es instead.',
      invalidPerMethodImport: 'Invalid lodash function "{{functionName}}" in per-method import.',
      autoFixSuggestion: 'Replace with: import { {{functions}} } from \'lodash-es\'',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const perMethodImports: {
      node: ImportDeclaration
      source: string
      functionName: LodashFunctionName
      localName: string
    }[] = []

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        const source = node.source.value
        if (typeof source !== 'string') return

        if (!isPerMethodImport(source)) {
          return
        }

        const functionName = extractFunctionName(source)

        // Get the local name (what it's imported as)
        const defaultSpecifier = node.specifiers.find(
          (spec): spec is ImportDefaultSpecifier => spec.type === 'ImportDefaultSpecifier',
        )

        const localName = defaultSpecifier ? defaultSpecifier.local.name : functionName

        perMethodImports.push({
          node,
          source,
          functionName,
          localName,
        })

        // Validate function name
        if (!isLodashFunction(functionName)) {
          context.report({
            node,
            messageId: 'invalidPerMethodImport',
            data: { functionName },
          })
          return
        }

        context.report({
          node,
          messageId: 'perMethodDeprecated',
          suggest: [
            {
              desc: 'Convert to destructured lodash-es import',
              fix(fixer: Rule.RuleFixer): Rule.Fix {
                // For single import, simple replacement
                return fixer.replaceText(
                  node,
                  `import { ${functionName} } from 'lodash-es';`,
                )
              },
            },
          ],
        })
      },

      'Program:exit'(): void {
        // At end of file, if we have multiple per-method imports,
        // suggest consolidating them
        if (perMethodImports.length > 1) {
          const analysis = analyzePerMethodImports(perMethodImports)

          if (analysis.functions.length > 1) {
            const firstImport = perMethodImports[0]?.node
            if (!firstImport) return

            context.report({
              node: firstImport,
              messageId: 'autoFixSuggestion',
              data: { functions: analysis.functions.join(', ') },
              suggest: [
                {
                  desc: `Consolidate ${perMethodImports.length} per-method imports into single destructured import`,
                  fix(fixer: Rule.RuleFixer): Rule.Fix[] {
                    const fixes: Rule.Fix[] = []

                    // Replace first import with consolidated version
                    fixes.push(
                      fixer.replaceText(
                        firstImport,
                        `import { ${analysis.functions.join(', ')} } from 'lodash-es';`,
                      ),
                    )

                    // Remove all other per-method imports
                    for (let i = 1; i < perMethodImports.length; i++) {
                      const importNode = perMethodImports[i]?.node
                      if (importNode) {
                        fixes.push(fixer.remove(importNode))
                      }
                    }

                    return fixes
                  },
                },
              ],
            })
          }
        }
      },
    }
  },
}

export default noMethodImports
