import enforceDestructuring from './rules/enforce-destructuring'
import enforceFunctions from './rules/enforce-functions'
import suggestNativeAlternatives from './rules/suggest-native-alternatives'
import noChaining from './rules/no-chaining'
import noMethodImports from './rules/no-method-imports'

import type { ESLintPlugin, FlatConfig } from './types'

// Plugin export for ESLint
const plugin: ESLintPlugin = {
  rules: {
    'enforce-destructuring': enforceDestructuring,
    'no-chaining': noChaining,
    'no-method-imports': noMethodImports,
    'enforce-functions': enforceFunctions,
    'suggest-native-alternatives': suggestNativeAlternatives,
  },
  configs: {
    'base': [],
    'recommended': [],
    'all': [],
    'recommended-legacy': {
      plugins: [],
      rules: {},
    },
  },
}

// Create flat config objects (following TypeScript ESLint approach)
const baseConfig: FlatConfig = {
  name: 'lodash-es/base',
  plugins: {
    'lodash-es': plugin,
  },
}

const recommendedConfig: FlatConfig = {
  name: 'lodash-es/recommended',
  ...baseConfig,
  rules: {
    'lodash-es/enforce-destructuring': 'error',
    'lodash-es/no-chaining': 'error',
    'lodash-es/no-method-imports': 'error',
  },
}

const allConfig: FlatConfig = {
  name: 'lodash-es/all',
  ...baseConfig,
  rules: {
    'lodash-es/enforce-destructuring': 'error',
    'lodash-es/no-chaining': 'error',
    'lodash-es/no-method-imports': 'error',
    'lodash-es/enforce-functions': 'off', // Users must configure manually
    'lodash-es/suggest-native-alternatives': 'off', // Users must configure manually
  },
}

// Following TypeScript ESLint standard approach - configs return arrays
plugin.configs = {
  // Modern flat config arrays (ESLint 9+) - following typescript-eslint approach
  'base': [baseConfig],
  'recommended': [recommendedConfig],
  'all': [allConfig],

  // Legacy config for ESLint 8 and below
  'recommended-legacy': {
    plugins: ['lodash-es'],
    rules: {
      'lodash-es/enforce-destructuring': 'error',
      'lodash-es/no-chaining': 'error',
      'lodash-es/no-method-imports': 'error',
    },
  },
}

export default plugin
