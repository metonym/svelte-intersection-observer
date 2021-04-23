# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
