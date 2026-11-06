# Changelog

## [0.2.2](https://github.com/chelonejs/dot.paths/compare/v0.2.1...v0.2.2) (2026-11-06)


### Bug Fixes

* an any member stays a wildcard in bracket mode ([d8c1e75](https://github.com/chelonejs/dot.paths/commit/d8c1e7539f59a96b7ac3af3c5b16b0d7cad6de25))
* bracket any wildcard, and Get reads a bare string path as unknown ([16917e5](https://github.com/chelonejs/dot.paths/commit/16917e5fae99a1aa2e36adf7dd07d66cb0d6603c))
* Get with nullish path reads a bare string path as unknown ([8c97c2d](https://github.com/chelonejs/dot.paths/commit/8c97c2dae89698e2d19a6ceacc72a0b8af3d0aca))

## [0.2.1](https://github.com/chelonejs/dot.paths/compare/v0.2.0...v0.2.1) (2026-11-04)


### Bug Fixes

* Paths and Get keep their types under lib ES2020 ([5e44362](https://github.com/chelonejs/dot.paths/commit/5e443625cb710993907c7296c6c880fed9e786ac))
* Paths and Get keep their types under lib ES2020 ([88c29e0](https://github.com/chelonejs/dot.paths/commit/88c29e00048df83d3644965fc17cda502bd1ad22)), closes [#6](https://github.com/chelonejs/dot.paths/issues/6)

## [0.2.0](https://github.com/chelonejs/dot.paths/compare/v0.1.2...v0.2.0) (2026-11-03)


### Features

* bracket array paths, as a Paths option and in Get ([52dec07](https://github.com/chelonejs/dot.paths/commit/52dec0704172bebf0a9a592bece95f6ee6bcb3db))
* Get option `nullish: 'leaf' | 'path'`: with 'path', a parent's null and undefined carry through to the result ([a45f20d](https://github.com/chelonejs/dot.paths/commit/a45f20d2b82145422cce1ba5fde5419ed59d3e32), [97e99ea](https://github.com/chelonejs/dot.paths/commit/97e99ea0ab2c29cf01ef63e6f76d7515dae02c33))


### Performance

* bracket Paths writes the root key without a dot instead of stripping it ([cb319e5](https://github.com/chelonejs/dot.paths/commit/cb319e55aa453e972d91c81325d25bd9b381c735))
