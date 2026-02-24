/**
 * ESLint rule to enforce destructured imports from lodash-es and auto-fix them
 */
import { getSourceCode, findLodashUsages, extractFunctionNames } from '../utils'
import { validateLodashImport, categorizeImportSpecifiers } from '../utils/import-mapping'

import type { ImportDeclaration } from 'estree'
import type { Rule } from 'eslint'
import type { Usage } from '../types'

const enforceLodashDestructuring: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce destructured imports from lodash-es',
      recommended: true,
    },
    fixable: 'code',
    schema: [],
  },

  create(context: Rule.RuleContext) {
    const sourceCode = getSourceCode(context)

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        if (!validateLodashImport(node)) return

        const { defaultOrNamespaceSpecifier, hasDefaultImport, hasNamespaceImport } = categorizeImportSpecifiers(node)

        if (hasDefaultImport || hasNamespaceImport) {
          if (!defaultOrNamespaceSpecifier) return

          context.report({
            node,
            message: `Use destructured imports from lodash-es instead of ${hasDefaultImport ? 'default' : 'namespace'} import.`,
            fix(fixer: Rule.RuleFixer) {
              try {
                const fullSourceCode = sourceCode.getText()
                const usedFunctions = extractFunctionNames(fullSourceCode, defaultOrNamespaceSpecifier.local.name)
                const allUsages = findLodashUsages(fullSourceCode, defaultOrNamespaceSpecifier.local.name)

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
