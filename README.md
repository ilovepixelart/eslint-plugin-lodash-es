# eslint-plugin-lodash-es

[![npm](https://img.shields.io/npm/v/eslint-plugin-lodash-es)](https://www.npmjs.com/package/eslint-plugin-lodash-es)
[![npm](https://img.shields.io/npm/dt/eslint-plugin-lodash-es)](https://www.npmjs.com/package/eslint-plugin-lodash-es)
[![GitHub](https://img.shields.io/github/license/ilovepixelart/eslint-plugin-lodash-es)](https://github.com/ilovepixelart/eslint-plugin-lodash-es/blob/main/LICENSE)
\
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ilovepixelart_eslint-plugin-lodash-es&metric=coverage)](https://sonarcloud.io/summary/new_code?id=ilovepixelart_eslint-plugin-lodash-es)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ilovepixelart_eslint-plugin-lodash-es&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ilovepixelart_eslint-plugin-lodash-es)
\
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=ilovepixelart_eslint-plugin-lodash-es&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=ilovepixelart_eslint-plugin-lodash-es)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ilovepixelart_eslint-plugin-lodash-es&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=ilovepixelart_eslint-plugin-lodash-es)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ilovepixelart_eslint-plugin-lodash-es&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=ilovepixelart_eslint-plugin-lodash-es)

ESLint plugin that enforces destructured imports from lodash-es with auto-fixing and provides configurable function usage policies.

**Key Benefits:**

- 🔧 Auto-fixes imports for better tree-shaking
- 📦 Reduces bundle size significantly
- 🛡️ Configurable function usage policies
- 💡 Intelligent suggestions for native alternatives
- 📝 Full TypeScript support

## Installation

```bash
npm install -D eslint-plugin-lodash-es
```

## Usage

### Flat config

```javascript
// eslint.config.js (ESLint 9+)
import eslintPluginLodashEs from 'eslint-plugin-lodash-es'

export default [
  ...eslintPluginLodashEs.configs.recommended
]
```

### Define config

```javascript
import { defineConfig } from 'eslint/config'

// Base
import globals from 'globals'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
// Plugins
import eslintPluginStylistic from '@stylistic/eslint-plugin'
import eslintPluginLodashEs from 'eslint-plugin-lodash-es'

export default defineConfig(
  {
    ignores: ['dist/', 'node_modules/', 'coverage/'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser, // or globals.node
      },
    },
  },
  //Base
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  // Plugins
  eslintPluginStylistic.configs.recommended,
  eslintPluginLodashEs.configs.recommended
)

```

### Manual Configuration

```javascript
// eslint.config.js (ESLint 9+)
export default [
  {
    plugins: { 'lodash-es': eslintPluginLodashEs },
    rules: {
      'lodash-es/enforce-destructuring': 'error',
      'lodash-es/no-chaining': 'error',
      'lodash-es/no-method-imports': 'error',
      'lodash-es/enforce-functions': ['error', { exclude: ['forEach'] }],
      'lodash-es/suggest-native-alternatives': 'warn',
    }
  }
]
```

### Legacy Config (ESLint 8)

```javascript
// .eslintrc.js
module.exports = {
  extends: ['plugin:lodash-es/recommended-legacy']
}
```

## What it does

### 1. Enforces Destructured Imports

Transforms this:

```typescript
import _ from 'lodash-es'
const result = _.first([1, 2, 3])
```

Into this (automatically):

```typescript
import { first } from 'lodash-es'
const result = first([1, 2, 3])
```

### 2. Transforms to Native JavaScript

Transforms this:

```typescript
import { map, first, groupBy } from 'lodash-es'

const doubled = map([1, 2, 3], x => x * 2)
const firstItem = first(items)
const grouped = groupBy(users, 'department')
```

Into this (automatically):

```typescript
import { map, first, groupBy } from 'lodash-es'

const doubled = [1, 2, 3].map(x => x * 2)
const firstItem = items.at(0)
const grouped = Object.groupBy(users, user => user.department)
```

**Supports 67+ lodash functions** with automatic transformation to modern JavaScript equivalents, including ES2022+ features like `Array.at()` and `Object.groupBy()`.

## Rules

| Rule | Description | 💡 | 🔧 | ✅ |
|------|-------------|:--:|:--:|:--:|
| [enforce-destructuring](./docs/rules/enforce-destructuring.md) | Enforce destructured imports from lodash-es | | 🔧 | ✅ |
| [no-chaining](./docs/rules/no-chaining.md) | Prevent chaining that kills tree-shaking | 💡 | 🔧 | ✅ |
| [no-method-imports](./docs/rules/no-method-imports.md) | Prevent deprecated per-method imports | 💡 | 🔧 | ✅ |
| [enforce-functions](./docs/rules/enforce-functions.md) | Transform lodash functions to native JavaScript | 💡 | 🔧 | |
| [suggest-native-alternatives](./docs/rules/suggest-native-alternatives.md) | Suggest native JavaScript alternatives | 💡 | 🔧 | |

**Legend:** 💡 Suggestions • 🔧 Auto-fixable • ✅ Recommended

## Why Use This?

**Bundle Size:** Reduces bundle from ~70KB (full lodash-es) to ~1KB per function

**Better Tree Shaking:** Modern bundlers eliminate unused code more effectively

**Team Standards:** Enforce consistent lodash usage across your codebase

## Documentation

See [detailed rule documentation](./docs/rules/) for configuration options and examples.

## Contributing

Contributions welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.
