/**
 * Tests for RegexCache functionality
 */
import { describe, it, expect } from 'vitest'
import { RegexCache } from '../src/regex-cache'

describe('TDD: RegexCache', () => {
  it('should create and cache member regex patterns', () => {
    const importName = 'lodash'

    const regex1 = RegexCache.getMemberRegex(importName)
    const regex2 = RegexCache.getMemberRegex(importName)

    expect(regex1).toBeInstanceOf(RegExp)
    expect(regex2).toBeInstanceOf(RegExp)
    expect(regex1).toBe(regex2)
  })

  it('should create and cache destructured regex patterns', () => {
    const localName = 'map'

    const regex1 = RegexCache.getDestructuredRegex(localName)
    const regex2 = RegexCache.getDestructuredRegex(localName)

    expect(regex1).toBeInstanceOf(RegExp)
    expect(regex2).toBeInstanceOf(RegExp)
    expect(regex1).toBe(regex2)
  })

  it('should create different regex objects for different import names', () => {
    const name1 = 'lodash'
    const name2 = 'underscore'

    const regex1 = RegexCache.getMemberRegex(name1)
    const regex2 = RegexCache.getMemberRegex(name2)

    expect(regex1).not.toBe(regex2)
    expect(regex1.source).toContain(name1)
    expect(regex2.source).toContain(name2)
  })

  it('should create different regex objects for different local names', () => {
    const name1 = 'map'
    const name2 = 'filter'

    const regex1 = RegexCache.getDestructuredRegex(name1)
    const regex2 = RegexCache.getDestructuredRegex(name2)

    expect(regex1).not.toBe(regex2)
    expect(regex1.source).toContain(name1)
    expect(regex2.source).toContain(name2)
  })

  it('should handle special characters in import names', () => {
    const specialName = 'lodash-es'

    const regex = RegexCache.getMemberRegex(specialName)

    expect(regex).toBeInstanceOf(RegExp)
    expect(regex.source).toContain('lodash-es')
  })

  it('should handle complex local names', () => {
    const complexName = 'mapValues'

    const regex = RegexCache.getDestructuredRegex(complexName)

    expect(regex).toBeInstanceOf(RegExp)
    expect(regex.source).toContain(complexName)
  })

  it('should create functional regex patterns', () => {
    const memberRegex = RegexCache.getMemberRegex('_')
    const destructuredRegex = RegexCache.getDestructuredRegex('map')

    expect('_.map(data, fn)').toMatch(memberRegex)
    expect('_.filter(data, fn)').toMatch(memberRegex)

    expect('map(data, fn)').toMatch(destructuredRegex)
    expect('data.map(fn)').not.toMatch(destructuredRegex)
  })
})
