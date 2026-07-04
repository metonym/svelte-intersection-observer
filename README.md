# svelte-intersection-observer

[![NPM][npm]][npm-url]

> Detect if an element is in the viewport using the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

<!-- REPO_URL -->

Try it in the [Svelte REPL](https://svelte.dev/repl/8cd2327a580c4f429c71f7df999bd51d).

<!-- TOC -->

## Installation

```sh
# NPM
npm i svelte-intersection-observer

# pnpm
pnpm i svelte-intersection-observer

# Bun
bun i svelte-intersection-observer

# Yarn
yarn add svelte-intersection-observer

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

### Pausing with `skip`

Set `skip` to `true` to unobserve without disconnecting the underlying observer or losing `entry`/`intersecting` state — useful for pausing tracking on an off-screen carousel panel or a closed modal. Set `skip` back to `false` to resume; unlike `once`, this can be toggled back and forth. `MultipleIntersectionObserver` and the `intersect` action support the same `skip` option.

```svelte
<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let elementSkip;
  let paused = false;
</script>

<button on:click={() => (paused = !paused)}>
  {paused ? "Resume" : "Pause"}
</button>

<IntersectionObserver element={elementSkip} skip={paused} let:intersecting>
  <div bind:this={elementSkip}>{intersecting ? "In view" : "Not in view"}</div>
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

### Detecting scroll to end

To detect when a user has scrolled to the end of a scrollable container, place a sentinel element after the content and set `root` to the container. `intersecting` becomes `true` once the sentinel scrolls into view.

```svelte
<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let container;
  let sentinel;
  let reachedEnd;
</script>

<header class:intersecting={reachedEnd}>
  {reachedEnd ? "You've reached the end" : "Keep scrolling..."}
</header>

<div bind:this={container} style:height="auto">
  {#each Array.from({ length: 20 }) as _, i}
    <p>Paragraph {i + 1}</p>
  {/each}

  <IntersectionObserver
    element={sentinel}
    root={container}
    bind:intersecting={reachedEnd}
  >
    <div bind:this={sentinel} style="height: 1px;" />
  </IntersectionObserver>
</div>
```

### `use:intersect` action

As an alternative to the `IntersectionObserver` component, use the `intersect` action to observe an element directly with `use:`, without a `bind:this` reference or wrapper markup. Listen for `on:observe`/`on:intersect` on the observed element itself.

```svelte
<script>
  import { intersect } from "svelte-intersection-observer";

  let actionIntersecting = false;
</script>

<header class:intersecting={actionIntersecting}>
  {actionIntersecting ? "Element is in view" : "Element is not in view"}
</header>

<div
  use:intersect={{ once: true }}
  on:observe={(e) => (actionIntersecting = e.detail.isIntersecting)}
>
  Hello world
</div>
```

Options passed to `use:intersect` are reactive — updating `root`, `rootMargin`, or `threshold` re-initializes the underlying observer. Updating `skip` toggles observing on the existing observer without re-initializing it.

### Multiple elements

For performance, use `MultipleIntersectionObserver` to observe multiple elements.

This avoids instantiating a new observer for every element.

```svelte
<script>
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let ref1;
  let ref2;

  $: elements = [ref1, ref2];
</script>

<MultipleIntersectionObserver {elements} let:elementIntersections>
  <header>
    <div class:intersecting={elementIntersections.get(ref1)}>
      Item 1: {elementIntersections.get(ref1) ? "✓" : "✗"}
    </div>
    <div class:intersecting={elementIntersections.get(ref2)}>
      Item 2: {elementIntersections.get(ref2) ? "✓" : "✗"}
    </div>
  </header>

  <div bind:this={ref1}>Item 1</div>
  <div bind:this={ref2}>Item 2</div>
</MultipleIntersectionObserver>
```

### Using with `#each`

`MultipleIntersectionObserver` also handles a dynamic, `#each`-driven list — give every item its own slot in an array/object instead of one shared variable.

```svelte
<script>
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let items = [
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" },
  ];

  let refs = [];
  let itemsContainer;

  $: itemElements = refs;
</script>

<MultipleIntersectionObserver
  elements={itemElements}
  root={itemsContainer}
  let:elementIntersections
>
  <header>
    {#each items as item, i}
      <div class:intersecting={elementIntersections.get(refs[i])}>
        {item.text}: {elementIntersections.get(refs[i]) ? "✓" : "✗"}
      </div>
    {/each}
  </header>

  <div bind:this={itemsContainer}>
    {#each items as item, i (item.id)}
      <div bind:this={refs[i]}>{item.text}</div>
    {/each}
  </div>
</MultipleIntersectionObserver>
```

**Avoid** using the single-element `IntersectionObserver` component inside an `#each` block with one variable shared across iterations (e.g. `let node;` declared outside the loop and bound via `bind:this={node}` inside it). Every iteration overwrites the same `node`, so each observer instance keeps re-observing a moving target, which can produce an infinite update loop. Use `MultipleIntersectionObserver` with a per-item ref, as shown above, instead.

## API

### IntersectionObserver

#### Props

| Name         | Description                                                 | Type                                                                                                                | Default value |
| :----------- | :---------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ | :------------ |
| element      | Observed element                                            | `null` or `HTMLElement`                                                                                             | `null`        |
| once         | Unobserve the element after the first intersection event    | `boolean`                                                                                                           | `false`       |
| intersecting | `true` if the observed element is intersecting the viewport | `boolean`                                                                                                           | `false`       |
| root         | Containing element                                          | `null` or `HTMLElement`                                                                                             | `null`        |
| rootMargin   | Margin offset of the containing element                     | `string`                                                                                                            | `"0px"`       |
| threshold    | Percentage of element visibility to trigger an event        | `number` between 0 and 1, or an array of `number`s between 0 and 1                                                  | `0`           |
| entry        | Observed element metadata                                   | `null` or [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) | `null`        |
| observer     | `IntersectionObserver` instance                             | `null` or [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)           | `null`        |
| skip         | Pause observing without losing `entry`/`intersecting` state | `boolean`                                                                                                           | `false`       |

**Note**: the observed `element` must render with a non-zero width and height for `threshold` values greater than `0` to have any effect — this is a constraint of the underlying [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), not something this component controls.

#### Dispatched events

- **on:observe**: fired when the element is first observed or whenever an intersection change occurs
- **on:intersect**: fired when the element is intersecting the viewport

The `e.detail` dispatched by the `observe` and `intersect` events is an [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) interface.

#### Slot props

| Name         | Type                                                                                                                |
| :----------- | :------------------------------------------------------------------------------------------------------------------ |
| intersecting | `boolean`                                                                                                           |
| entry        | `null` or [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) |
| observer     | [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)                     |

### MultipleIntersectionObserver

#### Props

| Name                 | Description                                           | Type                                                                                                                                    | Default value |
| :------------------- | :---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- | :------------ |
| elements             | Array of HTML elements to observe                     | `Array<HTMLElement \| null>`                                                                                                            | `[]`          |
| once                 | Unobserve elements after the first intersection event | `boolean`                                                                                                                               | `false`       |
| root                 | Containing element                                    | `null` or `HTMLElement`                                                                                                                 | `null`        |
| rootMargin           | Margin offset of the containing element               | `string`                                                                                                                                | `"0px"`       |
| threshold            | Percentage of element visibility to trigger an event  | `number` between 0 and 1, or an array of `number`s between 0 and 1                                                                      | `0`           |
| elementIntersections | Map of each element to its intersection state         | `Map<HTMLElement \| null, boolean>`                                                                                                     | `new Map()`   |
| elementEntries       | Map of each element to its latest entry               | `Map<HTMLElement \| null,` [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)`>` | `new Map()`   |
| observer             | `IntersectionObserver` instance                       | `null` or [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)                               | `null`        |
| skip                 | Pause observing all elements without losing state     | `boolean`                                                                                                                               | `false`       |

#### Dispatched events

- **on:observe**: fired when an element is first observed or whenever an intersection change occurs
- **on:intersect**: fired when an element is intersecting the viewport

The `e.detail` for both events includes:

```ts
{
  entry: IntersectionObserverEntry;
  target: HTMLElement;
}
```

#### Slot props

| Name                 | Type                                                                                                                                    |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| observer             | [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)                                         |
| elementIntersections | `Map<HTMLElement \| null, boolean>`                                                                                                     |
| elementEntries       | `Map<HTMLElement \| null,` [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)`>` |

### `intersect` action

#### Options

| Name       | Description                                                  | Type                                                                | Default value |
| :--------- | :------------------------------------------------------------ | :------------------------------------------------------------------- | :------------- |
| root       | Containing element                                            | `null` or `HTMLElement`                                             | `null`         |
| rootMargin | Margin offset of the containing element                       | `string`                                                            | `"0px"`        |
| threshold  | Percentage of element visibility to trigger an event          | `number` between 0 and 1, or an array of `number`s between 0 and 1 | `0`            |
| once       | Unobserve the element after the first intersection event      | `boolean`                                                           | `false`        |
| skip       | Pause observing without disconnecting the observer            | `boolean`                                                           | `false`        |

#### Dispatched events

- **on:observe**: fired on the element when it is first observed or whenever an intersection change occurs
- **on:intersect**: fired on the element when it is intersecting the viewport

The `e.detail` dispatched by the `observe` and `intersect` events is an [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) interface.

### `IntersectionObserverEntry` interface

Note that all properties in [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) are read-only.

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

## Changelog

[Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/svelte-intersection-observer.svg?color=%23ff3e00&style=for-the-badge
[npm-url]: https://npmjs.com/package/svelte-intersection-observer
