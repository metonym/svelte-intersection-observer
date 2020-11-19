# svelte-intersection-observer

[![NPM][npm]][npm-url]
[![Build][build]][build-badge]

> Detect if an element is in the viewport using the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry).

Try it in the [Svelte REPL](https://svelte.dev/repl/8cd2327a580c4f429c71f7df999bd51d?version=3.29.7).

## [Demo](https://metonym.github.io/svelte-intersection-observer/)

## Install

```sh
yarn add -D svelte-intersection-observer
```

## Usage

```svelte
<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let element;
</script>

<IntersectionObserver {element} let:intersecting>
  <div bind:this="{element}">
    {#if intersecting}
      Element is in view
    {/if}
  </div>
</IntersectionObserver>
```

## API

### Props

| Property name | Description                               | Value                                                                                                               |
| :------------ | :---------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| element       | Element observed for intersection         | `HTMLElement`                                                                                                       |
| root          | Containing element                        | `null` or `HTMLElement` (default: `null`)                                                                           |
| rootMargin    | Offset of the containing element          | `string` (default: `"0px"`)                                                                                         |
| threshold     | Percentage of element to trigger an event | `number` between 0 and 1 (default: `0`)                                                                             |
| intersecting  | If the element is intersecting            | `boolean`                                                                                                           |
| entry         | Observed element metadata                 | `null` or [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) |

### Dispatched Events

The `observe` event is dispatched when an intersection change occurs.

```jsx
<IntersectionObserver
  {element}
  on:observe={({ detail: entry }) => {
    console.log(entry);
    // entry.boundingClientRect
    // entry.intersectionRatio
    // entry.intersectionRect
    // entry.isIntersecting
    // entry.rootBounds
    // entry.target
    // entry.time
  }} />
```

## [Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/svelte-intersection-observer.svg?color=blue
[npm-url]: https://npmjs.com/package/svelte-intersection-observer
[build]: https://travis-ci.com/metonym/svelte-intersection-observer.svg?branch=master
[build-badge]: https://travis-ci.com/metonym/svelte-intersection-observer
