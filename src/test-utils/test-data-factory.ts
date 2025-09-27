/**
 * Test data factory for generating common test scenarios
 * Provides pre-built test cases for various transformation patterns
 */
import type { LodashFunctionName, EnforceFunctionsRuleOptions } from '../types'

/* eslint-disable @typescript-eslint/no-extraneous-class */

// Helper type for transformation test cases
interface TransformationTestCase {
  function: LodashFunctionName
  input: string
  expected: string
}

// Helper function to create transformation test cases
function createTransformationTests(
  cases: [LodashFunctionName, string, string][],
): TransformationTestCase[] {
  return cases.map(([functionName, input, expected]) => ({
    function: functionName,
    input,
    expected,
  }))
}

export class TestDataFactory {
  /**
   * Generate array method transformation test cases
   */
  static arrayMethods(): TransformationTestCase[] {
    return createTransformationTests([
      ['map', 'const result = map([1, 2, 3], x => x * 2)', 'const result = [1, 2, 3].map(x => x * 2)'],
      ['filter', 'const filtered = filter(users, user => user.active)', 'const filtered = users.filter(user => user.active)'],
      ['some', 'const found = some(items, item => item.id === 1)', 'const found = items.some(item => item.id === 1)'],
      ['some', 'const hasActive = some(users, u => u.active)', 'const hasActive = users.some(u => u.active)'],
      ['every', 'const allActive = every(users, u => u.active)', 'const allActive = users.every(u => u.active)'],
      ['reduce', 'const sum = reduce([1, 2, 3], (acc, val) => acc + val, 0)', 'const sum = [1, 2, 3].reduce((acc, val) => acc + val, 0)'],
    ])
  }

  /**
   * Generate string method transformation test cases
   */
  static stringMethods(): TransformationTestCase[] {
    return createTransformationTests([
      ['trim', 'const trimmed = trim("  hello  ")', 'const trimmed = "  hello  ".trim()'],
      ['toLower', 'const lower = toLower("HELLO")', 'const lower = "HELLO".toLowerCase()'],
      ['toUpper', 'const upper = toUpper("hello")', 'const upper = "hello".toUpperCase()'],
      ['startsWith', 'const starts = startsWith(text, "hello")', 'const starts = text.startsWith("hello")'],
      ['endsWith', 'const ends = endsWith(text, "world")', 'const ends = text.endsWith("world")'],
    ])
  }

  /**
   * Generate type checking transformation test cases
   */
  static typeChecking(): TransformationTestCase[] {
    return createTransformationTests([
      ['isArray', 'const check = isArray(value)', 'const check = Array.isArray(value)'],
      ['isString', 'const check = isString(value)', 'const check = typeof value === "string"'],
      ['isNumber', 'const check = isNumber(value)', 'const check = typeof value === "number"'],
      ['isBoolean', 'const check = isBoolean(value)', 'const check = typeof value === "boolean"'],
      ['isNull', 'const check = isNull(value)', 'const check = value === null'],
      ['isUndefined', 'const check = isUndefined(value)', 'const check = value === undefined'],
    ])
  }

  /**
   * Generate object utility transformation test cases
   */
  static objectUtilities(): TransformationTestCase[] {
    return createTransformationTests([
      ['keys', 'const objKeys = keys(object)', 'const objKeys = Object.keys(object)'],
      ['values', 'const objValues = values(object)', 'const objValues = Object.values(object)'],
      ['entries', 'const objEntries = entries(object)', 'const objEntries = Object.entries(object)'],
      ['assign', 'const merged = assign({}, obj1, obj2)', 'const merged = Object.assign({}, obj1, obj2)'],
    ])
  }

  /**
   * Generate math utility transformation test cases
   */
  static mathUtilities(): TransformationTestCase[] {
    return createTransformationTests([
      ['max', 'const maximum = max([1, 2, 3, 4, 5])', 'const maximum = Math.max(...[1, 2, 3, 4, 5])'],
      ['min', 'const minimum = min([1, 2, 3, 4, 5])', 'const minimum = Math.min(...[1, 2, 3, 4, 5])'],
      ['ceil', 'const rounded = ceil(4.2)', 'const rounded = Math.ceil(4.2)'],
      ['floor', 'const floored = floor(4.8)', 'const floored = Math.floor(4.8)'],
      ['round', 'const rounded = round(4.5)', 'const rounded = Math.round(4.5)'],
    ])
  }

  /**
   * Generate edge case test scenarios
   */
  static edgeCases(): {
    description: string
    function: LodashFunctionName
    input: string
    expected: string
  }[] {
    return [
      {
        description: 'complex nested expressions',
        function: 'map',
        input: 'const result = map(getData().users.filter(u => u.active), user => user.name)',
        expected: 'const result = getData().users.filter(u => u.active).map(user => user.name)',
      },
      {
        description: 'function with complex callback',
        function: 'filter',
        input: 'const filtered = filter(items, item => item.score > 80 && item.category === "premium")',
        expected: 'const filtered = items.filter(item => item.score > 80 && item.category === "premium")',
      },
      {
        description: 'nested template literals',
        function: 'map',
        input: 'const formatted = map(users, user => `Name: ${user.name}, Age: ${user.age}`)',
        expected: 'const formatted = users.map(user => `Name: ${user.name}, Age: ${user.age}`)',
      },
      {
        description: 'operator precedence with parentheses',
        function: 'map',
        input: 'const result = map(data?.items || [], fn)',
        expected: 'const result = (data?.items || []).map(fn)',
      },
    ]
  }

  /**
   * Generate configuration test scenarios
   */
  static configurationScenarios(): {
    description: string
    options: EnforceFunctionsRuleOptions
    functions: LodashFunctionName[]
    shouldError: boolean
  }[] {
    return [
      {
        description: 'exclude specific functions',
        options: { exclude: ['map', 'filter'] },
        functions: ['map', 'filter', 'some'],
        shouldError: true, // map and filter should error, some should not
      },
      {
        description: 'include only specific functions',
        options: { include: ['some', 'every'] },
        functions: ['map', 'filter', 'some'],
        shouldError: true, // map and filter should error, some should not
      },
      {
        description: 'permissive configuration',
        options: {},
        functions: ['map', 'filter', 'some'],
        shouldError: false, // no functions should error
      },
    ]
  }

  /**
   * Generate performance test scenarios
   */
  static performanceScenarios(): {
    description: string
    input: string
    expected: string
    complexity: 'simple' | 'medium' | 'complex'
  }[] {
    return [
      {
        description: 'simple array transformation',
        input: 'const result = map([1, 2, 3], x => x * 2)',
        expected: 'const result = [1, 2, 3].map(x => x * 2)',
        complexity: 'simple',
      },
      {
        description: 'medium complexity expression',
        input: 'const result = filter(users.slice(0, 10), user => user.active)',
        expected: 'const result = users.slice(0, 10).filter(user => user.active)',
        complexity: 'medium',
      },
      {
        description: 'complex nested transformation',
        input: 'const result = map(filter(getData().users, u => u.role === "admin"), user => ({ ...user, processed: true }))',
        expected: 'const result = getData().users.filter(u => u.role === "admin").map(user => ({ ...user, processed: true }))',
        complexity: 'complex',
      },
    ]
  }

  /**
   * Generate all test data categories
   */
  static all(): {
    arrayMethods: TransformationTestCase[]
    stringMethods: TransformationTestCase[]
    typeChecking: TransformationTestCase[]
    objectUtilities: TransformationTestCase[]
    mathUtilities: TransformationTestCase[]
    edgeCases: { description: string, function: LodashFunctionName, input: string, expected: string }[]
    configurationScenarios: { description: string, options: EnforceFunctionsRuleOptions, functions: LodashFunctionName[], shouldError: boolean }[]
    performanceScenarios: { description: string, input: string, expected: string, complexity: 'simple' | 'medium' | 'complex' }[]
  } {
    return {
      arrayMethods: this.arrayMethods(),
      stringMethods: this.stringMethods(),
      typeChecking: this.typeChecking(),
      objectUtilities: this.objectUtilities(),
      mathUtilities: this.mathUtilities(),
      edgeCases: this.edgeCases(),
      configurationScenarios: this.configurationScenarios(),
      performanceScenarios: this.performanceScenarios(),
    }
  }
}
