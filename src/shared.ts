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

export interface CreateAlternativeOptions {
  category: FunctionCategory
  native: string
  description: string
  example: {
    lodash: string
    native: string
  }
  safety?: {
    level?: SafetyLevel
    concerns?: readonly string[]
    mitigation?: string
  }
  migration?: {
    difficulty?: MigrationDifficulty
    challenges?: readonly string[]
    steps?: readonly string[]
  }
  notes?: readonly string[]
  related?: readonly string[]
  excludeByDefault?: boolean
}

/**
 * Helper function to create a NativeAlternative with common patterns
 */
export function createAlternative(options: CreateAlternativeOptions): NativeAlternative {
  const safety: SafetyInfo = {
    level: options.safety?.level ?? SafetyLevel.Safe,
  }
  if (options.safety?.concerns) {
    safety.concerns = options.safety.concerns
  }
  if (options.safety?.mitigation) {
    safety.mitigation = options.safety.mitigation
  }

  const migration: MigrationInfo = {
    difficulty: options.migration?.difficulty ?? MigrationDifficulty.Easy,
  }
  if (options.migration?.challenges) {
    migration.challenges = options.migration.challenges
  }
  if (options.migration?.steps) {
    migration.steps = options.migration.steps
  }

  const result: NativeAlternative = {
    category: options.category,
    native: options.native,
    description: options.description,
    example: options.example,
    safety,
    migration,
  }

  if (options.notes) {
    result.notes = options.notes
  }
  if (options.related) {
    result.related = options.related
  }
  if (options.excludeByDefault !== undefined) {
    result.excludeByDefault = options.excludeByDefault
  }

  return result
}
