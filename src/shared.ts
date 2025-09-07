/**
 * Shared enums and constants used across the lodash-es plugin
 */

export enum SafetyLevel {
  Safe = 'safe',
  Caution = 'caution',
  Unsafe = 'unsafe',
}

export const safetyLevels = Object.values(SafetyLevel)

export enum MigrationDifficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export const migrationDifficulties = Object.values(MigrationDifficulty)

export enum FunctionCategory {
  Array = 'array',
  Object = 'object',
  String = 'string',
  Number = 'number',
  Date = 'date',
  Function = 'function',
  Collection = 'collection',
}

export const functionCategories = Object.values(FunctionCategory)

export interface NativeExample {
  lodash: string
  native: string
}

export interface SafetyInfo {
  level: SafetyLevel
  concerns?: readonly string[] // What makes it unsafe
  mitigation?: string // How to make it safer
}

export interface MigrationInfo {
  difficulty: MigrationDifficulty
  challenges?: readonly string[] // What makes it difficult
  steps?: readonly string[] // Step-by-step migration guide
}

export interface NativeAlternative {
  category: FunctionCategory // Category for grouping
  native: string // Native JavaScript equivalent
  description: string // Human readable description
  example: NativeExample // Code examples
  safety: SafetyInfo // Safety assessment
  migration: MigrationInfo // How difficult is migration
  notes?: readonly string[] // Additional contextual notes
  related?: readonly string[] // Related functions that might be alternatives
  excludeByDefault?: boolean // If this alternative should be excluded by default in certain configs
}

export interface AlternativeFilterConfig {
  categories?: FunctionCategory[]
  safetyLevels?: SafetyLevel[]
  maxDifficulty?: MigrationDifficulty
  excludeByDefault?: boolean
}
