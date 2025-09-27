import { describe, it, expect } from 'vitest'
import { createNamespaceFix } from '../../src/autofix/namespace-autofix'
import type { Usage } from '../../src/types'
import type { SourceCode } from 'eslint'

describe('namespace-autofix branch coverage', () => {
  describe('createNamespaceFix edge cases', () => {
    it('should return null when regex does not match', () => {
      // Test line 40: if (!match) return null
      // Create a malformed namespace call that won't match the regex pattern

      const mockSourceCode = {
        getText: () => 'malformed.call.pattern', // This won't match the expected regex
      } as SourceCode

      const usage: Usage = {
        start: 0,
        end: 22,
        fullMatch: 'malformed.call.pattern',
        functionName: 'map',
        originalText: 'malformed.call.pattern',
      }

      const result = createNamespaceFix(mockSourceCode, usage, 'map')
      expect(result).toBe(null)
    })

    it('should return null for incomplete function calls', () => {
      // Another case that should trigger the regex mismatch
      const mockSourceCode = {
        getText: () => '_.map(', // Incomplete call, missing closing paren and params
      } as SourceCode

      const usage: Usage = {
        start: 0,
        end: 6,
        fullMatch: '_.map(',
        functionName: 'map',
        originalText: '_.map(',
      }

      const result = createNamespaceFix(mockSourceCode, usage, 'map')
      expect(result).toBe(null)
    })

    it('should return null for malformed namespace patterns', () => {
      // Test various malformed patterns that won't match the regex
      const testCases = [
        'map(array, fn)', // Missing namespace prefix
        '_.', // Incomplete
        '_.map)', // Missing opening paren
        'namespace..map(array, fn)', // Double dots
        '', // Empty string
      ]

      for (const malformedCall of testCases) {
        const mockSourceCode = {
          getText: () => malformedCall,
        } as SourceCode

        const usage: Usage = {
          start: 0,
          end: malformedCall.length,
          fullMatch: malformedCall,
          functionName: 'map',
          originalText: malformedCall,
        }

        const result = createNamespaceFix(mockSourceCode, usage, 'map')
        expect(result).toBe(null)
      }
    })

    it('should handle edge cases in function name extraction', () => {
      // Test cases where the function name doesn't match or creates issues
      const mockSourceCode = {
        getText: () => '_.invalidFunction(args)',
      } as SourceCode

      const usage: Usage = {
        start: 0,
        end: 21,
        fullMatch: '_.invalidFunction(args)',
        functionName: 'map', // Mismatch between actual function and expected
        originalText: '_.invalidFunction(args)',
      }

      const result = createNamespaceFix(mockSourceCode, usage, 'map')
      expect(result).toBe(null) // Should fail because regex looks for 'map' but function is 'invalidFunction'
    })

    it('should handle special characters in function names', () => {
      // Test with special characters that might break the regex
      const mockSourceCode = {
        getText: () => '_.$pecial(args)', // Special character in function name
      } as SourceCode

      const usage: Usage = {
        start: 0,
        end: 15,
        fullMatch: '_.$pecial(args)',
        functionName: '$pecial',
        originalText: '_.$pecial(args)',
      }

      const result = createNamespaceFix(mockSourceCode, usage, '$pecial')
      // This might fail due to regex not handling special characters properly
      expect(result).toBe(null)
    })

    it('should handle complex but invalid namespace patterns', () => {
      // Test complex patterns that look like they might match but don't
      const complexCases = [
        '_map(array, fn)', // Missing dot
        '_.map array, fn)', // Missing opening paren
        '_.map(array, fn', // Missing closing paren
        'namespace.map(args) extra', // Extra content after
        'prefix _.map(args)', // Extra content before
      ]

      for (const complexCall of complexCases) {
        const mockSourceCode = {
          getText: () => complexCall,
        } as SourceCode

        const usage: Usage = {
          start: 0,
          end: complexCall.length,
          fullMatch: complexCall,
          functionName: 'map',
          originalText: complexCall,
        }

        const result = createNamespaceFix(mockSourceCode, usage, 'map')
        expect(result).toBe(null)
      }
    })
  })

  describe('regex pattern validation', () => {
    it('should validate the regex pattern works correctly', () => {
      // Test that valid patterns still work (sanity check)
      const validSourceCode = {
        getText: () => '_.map(array, fn)',
      } as SourceCode

      const validUsage: Usage = {
        start: 0,
        end: 16,
        fullMatch: '_.map(array, fn)',
        functionName: 'map',
        originalText: '_.map(array, fn)',
      }

      const result = createNamespaceFix(validSourceCode, validUsage, 'map')
      expect(result).not.toBe(null) // This should succeed
    })

    it('should handle empty and whitespace scenarios', () => {
      // Test edge cases with empty/whitespace content
      const edgeCases = [
        '', // Empty
        '   ', // Whitespace only
        '\n\t', // Newlines and tabs
        '_.map()', // Valid but empty params
      ]

      for (const edgeCase of edgeCases) {
        const mockSourceCode = {
          getText: () => edgeCase,
        } as SourceCode

        const usage: Usage = {
          start: 0,
          end: edgeCase.length,
          fullMatch: edgeCase,
          functionName: 'map',
          originalText: edgeCase,
        }

        const result = createNamespaceFix(mockSourceCode, usage, 'map')

        if (edgeCase === '_.map()') {
          expect(result).not.toBe(null) // This should succeed with empty params
        } else {
          expect(result).toBe(null) // Others should fail
        }
      }
    })
  })
})
