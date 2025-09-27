# enforce-functions

Automatically transform lodash functions to their native JavaScript equivalents with optional include/exclude policies.

| | |
|:---|:---|
| **Rule type** | problem |
| **Fixable** | Yes |
| **Recommended** | No |

## Rule Details

This rule automatically transforms lodash function calls to their native JavaScript equivalents, providing modern, performant alternatives. It supports 67+ lodash functions with comprehensive autofix capabilities including ES2022+ features.

**Primary Features:**

- 🔧 **Automatic transformation** to native JavaScript
- 📦 **Bundle size reduction** by eliminating lodash dependencies
- 🚀 **Modern JavaScript** support (ES2022 Array.at(), ES2024 Object.groupBy())
- ⚙️ **Configurable policies** via include/exclude options

**Note**: You cannot use both `include` and `exclude` options together. Use one or the other.

## Automatic Transformations

The rule automatically transforms lodash functions to their native equivalents:

### Array Functions

```typescript
// Before (lodash)
import { map, filter, first, last } from 'lodash-es'

const doubled = map([1, 2, 3], x => x * 2)
const evens = filter([1, 2, 3, 4], x => x % 2 === 0)
const firstItem = first(items)
const lastItem = last(items)

// After (native - automatic transformation)
import { map, filter, first, last } from 'lodash-es'

const doubled = [1, 2, 3].map(x => x * 2)
const evens = [1, 2, 3, 4].filter(x => x % 2 === 0)
const firstItem = items.at(0)          // ES2022 Array.at()
const lastItem = items.at(-1)          // Negative indexing
```

### Modern JavaScript Features

```typescript
// Before (lodash)
import { groupBy, sortBy, cloneDeep } from 'lodash-es'

const grouped = groupBy(users, 'department')
const sorted = sortBy(data, 'score')
const deep = cloneDeep(complex)

// After (native - automatic transformation)
import { groupBy, sortBy, cloneDeep } from 'lodash-es'

const grouped = Object.groupBy(users, user => user.department)  // ES2024
const sorted = data.toSorted((a, b) => a.score - b.score)      // ES2023
const deep = structuredClone(complex)                          // Native API
```

### Complex Transformations

```typescript
// Before (lodash)
import { has, pick, reject } from 'lodash-es'

const hasName = has(user, 'name')
const subset = pick(user, ['name', 'email'])
const nonAdmins = reject(users, user => user.role === 'admin')

// After (native - automatic transformation)
import { has, pick, reject } from 'lodash-es'

const hasName = 'name' in user
const subset = Object.fromEntries(['name', 'email'].map(k => [k, user[k]]))
const nonAdmins = users.filter(item => !(user => user.role === 'admin')(item))
```

## Configuration Options

When functions are excluded or not included, the rule flags them without transformation:

```typescript
// Configuration: { "exclude": ["forEach", "map"] }
import { forEach, map, filter } from 'lodash-es'

forEach(items, callback) // ❌ forEach is excluded - flagged, no transformation
map(items, mapper)       // ❌ map is excluded - flagged, no transformation
filter(items, predicate) // ✅ filter transforms to: items.filter(predicate)
```

## Supported Functions (67+)

### Array Functions (19 functions)

- `map` → `array.map(fn)`
- `filter` → `array.filter(predicate)`
- `find` → `array.find(predicate)`
- `reduce` → `array.reduce(fn, initial)`
- `forEach` → `array.forEach(fn)`
- `some` → `array.some(predicate)`
- `every` → `array.every(predicate)`
- `slice` → `array.slice(start, end)`
- `concat` → `array.concat(...values)`
- `join` → `array.join(separator)`
- `indexOf` → `array.indexOf(value)`
- `lastIndexOf` → `array.lastIndexOf(value)`
- `flatten` → `array.flat()`
- `flatMap` → `array.flatMap(fn)`
- `reduceRight` → `array.reduceRight(fn, initial)`
- `first` → `array.at(0)` (ES2022)
- `last` → `array.at(-1)` (ES2022)
- `includes` → `array.includes(value)`
- `reverse` → `array.reverse()` ⚠️ mutates

### Object Functions (4 functions)

- `keys` → `Object.keys(object)`
- `values` → `Object.values(object)`
- `entries` → `Object.entries(object)`
- `assign` → `Object.assign(target, ...sources)`

### String Functions (12 functions)

- `trim` → `string.trim()`
- `trimStart` → `string.trimStart()`
- `trimEnd` → `string.trimEnd()`
- `toLower` → `string.toLowerCase()`
- `toUpper` → `string.toUpperCase()`
- `startsWith` → `string.startsWith(target)`
- `endsWith` → `string.endsWith(target)`
- `repeat` → `string.repeat(n)`
- `replace` → `string.replace(pattern, replacement)`
- `split` → `string.split(separator)`
- `padStart` → `string.padStart(length, chars)`
- `padEnd` → `string.padEnd(length, chars)`

### Collection Functions (11 functions)

- `reject` → `array.filter(item => !predicate(item))`
- `size` → `value.length`
- `groupBy` → `Object.groupBy(array, fn)` (ES2024)
- `countBy` → reduce pattern for counting
- `keyBy` → `Object.fromEntries(array.map(...))`
- `chunk` → `Array.from()` pattern
- `partition` → dual filter operations
- `orderBy` → `array.toSorted(...)` (ES2023)
- `each` → `array.forEach(fn)`
- `findLast` → `array.findLast(predicate)` (ES2023)
- Complex object manipulation functions

### Type Checking Functions (11 functions)

- `isString` → `typeof value === "string"`
- `isNumber` → `typeof value === "number"`
- `isBoolean` → `typeof value === "boolean"`
- `isFunction` → `typeof value === "function"`
- `isObject` → `typeof value === "object" && value !== null`
- `isNull` → `value === null`
- `isUndefined` → `value === undefined`
- `isNil` → `value == null`
- `isArray` → `Array.isArray(value)`
- `toString` → `value.toString()`
- `toNumber` → `Number(value)`

### Math/Number Functions (8 functions)

- `isFinite` → `Number.isFinite(value)`
- `isInteger` → `Number.isInteger(value)`
- `isNaN` → `Number.isNaN(value)`
- `max` → `Math.max(...array)`
- `min` → `Math.min(...array)`
- `ceil` → `Math.ceil(number)`
- `floor` → `Math.floor(number)`
- `round` → `Math.round(number)`

### Advanced Functions

- `has` → `key in object` (parameter reordering)
- `pick` → `Object.fromEntries()` pattern
- `omit` → `Object.entries().filter()` pattern
- `merge` → `Object.assign({}, ...)` pattern
- `get` → optional chaining `obj?.prop?.path`
- `clone` → `{...obj}` spread
- `cloneDeep` → `structuredClone(obj)` (native browser API)
- `uniq` → `[...new Set(array)]`
- `compact` → `array.filter(Boolean)`
- `sortBy` → `array.toSorted(...)` (ES2023)
- `now` → `Date.now()`

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
