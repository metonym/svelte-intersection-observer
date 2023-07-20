# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.10.1](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.10.1) - 2023-07-20

**Fixes**

- fix `threshold` prop type to be `number | number[]`

## [0.10.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.10.0) - 2021-12-29

**Features**

- mark `observer` for garbage collection after disconnecting

**Documentation**

- make prop descriptions consistent with docs

**Refactoring**

- omit redundant `null` from `element` and `root` types as `HTMLElement` is already nullable

## [0.9.2](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.9.2) - 2021-11-26

**Documentation**

- add `let:` directive example
- update component prop descriptions
- use Svelte syntax highlighting for `on:observe`, `on:intersect` examples

## [0.9.1](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.9.1) - 2021-10-25

**Documentation**

- update the "Once" example to include the `"svelte-intersection-observer"` import
- rename example `svite` to `vite`

**Refactoring**

- inline `entry` prop typedef
- remove `@event`, `@slot` artifacts used by sveld to generate initial TypeScript definitions

## [0.9.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.9.0) - 2021-10-05

- improve TypeScript definitions for dispatched events
  - `on:observe`: `event.detail.isIntersecting` is a `boolean`
  - `on:intersect`: `event.detail.isIntersecting` can only be `true`

## [0.8.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.8.0) - 2021-09-02

- use `.svelte.d.ts` extension for component TypeScript definition

## [0.7.1](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.7.1) - 2021-07-05

**Documentation**

- add description for basic usage
- add `on:observe` example
- explain difference between `on:observe` and `on:intersect`
- document `IntersectionObserverEntry` interface
- re-order prop table so that `once` and `intersecting` are more prominent

## [0.7.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.7.0) - 2021-04-23

**Features**

- re-initialize observer if `rootMargin` changes

## [0.6.1](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.6.1) - 2021-04-03

**Fixes**

- move intersection observer instantiation to `onMount` to work in hydration use cases

## [0.6.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.6.0) - 2021-02-24

**Features**

- export `observer` prop (type `IntersectionObserver`)
- dispatch "intersect" event if the observed element `isIntersecting` the viewport

## [0.5.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.5.0) - 2021-01-20

**Features**

- Add support for Server-Side Rendering (SSR)

## [0.4.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.4.0) - 2020-12-20

**Features**

- Export `intersecting` prop

**Fixes**

- Remove observer from module context to allow multiple component instantiations
- Fix prop type for `entry`

## [0.3.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.3.0) - 2020-11-23

- Export `entry` as a reactive prop

## [0.2.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.2.0) - 2020-11-18

- Add TypeScript definitions

## [0.1.1](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.1.1) - 2020-04-05

- Only `disconnect` observer in `onDestroy` lifecycle method

## [0.1.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.1.0) - 2020-04-05

- Initial release
