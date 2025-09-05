import { describe, it, expect } from 'vitest'
import plugin from '../src/index'

describe('flat config', () => {
  it('should export base config', () => {
    expect(plugin.configs.base).toBeDefined()
    expect(Array.isArray(plugin.configs.base)).toBe(true)
    expect(plugin.configs.base[0]).toHaveProperty('plugins')
    expect(plugin.configs.base[0].plugins).toHaveProperty('lodash-es')
  })

  it('should export recommended config', () => {
    expect(plugin.configs.recommended).toBeDefined()
    expect(Array.isArray(plugin.configs.recommended)).toBe(true)
    expect(plugin.configs.recommended[0]).toHaveProperty('plugins')
    expect(plugin.configs.recommended[0]).toHaveProperty('rules')
    expect(plugin.configs.recommended[0].rules).toHaveProperty('lodash-es/enforce-destructuring', 'error')
  })

  it('should export all config', () => {
    expect(plugin.configs.all).toBeDefined()
    expect(Array.isArray(plugin.configs.all)).toBe(true)
  })

  it('should export legacy config', () => {
    expect(plugin.configs['recommended-legacy']).toBeDefined()
    expect(plugin.configs['recommended-legacy']).toHaveProperty('plugins')
    expect(plugin.configs['recommended-legacy']).toHaveProperty('rules')
    expect(plugin.configs['recommended-legacy'].rules).toHaveProperty('lodash-es/enforce-destructuring', 'error')
  })

  it('should export rules', () => {
    expect(plugin.rules).toBeDefined()
    expect(plugin.rules).toHaveProperty('enforce-destructuring')
    expect(typeof plugin.rules['enforce-destructuring']).toBe('object')
  })
})
