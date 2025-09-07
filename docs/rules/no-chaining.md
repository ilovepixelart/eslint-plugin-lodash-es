# no-chaining

Prevent lodash chaining that kills tree-shaking even with destructured imports.

| | |
|:---|:---|
| **Rule type** | problem |
| **Fixable** | 💡 Yes |
| **Recommended** | ✅ Yes |

## Rule Details

This rule prevents the use of lodash's `chain()` function which defeats tree-shaking optimizations even when using destructured imports. Chaining creates dependencies on the entire lodash library and prevents bundlers from eliminating unused code.

Examples of **incorrect** code for this rule:

```typescript
import { chain, map, filter } from 'lodash-es'

// ❌ Using chain defeats tree-shaking
const result = chain([1, 2, 3, 4])
  .map(x => x * 2)
  .filter(x => x > 4)
  .value()
```

```typescript
import _ from 'lodash-es'

// ❌ Chain usage with namespace import
const result = _.chain([1, 2, 3, 4])
  .map(x => x * 2)
  .filter(x => x > 4)
  .value()
```

Examples of **correct** code for this rule:

```typescript
import { map, filter } from 'lodash-es'

// ✅ Use individual functions for tree-shaking
const doubled = map([1, 2, 3, 4], x => x * 2)
const result = filter(doubled, x => x > 4)
```

```typescript
// ✅ Use native array chaining methods
const result = [1, 2, 3, 4]
  .map(x => x * 2)
  .filter(x => x > 4)
```

```typescript
// ✅ Use function composition with libraries like Ramda
import { pipe, map, filter } from 'ramda'

const result = pipe(
  map(x => x * 2),
  filter(x => x > 4)
)([1, 2, 3, 4])
```

## Why This Rule Exists

The `chain()` function creates several problems:

- **Bundle Size**: Chain imports the entire lodash library, not just the functions you use
- **Tree-shaking**: Bundlers cannot eliminate unused lodash functions when chain is used
- **Performance**: Larger bundles lead to slower page loads
- **Dependencies**: Creates hidden dependencies on lodash functions you may not realize you're using

### Bundle Size Impact

```typescript
// ❌ This imports ~70KB (entire lodash)
import { chain } from 'lodash-es'
const result = chain(data).map(fn).filter(pred).value()

// ✅ This imports ~2KB (just map and filter)  
import { map, filter } from 'lodash-es'
const result = filter(map(data, fn), pred)
```

## Suggestions

This rule provides auto-fix suggestions that help convert chain usage to tree-shaking friendly alternatives:

### Simple Chain Conversion

Before:

```typescript
chain(array).map(fn).filter(pred).value()
```

Suggested fix:

```typescript
filter(map(array, fn), pred)
```

### Import Cleanup

When removing chain imports, the rule suggests:

- Removing `chain` from destructured imports
- Removing the entire import if only `chain` was imported
- Converting to individual function usage

## Migration Strategy

1. **Replace simple chains** with individual function calls
2. **Use native methods** where possible for better performance
3. **Consider function composition** libraries for complex data transformations
4. **Remove chain imports** once all usage is eliminated

### Example Migration

Before:

```typescript
import { chain, map, filter, sortBy } from 'lodash-es'

const processUsers = (users) => 
  chain(users)
    .filter(user => user.active)
    .map(user => ({ ...user, fullName: `${user.first} ${user.last}` }))
    .sortBy('age')
    .value()
```

After:

```typescript
import { filter, map, sortBy } from 'lodash-es'

const processUsers = (users) => {
  const activeUsers = filter(users, user => user.active)
  const withFullNames = map(activeUsers, user => 
    ({ ...user, fullName: `${user.first} ${user.last}` })
  )
  return sortBy(withFullNames, 'age')
}
```

Or with native methods:

```typescript
const processUsers = (users) => 
  users
    .filter(user => user.active)
    .map(user => ({ ...user, fullName: `${user.first} ${user.last}` }))
    .sort((a, b) => a.age - b.age)
```

## When Not To Use It

You might want to disable this rule if:

- You're using a bundler that doesn't support tree-shaking
- You're in a legacy environment where bundle size isn't a concern
- You're gradually migrating away from chaining and need time to refactor
- You're using a different lodash plugin that handles chaining differently

## Performance Considerations

Using individual functions instead of chaining typically provides:

- **90% smaller bundles** - Only import functions you actually use
- **Faster build times** - Less code for bundlers to process
- **Better runtime performance** - Smaller JavaScript payloads
- **Improved tree-shaking** - Bundlers can eliminate unused dependencies

## Related Rules

- [enforce-destructuring](./enforce-destructuring.md) - Ensure optimal import patterns
- [no-method-imports](./no-method-imports.md) - Prevent deprecated per-method imports  
- [suggest-native-alternatives](./suggest-native-alternatives.md) - Consider native alternatives

## Version

This rule was introduced in eslint-plugin-lodash-es v0.3.0.

## Resources

- [Rule source](../../src/rules/no-chaining.ts)
- [Test source](../../tests/no-chaining.test.ts)
