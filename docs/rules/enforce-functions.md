# enforce-functions

Enforce specific lodash-es function usage policies based on include/exclude configuration.

| | |
|:---|:---|
| **Rule type** | problem |
| **Fixable** | No |
| **Recommended** | No |

## Rule Details

This rule allows you to control which lodash functions are allowed in your codebase. You can either specify which functions to include (allowlist) or which functions to exclude (blocklist).

**Note**: You cannot use both `include` and `exclude` options together. Use one or the other.

Examples of **incorrect** code for this rule:

```typescript
// Configuration: { "exclude": ["forEach", "map"] }
import { forEach, map, filter } from 'lodash-es'

forEach(items, callback) // ❌ forEach is excluded
map(items, mapper)       // ❌ map is excluded  
filter(items, predicate) // ✅ filter is allowed
```

```typescript
// Configuration: { "include": ["map", "filter"] }
import { map, filter, reduce } from 'lodash-es'

map(items, mapper)       // ✅ map is included
filter(items, predicate) // ✅ filter is included
reduce(items, reducer)   // ❌ reduce is not included
```

Examples of **correct** code for this rule:

```typescript
// Configuration: { "exclude": ["forEach"] }
import { map, filter } from 'lodash-es'

map(items, mapper)       // ✅ map is not excluded
filter(items, predicate) // ✅ filter is not excluded
```

## Options

This rule accepts an options object with the following properties:

- `include` (array of strings): List of lodash functions to allow. If provided, only these functions are permitted.
- `exclude` (array of strings): List of lodash functions to disallow/block.

### exclude

Examples of **incorrect** code for the `exclude` option:

```typescript
/* eslint lodash-es/enforce-functions: ["error", { "exclude": ["forEach", "map"] }] */
import { forEach, map } from 'lodash-es'

forEach(items, callback) // ❌ forEach is excluded
map(items, mapper)       // ❌ map is excluded
```

Examples of **correct** code for the `exclude` option:

```typescript
/* eslint lodash-es/enforce-functions: ["error", { "exclude": ["forEach"] }] */
import { map, filter } from 'lodash-es'

map(items, mapper)       // ✅ map is not excluded
filter(items, predicate) // ✅ filter is not excluded
```

### include

Examples of **incorrect** code for the `include` option:

```typescript
/* eslint lodash-es/enforce-functions: ["error", { "include": ["map", "filter"] }] */
import { map, filter, reduce } from 'lodash-es'

reduce(items, reducer)   // ❌ reduce is not included
```

Examples of **correct** code for the `include` option:

```typescript
/* eslint lodash-es/enforce-functions: ["error", { "include": ["map", "filter"] }] */
import { map, filter } from 'lodash-es'

map(items, mapper)       // ✅ map is included
filter(items, predicate) // ✅ filter is included
```

## Use Cases

### Performance-focused teams

Exclude functions with performance implications:

```json
{
  "lodash-es/enforce-functions": ["error", {
    "exclude": ["forEach", "forEachRight", "forIn", "forInRight"]
  }]
}
```

### Functional programming style

Include only functional programming utilities:

```json
{
  "lodash-es/enforce-functions": ["error", {
    "include": [
      "map", "filter", "reduce", "find", "some", "every",
      "flatten", "flatMap", "uniq", "groupBy", "keyBy"
    ]
  }]
}
```

### Gradual migration

Exclude functions that have native alternatives:

```json
{
  "lodash-es/enforce-functions": ["error", {
    "exclude": ["forEach", "map", "filter", "find", "some", "every"]
  }]
}
```

## Enhanced Error Messages

This rule provides enhanced error messages that include native alternatives when available:

```
Lodash function 'forEach' is excluded by configuration. Consider using native Array.prototype.forEach: array.forEach(callback)
```

## When Not To Use It

You might want to disable this rule if:

- You want to allow all lodash functions without restrictions
- You're in early development and haven't decided on function policies yet
- You're migrating from another lodash plugin and need flexibility

## Related Rules

- [enforce-destructuring](./enforce-destructuring.md) - Enforce destructured imports
- [suggest-native-alternatives](./suggest-native-alternatives.md) - Suggests native JavaScript alternatives

## Version

This rule was introduced in eslint-plugin-lodash-es v0.1.0.

## Resources

- [Rule source](../../src/rules/enforce-functions.ts)
- [Test source](../../tests/enforce-functions.test.ts)