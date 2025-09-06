# suggest-native-alternatives

Suggest native JavaScript alternatives to lodash functions when available.

| | |
|:---|:---|
| **Rule type** | suggestion |
| **Fixable** | No |
| **Recommended** | No |

## Rule Details

This rule suggests native JavaScript alternatives for lodash functions that have equivalent native implementations. It helps teams migrate away from lodash by highlighting where native JavaScript can be used instead.

Examples of code that **triggers suggestions** for this rule:

```typescript
import { map, filter, find, forEach } from 'lodash-es'

// Suggests: Consider using native 'array.map(callback)' instead of lodash 'map'
const doubled = map([1, 2, 3], x => x * 2)

// Suggests: Consider using native 'array.filter(predicate)' instead of lodash 'filter'  
const evens = filter([1, 2, 3, 4], x => x % 2 === 0)

// Suggests: Consider using native 'array.find(predicate)' instead of lodash 'find'
const found = find([1, 2, 3], x => x > 2)

// Suggests: Consider using native 'array.forEach(callback)' instead of lodash 'forEach'
forEach([1, 2, 3], console.log)
```

Examples of **preferred native alternatives**:

```typescript
// Using native alternatives
const doubled = [1, 2, 3].map(x => x * 2)
const evens = [1, 2, 3, 4].filter(x => x % 2 === 0)  
const found = [1, 2, 3].find(x => x > 2)
[1, 2, 3].forEach(console.log)
```

## Supported Native Alternatives

The rule includes suggestions for lodash functions that have native JavaScript equivalents:

| Lodash Function | Native Alternative | Notes |
|-----------------|-------------------|--------|
| `map` | `Array.prototype.map` | Direct replacement |
| `filter` | `Array.prototype.filter` | Direct replacement |
| `find` | `Array.prototype.find` | Direct replacement |
| `forEach` | `Array.prototype.forEach` | Direct replacement |
| `some` | `Array.prototype.some` | Direct replacement |
| `every` | `Array.prototype.every` | Direct replacement |
| `reduce` | `Array.prototype.reduce` | Direct replacement |
| `includes` | `Array.prototype.includes` | Direct replacement |
| `indexOf` | `Array.prototype.indexOf` | Direct replacement |
| `reverse` | `Array.prototype.reverse` | Mutates original array |
| `concat` | `Array.prototype.concat` | Direct replacement |
| `slice` | `Array.prototype.slice` | Direct replacement |
| `join` | `Array.prototype.join` | Direct replacement |
| `keys` | `Object.keys` | For objects |
| `values` | `Object.values` | For objects |
| `assign` | `Object.assign` | For objects |

## Options

This rule accepts an options object with the following properties:

- `includeAll` (boolean): Include all alternatives, even if they're not perfect replacements. Default: `false`
- `excludeUnsafe` (boolean): Exclude alternatives that have different behavior from lodash. Default: `true`

### excludeUnsafe

Examples with `excludeUnsafe: true` (default):

```typescript
/* eslint lodash-es/suggest-native-alternatives: ["warn", { "excludeUnsafe": true }] */
import { reverse } from 'lodash-es'

reverse(array) // No suggestion - lodash reverse doesn't mutate, native reverse does
```

Examples with `excludeUnsafe: false`:

```typescript
/* eslint lodash-es/suggest-native-alternatives: ["warn", { "excludeUnsafe": false }] */
import { reverse } from 'lodash-es'

reverse(array) // Suggests native reverse with warning about mutation
```

### includeAll

Examples with `includeAll: true`:

```typescript
/* eslint lodash-es/suggest-native-alternatives: ["warn", { "includeAll": true }] */
import { padStart } from 'lodash-es'

padStart(str, 10) // Suggests native String.prototype.padStart even if slightly different
```

## Enhanced Messages

The rule provides detailed messages with examples:

```text
Consider using native 'array.map(callback)' instead of lodash 'map'. Maps each element to a new value using a callback function.
```

For functions with behavioral differences:

```text
Consider using native 'array.reverse()' instead of lodash 'reverse'. Reverses array elements in place. Note: Native reverse mutates the original array.
```

## Benefits

Using native alternatives provides several advantages:

- **Bundle size reduction**: Remove lodash dependencies where possible
- **Performance**: Native methods are often faster
- **Standards compliance**: Use established JavaScript APIs
- **Future-proofing**: Native methods receive browser optimizations

## Migration Strategy

1. Start with `"warn"` level to identify opportunities
2. Use default configuration to focus on safe replacements
3. Gradually replace lodash functions with native alternatives
4. Use `includeAll: true` for comprehensive migration

## When Not To Use It

You might want to disable this rule if:

- You prefer lodash's consistent API across all functions
- You're working with legacy browsers that don't support native methods
- Your team has decided to stick with lodash for consistency
- You're in the middle of adding lodash and don't want migration suggestions yet

## Related Rules

- [enforce-destructuring](./enforce-destructuring.md) - Enforce destructured imports  
- [enforce-functions](./enforce-functions.md) - Control which lodash functions are allowed

## Version

This rule was introduced in eslint-plugin-lodash-es v0.1.0.

## Resources

- [Rule source](../../src/rules/suggest-native-alternatives.ts)
- [Test source](../../tests/suggest-native-alternatives.test.ts)
