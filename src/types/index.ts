/**
 * Provides a single source of truth for all type definitions
 */

// Export all core types
export * from './core'

// Export utilities for type manipulation
export type {
  // Utility types for working with configurations
  Partial,
  Required,
  Pick,
  Omit,
  RecordType,
} from './utilities'
