/**
 * ESLint rule to prevent lodash chaining that kills tree-shaking
 * Even with destructured imports, using chain() prevents optimization
 */
import { getSourceCode, isLodashModule } from '../utils'

import type {
  ImportDeclaration,
  ImportSpecifier,
  CallExpression,
} from 'estree'
import type { Rule } from 'eslint'
import { LodashModuleName } from '../constants'

const noChaining: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prevent lodash chaining that kills tree-shaking even with destructured imports',
      category: 'Best Practices',
      recommended: true,
    },
    fixable: 'code',
    hasSuggestions: true,
    schema: [],
    messages: {
      noChaining: 'Lodash chain() prevents tree-shaking. Use native array chaining or function composition instead.',
      chainingSuggestion: 'Replace _.chain({{data}}){{methods}}.value() with {{data}}{{methods}}',
    },
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    let hasChainImport = false
    let hasLodashImport = false

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        const source = node.source.value as LodashModuleName
        if (typeof source !== 'string') return

        if (!isLodashModule(source)) {
          return
        }

        hasLodashImport = true

        // Check for chain in destructured imports
        const chainSpecifier = node.specifiers.find(
          (spec): spec is ImportSpecifier =>
            spec.type === 'ImportSpecifier'
            && spec.imported.type === 'Identifier'
            && spec.imported.name === 'chain',
        )

        if (chainSpecifier) {
          hasChainImport = true

          context.report({
            node: chainSpecifier,
            messageId: 'noChaining',
            suggest: [
              {
                desc: 'Remove chain import and use native array methods',
                fix(fixer: Rule.RuleFixer): Rule.Fix | null {
                  // Remove chain from import
                  if (node.specifiers.length === 1) {
                    // Only chain imported, remove entire import
                    return fixer.remove(node)
                  }
                  // Remove just chain from destructured imports
                  const specifiers = node.specifiers
                    .filter(spec => spec !== chainSpecifier)
                    .map(spec =>
                      spec.type === 'ImportSpecifier' && spec.imported.type === 'Identifier'
                        ? spec.imported.name
                        : spec.local.name)
                    .join(', ')

                  return fixer.replaceText(node, `import { ${specifiers} } from '${source}';`)
                },
              },
            ],
          })
        }
      },

      CallExpression(node: CallExpression): void {
        if (!hasLodashImport) return

        // Detect chain() usage
        const isChainCall = (
          (node.callee.type === 'Identifier' && node.callee.name === 'chain' && hasChainImport)
          || (node.callee.type === 'MemberExpression'
            && node.callee.property.type === 'Identifier'
            && node.callee.property.name === 'chain')
        )

        if (isChainCall) {
          const sourceCode = getSourceCode(context)

          context.report({
            node,
            messageId: 'noChaining',
            suggest: [
              {
                desc: 'Convert to native array chaining',
                fix(fixer: Rule.RuleFixer): Rule.Fix | null {
                  // Try to convert simple chain patterns
                  const chainText = sourceCode.getText(node)

                  // Look for common pattern: chain(data).method1().method2().value()
                  const chainPattern = /chain\(([^)]+)\)((?:\.[a-zA-Z]+\([^)]*\))*?)\.value\(\)/
                  const chainMatch = chainPattern.exec(chainText)

                  if (chainMatch) {
                    const [, data, methods] = chainMatch
                    const nativeChain = `${data}${methods}`
                    // Note: Using node directly since we can't safely access parent
                    return fixer.replaceText(node, nativeChain)
                  }

                  return null // Can't auto-fix complex chains
                },
              },
            ],
          })
        }
      },
    }
  },
}

export default noChaining
