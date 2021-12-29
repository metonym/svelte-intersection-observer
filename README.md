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

**pnpm**

```bash
pnpm i -D svelte-intersection-observer
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
  import IntersectionObserver from "svelte-intersection-observer";

  let elementOnce;
  let intersectOnce;
</script>

<header class:intersecting={intersectOnce}>
  {intersectOnce ? "Element is in view" : "Element is not in view"}
</header>

<IntersectionObserver
  once
  element={elementOnce}
  bind:intersecting={intersectOnce}
>
  <div bind:this={elementOnce}>Hello world</div>
</IntersectionObserver>
```

### `let:intersecting`

An alternative to binding to the `intersecting` prop is to use the `let:` directive.

In the following example, the "Hello world" element will fade in when its containing element intersects the viewport.

```svelte
<script>
  import IntersectionObserver from "svelte-intersection-observer";
  import { fade } from "svelte/transition";

  let node;
</script>

<header />

<IntersectionObserver element={node} let:intersecting>
  <div bind:this={node}>
    {#if intersecting}
      <div transition:fade={{ delay: 200 }}>Hello world</div>
    {/if}
  </div>
</IntersectionObserver>
```

### `on:observe` event

The `observe` event is dispatched when the element is first observed and also whenever an intersection event occurs.

```svelte no-eval
<IntersectionObserver
  {element}
  on:observe={(e) => {
    console.log(e.detail); // IntersectionObserverEntry
    console.log(e.detail.isIntersecting); // true | false
  }}
>
  <div bind:this={element}>Hello world</div>
</IntersectionObserver>
```

### `on:intersect` event

As an alternative to binding the `intersecting` prop, you can listen to the `intersect` event that is dispatched if the observed element is intersecting the viewport.

**Note**: Compared to `on:observe`, `on:intersect` is dispatched only when the element is _intersecting the viewport_. In other words, `e.detail.isIntersecting` will only be `true`.

```svelte no-eval
<IntersectionObserver
  {element}
  on:intersect={(e) => {
    console.log(e.detail); // IntersectionObserverEntry
    console.log(e.detail.isIntersecting); // true
  }}
>
  <div bind:this={element}>Hello world</div>
</IntersectionObserver>
```

## API

### Props

| Name         | Description                                                 | Type                                                                                                      | Default value |
| :----------- | :---------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :------------ |
| element      | Observed element                                            | `HTMLElement`                                                                                             | `null`        |
| once         | Unobserve the element after the first intersection event    | `boolean`                                                                                                 | `false`       |
| intersecting | `true` if the observed element is intersecting the viewport | `boolean`                                                                                                 | `false`       |
| root         | Containing element                                          | `null` or `HTMLElement`                                                                                   | `null`        |
| rootMargin   | Margin offset of the containing element                     | `string`                                                                                                  | `"0px"`       |
| threshold    | Percentage of element visibile to trigger an event          | `number` between 0 and 1                                                                                  | `0`           |
| entry        | Observed element metadata                                   | [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) | `null`        |
| observer     | `IntersectionObserver` instance                             | [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)           | `null`        |

### Dispatched events

- **on:observe**: fired when the element is first observed or whenever an intersection change occurs
- **on:intersect**: fired when the element is intersecting the viewport

The `e.detail` dispatched by the `observe` and `intersect` events is an [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) interface.

Note that all properties in `IntersectionObserverEntry` are read-only.

<details>
 <summary><code>IntersectionObserverEntry</code></summary>

```ts
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

</details>

## Examples

The [examples folder](examples/) contains sample set-ups.

- [examples/sveltekit](examples/sveltekit)
- [examples/vite](examples/vite)
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
