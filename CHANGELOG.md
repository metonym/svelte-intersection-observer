# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1](https://github.com/metonym/svelte-intersection-observer/releases/tag/v1.1.1) - 2026-01-19

**Fixes**

- Re-publish to include types

## [1.1.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v1.1.0) - 2026-01-19

**Features**

- Add `MultipleIntersectionObserver` component

## [1.0.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v1.0.0) - 2024-01-01

**Breaking Changes**

- Remove `IntersectionObserverProps` or `Entry` TypeScript interfaces from `IntersectionObserver.svelte.d.ts`
- Drop support for bundled ESM/UMD; code is only distributed as Svelte files

**Fixes**

- `element` and `root` prop types should be `null | HTMLElement` to support TypeScript strict mode
- Add `exports` field to `package.json`

## [0.10.2](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.10.2) - 2024-01-01

**Fixes**

- Add `exports` field to `package.json`

## [0.10.1](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.10.1) - 2023-07-20

**Fixes**

- Fix `threshold` prop type to be `number | number[]`

## [0.10.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.10.0) - 2021-12-29

**Features**

- Mark `observer` for garbage collection after disconnecting

**Documentation**

- Make prop descriptions consistent with docs

**Refactoring**

- Omit redundant `null` from `element` and `root` types as `HTMLElement` is already nullable

## [0.9.2](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.9.2) - 2021-11-26

**Documentation**

- Add `let:` directive example
- Update component prop descriptions
- Use Svelte syntax highlighting for `on:observe`, `on:intersect` examples

## [0.9.1](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.9.1) - 2021-10-25

**Documentation**

- Update the "Once" example to include the `"svelte-intersection-observer"` import
- Rename example `svite` to `vite`

**Refactoring**

- Inline `entry` prop typedef
- Remove `@event`, `@slot` artifacts used by sveld to generate initial TypeScript definitions

## [0.9.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.9.0) - 2021-10-05

- Improve TypeScript definitions for dispatched events
  - `on:observe`: `event.detail.isIntersecting` is a `boolean`
  - `on:intersect`: `event.detail.isIntersecting` can only be `true`

## [0.8.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.8.0) - 2021-09-02

- Use `.svelte.d.ts` extension for component TypeScript definition

## [0.7.1](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.7.1) - 2021-07-05

**Documentation**

- Add description for basic usage
- Add `on:observe` example
- Explain difference between `on:observe` and `on:intersect`
- Document `IntersectionObserverEntry` interface
- Re-order prop table so that `once` and `intersecting` are more prominent

## [0.7.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.7.0) - 2021-04-23

**Features**

- Re-initialize observer if `rootMargin` changes

## [0.6.1](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.6.1) - 2021-04-03

**Fixes**

- Move intersection observer instantiation to `onMount` to work in hydration use cases

## [0.6.0](https://github.com/metonym/svelte-intersection-observer/releases/tag/v0.6.0) - 2021-02-24

**Features**

- Export `observer` prop (type `IntersectionObserver`)
- Dispatch "intersect" event if the observed element `isIntersecting` the viewport

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
