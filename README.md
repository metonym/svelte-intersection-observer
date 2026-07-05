# svelte-intersection-observer

<!-- HIDE_START -->
[![NPM][npm]][npm-url]
<!-- HIDE_END -->

> Detect if an element is in the viewport using the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).

Use it to lazy-load images, trigger scroll animations, implement infinite scroll, autoplay video when visible, track ad or analytics impressions, or detect when a user has scrolled to the end of a list.

This zero-dependency library offers several ways to observe elements:

- `IntersectionObserver`: component for observing a single element
- `MultipleIntersectionObserver`: component for observing multiple elements (shared observer for better performance)
- `intersect`: action for observing an element directly with `use:`
- `intersectAttachment`: attachment for observing an element directly with `{@attach}` (Svelte 5.29+)

Try it in the [Svelte REPL](https://svelte.dev/repl/8cd2327a580c4f429c71f7df999bd51d).

## Compatibility

| Package version | Svelte version    | Notes                                     |
| :--------------- | :----------------- | :----------------------------------------- |
| 1.x              | 3, 4, 5 (non-runes) | Uses `export let`, slots, and `on:` events |
| 2.x              | 5 (runes mode only) | Uses `$props()`, snippets, and callback props |

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

  let element = $state();
  let intersecting = $state(false);
</script>

<header class:intersecting>
  {intersecting ? "Element is in view" : "Element is not in view"}
</header>

<IntersectionObserver {element} bind:intersecting>
  <div bind:this={element}>Hello world</div>
</IntersectionObserver>
```

### `children` snippet

An alternative to binding to the `intersecting` prop is to use the `children` snippet, which receives `intersecting`, `entry`, and `observer`.

In the following example, the "Hello world" element fades in when its containing element intersects the viewport.

```svelte
<script>
  import IntersectionObserver from "svelte-intersection-observer";
  import { fade } from "svelte/transition";

  let node = $state();
</script>

<header></header>

<IntersectionObserver element={node}>
  {#snippet children({ intersecting })}
    <div bind:this={node}>
      {#if intersecting}
        <div transition:fade={{ delay: 200 }}>Hello world</div>
      {/if}
    </div>
  {/snippet}
</IntersectionObserver>
```

### Once

Set `once` to `true` for the intersection event to occur only once. The `element` will be unobserved after the first intersection event occurs.

```svelte
<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let elementOnce = $state();
  let intersectOnce = $state(false);
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

Set `skip` to `true` to unobserve without disconnecting the underlying observer or losing `entry`/`intersecting` state. This is useful for pausing tracking on an off-screen carousel panel or a closed modal. Set `skip` back to `false` to resume; unlike `once`, this can be toggled back and forth. `MultipleIntersectionObserver` and the `intersect` action support the same `skip` option.

```svelte no-eval
<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let elementSkip = $state();
  let paused = $state(false);
</script>

<button onclick={() => (paused = !paused)}>
  {paused ? "Resume" : "Pause"}
</button>

<IntersectionObserver element={elementSkip} skip={paused}>
  {#snippet children({ intersecting })}
    <div bind:this={elementSkip}>{intersecting ? "In view" : "Not in view"}</div>
  {/snippet}
</IntersectionObserver>
```

### `onobserve` callback prop

`onobserve` is called when the element is first observed and also whenever an intersection event occurs.

```svelte no-eval
<IntersectionObserver
  {element}
  onobserve={(entry) => {
    console.log(entry); // IntersectionObserverEntry
    console.log(entry.isIntersecting); // true | false
  }}
>
  <div bind:this={element}>Hello world</div>
</IntersectionObserver>
```

### `onintersect` callback prop

As an alternative to binding the `intersecting` prop, you can pass an `onintersect` callback that is called if the observed element is intersecting the viewport.

**Note**: Compared to `onobserve`, `onintersect` is called only when the element is _intersecting the viewport_. In other words, `entry.isIntersecting` will only be `true`.

```svelte no-eval
<IntersectionObserver
  {element}
  onintersect={(entry) => {
    console.log(entry); // IntersectionObserverEntry
    console.log(entry.isIntersecting); // true
  }}
>
  <div bind:this={element}>Hello world</div>
</IntersectionObserver>
```

### Detecting scroll to end

To detect when a user has scrolled to the end of a scrollable container, place a sentinel element after the content and set `root` to the container. `intersecting` becomes `true` once the sentinel scrolls into view.

**Note**: `root` must be the scrollable element itself (i.e. it has its own `overflow`/fixed `height`), not just an ancestor of one. If `root` merely sits inside a scrollable ancestor, the sentinel scrolls along with `root` and never changes position relative to it, so it reports as permanently intersecting.

```svelte
<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let container = $state();
  let sentinel = $state();
  let reachedEnd = $state(false);
</script>

<header class:intersecting={reachedEnd}>
  {reachedEnd ? "You've reached the end" : "Keep scrolling..."}
</header>

<div bind:this={container} style="height: 200px; overflow-y: auto;">
  {#each Array.from({ length: 20 }) as _, i}
    <p>Paragraph {i + 1}</p>
  {/each}

  <IntersectionObserver
    element={sentinel}
    root={container}
    bind:intersecting={reachedEnd}
  >
    <div bind:this={sentinel} style="height: 1px;"></div>
  </IntersectionObserver>
</div>
```

### Scrolling to a conditionally revealed element

Keep the `bind:this` element outside the `{#if intersecting}` block, and only gate the animated content inside it. The bound element then stays in the DOM, so you can call `scrollIntoView()` on it whenever you want, whether or not its reveal animation has played yet.

```svelte
<script>
  import IntersectionObserver from "svelte-intersection-observer";
  import { fly } from "svelte/transition";

  let revealNode = $state();
  let revealIntersecting = $state(false);
</script>

<header class:intersecting={revealIntersecting}>
  <button
    onclick={() => {
      revealNode.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }}
  >
    Scroll to section
  </button>
</header>

<IntersectionObserver element={revealNode} once bind:intersecting={revealIntersecting}>
  <div bind:this={revealNode}>
    {#if revealIntersecting}
      <section transition:fly={{ y: 50, delay: 200, duration: 300 }}>
        Hello world
      </section>
    {/if}
  </div>
</IntersectionObserver>
```

### `use:intersect` action

As an alternative to the `IntersectionObserver` component, use the `intersect` action to observe an element directly with `use:`, without a `bind:this` reference or wrapper markup. Listen for `onobserve`/`onintersect` on the observed element itself.

```svelte
<script>
  import { intersect } from "svelte-intersection-observer";

  let actionIntersecting = $state(false);
</script>

<header class:intersecting={actionIntersecting}>
  {actionIntersecting ? "Element is in view" : "Element is not in view"}
</header>

<div
  use:intersect={{ once: true }}
  onobserve={(e) => (actionIntersecting = e.detail.isIntersecting)}
>
  Hello world
</div>
```

Options passed to `use:intersect` are reactive: updating `root`, `rootMargin`, or `threshold` re-initializes the underlying observer. Updating `skip` toggles observing on the existing observer without re-initializing it.

### `intersectAttachment` attachment

As of Svelte 5.29, [attachments](https://svelte.dev/docs/svelte/svelte-attachments) are the preferred replacement for actions. `intersectAttachment` wraps the `intersect` action with `svelte/attachments`'s `fromAction`, reusing the same observer logic but plugging into `{@attach ...}` instead of `use:`.

Attachments have a few architectural advantages over actions:

- No separate `update()` lifecycle method; they rerun reactively like a `$effect`
- Just plain functions, so they're easier to compose and generate dynamically
- Can be forwarded through components as ordinary props, unlike actions

```svelte
<script>
  import { intersectAttachment } from "svelte-intersection-observer";

  let attachmentIntersecting = $state(false);
</script>

<header class:intersecting={attachmentIntersecting}>
  {attachmentIntersecting ? "Element is in view" : "Element is not in view"}
</header>

<div
  {@attach intersectAttachment(() => ({ once: true }))}
  onobserve={(e) => (attachmentIntersecting = e.detail.isIntersecting)}
>
  Hello world
</div>
```

**Note**: unlike `use:intersect`, which takes the options object directly, `intersectAttachment` takes a function that _returns_ the options object (this is how `fromAction` tracks reactive dependencies). `intersect` remains fully supported; use whichever fits your codebase.

### Multiple elements

For performance, use `MultipleIntersectionObserver` to observe multiple elements with a single shared observer instead of instantiating a new one for every element.

```svelte
<script>
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let ref1 = $state();
  let ref2 = $state();

  let elements = $derived([ref1, ref2]);
</script>

<MultipleIntersectionObserver {elements}>
  {#snippet children({ elementIntersections })}
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
  {/snippet}
</MultipleIntersectionObserver>
```

### Using with `#each`

`MultipleIntersectionObserver` also handles a dynamic, `#each`-driven list: give every item its own slot in an array/object instead of one shared variable.

```svelte
<script>
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let items = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    text: `Item ${i + 1}`,
  }));

  let refs = $state([]);
  let itemsContainer = $state();

  let itemElements = $derived(refs);
</script>

<MultipleIntersectionObserver elements={itemElements} root={itemsContainer}>
  {#snippet children({ elementIntersections })}
    <header>
      {#each items as item, i (item.id)}
        <div class:intersecting={elementIntersections.get(refs[i])}>
          {item.text}: {elementIntersections.get(refs[i]) ? "✓" : "✗"}
        </div>
      {/each}
    </header>

    <div
      bind:this={itemsContainer}
      style="height: 150px; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem;"
    >
      {#each items as item, i (item.id)}
        <div
          bind:this={refs[i]}
          style="height: 100px; display: flex; align-items: center; flex-shrink: 0;"
        >
          {item.text}
        </div>
      {/each}
    </div>
  {/snippet}
</MultipleIntersectionObserver>
```

As with the scroll-to-end example, `root` must be an element that scrolls on its own; here, `itemsContainer` has an explicit `height` and `overflow-y: auto`.

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

**Note**: the observed `element` must render with a non-zero width and height for `threshold` values greater than `0` to have any effect. This is a constraint of the underlying [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), not something this component controls.

#### Callback props

- **onobserve**: called when the element is first observed or whenever an intersection change occurs
- **onintersect**: called when the element is intersecting the viewport

Both callbacks are called with an [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry).

#### `children` snippet props

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

#### Callback props

- **onobserve**: called when an element is first observed or whenever an intersection change occurs
- **onintersect**: called when an element is intersecting the viewport

Both callbacks are called with:

```ts
{
  entry: IntersectionObserverEntry;
  target: HTMLElement;
}
```

#### `children` snippet props

| Name                 | Type                                                                                                                                    |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| observer             | [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)                                         |
| elementIntersections | `Map<HTMLElement \| null, boolean>`                                                                                                     |
| elementEntries       | `Map<HTMLElement \| null,` [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)`>` |

### `intersect` action / `intersectAttachment` attachment

`intersectAttachment` is a thin wrapper around the `intersect` action (see [above](#intersectattachment-attachment)), so both share the same options and dispatched events.

#### Options

| Name       | Description                                              | Type                                                               | Default value |
| :--------- | :------------------------------------------------------- | :----------------------------------------------------------------- | :------------ |
| root       | Containing element                                       | `null` or `HTMLElement`                                            | `null`        |
| rootMargin | Margin offset of the containing element                  | `string`                                                           | `"0px"`       |
| threshold  | Percentage of element visibility to trigger an event     | `number` between 0 and 1, or an array of `number`s between 0 and 1 | `0`           |
| once       | Unobserve the element after the first intersection event | `boolean`                                                          | `false`       |
| skip       | Pause observing without disconnecting the observer       | `boolean`                                                          | `false`       |

#### Dispatched events

- **onobserve**: fired on the element when it is first observed or whenever an intersection change occurs
- **onintersect**: fired on the element when it is intersecting the viewport

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

[npm]: https://img.shields.io/npm/v/svelte-intersection-observer.svg?color=%23ff3e00&style=for-the-badge
[npm-url]: https://npmjs.com/package/svelte-intersection-observer
