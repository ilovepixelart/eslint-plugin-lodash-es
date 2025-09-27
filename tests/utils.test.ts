import { describe, it, expect } from 'vitest'
import {
  getSourceCode,
  isLodashModule,
  isLodashFunction,
  createLodashMemberRegex,
  findLodashUsages,
  findDestructuredLodashUsages,
  extractFunctionNames,
  getNativeAlternative,
  hasNativeAlternative,
  getAlternativesByCategory,
  getSafeAlternatives,
  getAlternativesByDifficulty,
  getFilteredAlternatives,
} from '../src/utils'
import { FunctionCategory, SafetyLevel, MigrationDifficulty } from '../src/constants'
import type { AlternativeFilterConfig } from '../src/types'
import { Rule } from 'eslint'

describe('utils', () => {
  describe('getSourceCode', () => {
    it('should return sourceCode from context when available', () => {
      const mockSourceCode = { getText: () => 'test' } as unknown as Rule.RuleContext
      const context = { sourceCode: mockSourceCode } as unknown as Rule.RuleContext
      expect(getSourceCode(context)).toBe(mockSourceCode)
    })

    it('should fallback to getSourceCode() for legacy contexts', () => {
      const mockSourceCode = { getText: () => 'test' } as unknown as Rule.RuleContext
      const context = { getSourceCode: () => mockSourceCode } as unknown as Rule.RuleContext
      expect(getSourceCode(context)).toBe(mockSourceCode)
    })
  })

  describe('isLodashModule', () => {
    it('should return true for valid lodash modules', () => {
      expect(isLodashModule('lodash-es')).toBe(true)
      expect(isLodashModule('lodash')).toBe(true)
    })

    it('should return false for invalid modules', () => {
      // @ts-expect-error testing invalid inputs
      expect(isLodashModule('react')).toBe(false)
      // @ts-expect-error testing invalid inputs
      expect(isLodashModule('vue')).toBe(false)
    })
  })

  describe('isLodashFunction', () => {
    it('should return true for valid lodash functions', () => {
      expect(isLodashFunction('map')).toBe(true)
      expect(isLodashFunction('filter')).toBe(true)
      expect(isLodashFunction('forEach')).toBe(true)
    })

    it('should return false for invalid functions', () => {
      // @ts-expect-error testing invalid inputs
      expect(isLodashFunction('invalidFunction')).toBe(false)
      // @ts-expect-error testing invalid inputs
      expect(isLodashFunction('notALodashFunc')).toBe(false)
    })
  })

  describe('createLodashMemberRegex', () => {
    it('should create correct regex pattern', () => {
      const regex = createLodashMemberRegex('_')
      expect(regex.test('_.map')).toBe(true)

      // Reset regex for global flag
      regex.lastIndex = 0
      expect(regex.test('_.filter')).toBe(true)

      regex.lastIndex = 0
      expect(regex.test('lodash.map')).toBe(false)
    })

    it('should handle custom import names', () => {
      const regex = createLodashMemberRegex('lodash')
      expect(regex.test('lodash.map')).toBe(true)

      regex.lastIndex = 0
      expect(regex.test('_.map')).toBe(false)
    })
  })

  describe('findLodashUsages', () => {
    it('should find lodash function usages', () => {
      const sourceCode = 'const result = _.map(array, fn); _.filter(items, predicate);'
      const usages = findLodashUsages(sourceCode, '_')

      expect(usages).toHaveLength(2)
      expect(usages[0].functionName).toBe('map')
      expect(usages[1].functionName).toBe('filter')
      expect(usages[0].fullMatch).toBe('_.map')
      expect(usages[1].fullMatch).toBe('_.filter')
    })

    it('should ignore invalid lodash functions', () => {
      const sourceCode = 'const result = _.invalidFunc(array);'
      const usages = findLodashUsages(sourceCode, '_')
      expect(usages).toHaveLength(0)
    })

    it('should handle multiple occurrences', () => {
      const sourceCode = '_.map(a, f); _.map(b, g); _.filter(c, h);'
      const usages = findLodashUsages(sourceCode, '_')
      expect(usages).toHaveLength(3)
    })
  })

  describe('findDestructuredLodashUsages', () => {
    it('should find destructured function usages', () => {
      const sourceCode = 'const result = map(array, fn); map(items, callback);'
      const usages = findDestructuredLodashUsages(sourceCode, 'map')

      expect(usages).toHaveLength(2)
      expect(usages[0].functionName).toBe('map')
      expect(usages[0].originalText).toBe('map')
    })

    it('should return empty array for invalid lodash functions', () => {
      const sourceCode = 'const result = invalidFunc(array, fn);'
      const usages = findDestructuredLodashUsages(sourceCode, 'invalidFunc')
      expect(usages).toHaveLength(0)
    })

    it('should handle renamed imports', () => {
      const sourceCode = 'const result = myMap(array, fn);'
      const usages = findDestructuredLodashUsages(sourceCode, 'myMap', 'map')
      expect(usages).toHaveLength(1)
      expect(usages[0].functionName).toBe('map')
    })

    it('should not match method calls', () => {
      const sourceCode = 'obj.map(fn); array.map(callback);'
      const usages = findDestructuredLodashUsages(sourceCode, 'map')
      expect(usages).toHaveLength(0)
    })

    it('should handle renamed imports with invalid original names', () => {
      const sourceCode = 'const result = myFunc(array, fn);'
      const usages = findDestructuredLodashUsages(sourceCode, 'myFunc', 'invalidLodashFunc')
      expect(usages).toHaveLength(0)
    })
  })

  describe('extractFunctionNames', () => {
    it('should extract unique lodash function names', () => {
      const sourceCode = '_.map(a, f); _.filter(b, g); _.map(c, h); _.reduce(d, i);'
      const functionNames = extractFunctionNames(sourceCode, '_')

      expect(functionNames).toEqual(['filter', 'map', 'reduce'])
    })

    it('should return empty array when no functions found', () => {
      const sourceCode = 'const regular = code;'
      const functionNames = extractFunctionNames(sourceCode, '_')
      expect(functionNames).toEqual([])
    })

    it('should ignore invalid functions', () => {
      const sourceCode = '_.map(a, f); _.invalidFunc(b, g);'
      const functionNames = extractFunctionNames(sourceCode, '_')
      expect(functionNames).toEqual(['map'])
    })
  })

  describe('getNativeAlternative', () => {
    it('should return alternative for valid lodash functions', () => {
      const alternative = getNativeAlternative('map')
      expect(alternative).toBeDefined()
      expect(alternative?.category).toBe(FunctionCategory.Array)
    })

    it('should return undefined for invalid functions', () => {
      const alternative = getNativeAlternative('invalidFunction')
      expect(alternative).toBeUndefined()
    })
  })

  describe('hasNativeAlternative', () => {
    it('should return true for functions with alternatives', () => {
      expect(hasNativeAlternative('map')).toBe(true)
      expect(hasNativeAlternative('filter')).toBe(true)
    })

    it('should return false for functions without alternatives', () => {
      expect(hasNativeAlternative('invalidFunction')).toBe(false)
    })

    it('should return false for non-lodash functions', () => {
      expect(hasNativeAlternative('nonLodashFunc')).toBe(false)
    })
  })

  describe('getAlternativesByCategory', () => {
    it('should return alternatives for array category', () => {
      const arrayAlternatives = getAlternativesByCategory(FunctionCategory.Array)

      expect(Object.keys(arrayAlternatives).length).toBeGreaterThan(0)
      for (const alt of Object.values(arrayAlternatives)) {
        expect(alt?.category).toBe(FunctionCategory.Array)
      }
    })

    it('should return alternatives for object category', () => {
      const objectAlternatives = getAlternativesByCategory(FunctionCategory.Object)

      expect(Object.keys(objectAlternatives).length).toBeGreaterThan(0)
      for (const alt of Object.values(objectAlternatives)) {
        expect(alt?.category).toBe(FunctionCategory.Object)
      }
    })

    it('should return alternatives for string category', () => {
      const stringAlternatives = getAlternativesByCategory(FunctionCategory.String)

      expect(Object.keys(stringAlternatives).length).toBeGreaterThan(0)
      for (const alt of Object.values(stringAlternatives)) {
        expect(alt?.category).toBe(FunctionCategory.String)
      }
    })

    it('should return alternatives for collection category', () => {
      const collectionAlternatives = getAlternativesByCategory(FunctionCategory.Collection)

      expect(Object.keys(collectionAlternatives).length).toBeGreaterThan(0)
      for (const alt of Object.values(collectionAlternatives)) {
        expect(alt?.category).toBe(FunctionCategory.Collection)
      }
    })
  })

  describe('getSafeAlternatives', () => {
    it('should return only safe alternatives', () => {
      const safeAlternatives = getSafeAlternatives()

      expect(Object.keys(safeAlternatives).length).toBeGreaterThan(0)
      for (const alt of Object.values(safeAlternatives)) {
        expect(alt?.safety.level).toBe(SafetyLevel.Safe)
      }
    })

    it('should exclude caution and unsafe alternatives', () => {
      const safeAlternatives = getSafeAlternatives()

      for (const alt of Object.values(safeAlternatives)) {
        expect(alt?.safety.level).not.toBe(SafetyLevel.Caution)
        expect(alt?.safety.level).not.toBe(SafetyLevel.Unsafe)
      }
    })
  })

  describe('getAlternativesByDifficulty', () => {
    it('should return alternatives with easy difficulty', () => {
      const easyAlternatives = getAlternativesByDifficulty(MigrationDifficulty.Easy)

      expect(Object.keys(easyAlternatives).length).toBeGreaterThan(0)
      for (const alt of Object.values(easyAlternatives)) {
        expect(alt?.migration.difficulty).toBe(MigrationDifficulty.Easy)
      }
    })

    it('should return alternatives with medium difficulty', () => {
      const mediumAlternatives = getAlternativesByDifficulty(MigrationDifficulty.Medium)

      expect(Object.keys(mediumAlternatives).length).toBeGreaterThan(0)
      for (const alt of Object.values(mediumAlternatives)) {
        expect(alt?.migration.difficulty).toBe(MigrationDifficulty.Medium)
      }
    })

    it('should return alternatives with hard difficulty', () => {
      const hardAlternatives = getAlternativesByDifficulty(MigrationDifficulty.Hard)

      for (const alt of Object.values(hardAlternatives)) {
        expect(alt?.migration.difficulty).toBe(MigrationDifficulty.Hard)
      }
    })
  })

  describe('getFilteredAlternatives', () => {
    it('should filter by categories', () => {
      const config: AlternativeFilterConfig = {
        categories: [FunctionCategory.Array],
      }
      const filteredAlternatives = getFilteredAlternatives(config)

      for (const alt of Object.values(filteredAlternatives)) {
        expect(alt?.category).toBe(FunctionCategory.Array)
      }
    })

    it('should filter by safety levels', () => {
      const config: AlternativeFilterConfig = {
        safetyLevels: [SafetyLevel.Safe],
      }
      const filteredAlternatives = getFilteredAlternatives(config)

      for (const alt of Object.values(filteredAlternatives)) {
        expect(alt?.safety.level).toBe(SafetyLevel.Safe)
      }
    })

    it('should exclude functions marked as excludeByDefault when excludeByDefault is false', () => {
      const config: AlternativeFilterConfig = {
        excludeByDefault: false,
      }
      const filteredAlternatives = getFilteredAlternatives(config)

      for (const alt of Object.values(filteredAlternatives)) {
        expect(alt?.excludeByDefault).not.toBe(true)
      }
    })

    it('should filter by maximum difficulty', () => {
      const config: AlternativeFilterConfig = {
        maxDifficulty: MigrationDifficulty.Easy,
      }
      const filteredAlternatives = getFilteredAlternatives(config)

      for (const alt of Object.values(filteredAlternatives)) {
        expect(alt?.migration.difficulty).toBe(MigrationDifficulty.Easy)
      }
    })

    it('should filter by maximum difficulty allowing medium and easy', () => {
      const config: AlternativeFilterConfig = {
        maxDifficulty: MigrationDifficulty.Medium,
      }
      const filteredAlternatives = getFilteredAlternatives(config)

      for (const alt of Object.values(filteredAlternatives)) {
        expect([MigrationDifficulty.Easy, MigrationDifficulty.Medium]).toContain(alt?.migration.difficulty)
      }
    })

    it('should apply multiple filters simultaneously', () => {
      const config: AlternativeFilterConfig = {
        categories: [FunctionCategory.Array],
        safetyLevels: [SafetyLevel.Safe],
        maxDifficulty: MigrationDifficulty.Easy,
      }
      const filteredAlternatives = getFilteredAlternatives(config)

      for (const alt of Object.values(filteredAlternatives)) {
        expect(alt?.category).toBe(FunctionCategory.Array)
        expect(alt?.safety.level).toBe(SafetyLevel.Safe)
        expect(alt?.migration.difficulty).toBe(MigrationDifficulty.Easy)
      }
    })

    it('should return empty object when no alternatives match filters', () => {
      const config: AlternativeFilterConfig = {
        categories: [],
        safetyLevels: [],
      }
      const filteredAlternatives = getFilteredAlternatives(config)
      expect(Object.keys(filteredAlternatives)).toHaveLength(0)
    })
  })
})
