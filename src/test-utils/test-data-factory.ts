/**
 * Test data factory for generating common test scenarios
 * Provides pre-built test cases for various transformation patterns
 */
import type { LodashFunctionName, EnforceFunctionsRuleOptions } from '../types'

/* eslint-disable @typescript-eslint/no-extraneous-class */
export class TestDataFactory {
  /**
   * Generate array method transformation test cases
   */
  static arrayMethods(): {
    function: LodashFunctionName
    input: string
    expected: string
  }[] {
    return [
      {
        function: 'map',
        input: 'const result = map([1, 2, 3], x => x * 2)',
        expected: 'const result = [1, 2, 3].map(x => x * 2)',
      },
      {
        function: 'filter',
        input: 'const filtered = filter(users, user => user.active)',
        expected: 'const filtered = users.filter(user => user.active)',
      },
      {
        function: 'some',
        input: 'const found = some(items, item => item.id === 1)',
        expected: 'const found = items.some(item => item.id === 1)',
      },
      {
        function: 'some',
        input: 'const hasActive = some(users, u => u.active)',
        expected: 'const hasActive = users.some(u => u.active)',
      },
      {
        function: 'every',
        input: 'const allActive = every(users, u => u.active)',
        expected: 'const allActive = users.every(u => u.active)',
      },
      {
        function: 'reduce',
        input: 'const sum = reduce([1, 2, 3], (acc, val) => acc + val, 0)',
        expected: 'const sum = [1, 2, 3].reduce((acc, val) => acc + val, 0)',
      },
    ]
  }

  /**
   * Generate string method transformation test cases
   */
  static stringMethods(): {
    function: LodashFunctionName
    input: string
    expected: string
  }[] {
    return [
      {
        function: 'trim',
        input: 'const trimmed = trim("  hello  ")',
        expected: 'const trimmed = "  hello  ".trim()',
      },
      {
        function: 'toLower',
        input: 'const lower = toLower("HELLO")',
        expected: 'const lower = "HELLO".toLowerCase()',
      },
      {
        function: 'toUpper',
        input: 'const upper = toUpper("hello")',
        expected: 'const upper = "hello".toUpperCase()',
      },
      {
        function: 'startsWith',
        input: 'const starts = startsWith(text, "hello")',
        expected: 'const starts = text.startsWith("hello")',
      },
      {
        function: 'endsWith',
        input: 'const ends = endsWith(text, "world")',
        expected: 'const ends = text.endsWith("world")',
      },
    ]
  }

  /**
   * Generate type checking transformation test cases
   */
  static typeChecking(): {
    function: LodashFunctionName
    input: string
    expected: string
  }[] {
    return [
      {
        function: 'isArray',
        input: 'const check = isArray(value)',
        expected: 'const check = Array.isArray(value)',
      },
      {
        function: 'isString',
        input: 'const check = isString(value)',
        expected: 'const check = typeof value === "string"',
      },
      {
        function: 'isNumber',
        input: 'const check = isNumber(value)',
        expected: 'const check = typeof value === "number"',
      },
      {
        function: 'isBoolean',
        input: 'const check = isBoolean(value)',
        expected: 'const check = typeof value === "boolean"',
      },
      {
        function: 'isNull',
        input: 'const check = isNull(value)',
        expected: 'const check = value === null',
      },
      {
        function: 'isUndefined',
        input: 'const check = isUndefined(value)',
        expected: 'const check = value === undefined',
      },
    ]
  }

  /**
   * Generate object utility transformation test cases
   */
  static objectUtilities(): {
    function: LodashFunctionName
    input: string
    expected: string
  }[] {
    return [
      {
        function: 'keys',
        input: 'const objKeys = keys(object)',
        expected: 'const objKeys = Object.keys(object)',
      },
      {
        function: 'values',
        input: 'const objValues = values(object)',
        expected: 'const objValues = Object.values(object)',
      },
      {
        function: 'entries',
        input: 'const objEntries = entries(object)',
        expected: 'const objEntries = Object.entries(object)',
      },
      {
        function: 'assign',
        input: 'const merged = assign({}, obj1, obj2)',
        expected: 'const merged = Object.assign({}, obj1, obj2)',
      },
    ]
  }

  /**
   * Generate math utility transformation test cases
   */
  static mathUtilities(): {
    function: LodashFunctionName
    input: string
    expected: string
  }[] {
    return [
      {
        function: 'max',
        input: 'const maximum = max([1, 2, 3, 4, 5])',
        expected: 'const maximum = Math.max(...[1, 2, 3, 4, 5])',
      },
      {
        function: 'min',
        input: 'const minimum = min([1, 2, 3, 4, 5])',
        expected: 'const minimum = Math.min(...[1, 2, 3, 4, 5])',
      },
      {
        function: 'ceil',
        input: 'const rounded = ceil(4.2)',
        expected: 'const rounded = Math.ceil(4.2)',
      },
      {
        function: 'floor',
        input: 'const floored = floor(4.8)',
        expected: 'const floored = Math.floor(4.8)',
      },
      {
        function: 'round',
        input: 'const rounded = round(4.5)',
        expected: 'const rounded = Math.round(4.5)',
      },
    ]
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
    arrayMethods: { function: LodashFunctionName, input: string, expected: string }[]
    stringMethods: { function: LodashFunctionName, input: string, expected: string }[]
    typeChecking: { function: LodashFunctionName, input: string, expected: string }[]
    objectUtilities: { function: LodashFunctionName, input: string, expected: string }[]
    mathUtilities: { function: LodashFunctionName, input: string, expected: string }[]
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
