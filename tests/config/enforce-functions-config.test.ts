/**
 * Comprehensive tests for EnforceFunctionsConfig class
 */
import { describe, it, expect } from 'vitest'
import { EnforceFunctionsConfig } from '../../src/config/enforce-functions-config'
import type { LodashFunctionName } from '../../src/types'

describe('EnforceFunctionsConfig', () => {
  describe('constructor and validation', () => {
    it('should create config with no options (permissive mode)', () => {
      const config = new EnforceFunctionsConfig()
      expect(config.getMode()).toBe('permissive')
    })

    it('should create config with empty object', () => {
      const config = new EnforceFunctionsConfig({})
      expect(config.getMode()).toBe('permissive')
    })

    it('should throw error when both include and exclude are specified', () => {
      expect(() => {
        new EnforceFunctionsConfig({
          include: ['map' as LodashFunctionName],
          exclude: ['filter' as LodashFunctionName],
        })
      }).toThrow('Cannot specify both "include" and "exclude" options')
    })

    it('should create config with include option', () => {
      const config = new EnforceFunctionsConfig({
        include: ['map', 'filter'] as LodashFunctionName[],
      })
      expect(config.getMode()).toBe('include')
    })

    it('should create config with exclude option', () => {
      const config = new EnforceFunctionsConfig({
        exclude: ['map', 'filter'] as LodashFunctionName[],
      })
      expect(config.getMode()).toBe('exclude')
    })
  })

  describe('isBlocked', () => {
    it('should not block anything in permissive mode', () => {
      const config = new EnforceFunctionsConfig()
      expect(config.isBlocked('map' as LodashFunctionName)).toBe(false)
      expect(config.isBlocked('filter' as LodashFunctionName)).toBe(false)
    })

    it('should block functions not in include list', () => {
      const config = new EnforceFunctionsConfig({
        include: ['map', 'filter'] as LodashFunctionName[],
      })
      expect(config.isBlocked('map' as LodashFunctionName)).toBe(false)
      expect(config.isBlocked('filter' as LodashFunctionName)).toBe(false)
      expect(config.isBlocked('reduce' as LodashFunctionName)).toBe(true)
    })

    it('should block functions in exclude list', () => {
      const config = new EnforceFunctionsConfig({
        exclude: ['map', 'filter'] as LodashFunctionName[],
      })
      expect(config.isBlocked('map' as LodashFunctionName)).toBe(true)
      expect(config.isBlocked('filter' as LodashFunctionName)).toBe(true)
      expect(config.isBlocked('reduce' as LodashFunctionName)).toBe(false)
    })
  })

  describe('isAllowed', () => {
    it('should allow all functions in permissive mode', () => {
      const config = new EnforceFunctionsConfig()
      expect(config.isAllowed('map' as LodashFunctionName)).toBe(true)
      expect(config.isAllowed('filter' as LodashFunctionName)).toBe(true)
    })

    it('should only allow functions in include list', () => {
      const config = new EnforceFunctionsConfig({
        include: ['map', 'filter'] as LodashFunctionName[],
      })
      expect(config.isAllowed('map' as LodashFunctionName)).toBe(true)
      expect(config.isAllowed('filter' as LodashFunctionName)).toBe(true)
      expect(config.isAllowed('reduce' as LodashFunctionName)).toBe(false)
    })

    it('should not allow functions in exclude list', () => {
      const config = new EnforceFunctionsConfig({
        exclude: ['map', 'filter'] as LodashFunctionName[],
      })
      expect(config.isAllowed('map' as LodashFunctionName)).toBe(false)
      expect(config.isAllowed('filter' as LodashFunctionName)).toBe(false)
      expect(config.isAllowed('reduce' as LodashFunctionName)).toBe(true)
    })
  })

  describe('getReason', () => {
    it('should return default reason in permissive mode', () => {
      const config = new EnforceFunctionsConfig()
      expect(config.getReason()).toBe('blocked by default configuration')
    })

    it('should return exclude reason in exclude mode', () => {
      const config = new EnforceFunctionsConfig({
        exclude: ['map'] as LodashFunctionName[],
      })
      expect(config.getReason()).toBe('excluded by configuration')
    })

    it('should return include reason in include mode', () => {
      const config = new EnforceFunctionsConfig({
        include: ['map'] as LodashFunctionName[],
      })
      expect(config.getReason()).toBe('not in the allowed functions list')
    })
  })

  describe('hasBlockingRules', () => {
    it('should return false in permissive mode', () => {
      const config = new EnforceFunctionsConfig()
      expect(config.hasBlockingRules()).toBe(false)
    })

    it('should return true with include option', () => {
      const config = new EnforceFunctionsConfig({
        include: ['map'] as LodashFunctionName[],
      })
      expect(config.hasBlockingRules()).toBe(true)
    })

    it('should return true with exclude option', () => {
      const config = new EnforceFunctionsConfig({
        exclude: ['map'] as LodashFunctionName[],
      })
      expect(config.hasBlockingRules()).toBe(true)
    })
  })

  describe('getAllowedFunctions', () => {
    it('should return null in permissive mode', () => {
      const config = new EnforceFunctionsConfig()
      expect(config.getAllowedFunctions()).toBeNull()
    })

    it('should return null in exclude mode', () => {
      const config = new EnforceFunctionsConfig({
        exclude: ['map'] as LodashFunctionName[],
      })
      expect(config.getAllowedFunctions()).toBeNull()
    })

    it('should return copy of allowed functions in include mode', () => {
      const allowed = ['map', 'filter'] as LodashFunctionName[]
      const config = new EnforceFunctionsConfig({ include: allowed })
      const result = config.getAllowedFunctions()
      expect(result).toEqual(allowed)
      expect(result).not.toBe(allowed) // Should be a copy
    })
  })

  describe('getBlockedFunctions', () => {
    it('should return null in permissive mode', () => {
      const config = new EnforceFunctionsConfig()
      expect(config.getBlockedFunctions()).toBeNull()
    })

    it('should return null in include mode', () => {
      const config = new EnforceFunctionsConfig({
        include: ['map'] as LodashFunctionName[],
      })
      expect(config.getBlockedFunctions()).toBeNull()
    })

    it('should return copy of blocked functions in exclude mode', () => {
      const blocked = ['map', 'filter'] as LodashFunctionName[]
      const config = new EnforceFunctionsConfig({ exclude: blocked })
      const result = config.getBlockedFunctions()
      expect(result).toEqual(blocked)
      expect(result).not.toBe(blocked) // Should be a copy
    })
  })

  describe('getMode', () => {
    it('should return permissive for no options', () => {
      const config = new EnforceFunctionsConfig()
      expect(config.getMode()).toBe('permissive')
    })

    it('should return include when include option is set', () => {
      const config = new EnforceFunctionsConfig({
        include: ['map'] as LodashFunctionName[],
      })
      expect(config.getMode()).toBe('include')
    })

    it('should return exclude when exclude option is set', () => {
      const config = new EnforceFunctionsConfig({
        exclude: ['map'] as LodashFunctionName[],
      })
      expect(config.getMode()).toBe('exclude')
    })
  })

  describe('getDebugInfo', () => {
    it('should return debug info for permissive mode', () => {
      const config = new EnforceFunctionsConfig()
      const debug = config.getDebugInfo()
      expect(debug).toEqual({
        mode: 'permissive',
        allowedCount: null,
        blockedCount: null,
        hasRules: false,
      })
    })

    it('should return debug info for include mode', () => {
      const config = new EnforceFunctionsConfig({
        include: ['map', 'filter', 'reduce'] as LodashFunctionName[],
      })
      const debug = config.getDebugInfo()
      expect(debug).toEqual({
        mode: 'include',
        allowedCount: 3,
        blockedCount: null,
        hasRules: true,
      })
    })

    it('should return debug info for exclude mode', () => {
      const config = new EnforceFunctionsConfig({
        exclude: ['map', 'filter'] as LodashFunctionName[],
      })
      const debug = config.getDebugInfo()
      expect(debug).toEqual({
        mode: 'exclude',
        allowedCount: null,
        blockedCount: 2,
        hasRules: true,
      })
    })
  })

  describe('static factory methods', () => {
    describe('fromRuleOptions', () => {
      it('should create config from valid options', () => {
        const options = {
          include: ['map', 'filter'] as LodashFunctionName[],
        }
        const config = EnforceFunctionsConfig.fromRuleOptions(options)
        expect(config.getMode()).toBe('include')
        expect(config.getAllowedFunctions()).toEqual(['map', 'filter'])
      })

      it('should create permissive config from null', () => {
        const config = EnforceFunctionsConfig.fromRuleOptions(null)
        expect(config.getMode()).toBe('permissive')
      })

      it('should create permissive config from undefined', () => {
        const config = EnforceFunctionsConfig.fromRuleOptions(undefined)
        expect(config.getMode()).toBe('permissive')
      })

      it('should create permissive config from non-object', () => {
        const config = EnforceFunctionsConfig.fromRuleOptions('invalid')
        expect(config.getMode()).toBe('permissive')
      })

      it('should create permissive config from number', () => {
        const config = EnforceFunctionsConfig.fromRuleOptions(42)
        expect(config.getMode()).toBe('permissive')
      })
    })

    describe('createPermissive', () => {
      it('should create permissive configuration', () => {
        const config = EnforceFunctionsConfig.createPermissive()
        expect(config.getMode()).toBe('permissive')
        expect(config.hasBlockingRules()).toBe(false)
        expect(config.isAllowed('map' as LodashFunctionName)).toBe(true)
      })
    })

    describe('createIncludeOnly', () => {
      it('should create include-only configuration', () => {
        const functions = ['map', 'filter'] as LodashFunctionName[]
        const config = EnforceFunctionsConfig.createIncludeOnly(functions)
        expect(config.getMode()).toBe('include')
        expect(config.isAllowed('map' as LodashFunctionName)).toBe(true)
        expect(config.isAllowed('reduce' as LodashFunctionName)).toBe(false)
      })

      it('should create config with empty include list', () => {
        const config = EnforceFunctionsConfig.createIncludeOnly([])
        expect(config.getMode()).toBe('include')
        expect(config.getAllowedFunctions()).toEqual([])
      })
    })

    describe('createExcludeOnly', () => {
      it('should create exclude-only configuration', () => {
        const functions = ['map', 'filter'] as LodashFunctionName[]
        const config = EnforceFunctionsConfig.createExcludeOnly(functions)
        expect(config.getMode()).toBe('exclude')
        expect(config.isAllowed('map' as LodashFunctionName)).toBe(false)
        expect(config.isAllowed('reduce' as LodashFunctionName)).toBe(true)
      })

      it('should create config with empty exclude list', () => {
        const config = EnforceFunctionsConfig.createExcludeOnly([])
        expect(config.getMode()).toBe('exclude')
        expect(config.getBlockedFunctions()).toEqual([])
      })
    })

    describe('createForNativeAlternatives', () => {
      it('should create config with native alternatives (excluding unsafe)', () => {
        const config = EnforceFunctionsConfig.createForNativeAlternatives(true)
        expect(config.getMode()).toBe('include')
        const allowed = config.getAllowedFunctions()
        expect(allowed).not.toBeNull()
        expect(Array.isArray(allowed)).toBe(true)
        // Should have some functions from nativeAlternatives
        if (allowed) {
          expect(allowed.length).toBeGreaterThan(0)
        }
      })

      it('should create config with all native alternatives (including unsafe)', () => {
        const config = EnforceFunctionsConfig.createForNativeAlternatives(false)
        expect(config.getMode()).toBe('include')
        const allowed = config.getAllowedFunctions()
        expect(allowed).not.toBeNull()
        expect(Array.isArray(allowed)).toBe(true)
        if (allowed) {
          expect(allowed.length).toBeGreaterThan(0)
        }
      })

      it('should exclude more functions when excludeUnsafe is true', () => {
        const configWithoutUnsafe = EnforceFunctionsConfig.createForNativeAlternatives(true)
        const configWithUnsafe = EnforceFunctionsConfig.createForNativeAlternatives(false)

        const withoutUnsafe = configWithoutUnsafe.getAllowedFunctions()
        const withUnsafe = configWithUnsafe.getAllowedFunctions()

        expect(withoutUnsafe).not.toBeNull()
        expect(withUnsafe).not.toBeNull()

        // Including unsafe should have same or more functions
        if (withoutUnsafe && withUnsafe) {
          expect(withUnsafe.length).toBeGreaterThanOrEqual(withoutUnsafe.length)
        }
      })

      it('should use excludeUnsafe=true by default', () => {
        const configDefault = EnforceFunctionsConfig.createForNativeAlternatives()
        const configExplicit = EnforceFunctionsConfig.createForNativeAlternatives(true)

        expect(configDefault.getAllowedFunctions()).toEqual(configExplicit.getAllowedFunctions())
      })
    })
  })

  describe('integration scenarios', () => {
    it('should handle large include list', () => {
      const largelist = Array.from({ length: 100 }, (_, i) => `func${i}` as LodashFunctionName)
      const config = new EnforceFunctionsConfig({ include: largelist })
      expect(config.isAllowed('func50' as LodashFunctionName)).toBe(true)
      expect(config.isAllowed('notInList' as LodashFunctionName)).toBe(false)
    })

    it('should handle large exclude list', () => {
      const largelist = Array.from({ length: 100 }, (_, i) => `func${i}` as LodashFunctionName)
      const config = new EnforceFunctionsConfig({ exclude: largelist })
      expect(config.isBlocked('func50' as LodashFunctionName)).toBe(true)
      expect(config.isBlocked('notInList' as LodashFunctionName)).toBe(false)
    })

    it('should maintain immutability of returned arrays', () => {
      const original = ['map', 'filter'] as LodashFunctionName[]
      const config = new EnforceFunctionsConfig({ include: original })
      const returned = config.getAllowedFunctions()

      expect(returned).not.toBeNull()

      if (returned) {
        // Modify the returned array
        returned.push('reduce' as LodashFunctionName)

        // Original config should not be affected
        expect(config.getAllowedFunctions()).toEqual(original)
        expect(config.getAllowedFunctions()).not.toEqual(returned)
      }
    })
  })
})
