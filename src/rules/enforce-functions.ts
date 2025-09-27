/**
 * ESLint rule to enforce specific lodash-es function usage policies
 */
import { getSourceCode, isLodashModule, findLodashUsages, findDestructuredLodashUsages, getNativeAlternative } from '../utils'
import { createDestructuredFix, createNamespaceFix } from '../autofix'
import { EnforceFunctionsConfig } from '../config/enforce-functions-config'

import type {
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportNamespaceSpecifier,
  ImportSpecifier,
} from 'estree'
import type { Rule } from 'eslint'
import type { Usage, LodashFunctionName, LodashModuleName } from '../types'

function createErrorMessage(functionName: LodashFunctionName, reason: string): string {
  const nativeAlternative = getNativeAlternative(functionName)
  const nativeExample = nativeAlternative?.example?.native || ''

  return nativeAlternative
    ? `Lodash function '${functionName}' is ${reason}. Consider using native ${nativeAlternative.native}: ${nativeExample}`
    : `Lodash function '${functionName}' is ${reason}.`
}

function reportUsage(
  node: ImportDeclaration,
  sourceCode: ReturnType<typeof getSourceCode>,
  usage: Usage,
  functionName: string,
  config: EnforceFunctionsConfig,
  context: Rule.RuleContext,
): void {
  const fix = createDestructuredFix(sourceCode, usage, functionName)

  context.report({
    node,
    loc: {
      start: sourceCode.getLocFromIndex(usage.start),
      end: sourceCode.getLocFromIndex(usage.end),
    },
    message: createErrorMessage(functionName as LodashFunctionName, config.getReason()),
    fix: fix ? (fixer): Rule.Fix => fixer.replaceTextRange(fix.range, fix.text) : undefined,
  })
}

function handleDefaultOrNamespaceImports(
  node: ImportDeclaration,
  defaultOrNamespaceSpecifier: ImportDefaultSpecifier | ImportNamespaceSpecifier,
  sourceCode: ReturnType<typeof getSourceCode>,
  config: EnforceFunctionsConfig,
  context: Rule.RuleContext,
): void {
  const fullSourceCode = sourceCode.getText()
  const blockedUsages = findBlockedFunctions(fullSourceCode, defaultOrNamespaceSpecifier.local.name, config)

  for (const usage of blockedUsages) {
    const fix = createNamespaceFix(sourceCode, usage, usage.functionName)

    context.report({
      node,
      loc: {
        start: sourceCode.getLocFromIndex(usage.start),
        end: sourceCode.getLocFromIndex(usage.end),
      },
      message: createErrorMessage(usage.functionName, config.getReason()),
      fix: fix ? (fixer): Rule.Fix => fixer.replaceTextRange(fix.range, fix.text) : undefined,
    })
  }
}

function handleDestructuredImports(
  node: ImportDeclaration,
  destructuredSpecifiers: ImportSpecifier[],
  sourceCode: ReturnType<typeof getSourceCode>,
  config: EnforceFunctionsConfig,
  context: Rule.RuleContext,
): void {
  // Map each import specifier to both original and local names
  const destructuredMappings = destructuredSpecifiers.map((spec) => {
    const originalName = spec.imported.type === 'Identifier' ? spec.imported.name : ''
    const localName = spec.local.name
    return { originalName, localName }
  }).filter(mapping => mapping.originalName !== '')

  const fullSourceCode = sourceCode.getText()

  // Check each import mapping
  for (const { originalName, localName } of destructuredMappings) {
    const isBlocked = config.isBlocked(originalName as LodashFunctionName)

    if (!isBlocked) continue

    // Search for usages of the LOCAL name (what it's actually called in the code)
    // but validate against the ORIGINAL lodash function name
    const usages = findDestructuredLodashUsages(fullSourceCode, localName, originalName)
    for (const usage of usages) {
      reportUsage(node, sourceCode, usage, originalName, config, context)
    }
  }
}

function findBlockedFunctions(sourceCode: string, importName: string, config: EnforceFunctionsConfig): Usage[] {
  const allUsages = findLodashUsages(sourceCode, importName)

  return allUsages.filter((usage) => {
    return config.isBlocked(usage.functionName)
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
    fixable: 'code',
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
    const config = EnforceFunctionsConfig.fromRuleOptions(context.options[0])

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        const source = node.source.value as LodashModuleName
        if (typeof source !== 'string') return

        if (!isLodashModule(source)) {
          return
        }

        // Check for default or namespace imports
        const defaultOrNamespaceSpecifier = node.specifiers.find(spec =>
          ['ImportDefaultSpecifier', 'ImportNamespaceSpecifier'].includes(spec.type),
        ) as ImportDefaultSpecifier | ImportNamespaceSpecifier | undefined

        if (defaultOrNamespaceSpecifier) {
          handleDefaultOrNamespaceImports(node, defaultOrNamespaceSpecifier, sourceCode, config, context)
        }

        // Check destructured imports: import { map, filter } from 'lodash-es'
        const destructuredSpecifiers = node.specifiers.filter((spec): spec is ImportSpecifier =>
          spec.type === 'ImportSpecifier',
        )

        if (destructuredSpecifiers.length > 0) {
          handleDestructuredImports(node, destructuredSpecifiers, sourceCode, config, context)
        }
      },
    }
  },
}

export default enforceFunctions
