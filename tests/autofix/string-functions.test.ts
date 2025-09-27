import { describe, it, expect } from 'vitest'
import { RuleTester } from 'eslint'
import enforceFunctions from '../../src/rules/enforce-functions'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
})

describe('comprehensive string function autofixes', () => {
  describe('startsWith autofix', () => {
    it('should autofix destructured startsWith calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { startsWith } from \'lodash-es\'; const result = startsWith("hello world", "hello");',
              output: 'import { startsWith } from \'lodash-es\'; const result = "hello world".startsWith("hello");',
              options: [{ exclude: ['startsWith'] }],
              errors: [{ message: 'Lodash function \'startsWith\' is excluded by configuration. Consider using native String.prototype.startsWith: string.startsWith(target)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace startsWith calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.startsWith(text, prefix);',
              output: 'import _ from \'lodash-es\'; const result = text.startsWith(prefix);',
              options: [{ exclude: ['startsWith'] }],
              errors: [{ message: 'Lodash function \'startsWith\' is excluded by configuration. Consider using native String.prototype.startsWith: string.startsWith(target)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle complex string expressions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { startsWith } from \'lodash-es\'; const result = startsWith(user.name.toLowerCase(), searchTerm);',
              output: 'import { startsWith } from \'lodash-es\'; const result = user.name.toLowerCase().startsWith(searchTerm);',
              options: [{ exclude: ['startsWith'] }],
              errors: [{ message: 'Lodash function \'startsWith\' is excluded by configuration. Consider using native String.prototype.startsWith: string.startsWith(target)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('endsWith autofix', () => {
    it('should autofix destructured endsWith calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { endsWith } from \'lodash-es\'; const result = endsWith("hello.js", ".js");',
              output: 'import { endsWith } from \'lodash-es\'; const result = "hello.js".endsWith(".js");',
              options: [{ exclude: ['endsWith'] }],
              errors: [{ message: 'Lodash function \'endsWith\' is excluded by configuration. Consider using native String.prototype.endsWith: string.endsWith(target)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle dynamic file extensions', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { endsWith } from \'lodash-es\'; const result = endsWith(filename, getExtension());',
              output: 'import { endsWith } from \'lodash-es\'; const result = filename.endsWith(getExtension());',
              options: [{ exclude: ['endsWith'] }],
              errors: [{ message: 'Lodash function \'endsWith\' is excluded by configuration. Consider using native String.prototype.endsWith: string.endsWith(target)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('trim family autofix', () => {
    it('should autofix destructured trim calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { trim } from \'lodash-es\'; const result = trim("  hello  ");',
              output: 'import { trim } from \'lodash-es\'; const result = "  hello  ".trim();',
              options: [{ exclude: ['trim'] }],
              errors: [{ message: 'Lodash function \'trim\' is excluded by configuration. Consider using native String.prototype.trim: string.trim()' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix trimStart calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { trimStart } from \'lodash-es\'; const result = trimStart("  hello  ");',
              output: 'import { trimStart } from \'lodash-es\'; const result = "  hello  ".trimStart();',
              options: [{ exclude: ['trimStart'] }],
              errors: [{ message: 'Lodash function \'trimStart\' is excluded by configuration. Consider using native String.prototype.trimStart: string.trimStart()' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix trimEnd calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { trimEnd } from \'lodash-es\'; const result = trimEnd("  hello  ");',
              output: 'import { trimEnd } from \'lodash-es\'; const result = "  hello  ".trimEnd();',
              options: [{ exclude: ['trimEnd'] }],
              errors: [{ message: 'Lodash function \'trimEnd\' is excluded by configuration. Consider using native String.prototype.trimEnd: string.trimEnd()' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle variable string inputs', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { trim } from \'lodash-es\'; const result = trim(userInput);',
              output: 'import { trim } from \'lodash-es\'; const result = userInput.trim();',
              options: [{ exclude: ['trim'] }],
              errors: [{ message: 'Lodash function \'trim\' is excluded by configuration. Consider using native String.prototype.trim: string.trim()' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('case conversion autofix', () => {
    it('should autofix toLower calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { toLower } from \'lodash-es\'; const result = toLower("HELLO WORLD");',
              output: 'import { toLower } from \'lodash-es\'; const result = "HELLO WORLD".toLowerCase();',
              options: [{ exclude: ['toLower'] }],
              errors: [{ message: 'Lodash function \'toLower\' is excluded by configuration. Consider using native String.prototype.toLowerCase: string.toLowerCase()' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix toUpper calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { toUpper } from \'lodash-es\'; const result = toUpper("hello world");',
              output: 'import { toUpper } from \'lodash-es\'; const result = "hello world".toUpperCase();',
              options: [{ exclude: ['toUpper'] }],
              errors: [{ message: 'Lodash function \'toUpper\' is excluded by configuration. Consider using native String.prototype.toUpperCase: string.toUpperCase()' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle namespace imports for case conversion', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const upper = _.toUpper(name); const lower = _.toLower(name);',
              output: 'import _ from \'lodash-es\'; const upper = name.toUpperCase(); const lower = name.toLowerCase();',
              options: [{ exclude: ['toUpper', 'toLower'] }],
              errors: [
                { message: 'Lodash function \'toUpper\' is excluded by configuration. Consider using native String.prototype.toUpperCase: string.toUpperCase()' },
                { message: 'Lodash function \'toLower\' is excluded by configuration. Consider using native String.prototype.toLowerCase: string.toLowerCase()' },
              ],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('string manipulation autofix', () => {
    it('should autofix split calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { split } from \'lodash-es\'; const result = split("a,b,c", ",");',
              output: 'import { split } from \'lodash-es\'; const result = "a,b,c".split(",");',
              options: [{ exclude: ['split'] }],
              errors: [{ message: 'Lodash function \'split\' is excluded by configuration. Consider using native String.prototype.split: string.split(separator)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix replace calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { replace } from \'lodash-es\'; const result = replace("hello world", "world", "universe");',
              output: 'import { replace } from \'lodash-es\'; const result = "hello world".replace("world", "universe");',
              options: [{ exclude: ['replace'] }],
              errors: [{ message: 'Lodash function \'replace\' is excluded by configuration. Consider using native String.prototype.replace: string.replace(pattern, replacement)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix repeat calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { repeat } from \'lodash-es\'; const result = repeat("*", 5);',
              output: 'import { repeat } from \'lodash-es\'; const result = "*".repeat(5);',
              options: [{ exclude: ['repeat'] }],
              errors: [{ message: 'Lodash function \'repeat\' is excluded by configuration. Consider using native String.prototype.repeat: string.repeat(n)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix padEnd calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { padEnd } from \'lodash-es\'; const result = padEnd("hello", 10, ".");',
              output: 'import { padEnd } from \'lodash-es\'; const result = "hello".padEnd(10, ".");',
              options: [{ exclude: ['padEnd'] }],
              errors: [{ message: 'Lodash function \'padEnd\' is excluded by configuration. Consider using native String.prototype.padEnd: string.padEnd(length, chars)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle complex string expressions with operators', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { trim } from \'lodash-es\'; const result = trim(input || defaultValue);',
              output: 'import { trim } from \'lodash-es\'; const result = (input || defaultValue).trim();',
              options: [{ exclude: ['trim'] }],
              errors: [{ message: 'Lodash function \'trim\' is excluded by configuration. Consider using native String.prototype.trim: string.trim()' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle regex patterns in replace', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { replace } from \'lodash-es\'; const result = replace(text, /[^a-zA-Z0-9]/g, "");',
              output: 'import { replace } from \'lodash-es\'; const result = text.replace(/[^a-zA-Z0-9]/g, "");',
              options: [{ exclude: ['replace'] }],
              errors: [{ message: 'Lodash function \'replace\' is excluded by configuration. Consider using native String.prototype.replace: string.replace(pattern, replacement)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle template literal separators in split', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { split } from \'lodash-es\'; const result = split(data, `${delimiter}`);',
              output: 'import { split } from \'lodash-es\'; const result = data.split(`${delimiter}`);',
              options: [{ exclude: ['split'] }],
              errors: [{ message: 'Lodash function \'split\' is excluded by configuration. Consider using native String.prototype.split: string.split(separator)' }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle computed repeat counts', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { repeat } from \'lodash-es\'; const result = repeat(char, Math.max(0, count));',
              output: 'import { repeat } from \'lodash-es\'; const result = char.repeat(Math.max(0, count));',
              options: [{ exclude: ['repeat'] }],
              errors: [{ message: 'Lodash function \'repeat\' is excluded by configuration. Consider using native String.prototype.repeat: string.repeat(n)' }],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('mixed string and array functions', () => {
    it('should handle multiple string functions in one statement', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { trim, split } from \'lodash-es\'; const parts = split(trim(input), ",");',
              output: 'import { trim, split } from \'lodash-es\'; const parts = trim(input).split(",");',
              options: [{ exclude: ['trim', 'split'] }],
              errors: [
                { message: 'Lodash function \'split\' is excluded by configuration. Consider using native String.prototype.split: string.split(separator)' },
                { message: 'Lodash function \'trim\' is excluded by configuration. Consider using native String.prototype.trim: string.trim()' },
              ],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should handle mixed string and array operations', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { split, map } from \'lodash-es\'; const result = map(split(text, ","), trim);',
              output: 'import { split, map } from \'lodash-es\'; const result = split(text, ",").map(trim);',
              options: [{ exclude: ['split', 'map'] }],
              errors: [
                { message: 'Lodash function \'map\' is excluded by configuration. Consider using native Array.prototype.map: array.map(fn)' },
                { message: 'Lodash function \'split\' is excluded by configuration. Consider using native String.prototype.split: string.split(separator)' },
              ],
            },
          ],
        })
      }).not.toThrow()
    })
  })

  describe('newly added string functions', () => {
    it('should autofix padStart calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import { padStart } from \'lodash-es\'; const result = padStart("hello", 10, " ");',
              output: 'import { padStart } from \'lodash-es\'; const result = "hello".padStart(10, " ");',
              options: [{ exclude: ['padStart'] }],
              errors: [{ message: /Lodash function 'padStart' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })

    it('should autofix namespace padStart calls', () => {
      expect(() => {
        ruleTester.run('enforce-functions', enforceFunctions, {
          valid: [],
          invalid: [
            {
              code: 'import _ from \'lodash-es\'; const result = _.padStart("test", 8, "0");',
              output: 'import _ from \'lodash-es\'; const result = "test".padStart(8, "0");',
              options: [{ exclude: ['padStart'] }],
              errors: [{ message: /Lodash function 'padStart' is excluded/ }],
            },
          ],
        })
      }).not.toThrow()
    })
  })
})
