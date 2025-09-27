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
import { map, filter, first, last, groupBy, cloneDeep } from 'lodash-es'

// Basic array methods
const doubled = map([1, 2, 3], x => x * 2)
const evens = filter([1, 2, 3, 4], x => x % 2 === 0)

// Modern array access
const firstItem = first(items)
const lastItem = last(items)

// Advanced collection functions
const grouped = groupBy(users, 'department')
const copy = cloneDeep(complexObject)
```

Examples of **preferred native alternatives**:

```typescript
// Basic array methods - direct replacements
const doubled = [1, 2, 3].map(x => x * 2)
const evens = [1, 2, 3, 4].filter(x => x % 2 === 0)

// Modern ES2022 array access
const firstItem = items.at(0)
const lastItem = items.at(-1)

// Modern ES2024 collection functions
const grouped = Object.groupBy(users, user => user.department)
const copy = structuredClone(complexObject)
```

## Supported Native Alternatives (67+ Functions)

The rule provides suggestions for lodash functions that have native JavaScript equivalents, organized by category:

### Array Functions (25 functions)

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
| `lastIndexOf` | `Array.prototype.lastIndexOf` | Direct replacement |
| `flatten` | `Array.prototype.flat` | ES2019+ |
| `flatMap` | `Array.prototype.flatMap` | ES2019+ |
| `reduceRight` | `Array.prototype.reduceRight` | Direct replacement |
| `first` | `Array.prototype.at(0)` | ES2022+ |
| `head` | `Array.prototype.at(0)` | ES2022+ (alias for first) |
| `last` | `Array.prototype.at(-1)` | ES2022+ |
| `initial` | `Array.prototype.slice(0, -1)` | All except last element |
| `tail` | `Array.prototype.slice(1)` | All except first element |
| `uniq` | `[...new Set(array)]` | ES6 Set deduplication |
| `compact` | `array.filter(Boolean)` | Remove falsy values |
| `sortBy` | `array.toSorted((a, b) => fn(a) - fn(b))` | ES2023+ |
| `reverse` | `Array.prototype.reverse` | ⚠️ Mutates original array |
| `concat` | `Array.prototype.concat` | Direct replacement |
| `slice` | `Array.prototype.slice` | Direct replacement |
| `join` | `Array.prototype.join` | Direct replacement |
| `isArray` | `Array.isArray` | Static method |

### String Functions (12 functions)

| Lodash Function | Native Alternative | Notes |
|-----------------|-------------------|--------|
| `startsWith` | `String.prototype.startsWith` | Direct replacement |
| `endsWith` | `String.prototype.endsWith` | Direct replacement |
| `repeat` | `String.prototype.repeat` | Direct replacement |
| `trim` | `String.prototype.trim` | Direct replacement |
| `trimStart` | `String.prototype.trimStart` | Direct replacement |
| `trimEnd` | `String.prototype.trimEnd` | Direct replacement |
| `toLower` | `String.prototype.toLowerCase` | Direct replacement |
| `toUpper` | `String.prototype.toUpperCase` | Direct replacement |
| `replace` | `String.prototype.replace` | Direct replacement |
| `split` | `String.prototype.split` | Direct replacement |
| `padStart` | `String.prototype.padStart` | ES2017+ |
| `padEnd` | `String.prototype.padEnd` | ES2017+ |

### Object Functions (4 functions)

| Lodash Function | Native Alternative | Notes |
|-----------------|-------------------|--------|
| `keys` | `Object.keys` | ⚠️ Throws on null/undefined |
| `values` | `Object.values` | ⚠️ Throws on null/undefined |
| `entries` | `Object.entries` | ⚠️ Throws on null/undefined |
| `assign` | `Object.assign` | Direct replacement |

### Collection Functions (11 functions)

| Lodash Function | Native Alternative | Notes |
|-----------------|-------------------|--------|
| `reject` | `array.filter(item => !predicate(item))` | Inverse filter |
| `size` | `value.length` | For arrays/strings |
| `each` | `Array.prototype.forEach` | Alias for forEach |
| `partition` | `[array.filter(pred), array.filter(item => !pred(item))]` | Split into two arrays |
| `findLast` | `Array.prototype.findLast` | ES2023+ |
| `groupBy` | `Object.groupBy(array, fn)` | ES2024+ |
| `countBy` | `array.reduce((acc, item) => {...}, {})` | Reduce pattern |
| `keyBy` | `Object.fromEntries(array.map(...))` | Object creation |
| `chunk` | `Array.from({length: Math.ceil(len/size)}, ...)` | Array chunking |
| `orderBy` | `array.toSorted((a, b) => fn(a) - fn(b))` | ES2023+ |
| `isEmpty` | Various approaches | ⚠️ Complex, no single native equivalent |

### Type Checking Functions (11 functions)

| Lodash Function | Native Alternative | Notes |
|-----------------|-------------------|--------|
| `isString` | `typeof value === "string"` | Type checking |
| `isNumber` | `typeof value === "number"` | Type checking |
| `isBoolean` | `typeof value === "boolean"` | Type checking |
| `isFunction` | `typeof value === "function"` | Type checking |
| `isObject` | `typeof value === "object" && value !== null` | Type checking |
| `isNull` | `value === null` | Direct comparison |
| `isUndefined` | `value === undefined` | Direct comparison |
| `isNil` | `value == null` | Null or undefined |
| `isArray` | `Array.isArray(value)` | Static method |
| `toString` | `value.toString()` | ⚠️ May fail on null/undefined |
| `toNumber` | `Number(value)` | Constructor call |

### Math/Number Functions (8 functions)

| Lodash Function | Native Alternative | Notes |
|-----------------|-------------------|--------|
| `isFinite` | `Number.isFinite` | Static method |
| `isInteger` | `Number.isInteger` | Static method |
| `isNaN` | `Number.isNaN` | Static method |
| `max` | `Math.max(...array)` | ⚠️ Use spread operator |
| `min` | `Math.min(...array)` | ⚠️ Use spread operator |
| `ceil` | `Math.ceil` | Direct replacement |
| `floor` | `Math.floor` | Direct replacement |
| `round` | `Math.round` | Direct replacement |

### Advanced Functions (8 functions)

| Lodash Function | Native Alternative | Notes |
|-----------------|-------------------|--------|
| `has` | `key in object` | Expression alternative |
| `pick` | `Object.fromEntries(keys.map(k => [k, obj[k]]))` | Object manipulation |
| `omit` | `Object.fromEntries(Object.entries(obj).filter(...))` | Object manipulation |
| `merge` | `Object.assign({}, ...)` | Deep merge pattern |
| `get` | `obj?.prop?.path` | Optional chaining |
| `clone` | `{...obj}` | Shallow clone |
| `cloneDeep` | `structuredClone(obj)` | Native deep clone |
| `now` | `Date.now()` | Static method |

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
