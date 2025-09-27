import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('Autofix boundary conditions', () => {
  describe('extreme unicode and special characters', () => {
    it('should handle unicode identifiers', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const データ = [1, 2, 3]; const result = map(データ, アイテム => アイテム * 2);',
              output: 'import { map } from \'lodash-es\'; const データ = [1, 2, 3]; const result = データ.map(アイテム => アイテム * 2);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle extremely long variable names', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const veryLongVariableNameThatShouldStillWorkInTransformationButMightCauseSomeIssuesWithLineLengthOrOtherThings = [1, 2, 3]; const result = map(veryLongVariableNameThatShouldStillWorkInTransformationButMightCauseSomeIssuesWithLineLengthOrOtherThings, x => x * 2);',
              output: 'import { map } from \'lodash-es\'; const veryLongVariableNameThatShouldStillWorkInTransformationButMightCauseSomeIssuesWithLineLengthOrOtherThings = [1, 2, 3]; const result = veryLongVariableNameThatShouldStillWorkInTransformationButMightCauseSomeIssuesWithLineLengthOrOtherThings.map(x => x * 2);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('function context extremes', () => {
    it('should handle this binding edge cases', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const obj = { multiplier: 2, transform() { return map(data, function(x) { return x * this.multiplier; }); } };',
              output: 'import { map } from \'lodash-es\'; const obj = { multiplier: 2, transform() { return data.map(function(x) { return x * this.multiplier; }); } };',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle bound functions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const multiplier = { value: 3 }; const transform = function(x) { return x * this.value; }; const result = map(data, transform.bind(multiplier));',
              output: 'import { map } from \'lodash-es\'; const multiplier = { value: 3 }; const transform = function(x) { return x * this.value; }; const result = data.map(transform.bind(multiplier));',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('potential breaking transformations', () => {
    it('should document array-like objects limitation', () => {
      // This is a known limitation: lodash works with array-like objects,
      // but native Array methods don't. The transformation should NOT happen
      // for non-arrays, but our current implementation doesn't detect this.
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [
            // These should ideally be valid (not transformed) but current implementation will transform them
            // This documents the limitation
          ],
          invalid: [
            // Current behavior: transforms even when it shouldn't
            {
              code: 'import { map } from \'lodash-es\'; const nodeList = document.querySelectorAll("div"); const result = map(nodeList, node => node.textContent);',
              output: 'import { map } from \'lodash-es\'; const nodeList = document.querySelectorAll("div"); const result = nodeList.map(node => node.textContent);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
