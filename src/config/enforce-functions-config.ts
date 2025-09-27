/**
 * Ultra-elegant configuration class for enforce-functions rule
 * Simplifies rule logic and improves maintainability
 */
import type { EnforceFunctionsRuleOptions, LodashFunctionName } from '../types'
import { nativeAlternatives } from '../constants'

export class EnforceFunctionsConfig {
  private readonly options: EnforceFunctionsRuleOptions

  constructor(options: EnforceFunctionsRuleOptions = {}) {
    this.options = options
    this.validate()
  }

  /**
   * Validate configuration options
   * @throws Error if both include and exclude are specified
   */
  private validate(): void {
    if (this.options.include && this.options.exclude) {
      throw new Error('Cannot specify both "include" and "exclude" options. Use only one.')
    }
  }

  /**
   * Check if a function should be blocked/flagged
   * @param functionName The lodash function name to check
   * @returns True if the function should be blocked
   */
  isBlocked(functionName: LodashFunctionName): boolean {
    // Include mode: only specified functions are allowed
    if (this.options.include) {
      return !this.options.include.includes(functionName)
    }

    // Exclude mode: specified functions are blocked
    if (this.options.exclude) {
      return this.options.exclude.includes(functionName)
    }

    // No configuration: allow all functions
    return false
  }

  /**
   * Check if a function is allowed/should be processed
   * @param functionName The lodash function name to check
   * @returns True if the function should be processed
   */
  isAllowed(functionName: LodashFunctionName): boolean {
    return !this.isBlocked(functionName)
  }

  /**
   * Get human-readable reason for blocking
   * @returns Descriptive reason string
   */
  getReason(): string {
    if (this.options.exclude) {
      return 'excluded by configuration'
    }

    if (this.options.include) {
      return 'not in the allowed functions list'
    }

    return 'blocked by default configuration'
  }

  /**
   * Check if any functions are configured to be blocked
   * @returns True if configuration will block any functions
   */
  hasBlockingRules(): boolean {
    return Boolean(this.options.include || this.options.exclude)
  }

  /**
   * Get list of specifically allowed functions (for include mode)
   * @returns Array of allowed function names or null if not in include mode
   */
  getAllowedFunctions(): LodashFunctionName[] | null {
    return this.options.include ? [...this.options.include] : null
  }

  /**
   * Get list of specifically blocked functions (for exclude mode)
   * @returns Array of blocked function names or null if not in exclude mode
   */
  getBlockedFunctions(): LodashFunctionName[] | null {
    return this.options.exclude ? [...this.options.exclude] : null
  }

  /**
   * Get configuration mode description
   * @returns String describing the current configuration mode
   */
  getMode(): 'include' | 'exclude' | 'permissive' {
    if (this.options.include) return 'include'
    if (this.options.exclude) return 'exclude'
    return 'permissive'
  }

  /**
   * Create a debug-friendly representation of the configuration
   * @returns Object with configuration details for debugging
   */
  getDebugInfo(): {
    mode: string
    allowedCount: number | null
    blockedCount: number | null
    hasRules: boolean
  } {
    return {
      mode: this.getMode(),
      allowedCount: this.options.include?.length ?? null,
      blockedCount: this.options.exclude?.length ?? null,
      hasRules: this.hasBlockingRules(),
    }
  }

  /**
   * Create configuration from raw ESLint rule options
   * @param rawOptions Raw options from ESLint context
   * @returns New EnforceFunctionsConfig instance
   */
  static fromRuleOptions(rawOptions: unknown): EnforceFunctionsConfig {
    // Handle case where no options are provided
    if (!rawOptions || typeof rawOptions !== 'object') {
      return new EnforceFunctionsConfig({})
    }

    // Type assertion after validation
    const options = rawOptions as EnforceFunctionsRuleOptions
    return new EnforceFunctionsConfig(options)
  }

  /**
   * Create a permissive configuration (allows all functions)
   * @returns Configuration that doesn't block any functions
   */
  static createPermissive(): EnforceFunctionsConfig {
    return new EnforceFunctionsConfig({})
  }

  /**
   * Create an include-only configuration
   * @param allowedFunctions Functions to allow
   * @returns Configuration that only allows specified functions
   */
  static createIncludeOnly(allowedFunctions: LodashFunctionName[]): EnforceFunctionsConfig {
    return new EnforceFunctionsConfig({ include: allowedFunctions })
  }

  /**
   * Create an exclude-only configuration
   * @param blockedFunctions Functions to block
   * @returns Configuration that blocks specified functions
   */
  static createExcludeOnly(blockedFunctions: LodashFunctionName[]): EnforceFunctionsConfig {
    return new EnforceFunctionsConfig({ exclude: blockedFunctions })
  }

  /**
   * Create configuration that includes all functions with native alternatives
   * @param excludeUnsafe Whether to exclude unsafe alternatives
   * @returns Configuration for suggest-native-alternatives rule
   */
  static createForNativeAlternatives(excludeUnsafe = true): EnforceFunctionsConfig {
    let functionsWithAlternatives = Array.from(nativeAlternatives.keys()) as LodashFunctionName[]

    // Filter out unsafe alternatives if requested
    if (excludeUnsafe) {
      functionsWithAlternatives = functionsWithAlternatives.filter((functionName) => {
        const alternative = nativeAlternatives.get(functionName)
        return !alternative?.excludeByDefault
      })
    }

    return new EnforceFunctionsConfig({ include: functionsWithAlternatives })
  }
}
