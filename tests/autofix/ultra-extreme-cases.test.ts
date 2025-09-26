import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('ultra-extreme edge cases', () => {
  describe('JavaScript language extremes', () => {
    it('should handle async/await in callbacks', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data, async (item) => await processItem(item));',
              output: 'import { map } from \'lodash-es\'; const result = data.map(async (item) => await processItem(item));',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle generator functions as callbacks', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data, function* (item) { yield item * 2; });',
              output: 'import { map } from \'lodash-es\'; const result = data.map(function* (item) { yield item * 2; });',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle try-catch blocks in callbacks', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: `import { map } from 'lodash-es';
const result = map(data, item => {
  try {
    return processItem(item);
  } catch (e) {
    return null;
  }
});`,
              output: `import { map } from 'lodash-es';
const result = data.map(item => {
  try {
    return processItem(item);
  } catch (e) {
    return null;
  }
});`,
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle computed property access in callbacks', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const prop = "value"; const result = map(data, item => item[prop]);',
              output: 'import { map } from \'lodash-es\'; const prop = "value"; const result = data.map(item => item[prop]);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle Symbol properties', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const sym = Symbol("id"); const result = map(data, item => item[sym]);',
              output: 'import { map } from \'lodash-es\'; const sym = Symbol("id"); const result = data.map(item => item[sym]);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('data type extremes', () => {
    it('should correctly fix array-like objects with Array.from()', () => {
      // FIXED: Now correctly transforms to Array.from(arguments).map()
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; function test() { const result = map(arguments, arg => arg * 2); }',
              output: 'import { map } from \'lodash-es\'; function test() { const result = Array.from(arguments).map(arg => arg * 2); }',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle BigInt values', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map([1n, 2n, 3n], n => n * 2n);',
              output: 'import { map } from \'lodash-es\'; const result = [1n, 2n, 3n].map(n => n * 2n);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle sparse arrays', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const sparse = [1, , , 4]; const result = map(sparse, x => x || 0);',
              output: 'import { map } from \'lodash-es\'; const sparse = [1, , , 4]; const result = sparse.map(x => x || 0);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should fix operator precedence by adding parentheses', () => {
      // FIXED: Now adds parentheses for operator precedence
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data?.items || [], item => item?.value);',
              output: 'import { map } from \'lodash-es\'; const result = (data?.items || []).map(item => item?.value);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('import/export extremes', () => {
    it('should correctly detect renamed imports by tracking aliases', () => {
      // FIXED: Now detects renamed imports and their actual usage
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map as mapFunc } from \'lodash-es\'; const result = mapFunc([1, 2, 3], x => x * 2);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
            {
              code: 'import { filter as filterFunc, map as mapFunc } from \'lodash-es\'; const result = mapFunc([1, 2, 3], x => x * 2); const filtered = filterFunc([1, 2, 3], x => x > 0);',
              options: [{ exclude: ['map', 'filter'] }],
              errors: [
                { message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' },
                { message: 'Lodash function \'filter\' is excluded by configuration. Consider using native Array.prototype.filter: array.filter(predicate)' },
              ],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should document dynamic property access limitation (UNFIXABLE)', () => {
      // UNFIXABLE LIMITATION: Cannot detect dynamic property access _[funcName]
      // Rule only detects static property access like _.map, not computed property access
      // This requires runtime analysis which is impossible in static linting
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [
            // Dynamic property access is not detected (and cannot be)
            {
              code: 'import * as _ from \'lodash-es\'; const funcName = "map"; const result = _[funcName](data, x => x * 2);',
              options: [{ exclude: ['map'] }],
            },
          ],
          invalid: [],
        })
      }).not.toThrow()
    })
  })

  describe('parameter parsing stress tests', () => {
    it('should handle extremely nested expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data.filter(a => a.items.some(b => b.values.every(c => c.score > data.stats.avg))), item => item.result);',
              output: 'import { map } from \'lodash-es\'; const result = data.filter(a => a.items.some(b => b.values.every(c => c.score > data.stats.avg))).map(item => item.result);',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle regex with complex patterns', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(strings, s => s.replace(/[\\[\\]{}(),.;:!?]/g, ""));',
              output: 'import { map } from \'lodash-es\'; const result = strings.map(s => s.replace(/[\\[\\]{}(),.;:!?]/g, ""));',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle callback with multiple return statements', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: `import { map } from 'lodash-es';
const result = map(data, item => {
  if (item.type === 'A') return item.value * 2;
  if (item.type === 'B') return item.value + 10;
  return item.value;
});`,
              output: `import { map } from 'lodash-es';
const result = data.map(item => {
  if (item.type === 'A') return item.value * 2;
  if (item.type === 'B') return item.value + 10;
  return item.value;
});`,
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle IIFE as callback', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { map } from \'lodash-es\'; const result = map(data, (function(multiplier) { return x => x * multiplier; })(2));',
              output: 'import { map } from \'lodash-es\'; const result = data.map((function(multiplier) { return x => x * multiplier; })(2));',
              options: [{ exclude: ['map'] }],
              errors: [{ message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

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
