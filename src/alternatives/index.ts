/**
 * Centralized native alternatives for lodash-es functions
 *
 * This module combines all categorized native alternatives into a single map
 * and provides convenient access to alternatives by category.
 */
import type { NativeAlternative } from '../shared'

// Import for local usage in combined maps
import { arrayAlternatives } from './array'
import { objectAlternatives } from './object'
import { stringAlternatives } from './string'
import { numberAlternatives } from './number'
import { dateAlternatives } from './date'
import { functionAlternatives } from './function'
import { collectionAlternatives } from './collection'

// Export all category maps for individual access if needed using export...from
export { arrayAlternatives } from './array'
export { objectAlternatives } from './object'
export { stringAlternatives } from './string'
export { numberAlternatives } from './number'
export { dateAlternatives } from './date'
export { functionAlternatives } from './function'
export { collectionAlternatives } from './collection'

/**
 * Combined map of all native alternatives, organized by function name
 */
export const nativeAlternatives = new Map<string, NativeAlternative>([
  // Merge all category-specific maps
  ...arrayAlternatives,
  ...objectAlternatives,
  ...stringAlternatives,
  ...numberAlternatives,
  ...dateAlternatives,
  ...functionAlternatives,
  ...collectionAlternatives,
] as const)

/**
 * Alternative maps organized by category for easy filtering
 */
export const alternativesByCategory = {
  array: arrayAlternatives,
  object: objectAlternatives,
  string: stringAlternatives,
  number: numberAlternatives,
  date: dateAlternatives,
  function: functionAlternatives,
  collection: collectionAlternatives,
} as const
