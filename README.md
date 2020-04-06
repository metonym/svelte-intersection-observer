# svelte-intersection-observer

[![NPM][npm]][npm-url]
[![Build][build]][build-badge]

> Detect if an element is in the viewport using the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry).

## Install

```bash
yarn add -D svelte-intersection-observer
```

## Usage

```html
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

| Property name | Description                                                                           | Value                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| element       | Element observed for intersecting changes                                             | `HTMLElement`                                                                                                       |
| root          | Containing element                                                                    | `null` or `HTMLElement` (default: `null`)                                                                           |
| rootMargin    | Offset of the containing element                                                      | `string` (default: `"0px"`)                                                                                         |
| threshold     | Percentage of the intersecting element to be visible to trigger an intersection event | `number` between 0 and 1 (default: `0`)                                                                             |
| intersecting  | If the element is intersecting                                                        | `boolean`                                                                                                           |
| entry         | Observed element metadata triggered when intersecting                                 | `null` or [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) |

### Dispatched Event

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
