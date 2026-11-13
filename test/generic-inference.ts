/**
 * Inference through `Get<T, P>` while `P` is still a type parameter. A store
 * API that takes a path and a value typed by that path (`setPath(path,
 * value)`) makes TypeScript infer `P` from both arguments, which walks into
 * `Get`'s conditional branches before `P` is known. Any cycle in `Get`'s
 * internals unrolls there until ts(2589). Pure type-level; `tsc` is the test.
 */
import type { Get, Paths } from '../src/index';

interface Store<T> {
  getPath: <P extends Paths<T>, D extends Get<T, P> | undefined = undefined>(
    path: P,
    defaultValue?: D
  ) => D extends undefined ? Get<T, P> : NonNullable<Get<T, P>> | D;
  setPath: <P extends Paths<T>>(
    path: P,
    value: Get<T, P> | ((prev: Get<T, P>) => Get<T, P>)
  ) => void;
}

interface State {
  count: number;
  user: { profile: { settings: { theme: string } } };
  posts: { id: number; title: string }[];
}

declare const store: Store<State>;
declare let n: number;

store.setPath('count', n++);
store.setPath('count', (prev) => prev + 1);
store.setPath('user.profile.settings.theme', 'light');
store.setPath('posts.0.title', 'Updated');
const count: number = store.getPath('count');
const theme: string = store.getPath('user.profile.settings.theme');

// @ts-expect-error the value is typed by the path
store.setPath('count', 'not a number');

export { count, theme };
