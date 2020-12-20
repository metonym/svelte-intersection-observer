# svelte-intersection-observer

[![NPM][npm]][npm-url]
[![Build][build]][build-badge]

> Detect if an element is in the viewport using the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry).

Try it in the [Svelte REPL](https://svelte.dev/repl/8cd2327a580c4f429c71f7df999bd51d?version=3.29.7).

## Install

```bash
yarn add -D svelte-intersection-observer
# OR
npm i -D svelte-intersection-observer
```

## Usage

```svelte
<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let element;
  let intersecting;
</script>

<header class:intersecting>
  Scroll down<br />
  Element in view:
  <strong>{intersecting ? 'Yes' : 'No'}</strong>
</header>

<IntersectionObserver {element} bind:intersecting>
  <div bind:this={element}>
    {#if intersecting}Element is in view{/if}
  </div>
</IntersectionObserver>
```

## API

### Props

| Prop name    | Description                                                 | Value                                                                                                     |
| :----------- | :---------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| element      | Element observed for intersection                           | `HTMLElement`                                                                                             |
| root         | Containing element                                          | `null` or `HTMLElement` (default: `null`)                                                                 |
| rootMargin   | Offset of the containing element                            | `string` (default: `"0px"`)                                                                               |
| threshold    | Percentage of element to trigger an event                   | `number` between 0 and 1 (default: `0`)                                                                   |
| entry        | Observed element metadata                                   | [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) |
| intersecting | `true` if the observed element is intersecting the viewport | `boolean`                                                                                                 |

### Dispatched events

- **on:observe**: fired when an intersection change occurs (type `IntersectionObserverEntry`)

## TypeScript support

Svelte version 3.31.0 or greater is required to use this module with TypeScript.

## [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/svelte-intersection-observer.svg?color=%235832c9
[npm-url]: https://npmjs.com/package/svelte-intersection-observer
[build]: https://travis-ci.com/metonym/svelte-intersection-observer.svg?branch=master
[build-badge]: https://travis-ci.com/metonym/svelte-intersection-observer
