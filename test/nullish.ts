/**
 * `Get<T, P, { nullish: 'carry' }>` keeps the `null` and `undefined` of every
 * optional or nullable parent, the type `obj.a?.b` has at runtime. The default
 * (`'drop'`) is pinned in `composition.ts`. Pure type-level; `tsc` is the test.
 */
import type { Get, GetStrict } from '../src/index';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

type C = { nullish: 'carry' };

interface Address {
  city: string;
  geo?: { lat: number } | null;
}
interface Order {
  id: string;
  notes?: string | null;
  billing: Address;
  shipping?: Address | null;
  items: { sku: string; discounts?: { code: string }[] }[];
  meta: unknown;
  loose: Record<string, unknown>;
}

type _Carry = [
  // No optional parent: same as drop.
  Expect<Equal<Get<Order, 'billing.city', C>, string>>,
  Expect<Equal<Get<Order, 'id', C>, string>>,
  // An optional or nullable leaf keeps its own nullishness in both modes.
  Expect<Equal<Get<Order, 'notes', C>, string | null | undefined>>,
  Expect<Equal<Get<Order, 'notes'>, string | null | undefined>>,
  // Through an optional, nullable parent.
  Expect<Equal<Get<Order, 'shipping.city', C>, string | null | undefined>>,
  Expect<Equal<Get<Order, 'shipping.city'>, string>>,
  // Nullishness accumulates over several parents.
  Expect<Equal<Get<Order, 'billing.geo.lat', C>, number | null | undefined>>,
  Expect<Equal<Get<Order, 'shipping.geo.lat', C>, number | null | undefined>>,
  // Through arrays, in either syntax.
  Expect<Equal<Get<Order, 'items.0.discounts.0.code', C>, string | undefined>>,
  Expect<
    Equal<Get<Order, 'items[0].discounts[0].code', C>, string | undefined>
  >,
  Expect<Equal<Get<Order, 'items[0].sku', C>, string>>,
  // Below `unknown` is unknown, in place of drop's `never`.
  Expect<Equal<Get<Order, 'meta.anything', C>, unknown>>,
  Expect<Equal<Get<Order, 'loose.a.b', C>, unknown>>,
  Expect<Equal<Get<Order, 'loose.a', C>, unknown>>,
  // A miss is still a miss.
  Expect<Equal<Get<Order, 'billing.nope', C>, never>>,
];

type _StrictCarry = [
  Expect<
    Equal<GetStrict<Order, 'shipping.geo.lat', C>, number | null | undefined>
  >,
  Expect<
    Equal<
      GetStrict<
        Order,
        `items[${number}].discounts[${number}].code`,
        C & { arrays: 'bracket' }
      >,
      string | undefined
    >
  >,
];

export type { _Carry, _StrictCarry };
