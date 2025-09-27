/**
 * Tests for TestDataFactory functionality
 */
import { describe, it, expect } from 'vitest'
import { TestDataFactory } from '../../src/test-utils/test-data-factory'

describe('TDD: TestDataFactory', () => {
  it('should provide array methods test data', () => {
    const arrayMethods = TestDataFactory.arrayMethods()

    expect(arrayMethods).toBeDefined()
    expect(Array.isArray(arrayMethods)).toBe(true)
    expect(arrayMethods.length).toBeGreaterThan(0)

    const firstMethod = arrayMethods[0]
    expect(firstMethod).toHaveProperty('function')
    expect(firstMethod).toHaveProperty('input')
    expect(firstMethod).toHaveProperty('expected')
  })

  it('should provide string methods test data', () => {
    const stringMethods = TestDataFactory.stringMethods()

    expect(stringMethods).toBeDefined()
    expect(Array.isArray(stringMethods)).toBe(true)
    expect(stringMethods.length).toBeGreaterThan(0)

    const firstMethod = stringMethods[0]
    expect(firstMethod).toHaveProperty('function')
    expect(firstMethod).toHaveProperty('input')
    expect(firstMethod).toHaveProperty('expected')
  })

  it('should provide type checking test data', () => {
    const typeChecking = TestDataFactory.typeChecking()

    expect(typeChecking).toBeDefined()
    expect(Array.isArray(typeChecking)).toBe(true)
    expect(typeChecking.length).toBeGreaterThan(0)

    const firstMethod = typeChecking[0]
    expect(firstMethod).toHaveProperty('function')
    expect(firstMethod).toHaveProperty('input')
    expect(firstMethod).toHaveProperty('expected')
  })

  it('should provide object utilities test data', () => {
    const objectUtilities = TestDataFactory.objectUtilities()

    expect(objectUtilities).toBeDefined()
    expect(Array.isArray(objectUtilities)).toBe(true)
    expect(objectUtilities.length).toBeGreaterThan(0)

    const firstMethod = objectUtilities[0]
    expect(firstMethod).toHaveProperty('function')
    expect(firstMethod).toHaveProperty('input')
    expect(firstMethod).toHaveProperty('expected')
  })

  it('should provide all test data categories', () => {
    const allData = TestDataFactory.all()

    expect(allData).toBeDefined()
    expect(allData).toHaveProperty('arrayMethods')
    expect(allData).toHaveProperty('stringMethods')
    expect(allData).toHaveProperty('typeChecking')
    expect(allData).toHaveProperty('objectUtilities')

    expect(Array.isArray(allData.arrayMethods)).toBe(true)
    expect(Array.isArray(allData.stringMethods)).toBe(true)
    expect(Array.isArray(allData.typeChecking)).toBe(true)
    expect(Array.isArray(allData.objectUtilities)).toBe(true)
  })
})
