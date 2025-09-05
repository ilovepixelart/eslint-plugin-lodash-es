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

ESLint plugin that enforces destructured imports from lodash-es and automatically fixes them.

## Features

- 🔧 **Auto-fixable**: Automatically converts default/namespace imports to destructured imports
- 📦 **Tree-shaking friendly**: Promotes better tree-shaking with lodash-es
- 🚀 **Performance**: Reduces bundle size by importing only used functions
- 🎯 **Smart detection**: Analyzes code to detect used lodash functions
- ✨ **Zero config**: Works out of the box with sensible defaults

## Installation

```bash
pnpm install -D eslint-plugin-lodash-es
```

```bash
npm install -D eslint-plugin-lodash-es
```

```bash
yarn add -D eslint-plugin-lodash-es
```

## Usage

### ESLint Configuration

#### ESLint 9+ (Flat Config) - Recommended

Following the official TypeScript ESLint standard approach:

```js
// eslint.config.js (ESLint 9+)
import eslintPluginLodashEs from 'eslint-plugin-lodash-es';

export default [
  // Other config objects...
  
  // Standard approach (like typescript-eslint)
  ...eslintPluginLodashEs.configs.recommended,
  
  // Or apply to specific files
  {
    files: ['src/**/*.{js,ts}'],
    ...eslintPluginLodashEs.configs.recommended[0],
  },
];
```

#### Manual Configuration

```js
// eslint.config.js (ESLint 9+)
import eslintPluginLodashEs from 'eslint-plugin-lodash-es';

export default [
  {
    plugins: {
      'lodash-es': eslintPluginLodashEs,
    },
    rules: {
      'lodash-es/enforce-destructuring': 'error',
    },
  },
];
```

#### ESLint 8 and Below (Legacy Config)

```js
// .eslintrc.js (ESLint 8 and below)
module.exports = {
  plugins: ['lodash-es'],
  rules: {
    'lodash-es/enforce-destructuring': 'error',
  },
  
  // Or use the legacy recommended preset
  extends: ['plugin:lodash-es/recommended-legacy'],
};
```

## Examples

### ❌ Before (will be auto-fixed)

```js
import _ from 'lodash-es';
import * as lodash from 'lodash-es';

const result = _.first([1, 2, 3]);
const mapped = _.map(users, 'name');
const filtered = lodash.filter(items, item => item.active);
```

### ✅ After (auto-fixed)

```js
import { first, map, filter } from 'lodash-es';

const result = first([1, 2, 3]);
const mapped = map(users, 'name');
const filtered = filter(items, item => item.active);
```

## Rule: enforce-destructuring

This rule enforces the use of destructured imports from lodash-es instead of default or namespace imports.

### Rule Options

This rule has no options.

### What it does

1. **Detects** default imports (`import _ from 'lodash-es'`) and namespace imports (`import * as _ from 'lodash-es'`)
2. **Analyzes** your code to find which lodash functions you actually use
3. **Auto-fixes** by:
   - Replacing the import statement with destructured imports
   - Updating all usage sites to use the destructured functions
   - Removing the import entirely if no lodash functions are detected

## Benefits

### Bundle Size Reduction

**Before** (entire lodash-es imported):

```typescript
import _ from 'lodash-es';
const result = _.first([1, 2, 3]);
// Bundle includes entire lodash-es library (~70KB)
```

**After** (only specific function imported):

```typescript
import { first } from 'lodash-es';
const result = first([1, 2, 3]);
// Bundle includes only the first function (~1KB)
```

### Better Tree Shaking

Modern bundlers like Webpack, Vite, and Rollup can eliminate unused code more effectively with destructured imports.

### Improved Developer Experience

- **IntelliSense**: Better autocomplete and type information
- **Explicit dependencies**: Easier to see which lodash functions are used
- **Reduced cognitive load**: No need to remember the lodash namespace

## Configuration Options

The plugin provides multiple configuration presets:

### Modern Configs (ESLint 9+)

Following TypeScript ESLint standard approach - all configs return arrays:

- **`configs.base`**: Includes just the plugin, no rules enabled
- **`configs.recommended`**: Enables `enforce-destructuring` rule as error  
- **`configs.all`**: Currently same as recommended (for future expansion)

### Legacy Configs (ESLint 8 and below)

- **`configs.recommended-legacy`**: Legacy format for ESLint 8 and below

Example usage:

```js
import eslintPluginLodashEs from 'eslint-plugin-lodash-es';

export default [
  // Just the plugin (manual rule configuration)  
  ...eslintPluginLodashEs.configs.base,
  
  // Recommended rules (standard approach)
  ...eslintPluginLodashEs.configs.recommended,
  
  // All rules (currently same as recommended)
  ...eslintPluginLodashEs.configs.all,
];
```

## Development

### Scripts

```bash
# Clean build directory
npm run clean

# Build the package
npm run build

# Type check
npm run type:check

# Run tests with coverage
npm run test

# Run tests with coverage and open browser
npm run test:open

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### Testing

The package includes comprehensive tests using Vitest and ESLint's RuleTester:

```bash
npm test
```

### Local Development

To test the plugin locally in another project:

```bash
# In the plugin directory
npm link

# In your project directory
npm link eslint-plugin-lodash-es
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need for better lodash-es tree shaking
- Built with ESLint's powerful rule engine
- Uses pkgroll for modern TypeScript builds
