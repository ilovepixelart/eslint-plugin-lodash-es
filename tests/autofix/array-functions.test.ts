import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('comprehensive array function autofixes', () => {
  describe('basic functionality', () => {
    it('should autofix destructured includes calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { includes } from \'lodash-es\'; const result = includes([1, 2, 3], 2);',
              output: 'import { includes } from \'lodash-es\'; const result = [1, 2, 3].includes(2);',
              options: [{ exclude: ['includes'] }],
              errors: [{ message: 'Lodash function \'includes\' is excluded by configuration. Consider using native Array.prototype.includes: array.includes(value)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace includes calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.includes([1, 2, 3], 2);',
              output: 'import _ from \'lodash-es\'; const result = [1, 2, 3].includes(2);',
              options: [{ exclude: ['includes'] }],
              errors: [{ message: 'Lodash function \'includes\' is excluded by configuration. Consider using native Array.prototype.includes: array.includes(value)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle complex array expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { includes } from \'lodash-es\'; const result = includes(data.filter(x => x.active), targetValue);',
              output: 'import { includes } from \'lodash-es\'; const result = data.filter(x => x.active).includes(targetValue);',
              options: [{ exclude: ['includes'] }],
              errors: [{ message: 'Lodash function \'includes\' is excluded by configuration. Consider using native Array.prototype.includes: array.includes(value)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle operator precedence', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { includes } from \'lodash-es\'; const result = includes(arr1 || arr2, value);',
              output: 'import { includes } from \'lodash-es\'; const result = (arr1 || arr2).includes(value);',
              options: [{ exclude: ['includes'] }],
              errors: [{ message: 'Lodash function \'includes\' is excluded by configuration. Consider using native Array.prototype.includes: array.includes(value)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle complex search values', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { includes } from \'lodash-es\'; const result = includes(users, { id: currentUser.id, active: true });',
              output: 'import { includes } from \'lodash-es\'; const result = users.includes({ id: currentUser.id, active: true });',
              options: [{ exclude: ['includes'] }],
              errors: [{ message: 'Lodash function \'includes\' is excluded by configuration. Consider using native Array.prototype.includes: array.includes(value)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})

describe('slice autofix', () => {
  describe('basic functionality', () => {
    it('should autofix destructured slice calls with start and end', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { slice } from \'lodash-es\'; const result = slice([1, 2, 3, 4, 5], 1, 4);',
              output: 'import { slice } from \'lodash-es\'; const result = [1, 2, 3, 4, 5].slice(1, 4);',
              options: [{ exclude: ['slice'] }],
              errors: [{ message: 'Lodash function \'slice\' is excluded by configuration. Consider using native Array.prototype.slice: array.slice(start, end)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix slice calls with only start parameter', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { slice } from \'lodash-es\'; const result = slice([1, 2, 3, 4, 5], 2);',
              output: 'import { slice } from \'lodash-es\'; const result = [1, 2, 3, 4, 5].slice(2);',
              options: [{ exclude: ['slice'] }],
              errors: [{ message: 'Lodash function \'slice\' is excluded by configuration. Consider using native Array.prototype.slice: array.slice(start, end)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace slice calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.slice([1, 2, 3, 4, 5], 1, 3);',
              output: 'import _ from \'lodash-es\'; const result = [1, 2, 3, 4, 5].slice(1, 3);',
              options: [{ exclude: ['slice'] }],
              errors: [{ message: 'Lodash function \'slice\' is excluded by configuration. Consider using native Array.prototype.slice: array.slice(start, end)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle negative indices', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { slice } from \'lodash-es\'; const result = slice(data, -3, -1);',
              output: 'import { slice } from \'lodash-es\'; const result = data.slice(-3, -1);',
              options: [{ exclude: ['slice'] }],
              errors: [{ message: 'Lodash function \'slice\' is excluded by configuration. Consider using native Array.prototype.slice: array.slice(start, end)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle computed indices', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { slice } from \'lodash-es\'; const result = slice(items, startIndex, startIndex + pageSize);',
              output: 'import { slice } from \'lodash-es\'; const result = items.slice(startIndex, startIndex + pageSize);',
              options: [{ exclude: ['slice'] }],
              errors: [{ message: 'Lodash function \'slice\' is excluded by configuration. Consider using native Array.prototype.slice: array.slice(start, end)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})

describe('concat autofix', () => {
  describe('basic functionality', () => {
    it('should autofix destructured concat calls with multiple arrays', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { concat } from \'lodash-es\'; const result = concat([1, 2], [3, 4], [5, 6]);',
              output: 'import { concat } from \'lodash-es\'; const result = [1, 2].concat([3, 4], [5, 6]);',
              options: [{ exclude: ['concat'] }],
              errors: [{ message: 'Lodash function \'concat\' is excluded by configuration. Consider using native Array.prototype.concat: array.concat(...values)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix concat calls with mixed values', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { concat } from \'lodash-es\'; const result = concat([1, 2], 3, [4, 5], 6);',
              output: 'import { concat } from \'lodash-es\'; const result = [1, 2].concat(3, [4, 5], 6);',
              options: [{ exclude: ['concat'] }],
              errors: [{ message: 'Lodash function \'concat\' is excluded by configuration. Consider using native Array.prototype.concat: array.concat(...values)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace concat calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.concat([1, 2], [3, 4]);',
              output: 'import _ from \'lodash-es\'; const result = [1, 2].concat([3, 4]);',
              options: [{ exclude: ['concat'] }],
              errors: [{ message: 'Lodash function \'concat\' is excluded by configuration. Consider using native Array.prototype.concat: array.concat(...values)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle spread operations', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { concat } from \'lodash-es\'; const result = concat(baseArray, ...additionalArrays);',
              output: 'import { concat } from \'lodash-es\'; const result = baseArray.concat(...additionalArrays);',
              options: [{ exclude: ['concat'] }],
              errors: [{ message: 'Lodash function \'concat\' is excluded by configuration. Consider using native Array.prototype.concat: array.concat(...values)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle complex expressions as parameters', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { concat } from \'lodash-es\'; const result = concat(getCurrentItems(), getAdditionalItems().filter(x => x.valid));',
              output: 'import { concat } from \'lodash-es\'; const result = getCurrentItems().concat(getAdditionalItems().filter(x => x.valid));',
              options: [{ exclude: ['concat'] }],
              errors: [{ message: 'Lodash function \'concat\' is excluded by configuration. Consider using native Array.prototype.concat: array.concat(...values)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})

describe('join autofix', () => {
  describe('basic functionality', () => {
    it('should autofix destructured join calls with string separator', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { join } from \'lodash-es\'; const result = join([\'apple\', \'banana\', \'cherry\'], \', \');',
              output: 'import { join } from \'lodash-es\'; const result = [\'apple\', \'banana\', \'cherry\'].join(\', \');',
              options: [{ exclude: ['join'] }],
              errors: [{ message: 'Lodash function \'join\' is excluded by configuration. Consider using native Array.prototype.join: array.join(separator)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix join calls with single character separator', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { join } from \'lodash-es\'; const result = join([\'a\', \'b\', \'c\'], \'|\');',
              output: 'import { join } from \'lodash-es\'; const result = [\'a\', \'b\', \'c\'].join(\'|\');',
              options: [{ exclude: ['join'] }],
              errors: [{ message: 'Lodash function \'join\' is excluded by configuration. Consider using native Array.prototype.join: array.join(separator)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace join calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.join([\'hello\', \'world\'], \' \');',
              output: 'import _ from \'lodash-es\'; const result = [\'hello\', \'world\'].join(\' \');',
              options: [{ exclude: ['join'] }],
              errors: [{ message: 'Lodash function \'join\' is excluded by configuration. Consider using native Array.prototype.join: array.join(separator)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle dynamic separators', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { join } from \'lodash-es\'; const result = join(words, isCompact ? \'\' : \' \');',
              output: 'import { join } from \'lodash-es\'; const result = words.join(isCompact ? \'\' : \' \');',
              options: [{ exclude: ['join'] }],
              errors: [{ message: 'Lodash function \'join\' is excluded by configuration. Consider using native Array.prototype.join: array.join(separator)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle template literal separators', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { join } from \'lodash-es\'; const result = join(items, `${delimiter}${spacing}`);',
              output: 'import { join } from \'lodash-es\'; const result = items.join(`${delimiter}${spacing}`);',
              options: [{ exclude: ['join'] }],
              errors: [{ message: 'Lodash function \'join\' is excluded by configuration. Consider using native Array.prototype.join: array.join(separator)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle number arrays', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { join } from \'lodash-es\'; const result = join([1, 2, 3, 4, 5], \'-\');',
              output: 'import { join } from \'lodash-es\'; const result = [1, 2, 3, 4, 5].join(\'-\');',
              options: [{ exclude: ['join'] }],
              errors: [{ message: 'Lodash function \'join\' is excluded by configuration. Consider using native Array.prototype.join: array.join(separator)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})

describe('mixed array function usage', () => {
  it('should handle multiple array functions in one statement', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { slice, join } from \'lodash-es\'; const result = join(slice([\'a\', \'b\', \'c\', \'d\'], 1, 3), \'-\');',
            output: 'import { slice, join } from \'lodash-es\'; const result = slice([\'a\', \'b\', \'c\', \'d\'], 1, 3).join(\'-\');',
            options: [{ exclude: ['slice', 'join'] }],
            errors: [
              { message: 'Lodash function \'join\' is excluded by configuration. Consider using native Array.prototype.join: array.join(separator)' },
              { message: 'Lodash function \'slice\' is excluded by configuration. Consider using native Array.prototype.slice: array.slice(start, end)' },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  it('should handle array functions with include configuration', () => {
    expect(() => {
      ruleTester.run('enforce-functions', enforceFunctions, {
        valid: [],
        invalid: [
          {
            code: 'import { includes, slice, concat, join, map } from \'lodash-es\'; const has = includes(arr, val); const part = slice(arr, 1); const merged = concat(arr1, arr2); const str = join(arr, \',\');',
            output: 'import { includes, slice, concat, join, map } from \'lodash-es\'; const has = arr.includes(val); const part = arr.slice(1); const merged = arr1.concat(arr2); const str = arr.join(\',\');',
            options: [{ include: ['map'] }], // Only map is allowed, others should be flagged
            errors: [
              { message: 'Lodash function \'includes\' is not in the allowed functions list. Consider using native Array.prototype.includes: array.includes(value)' },
              { message: 'Lodash function \'slice\' is not in the allowed functions list. Consider using native Array.prototype.slice: array.slice(start, end)' },
              { message: 'Lodash function \'concat\' is not in the allowed functions list. Consider using native Array.prototype.concat: array.concat(...values)' },
              { message: 'Lodash function \'join\' is not in the allowed functions list. Consider using native Array.prototype.join: array.join(separator)' },
            ],
          },
        ],
      })
    }).not.toThrow()
  })

  describe('newly added array functions', () => {
    it('should autofix indexOf calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { indexOf } from \'lodash-es\'; const result = indexOf(array, value);',
              output: 'import { indexOf } from \'lodash-es\'; const result = array.indexOf(value);',
              options: [{ exclude: ['indexOf'] }],
              errors: [{ message: /Lodash function 'indexOf' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix lastIndexOf calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { lastIndexOf } from \'lodash-es\'; const result = lastIndexOf(array, value);',
              output: 'import { lastIndexOf } from \'lodash-es\'; const result = array.lastIndexOf(value);',
              options: [{ exclude: ['lastIndexOf'] }],
              errors: [{ message: /Lodash function 'lastIndexOf' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix flatten calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { flatten } from \'lodash-es\'; const result = flatten(nestedArray);',
              output: 'import { flatten } from \'lodash-es\'; const result = nestedArray.flat();',
              options: [{ exclude: ['flatten'] }],
              errors: [{ message: /Lodash function 'flatten' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix flatMap calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { flatMap } from \'lodash-es\'; const result = flatMap(array, fn);',
              output: 'import { flatMap } from \'lodash-es\'; const result = array.flatMap(fn);',
              options: [{ exclude: ['flatMap'] }],
              errors: [{ message: /Lodash function 'flatMap' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix reduceRight calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { reduceRight } from \'lodash-es\'; const result = reduceRight(array, fn, initial);',
              output: 'import { reduceRight } from \'lodash-es\'; const result = array.reduceRight(fn, initial);',
              options: [{ exclude: ['reduceRight'] }],
              errors: [{ message: /Lodash function 'reduceRight' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix first calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { first } from \'lodash-es\'; const result = first(array);',
              output: 'import { first } from \'lodash-es\'; const result = array.at(0);',
              options: [{ exclude: ['first'] }],
              errors: [{ message: /Lodash function 'first' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix head calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { head } from \'lodash-es\'; const result = head(array);',
              output: 'import { head } from \'lodash-es\'; const result = array.at(0);',
              options: [{ exclude: ['head'] }],
              errors: [{ message: /Lodash function 'head' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix last calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { last } from \'lodash-es\'; const result = last(array);',
              output: 'import { last } from \'lodash-es\'; const result = array.at(-1);',
              options: [{ exclude: ['last'] }],
              errors: [{ message: /Lodash function 'last' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix initial calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { initial } from \'lodash-es\'; const result = initial(array);',
              output: 'import { initial } from \'lodash-es\'; const result = array.slice(0, -1);',
              options: [{ exclude: ['initial'] }],
              errors: [{ message: /Lodash function 'initial' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix tail calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { tail } from \'lodash-es\'; const result = tail(array);',
              output: 'import { tail } from \'lodash-es\'; const result = array.slice(1);',
              options: [{ exclude: ['tail'] }],
              errors: [{ message: /Lodash function 'tail' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
