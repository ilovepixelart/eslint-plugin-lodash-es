/**
 * Tests for AutofixTestRunner functionality
 */
import { describe, it, expect } from 'vitest'
import { AutofixTestRunner } from '../../src/test-utils/autofix-test-runner'

describe('TDD: AutofixTestRunner', () => {
  it('should create instance with default config', () => {
    const runner = new AutofixTestRunner()
    expect(runner).toBeDefined()
  })

  it('should accept custom configuration', () => {
    const config = { ecmaVersion: 2023, sourceType: 'module' as const }
    const runner = new AutofixTestRunner(config)
    expect(runner).toBeDefined()
  })

  it('should handle valid code without errors', () => {
    const runner = new AutofixTestRunner()

    expect(() => {
      runner.testValid([
        'import { map } from "lodash-es"; const result = [1,2,3].map(x => x * 2);',
      ])
    }).not.toThrow()
  })

  it('should detect and fix lodash usage', () => {
    const runner = new AutofixTestRunner()

    expect(() => {
      runner.testTransformation({
        name: 'simple map transformation',
        input: 'import { map } from "lodash-es";\nmap([1,2,3], x => x * 2)',
        expected: 'import { map } from "lodash-es";\n[1,2,3].map(x => x * 2)',
        functionName: 'map',
        options: { exclude: ['map'] },
      })
    }).not.toThrow()
  })

  it('should handle batch transformations', () => {
    const runner = new AutofixTestRunner()

    expect(() => {
      runner.testBatch([
        {
          name: 'map transformation',
          input: 'import { map } from "lodash-es";\nmap([1,2,3], x => x * 2)',
          expected: 'import { map } from "lodash-es";\n[1,2,3].map(x => x * 2)',
          functionName: 'map',
          options: { exclude: ['map'] },
        },
        {
          name: 'filter transformation',
          input: 'import { filter } from "lodash-es";\nfilter([1,2,3], x => x > 1)',
          expected: 'import { filter } from "lodash-es";\n[1,2,3].filter(x => x > 1)',
          functionName: 'filter',
          options: { exclude: ['filter'] },
        },
      ])
    }).not.toThrow()
  })

  it('should handle destructured transformations', () => {
    const runner = new AutofixTestRunner()

    expect(() => {
      runner.testDestructuredTransforms([
        {
          function: 'map',
          input: 'map([1,2,3], x => x * 2)',
          expected: '[1,2,3].map(x => x * 2)',
          options: { exclude: ['map'] },
        },
      ])
    }).not.toThrow()
  })

  it('should handle namespace transformations', () => {
    const runner = new AutofixTestRunner()

    expect(() => {
      runner.testNamespaceTransforms([
        {
          function: 'map',
          input: '_.map([1,2,3], x => x * 2)',
          expected: '[1,2,3].map(x => x * 2)',
          options: { exclude: ['map'] },
        },
      ])
    }).not.toThrow()
  })

  it('should handle transformation with custom test name', () => {
    const runner = new AutofixTestRunner()

    expect(() => {
      runner.testTransformation({
        name: 'reduce transformation',
        input: 'import { reduce } from "lodash-es";\nreduce([1,2,3], (sum, n) => sum + n, 0)',
        expected: 'import { reduce } from "lodash-es";\n[1,2,3].reduce((sum, n) => sum + n, 0)',
        functionName: 'reduce',
        options: { exclude: ['reduce'] },
      })
    }).not.toThrow()
  })

  it('should handle edge cases with complex expressions', () => {
    const runner = new AutofixTestRunner()

    expect(() => {
      runner.testBatch([
        {
          name: 'complex nested expression',
          input: 'import { map } from "lodash-es";\nmap(users.filter(u => u.active), u => u.name)',
          expected: 'import { map } from "lodash-es";\nusers.filter(u => u.active).map(u => u.name)',
          functionName: 'map',
          options: { exclude: ['map'] },
        },
      ], 'edge cases')
    }).not.toThrow()
  })
})
