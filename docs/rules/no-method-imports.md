# no-method-imports

Prevent deprecated per-method lodash imports that bypass tree-shaking and will be removed in lodash v5.

| | |
|:---|:---|
| **Rule type** | problem |
| **Fixable** | 🔧 Yes |
| **Recommended** | ✅ Yes |

## Rule Details

This rule prevents the use of deprecated per-method lodash imports such as `import map from 'lodash/map'`. These import patterns bypass ESLint rules, prevent proper tree-shaking, and will be removed in lodash v5.

Examples of **incorrect** code for this rule:

```typescript
// ❌ Per-method imports from lodash/function
import map from 'lodash/map'
import filter from 'lodash/filter'
import reduce from 'lodash/reduce'

const result = map([1, 2, 3], x => x * 2)
```

```typescript
// ❌ Per-method imports from lodash.function packages
import map from 'lodash.map'
import isEmpty from 'lodash.isempty'

const doubled = map([1, 2, 3], x => x * 2)
const empty = isEmpty([])
```

```typescript
// ❌ Per-method imports from lodash/fp/function
import map from 'lodash/fp/map'
import curry from 'lodash/fp/curry'

const double = map(x => x * 2)
```

```typescript
// ❌ Invalid function names
import invalidFunction from 'lodash/invalidFunction'
import notAFunction from 'lodash/notAFunction'
```

Examples of **correct** code for this rule:

```typescript
// ✅ Use destructured imports from lodash-es
import { map, filter, reduce } from 'lodash-es'

const doubled = map([1, 2, 3], x => x * 2)
const evens = filter([1, 2, 3, 4], x => x % 2 === 0)
const sum = reduce([1, 2, 3], (acc, val) => acc + val, 0)
```

```typescript
// ✅ Use default or namespace imports (handled by other rules)
import _ from 'lodash-es'
import * as lodash from 'lodash-es'

const result = _.map([1, 2, 3], x => x * 2)
```

## Why This Rule Exists

Per-method imports create several critical problems:

### 1. **Bypass ESLint Rules**

Per-method imports circumvent other lodash-es plugin rules:

```typescript
// This bypasses enforce-destructuring rule
import map from 'lodash/map'  // ❌ Undetected by other rules
import _ from 'lodash-es'      // ✅ Caught by enforce-destructuring
```

### 2. **Removal in Lodash v5**

The lodash team plans to remove per-method packages in v5:

> "Per-method packages like lodash.map will be discontinued in v5 in favor of better tree-shaking support"

### 3. **Inconsistent Bundle Behavior**

Per-method imports may not tree-shake properly:

```typescript
// ❌ May import entire lodash internally
import map from 'lodash/map'

// ✅ Guaranteed tree-shaking with proper bundler
import { map } from 'lodash-es'
```

### 4. **Maintenance Issues**

Mixed import patterns create maintenance headaches:

```typescript
// ❌ Inconsistent patterns
import map from 'lodash/map'           // Per-method
import { filter } from 'lodash-es'     // Destructured
import _ from 'lodash-es'              // Default
```

## Auto-Fixing

This rule provides powerful auto-fixing capabilities:

### Single Import Conversion

Before:

```typescript
import map from 'lodash/map'
```

After auto-fix:

```typescript
import { map } from 'lodash-es'
```

### Multiple Import Consolidation

Before:

```typescript
import map from 'lodash/map'
import filter from 'lodash/filter'
import reduce from 'lodash/reduce'
```

After auto-fix:

```typescript
import { map, filter, reduce } from 'lodash-es'
```

### Mixed Valid/Invalid Functions

Before:

```typescript
import map from 'lodash/map'           // Valid function
import invalidFunc from 'lodash/invalidFunc'  // Invalid function
```

After auto-fix:

```typescript
import { map } from 'lodash-es'
// invalidFunc import removed - error reported separately
```

## Detected Patterns

This rule detects and flags these import patterns:

| Pattern | Example | Status |
|---------|---------|--------|
| `lodash/function` | `import map from 'lodash/map'` | ❌ Deprecated |
| `lodash.function` | `import map from 'lodash.map'` | ❌ Deprecated |
| `lodash/fp/function` | `import map from 'lodash/fp/map'` | ❌ Deprecated |

## Error Messages

### Valid Functions

For valid lodash functions:

```text
Per-method lodash imports are deprecated and will be removed in v5. Use destructured imports from lodash-es instead.
```

### Invalid Functions

For invalid function names:

```text
Invalid lodash function "invalidFunction" in per-method import.
```

### Consolidation Suggestion

For multiple per-method imports:

```text
Replace with: import { map, filter, reduce } from 'lodash-es'
```

## Migration Guide

### Step 1: Identify Per-Method Imports

Run the rule to find all per-method imports in your codebase.

### Step 2: Use Auto-Fix

Run ESLint with `--fix` to automatically convert simple cases:

```bash
eslint --fix src/
```

### Step 3: Manual Review

Review the changes, especially for:

- Complex import structures
- Mixed lodash versions
- Custom utility functions

### Step 4: Test

Ensure your application works correctly after the conversion.

### Step 5: Update Dependencies

Remove individual lodash packages from package.json:

```bash
npm uninstall lodash.map lodash.filter lodash.reduce
```

## Integration with Other Rules

This rule works seamlessly with other lodash-es plugin rules:

```javascript
// eslint.config.js
export default [
  {
    rules: {
      'lodash-es/no-method-imports': 'error',        // Prevent per-method imports
      'lodash-es/enforce-destructuring': 'error',   // Enforce destructured imports
      'lodash-es/enforce-functions': 'warn',         // Control allowed functions
      'lodash-es/suggest-native-alternatives': 'info' // Suggest native alternatives
    }
  }
]
```

## Performance Impact

Converting per-method imports typically provides:

- **Consistent tree-shaking** across all bundlers
- **Better code splitting** with modern bundlers  
- **Reduced package.json complexity** - fewer dependencies to manage
- **Future compatibility** with lodash v5

## When Not To Use It

You might want to disable this rule if:

- You're using lodash v4 and don't plan to upgrade to v5
- You have a complex build system that specifically relies on per-method packages
- You're in the middle of a large migration and need to disable temporarily
- You're using a bundler that specifically optimizes per-method imports

## Edge Cases

### Aliased Imports

The rule handles aliased imports:

```typescript
import customMap from 'lodash/map'  // ❌ Still flagged
```

### TypeScript

Works seamlessly with TypeScript:

```typescript
import map from 'lodash/map'
const result: number[] = map([1, 2, 3], (x: number) => x * 2)  // ❌ Flagged
```

### Namespace Conflicts

Handles namespace conflicts gracefully:

```typescript
// Before
import map from 'lodash/map'
import filter from 'lodash/filter'

// After auto-fix
import { map, filter } from 'lodash-es'
```

## Related Rules

- [enforce-destructuring](./enforce-destructuring.md) - Enforce optimal import patterns
- [no-chaining](./no-chaining.md) - Prevent tree-shaking issues with chain()
- [enforce-functions](./enforce-functions.md) - Control which functions are allowed
- [suggest-native-alternatives](./suggest-native-alternatives.md) - Consider native alternatives

## Version

This rule was introduced in eslint-plugin-lodash-es v0.3.0.

## Resources

- [Rule source](../../src/rules/no-method-imports.ts)
- [Test source](../../tests/no-method-imports.test.ts)
- [Lodash v5 Migration Guide](https://github.com/lodash/lodash/wiki/Roadmap)
