/**
 * Shared utilities for import processing and validation
 */
import type { ImportDeclaration, ImportSpecifier, ImportDefaultSpecifier, ImportNamespaceSpecifier } from 'estree'
import type { LodashModuleName } from '../types'
import { isLodashModule } from '../utils'

export interface ImportMapping {
  originalName: string
  localName: string
  specifier: ImportSpecifier
}

export interface CategorizedSpecifiers {
  defaultOrNamespaceSpecifier: ImportDefaultSpecifier | ImportNamespaceSpecifier | undefined
  destructuredSpecifiers: ImportSpecifier[]
  hasDefaultImport: boolean
  hasNamespaceImport: boolean
}

/**
 * Validate that import declaration is a lodash-es import
 * @param node Import declaration node
 * @returns True if valid lodash import
 */
export function validateLodashImport(node: ImportDeclaration): boolean {
  const source = node.source.value as LodashModuleName
  return typeof source === 'string' && isLodashModule(source)
}

/**
 * Categorize import specifiers into default/namespace and destructured
 * @param node Import declaration node
 * @returns Categorized specifiers with boolean flags
 */
export function categorizeImportSpecifiers(node: ImportDeclaration): CategorizedSpecifiers {
  const hasDefaultImport = node.specifiers.some(spec => spec.type === 'ImportDefaultSpecifier')
  const hasNamespaceImport = node.specifiers.some(spec => spec.type === 'ImportNamespaceSpecifier')

  const defaultOrNamespaceSpecifier = node.specifiers.find(spec =>
    ['ImportDefaultSpecifier', 'ImportNamespaceSpecifier'].includes(spec.type),
  ) as ImportDefaultSpecifier | ImportNamespaceSpecifier | undefined

  const destructuredSpecifiers = node.specifiers.filter(spec =>
    spec.type === 'ImportSpecifier',
  )

  return {
    defaultOrNamespaceSpecifier,
    destructuredSpecifiers,
    hasDefaultImport,
    hasNamespaceImport,
  }
}

/**
 * Extract import mappings from destructured specifiers
 * @param destructuredSpecifiers Array of import specifiers
 * @returns Array of mappings with original name, local name, and specifier reference
 */
export function extractImportMappings(destructuredSpecifiers: ImportSpecifier[]): ImportMapping[] {
  return destructuredSpecifiers.map((spec) => {
    const originalName = spec.imported.type === 'Identifier' ? spec.imported.name : ''
    const localName = spec.local.name
    return { originalName, localName, specifier: spec }
  }).filter(mapping => mapping.originalName !== '')
}
