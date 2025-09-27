/**
 * ESLint rule to enforce destructured imports from lodash-es and auto-fix them
 */
import { getSourceCode, isLodashModule, findLodashUsages, extractFunctionNames } from '../utils'

import type { ImportDeclaration } from 'estree'
import type { Rule } from 'eslint'
import type { Usage, LodashModuleName } from '../types'

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
    const sourceCode = getSourceCode(context)

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        const source = node.source.value as LodashModuleName
        if (typeof source !== 'string') return

        if (!isLodashModule(source)) {
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
            ['ImportDefaultSpecifier', 'ImportNamespaceSpecifier'].includes(spec.type),
          )
          if (!importSpecifier) return

          context.report({
            node,
            message: `Use destructured imports from lodash-es instead of ${hasDefaultImport ? 'default' : 'namespace'} import.`,
            fix(fixer: Rule.RuleFixer) {
              try {
                const fullSourceCode = sourceCode.getText()
                const usedFunctions = extractFunctionNames(fullSourceCode, importSpecifier.local.name)
                const allUsages = findLodashUsages(fullSourceCode, importSpecifier.local.name)

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
                const sortedUsages = [...allUsages].sort((a: Usage, b: Usage) => b.start - a.start)

                for (const usage of sortedUsages) {
                  const range: [number, number] = [usage.start, usage.end]
                  fixes.push(fixer.replaceTextRange(range, usage.functionName))
                }

                return fixes
              } catch (error) {
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
