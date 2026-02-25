/**
 * ESLint rule to suggest native JavaScript alternatives to lodash functions
 */
import { getSourceCode, findLodashUsages, findDestructuredLodashUsages, getNativeAlternative } from '../utils'
import { functionClassifications } from '../shared'
import { createDestructuredFix, createNamespaceFix } from '../autofix'
import { EnforceFunctionsConfig } from '../config/enforce-functions-config'
import { extractImportMappings, validateLodashImport, categorizeImportSpecifiers } from '../utils/import-mapping'

import type { ImportDeclaration, ImportSpecifier } from 'estree'
import type { Rule } from 'eslint'
import type { Usage, SuggestNativeAlternativesRuleOptions, LodashFunctionName } from '../types'

/**
 * Create message with null safety warnings and context
 */
function createMessage(functionName: LodashFunctionName, alternative: { example?: { native?: string }, native: string, description: string, notes?: readonly string[] }): string {
  const baseExample = alternative.example?.native || alternative.native
  const description = alternative.description

  // Add null safety warning for functions that lose lodash's null safety
  const needsNullSafety = (functionClassifications.nullSafe as readonly string[]).includes(functionName)

  // Add mutation warning for functions with different behavior
  const hasMutationRisk = (functionClassifications.mutating as readonly string[]).includes(functionName)

  const nullSafetyWarning = needsNullSafety ? ' ⚠️  Add null safety: use `obj || {}` to prevent runtime errors.' : ''
  const mutationWarning = hasMutationRisk ? ' ⚠️  Native version mutates the original array.' : ''
  const notesText = alternative.notes?.length ? ` Note: ${alternative.notes.join('. ')}` : ''

  return `Consider native '${baseExample}' instead of '_.${functionName}()'. ${description}.${nullSafetyWarning}${mutationWarning}${notesText}`
}

function findNativeAlternativeUsages(sourceCode: string, importName: string, config: EnforceFunctionsConfig): Usage[] {
  const allUsages = findLodashUsages(sourceCode, importName)

  return allUsages.filter((usage) => {
    return config.isAllowed(usage.functionName)
  })
}

const suggestNativeAlternatives: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Suggest native JavaScript alternatives to lodash functions when available',
      recommended: false,
    },
    fixable: 'code',
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

    // Create config that includes all functions with native alternatives
    const config = EnforceFunctionsConfig.createForNativeAlternatives(options.excludeUnsafe)

    /**
     * Handle default/namespace imports reporting
     */
    function handleDefaultImports(node: ImportDeclaration, importName: string): void {
      const fullSourceCode = sourceCode.getText()
      const alternativeUsages = findNativeAlternativeUsages(fullSourceCode, importName, config)

      for (const usage of alternativeUsages) {
        const alternative = getNativeAlternative(usage.functionName)

        if (!alternative) {
          continue
        }

        const fix = createNamespaceFix(sourceCode, usage, usage.functionName)

        context.report({
          node,
          loc: {
            start: sourceCode.getLocFromIndex(usage.start),
            end: sourceCode.getLocFromIndex(usage.end),
          },
          message: createMessage(usage.functionName, alternative),
          fix: fix ? (fixer): Rule.Fix => fixer.replaceTextRange(fix.range, fix.text) : undefined,
        })
      }
    }

    /**
     * Check if function should be processed for suggestions
     */
    function shouldProcessFunction(originalName: string): boolean {
      // In suggest-native-alternatives, we want to process functions that are "allowed"
      // by the config (i.e., functions that have native alternatives)
      return config.isAllowed(originalName as LodashFunctionName)
    }

    /**
     * Report suggestion for import specifier without usage
     */
    function reportImportSpecifier(specifier: ImportSpecifier, originalName: string): void {
      const alternative = getNativeAlternative(originalName as LodashFunctionName)
      if (!alternative) return

      context.report({
        node: specifier,
        message: createMessage(originalName as LodashFunctionName, alternative),
      })
    }

    /**
     * Report suggestion for function usage with autofix
     */
    function reportUsageWithFix(specifier: ImportSpecifier, usage: Usage, originalName: string): void {
      const alternative = getNativeAlternative(originalName as LodashFunctionName)
      if (!alternative) return

      const fix = createDestructuredFix(sourceCode, usage, originalName)

      context.report({
        node: specifier,
        loc: {
          start: sourceCode.getLocFromIndex(usage.start),
          end: sourceCode.getLocFromIndex(usage.end),
        },
        message: createMessage(originalName as LodashFunctionName, alternative),
        fix: fix ? (fixer): Rule.Fix => fixer.replaceTextRange(fix.range, fix.text) : undefined,
      })
    }

    /**
     * Process a single destructured import mapping
     */
    function processDestructuredMapping(mapping: { originalName: string, localName: string, specifier: ImportSpecifier }, fullSourceCode: string): void {
      const { originalName, localName, specifier } = mapping

      if (!shouldProcessFunction(originalName)) return

      // Search for usages of the LOCAL name (what it's actually called in the code)
      // but validate against the ORIGINAL lodash function name
      const usages = findDestructuredLodashUsages(fullSourceCode, localName, originalName)

      if (usages.length === 0) {
        // If no usages found, report on the import specifier itself
        reportImportSpecifier(specifier, originalName)
      } else {
        // Report on each usage with autofix
        for (const usage of usages) {
          reportUsageWithFix(specifier, usage, originalName)
        }
      }
    }

    /**
     * Handle destructured imports reporting
     */
    function handleDestructuredImports(destructuredSpecifiers: ImportSpecifier[]): void {
      const destructuredMappings = extractImportMappings(destructuredSpecifiers)
      const fullSourceCode = sourceCode.getText()

      // Check each import mapping
      for (const mapping of destructuredMappings) {
        processDestructuredMapping(mapping, fullSourceCode)
      }
    }

    return {
      ImportDeclaration(node: ImportDeclaration): void {
        if (!validateLodashImport(node)) return

        const { defaultOrNamespaceSpecifier, destructuredSpecifiers } = categorizeImportSpecifiers(node)

        if (defaultOrNamespaceSpecifier) {
          handleDefaultImports(node, defaultOrNamespaceSpecifier.local.name)
        }

        if (destructuredSpecifiers.length > 0) {
          handleDestructuredImports(destructuredSpecifiers)
        }
      },
    }
  },
}

export default suggestNativeAlternatives
