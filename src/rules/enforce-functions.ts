/**
 * ESLint rule to enforce specific lodash-es function usage policies
 */
import { getSourceCode, isLodashModule, findLodashUsages, findDestructuredLodashUsages, getNativeAlternative } from '../utils'
import { createDestructuredFix, createNamespaceFix } from '../autofix'

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
    const fix = createNamespaceFix(sourceCode, usage, usage.functionName)

    context.report({
      node,
      loc: {
        start: sourceCode.getLocFromIndex(usage.start),
        end: sourceCode.getLocFromIndex(usage.end),
      },
      message: createErrorMessage(usage.functionName, reason),
      fix: fix ? (fixer): Rule.Fix => fixer.replaceTextRange(fix.range, fix.text) : undefined,
    })
  }
}

function handleDestructuredImports(
  node: ImportDeclaration,
  destructuredSpecifiers: ImportSpecifier[],
  sourceCode: ReturnType<typeof getSourceCode>,
  options: EnforceFunctionsRuleOptions,
  context: Rule.RuleContext,
): void {
  // Map each import specifier to both original and local names
  const destructuredMappings = destructuredSpecifiers.map((spec) => {
    const originalName = spec.imported.type === 'Identifier' ? spec.imported.name : ''
    const localName = spec.local.name
    return { originalName, localName }
  }).filter(mapping => mapping.originalName !== '')

  const reason = getReason(options)
  const fullSourceCode = sourceCode.getText()

  // Check each import mapping
  for (const { originalName, localName } of destructuredMappings) {
    const isBlocked = (options.include && !options.include.includes(originalName as LodashFunctionName))
      || (options.exclude?.includes(originalName as LodashFunctionName))

    if (isBlocked) {
      // Search for usages of the LOCAL name (what it's actually called in the code)
      // but validate against the ORIGINAL lodash function name
      const usages = findDestructuredLodashUsages(fullSourceCode, localName, originalName)
      for (const usage of usages) {
        // But use the ORIGINAL name for the fix and error message
        const fix = createDestructuredFix(sourceCode, usage, originalName)

        context.report({
          node,
          loc: {
            start: sourceCode.getLocFromIndex(usage.start),
            end: sourceCode.getLocFromIndex(usage.end),
          },
          message: createErrorMessage(originalName as LodashFunctionName, reason),
          fix: fix ? (fixer): Rule.Fix => fixer.replaceTextRange(fix.range, fix.text) : undefined,
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
          handleDestructuredImports(node, destructuredSpecifiers, sourceCode, options, context)
        }
      },
    }
  },
}

export default enforceFunctions
