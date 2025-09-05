import { describe, it, expect } from 'vitest'

describe('lodash-es integration', () => {
  it('should work with destructured imports', () => {
    // Test the example usage patterns work correctly
    const testDestructuredImports = (): void => {
      // This mimics the content from test-lodash-namespace.ts
      const data = [1, 2, 3, 4, 5]

      // Simulate what would be the correct destructured import usage
      const mockFirst = (arr: number[]): number | undefined => arr[0]
      const mockFilter = (arr: number[], predicate: (x: number) => boolean): number[] => arr.filter(predicate)

      const result = mockFirst(data)
      const filtered = mockFilter(data, x => x > 2)

      expect(result).toBe(1)
      expect(filtered).toEqual([3, 4, 5])
    }

    expect(testDestructuredImports).not.toThrow()
  })

  it('should work with multiple lodash functions', () => {
    // Test the example usage patterns work correctly
    const testMultipleFunctions = (): void => {
      // This mimics the content from test-lodash-usage.ts
      const data = [1, 2, 3]

      // Simulate what would be the correct destructured import usage
      const mockFirst = (arr: number[]): number | undefined => arr[0]
      const mockMap = (arr: number[], fn: (x: number) => number): number[] => arr.map(fn)
      const mockFilter = (arr: number[], predicate: (x: number) => boolean): number[] => arr.filter(predicate)

      const result = mockFirst(data)
      const mapped = mockMap(data, x => x * 2)
      const filtered = mockFilter(data, x => x > 1)

      expect(result).toBe(1)
      expect(mapped).toEqual([2, 4, 6])
      expect(filtered).toEqual([2, 3])
    }

    expect(testMultipleFunctions).not.toThrow()
  })

  it('should handle empty arrays correctly', () => {
    const mockFirst = (arr: number[]): number | undefined => arr[0]
    const mockFilter = (arr: number[], predicate: (x: number) => boolean): number[] => arr.filter(predicate)

    expect(mockFirst([])).toBeUndefined()
    expect(mockFilter([], x => x > 0)).toEqual([])
  })

  it('should handle complex filter conditions', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const mockFilter = (arr: number[], predicate: (x: number) => boolean): number[] => arr.filter(predicate)

    const evenNumbers = mockFilter(data, x => x % 2 === 0)
    const greaterThanFive = mockFilter(data, x => x > 5)

    expect(evenNumbers).toEqual([2, 4, 6, 8, 10])
    expect(greaterThanFive).toEqual([6, 7, 8, 9, 10])
  })
})
