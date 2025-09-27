/**
 * Autofix functionality for lodash-to-native transformations
 *
 * This module provides comprehensive autofix capabilities for transforming
 * lodash function calls to their native JavaScript equivalents.
 */

// Export all autofix functions
export { createDestructuredFix } from './destructured-autofix'
export { createNamespaceFix } from './namespace-autofix'

// Export common autofix utilities
export * from './common-autofix'

// Export parameter parsing utilities
export {
  findFirstTopLevelComma,
  extractMethodName,
  findClosingParenthesis,
  needsParentheses,
} from './parameter-parser'
