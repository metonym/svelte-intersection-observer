# svelte-intersection-observer

[![NPM][npm]][npm-url]

> Detect if an element is in the viewport using the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

<!-- REPO_URL -->

Try it in the [Svelte REPL](https://svelte.dev/repl/8cd2327a580c4f429c71f7df999bd51d).

<!-- TOC -->

## Installation

**Yarn**

```bash
yarn add -D svelte-intersection-observer
```

**NPM**

```bash
npm i -D svelte-intersection-observer
```

## Usage

### Basic

Use the [`bind:this`](https://svelte.dev/docs#bind_element) directive to pass an element reference to the `IntersectionObserver` component.

Then, simply bind to the reactive `intersecting` prop to determine if the element intersects the viewport.

```svelte
<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let element;
  let intersecting;
</script>

<header class:intersecting>
  {intersecting ? "Element is in view" : "Element is not in view"}
</header>

<IntersectionObserver {element} bind:intersecting>
  <div bind:this={element}>Hello world</div>
</IntersectionObserver>
```

### Once

Set `once` to `true` for the intersection event to occur only once. The `element` will be unobserved after the first intersection event occurs.

```svelte
<script>
  let element2;
  let intersectOnce;
</script>

<header class:intersecting={intersectOnce}>
  {intersectOnce ? "Element is in view" : "Element is not in view"}
</header>

<IntersectionObserver once element={element2} bind:intersecting={intersectOnce}>
  <div bind:this={element2}>Hello world</div>
</IntersectionObserver>
```

### on:observe event

The `observe` event is dispatched when the element is first observed and also whenever an intersection event occurs.

```html
<IntersectionObserver
  {element}
  on:observe="{(e) => {
    console.log(e.detail); // IntersectionObserverEntry
    console.log(e.detail.isIntersecting); // true | false
  }}"
>
  <div bind:this="{element}">Hello world</div>
</IntersectionObserver>
```

### on:intersect event

As an alternative to binding the `intersecting` prop, you can listen to the `intersect` event that is dispatched if the observed element is intersecting the viewport.

**Compared to `on:observe`, this event is dispatched only when the element is _intersecting the viewport_.**

```html
<IntersectionObserver
  {element}
  on:intersect="{(e) => {
    console.log(e.detail); // IntersectionObserverEntry
  }}"
>
  <div bind:this="{element}">Hello world</div>
</IntersectionObserver>
```

## API

### Props

| Name         | Description                                                       | Value                                                                                                     |
| :----------- | :---------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| element      | Element observed for intersection                                 | `HTMLElement`                                                                                             |
| once         | If `true`, the observed element will be unobserved upon intersect | `boolean` (default: `false`)                                                                              |
| intersecting | `true` if the observed element is intersecting the viewport       | `boolean` (default: `false`)                                                                              |
| root         | Containing element                                                | `null` or `HTMLElement` (default: `null`)                                                                 |
| rootMargin   | Margin offset of the containing element                           | `string` (default: `"0px"`)                                                                               |
| threshold    | Percentage of element visibility to trigger an event              | `number` between 0 and 1 (default: `0`)                                                                   |
| entry        | Observed element metadata                                         | [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) |
| observer     | IntersectionObserver instance                                     | [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)           |

### Dispatched events

- **on:observe**: fired when the element is first observed or whenever an intersection change occurs
- **on:intersect**: fired when the element is intersecting the viewport

The `e.detail` dispatched by the `observe` and `intersect` events is an [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) interface.

Note that all properties in `IntersectionObserverEntry` are read only.

<details>
 <summary><code>IntersectionObserverEntry</code></summary>

<!-- prettier-ignore-start -->
```js
interface IntersectionObserverEntry {
  target: HTMLElement;
  time: number;
  isIntersecting: boolean;
  isVisible: boolean;
  intersectionRatio: number;
  intersectionRect: {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
    x: number;
    y: number;
  };
  rootBounds: {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
    x: number;
    y: number;
  };
  boundingClientRect: {
    bottom: number;
    height: number;
    left: number;
    right: number;
    top: number;
    width: number;
    x: number;
    y: number;
  };
}
```
<!-- prettier-ignore-end -->

</details>

## Examples

The [examples folder](examples/) contains sample set-ups.

- [examples/sveltekit](examples/sveltekit)
- [examples/svite](examples/svite)
- [examples/sapper](examples/sapper)
- [examples/snowpack](examples/snowpack)
- [examples/rollup](examples/rollup)
- [examples/webpack](examples/webpack)

## TypeScript support

Svelte version 3.31 or greater is required to use this module with TypeScript.

TypeScript definitions for this component are located in the [types folder](types/).

## Changelog

[Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/svelte-intersection-observer.svg?color=%23ff3e00&style=for-the-badge
[npm-url]: https://npmjs.com/package/svelte-intersection-observer
