# enforce-destructuring

Enforce destructured imports from lodash-es and auto-fix them.

| | |
|:---|:---|
| **Rule type** | suggestion |
| **Fixable** | 🔧 Yes |
| **Recommended** | ✅ Yes |

## Rule Details

This rule enforces using destructured imports from lodash-es instead of default or namespace imports. It automatically detects lodash functions used in your code and converts imports to the optimal destructured format.

Examples of **incorrect** code for this rule:

```typescript
import _ from 'lodash-es'
import * as lodash from 'lodash-es'

const result = _.map(array, fn)
const filtered = lodash.filter(array, predicate)
```

Examples of **correct** code for this rule:

```typescript
import { map, filter } from 'lodash-es'

const result = map(array, fn)
const filtered = filter(array, predicate)
```

## Why

This rule promotes several benefits:

- **Tree-shaking**: Only imports the functions you actually use
- **Bundle size**: Significantly reduces bundle size  
- **Performance**: Faster builds and smaller JavaScript bundles
- **Clarity**: Makes dependencies explicit

## Auto-fixing

This rule is **auto-fixable** 🔧. When you run ESLint with the `--fix` option, it will:

1. Analyze your code to detect which lodash functions are used
2. Replace default/namespace imports with destructured imports  
3. Update function calls to use the destructured names

### Example of auto-fixing

Before auto-fix:

```typescript
import _ from 'lodash-es'

const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
]

const names = _.map(users, 'name')
const adults = _.filter(users, user => user.age >= 18)
const first = _.first(names)
```

After auto-fix:

```typescript
import { map, filter, first } from 'lodash-es'

const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 }
]

const names = map(users, 'name')
const adults = filter(users, user => user.age >= 18)
const firstUser = first(names)
```

## Options

This rule has no configuration options. It works out of the box.

## When Not To Use It

You might want to disable this rule if:

- You're using a very old bundler that doesn't support tree-shaking
- You have specific requirements for namespace imports
- You're migrating a large codebase and want to do it gradually

## Related Rules

- [enforce-functions](./enforce-functions.md) - Control which lodash functions are allowed
- [suggest-native-alternatives](./suggest-native-alternatives.md) - Suggests native JavaScript alternatives

## Version

This rule was introduced in eslint-plugin-lodash-es v0.1.0.

## Resources

- [Rule source](../../src/rules/enforce-destructuring.ts)
- [Test source](../../tests/enforce-destructuring.test.ts)