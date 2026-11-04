/**
 * The oldest lib the types support. Under `skipLibCheck`, a global the lib
 * lacks resolves to `any` in `_Leaf` and every path type with it, with no
 * error, so this file compiles against `lib: ["ES2020"]` only.
 * Pure type-level; `tsc -p test/lib-es2020` is the test.
 */
import type { Get, Paths } from '../../src/index';

type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false;
type Expect<T extends true> = T;

type Nested = { a: { b: number } };

type _Es2020 = [
  Expect<Equal<Paths<Nested>, 'a' | 'a.b'>>,
  Expect<Equal<Get<Nested, 'a.b'>, number>>,
];

// @ts-expect-error a number is not a path
export const notAPath: Paths<Nested> = 5;
// @ts-expect-error `a.c` is not a path of `Nested`
export const wrongPath: Paths<Nested> = 'a.c';
