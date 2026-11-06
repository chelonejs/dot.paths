/**
 * `Paths<T, { arrays: 'bracket' }>` writes array elements as `[${number}]`
 * with no dot before them, the field-name syntax of TanStack Form's
 * `DeepKeys`. `Get` reads either syntax. Pure type-level; `tsc` is the test.
 */
import type { Get, GetStrict, Paths } from '../src/index';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

type B = { arrays: 'bracket' };

interface Order {
  id: string;
  customer: { name: string; tags: string[] };
  items: { sku: string; discounts?: { code: string }[] }[];
  grid: number[][];
}

type _Enumeration = [
  Expect<
    Equal<
      Paths<Order, B>,
      | 'id'
      | 'customer'
      | 'customer.name'
      | 'customer.tags'
      | `customer.tags[${number}]`
      | 'items'
      | `items[${number}]`
      | `items[${number}].sku`
      | `items[${number}].discounts`
      | `items[${number}].discounts[${number}]`
      | `items[${number}].discounts[${number}].code`
      | 'grid'
      | `grid[${number}]`
      | `grid[${number}][${number}]`
    >
  >,
  // An array at the root starts with its bracket.
  Expect<Equal<Paths<{ a: 1 }[], B>, `[${number}]` | `[${number}].a`>>,
  // Leaves, empty tuples and depth behave as in dot mode.
  Expect<Equal<Paths<string, B>, never>>,
  Expect<Equal<Paths<{ e: [] }, B>, 'e'>>,
  Expect<Equal<Paths<{ a: { b: { c: 1 } } }, B & { depth: 2 }>, 'a' | 'a.b'>>,
  // Dot mode is unchanged.
  Expect<
    Equal<Paths<{ l: { a: 1 }[] }>, 'l' | `l.${number}` | `l.${number}.a`>
  >,
  Expect<
    Equal<
      Paths<{ l: { a: 1 }[] }, { arrays: 'dot' }>,
      'l' | `l.${number}` | `l.${number}.a`
    >
  >,
];

// A self-referencing type stops at the depth cap instead of overflowing.
interface Category {
  name: string;
  children: Category[];
}
type _Recursive = [
  Expect<
    Equal<
      Paths<Category, B & { depth: 3 }>,
      | 'name'
      | 'children'
      | `children[${number}]`
      | `children[${number}].name`
      | `children[${number}].children`
    >
  >,
];

type _GetReadsBrackets = [
  Expect<Equal<Get<Order, 'items[0].sku'>, string>>,
  Expect<Equal<Get<Order, `items[${number}].sku`>, string>>,
  Expect<Equal<Get<Order, 'items[0].discounts[1].code'>, string>>,
  Expect<Equal<Get<Order, 'grid[0][1]'>, number>>,
  Expect<Equal<Get<{ a: 1 }[], '[0].a'>, 1>>,
  // Mixed syntax reads too; each path is one property walk either way.
  Expect<Equal<Get<Order, 'items.0.discounts[1].code'>, string>>,
  Expect<Equal<Get<Order, 'items[0].sku'>, Get<Order, 'items.0.sku'>>>,
  // A miss stays a miss.
  Expect<Equal<Get<Order, 'items[0].nope'>, never>>,
];

type _GetStrictBrackets = [
  Expect<Equal<GetStrict<Order, `items[${number}].sku`, B>, string>>,
];
// @ts-expect-error a dot path is not a bracket-mode path
type _N1 = GetStrict<Order, `items.${number}.sku`, B>;
// @ts-expect-error a bracket path is not a dot-mode path
type _N2 = GetStrict<Order, `items[${number}].sku`>;

// An `any` member is the wildcard it is in dot mode, in either syntax below it.
type _AnyWildcard = [
  Expect<Equal<Paths<any, B>, string>>,
  Expect<
    Equal<
      Paths<{ raw: any }, B>,
      'raw' | `raw.${string}` | `raw[${number}]${string}`
    >
  >,
  Expect<
    Equal<
      Paths<any[], B>,
      | `[${number}]`
      | `[${number}].${string}`
      | `[${number}][${number}]${string}`
    >
  >,
  Expect<
    Equal<
      Paths<{ a: { raw: any }; id: string }, B>,
      'a' | 'id' | 'a.raw' | `a.raw.${string}` | `a.raw[${number}]${string}`
    >
  >,
  Expect<Equal<GetStrict<{ raw: any }, 'raw.a', B>, any>>,
  Expect<Equal<GetStrict<{ raw: any }, 'raw[0].a[1]', B>, any>>,
];
// @ts-expect-error the wildcard sits below `raw`, not beside it
type _N3 = GetStrict<{ raw: any }, 'rawr', B>;

export type {
  _AnyWildcard,
  _Enumeration,
  _GetReadsBrackets,
  _GetStrictBrackets,
  _N1,
  _N2,
  _N3,
  _Recursive,
};
