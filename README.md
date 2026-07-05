# svelte-intersection-observer

<!-- HIDE_START -->
[![NPM][npm]][npm-url]
<!-- HIDE_END -->

## About

`svelte-intersection-observer` is a zero-dependency Svelte library built on the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) that detects when an element enters or exits the viewport, without expensive scroll listeners. Use it for lazy-loading, scroll animations, infinite scroll, autoplaying video, impression tracking, and more (see [Use Cases](#use-cases)).

It offers six interchangeable primitives, all backed by the same shared observer logic.

| Primitive | Export | Use it when... |
| :-------- | :----- | :--------------------- |
| [Component](#intersectionobserver) | `IntersectionObserver` | you want a component with a bound `intersecting` prop |
| [Pooled component](#multipleintersectionobserver) | `MultipleIntersectionObserver` | you're observing many elements and want one shared observer |
| [Action](#intersect) | `intersect` | you want `use:` on a plain element, no extra markup |
| [Attachment](#intersectattachment) | `intersectAttachment` | same as the action, composed via `{@attach}` (Svelte 5.29+) |
| [Composable](#createintersectionobserver) | `createIntersectionObserver` | you want reactive state from `<script>`, no directive |
| [Factory](#createintersectiongroup) | `createIntersectionGroup` | you're rendering a list with `{@attach}` and want one shared observer |

See [Library](#library) for the full docs on each. Try it in the [Svelte REPL](https://svelte.dev/repl/8cd2327a580c4f429c71f7df999bd51d).

### Compatibility

| Package version | Svelte version    | Notes                                     |
| :--------------- | :----------------- | :----------------------------------------- |
| [1.x](https://github.com/metonym/svelte-intersection-observer/tree/v1.2.x) | 3, 4, 5 (non-runes) | Uses `export let`, slots, and `on:` events |
| 2.x              | ≥5.29 (runes mode only) | Uses `$props()`, snippets, and callback props |

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

## Library

Every primitive shares the same core options (`root`, `rootMargin`, `threshold`, `once`, `skip`) and the same `onobserve`/`onintersect`/`onexit` callbacks. Only how you plug it into your markup differs. See [Use Cases](#use-cases) for realistic scenarios built from these.

### `IntersectionObserver`

Use the [`bind:this`](https://svelte.dev/docs#bind_element) directive to pass an element reference to the `IntersectionObserver` component.

Then bind to the reactive `intersecting` prop to check whether the element intersects the viewport.

```svelte
<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let element: HTMLElement | undefined = $state();
  let intersecting = $state(false);
</script>

<header class:intersecting>
  {intersecting ? "Element is in view" : "Element is not in view"}
</header>

<IntersectionObserver {element} bind:intersecting>
  <div bind:this={element}>Hello world</div>
</IntersectionObserver>
```

#### `once`

Set `once` to `true` to unobserve the element after its first intersection event, useful for a one-time reveal animation, a single lazy-load, or a single analytics impression.

```svelte
<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let elementOnce: HTMLElement | undefined = $state();
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

#### `children` snippet

An alternative to binding to the `intersecting` prop is to use the `children` snippet, which receives `intersecting`, `entry`, and `observer`.

In this example, "Hello world" fades in when its containing element intersects the viewport.

```svelte
<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";
  import { fade } from "svelte/transition";

  let node: HTMLElement | undefined = $state();
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

#### Props

| Name         | Description                                                 | Type                                                                                                                | Default value |
| :----------- | :---------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ | :------------ |
| element      | Observed element                                            | `null` \| `undefined` \| `Element`                                                                                   | `null`        |
| once         | Unobserve the element after the first intersection event    | `boolean`                                                                                                           | `false`       |
| intersecting | `true` if the observed element is intersecting the viewport | `boolean`                                                                                                           | `false`       |
| root         | Containing element                                          | `Element` \| `Document` \| `null`                                                                                    | `null`        |
| rootMargin   | Margin offset of the containing element                     | `string`                                                                                                            | `"0px"`       |
| threshold    | Percentage of element visibility to trigger an event        | `number` between 0 and 1, or an array of `number`s between 0 and 1                                                  | `0`           |
| entry        | Observed element metadata                                   | `null` or [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) | `null`        |
| observer     | `IntersectionObserver` instance                             | `null` or [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)           | `null`        |
| skip         | Pause observing without losing `entry`/`intersecting` state | `boolean`                                                                                                           | `false`       |

**Note**: the observed `element` must render with a non-zero width and height for `threshold` values greater than `0` to have any effect. This is a constraint of the underlying [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), not something this component controls.

#### Callback props

Same `onobserve`/`onintersect`/`onexit` behavior as described in [Callbacks](#callbacks-onobserve-onintersect-and-onexit) below.

#### `children` snippet props

| Name         | Type                                                                                                                |
| :----------- | :------------------------------------------------------------------------------------------------------------------ |
| intersecting | `boolean`                                                                                                           |
| entry        | `null` or [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) |
| observer     | [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)                     |

### `MultipleIntersectionObserver`

For performance, use `MultipleIntersectionObserver` to observe multiple elements with one shared observer instead of instantiating one per element.

```svelte
<script lang="ts">
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let ref1: HTMLElement | undefined = $state();
  let ref2: HTMLElement | undefined = $state();
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

#### Using with `#each`

`MultipleIntersectionObserver` also handles a dynamic, `#each`-driven list: give every item its own slot in an array/object instead of one shared variable.

```svelte
<script lang="ts">
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let items = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    text: `Item ${i + 1}`,
  }));

  let refs: (HTMLElement | undefined)[] = $state([]);
  let itemsContainer: HTMLElement | undefined = $state();
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

**Avoid** using the single-element `IntersectionObserver` component inside an `#each` block with one variable shared across iterations (e.g. `let node;` declared outside the loop, bound via `bind:this={node}` inside it). Every iteration overwrites the same `node`, so each observer keeps re-observing a moving target, which can cause an infinite update loop. Use `MultipleIntersectionObserver` with a per-item ref instead.

#### Props

| Name                 | Description                                           | Type                                                                                                                                    | Default value |
| :------------------- | :---------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :------------ |
| elements             | Array of elements to observe                          | `ReadonlyArray<Element \| null \| undefined>`                                                                                           | `[]`          |
| once                 | Unobserve elements after the first intersection event | `boolean`                                                                                                                               | `false`       |
| root                 | Containing element                                    | `Element` \| `Document` \| `null`                                                                                                        | `null`        |
| rootMargin           | Margin offset of the containing element               | `string`                                                                                                                                | `"0px"`       |
| threshold            | Percentage of element visibility to trigger an event  | `number` between 0 and 1, or an array of `number`s between 0 and 1                                                                      | `0`           |
| elementIntersections | Map of each element to its intersection state         | `Map<HTMLElement \| null, boolean>`                                                                                                     | `new Map()`   |
| elementEntries       | Map of each element to its latest entry               | `Map<HTMLElement \| null,` [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)`>` | `new Map()`   |
| observer             | `IntersectionObserver` instance                       | `null` or [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)                               | `null`        |
| skip                 | Pause observing all elements without losing state     | `boolean`                                                                                                                               | `false`       |

#### Callback props

Called with:

```ts
{
  entry: IntersectionObserverEntry;
  target: HTMLElement;
}
```

See [Callbacks](#callbacks-onobserve-onintersect-and-onexit) for when each one fires.

#### `children` snippet props

| Name                 | Type                                                                                                                                    |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| observer             | [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)                                         |
| elementIntersections | `Map<HTMLElement \| null, boolean>`                                                                                                     |
| elementEntries       | `Map<HTMLElement \| null,` [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)`>` |

### `intersect`

As an alternative to the `IntersectionObserver` component, use the `intersect` action to observe an element directly with `use:`, without a `bind:this` reference or extra markup. Listen for `onobserve`/`onintersect`/`onexit` on the observed element itself.

```svelte
<script lang="ts">
  import { intersect } from "svelte-intersection-observer";

  let actionIntersecting = $state(false);
</script>

<header class:intersecting={actionIntersecting}>
  {actionIntersecting ? "Element is in view" : "Element is not in view"}
</header>

<div
  use:intersect={{ once: true }}
  onobserve={(e) => {
    actionIntersecting = e.detail.isIntersecting;
  }}
>
  Hello world
</div>
```

Options passed to `use:intersect` are reactive: updating `root`, `rootMargin`, or `threshold` re-initializes the underlying observer. Updating `skip` toggles observing on the existing observer without re-initializing it.

#### Options

| Name       | Description                                              | Type                                                               | Default value |
| :--------- | :------------------------------------------------------- | :----------------------------------------------------------------- | :------------ |
| root       | Containing element                                       | `null` or `HTMLElement`                                            | `null`        |
| rootMargin | Margin offset of the containing element                  | `string`                                                           | `"0px"`       |
| threshold  | Percentage of element visibility to trigger an event     | `number` between 0 and 1, or an array of `number`s between 0 and 1 | `0`           |
| once       | Unobserve the element after the first intersection event | `boolean`                                                          | `false`       |
| skip       | Pause observing without disconnecting the observer       | `boolean`                                                          | `false`       |

#### Dispatched events

Same `onobserve`/`onintersect`/`onexit` behavior as described in [Callbacks](#callbacks-onobserve-onintersect-and-onexit); the action dispatches them on the element, and `e.detail` is the [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry).

### `intersectAttachment`

As of Svelte 5.29, [attachments](https://svelte.dev/docs/svelte/svelte-attachments) are the preferred replacement for actions. `intersectAttachment` wraps the `intersect` action with `svelte/attachments`'s `fromAction`, reusing the same observer logic but plugging into `{@attach ...}` instead of `use:`.

Attachments have a few architectural advantages over actions:

- No separate `update()` lifecycle method; they rerun reactively like a `$effect`
- Just plain functions, so they're easier to compose and generate dynamically
- Can be forwarded through components as ordinary props, unlike actions

```svelte
<script lang="ts">
  import { intersectAttachment } from "svelte-intersection-observer";

  let attachmentIntersecting = $state(false);
</script>

<header class:intersecting={attachmentIntersecting}>
  {attachmentIntersecting ? "Element is in view" : "Element is not in view"}
</header>

<div
  {@attach intersectAttachment(() => ({ once: true }))}
  onobserve={(e) => {
    attachmentIntersecting = e.detail.isIntersecting;
  }}
>
  Hello world
</div>
```

**Note**: unlike `use:intersect`, which takes the options object directly, `intersectAttachment` takes a function that _returns_ the options object (this is how `fromAction` tracks reactive dependencies). `intersect` remains fully supported; use whichever fits your codebase.

Options and dispatched events are identical to the [`intersect` action](#intersect) above.

### `createIntersectionObserver`

To get intersection state without wrapping markup in a component, use `createIntersectionObserver`, a script-only rune-based composable: call it in `<script>` for reactive `intersecting`/`entry` getters, then apply `attach` to the node with `{@attach}`.

```svelte no-eval
<script lang="ts">
  import { createIntersectionObserver } from "svelte-intersection-observer";

  const observer = createIntersectionObserver(() => ({ threshold: 0.5 }));
</script>

<div {@attach observer.attach}>
  {observer.intersecting ? "In view" : "Not in view"}
</div>
```

`createIntersectionObserver` takes the same options as [`intersectAttachment`](#intersectattachment) (as a function returning the options object) and reuses its underlying observer logic.

#### Return value

| Name         | Description                                             | Type                                                                                                                 |
| :----------- | :------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| intersecting | `true` if the observed element is intersecting the viewport | `boolean`                                                                                                          |
| entry        | Observed element metadata                                | `null` or [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) |
| attach       | Attachment to apply to the observed element via `{@attach}` | [`Attachment<HTMLElement>`](https://svelte.dev/docs/svelte/svelte-attachments)                                    |

### `createIntersectionGroup`

A bare `intersect`/`intersectAttachment` inside an `#each` block creates one native `IntersectionObserver` per iteration: for a long list, that's N observers instead of 1. `createIntersectionGroup` fixes this for the action/attachment API: call it once to create a group, then call `group.attach(...)` once per element to get an attachment that shares a single underlying observer across the whole group.

```svelte
<script lang="ts">
  import { createIntersectionGroup } from "svelte-intersection-observer";

  let groupItems = $state(
    Array.from({ length: 5 }, (_, i) => ({ id: i, intersecting: false })),
  );

  const group = createIntersectionGroup();
</script>

<header>
  {#each groupItems as item (item.id)}
    <div class:intersecting={item.intersecting}>
      Item {item.id}: {item.intersecting ? "✓" : "✗"}
    </div>
  {/each}
</header>

{#each groupItems as item (item.id)}
  <div
    class:intersecting={item.intersecting}
    {@attach group.attach({
      onobserve: (entry) => (item.intersecting = entry.isIntersecting),
    })}
  >
    Item {item.id}
  </div>
{/each}
```

`root`/`rootMargin`/`threshold` configure the one shared observer, so they're passed once to `createIntersectionGroup` itself (as a function) rather than per element:

```js
const group = createIntersectionGroup(() => ({
  root: container,
  rootMargin: "0px",
  threshold: 0.5,
}));
```

Shared options are reactive: when `root`, `rootMargin`, or `threshold` changes, the group rebuilds its single shared observer and re-observes every element. Note that elements whose `once` has already fired are re-observed as well.

`once`, `skip`, `onobserve`, `onintersect`, and `onexit` are the only options that make sense per element, so those are what `group.attach(...)` accepts.

#### Signature

```ts
function createIntersectionGroup(
  getSharedOptions?: () => IntersectGroupSharedOptions,
): IntersectionGroup;
```

#### Shared options

Passed once to `createIntersectionGroup`; apply to every element in the group.

| Name       | Description                                           | Type                                                               | Default value |
| :--------- | :----------------------------------------------------- | :----------------------------------------------------------------- | :------------ |
| root       | Containing element                                    | `null` or `HTMLElement`                                            | `null`        |
| rootMargin | Margin offset of the containing element               | `string`                                                           | `"0px"`       |
| threshold  | Percentage of element visibility to trigger an event  | `number` between 0 and 1, or an array of `number`s between 0 and 1 | `0`           |

#### `group.attach(options)` per-node options

Passed once per element, to `group.attach(...)`.

| Name       | Description                                               | Type                                                    | Default value |
| :--------- | :---------------------------------------------------------- | :------------------------------------------------------- | :------------ |
| once       | Unobserve the element after the first intersection event  | `boolean`                                               | `false`       |
| skip       | Skip observing this element without affecting the group   | `boolean`                                               | `false`       |
| onobserve  | Called when the element is first observed or when an intersection change occurs | `(entry: IntersectionObserverEntry) => void` | `undefined` |
| onintersect | Called when the element is intersecting the viewport      | `(entry: IntersectionObserverEntry) => void`            | `undefined`   |
| onexit     | Called when the element stops intersecting                | `(entry: IntersectionObserverEntry) => void`            | `undefined`   |

#### Callbacks: `onobserve`, `onintersect`, and `onexit`

Every primitive above exposes the same three callbacks, called with an [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) (components pass it directly; action and attachment dispatch it as `event.detail`):

- **onobserve**: called when the element is first observed, and again on every intersection change
- **onintersect**: called only when the element is intersecting the viewport (a filtered view of `onobserve`)
- **onexit**: called when the element stops intersecting (transitions out of view); not called for the initial off-screen report

```svelte no-eval
<IntersectionObserver
  {element}
  onobserve={(entry) => {
    console.log(entry); // IntersectionObserverEntry
    console.log(entry.isIntersecting); // true | false
  }}
  onintersect={(entry) => {
    console.log(entry.isIntersecting); // always true
  }}
  onexit={(entry) => {
    console.log(entry.isIntersecting); // always false
  }}
>
  <div bind:this={element}>Hello world</div>
</IntersectionObserver>
```

## Use Cases

Realistic scenarios built from the primitives above.

### Lazy-loading images

Delay loading an image's real `src` until it's about to scroll into view. `rootMargin` starts the fetch slightly before the image is visible so it's ready when the user scrolls to it; `once` stops observing once it has loaded.

```svelte no-eval
<script lang="ts">
  import { intersectAttachment } from "svelte-intersection-observer";

  let loaded = $state(false);
</script>

<img
  {@attach intersectAttachment(() => ({ once: true, rootMargin: "200px" }))}
  onintersect={() => (loaded = true)}
  src={loaded ? "/photo.jpg" : "/placeholder.jpg"}
  alt=""
/>
```

### Autoplaying video

Play a `<video>` while it's on screen and pause it once it scrolls away. Unlike lazy-loading, this needs to react every time visibility changes, so use the `onintersect`/`onexit` pair (not `onobserve`) and skip `once`.

```svelte no-eval
<script lang="ts">
  import { intersect } from "svelte-intersection-observer";

  let video: HTMLVideoElement | undefined = $state();
</script>

<video
  bind:this={video}
  use:intersect
  onintersect={() => video?.play()}
  onexit={() => video?.pause()}
  src="/clip.mp4"
  muted
  loop
></video>
```

### Tracking impressions

Fire an impression event the first time an element is meaningfully visible. `threshold` sets what counts as "visible enough," and `once` guarantees a single event per element.

```svelte no-eval
<div
  use:intersect={{ once: true, threshold: 0.5 }}
  onintersect={() => analytics.track("ad_impression", { id: "banner-1" })}
>
  <!-- ad content -->
</div>
```

### Infinite scroll

To detect when a user has scrolled to the end of a scrollable container, place a sentinel element after the content and set `root` to the container. `intersecting` becomes `true` once the sentinel scrolls into view.

**Note**: `root` must be the scrollable element itself (i.e. it has its own `overflow`/fixed `height`), not just an ancestor of one. If `root` merely sits inside a scrollable ancestor, the sentinel scrolls along with `root` and never changes position relative to it, so it reports as permanently intersecting.

```svelte
<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let container: HTMLElement | undefined = $state();
  let sentinel: HTMLElement | undefined = $state();
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

The same sentinel pattern powers infinite scroll: call a `loadMore()` function from `onintersect` instead of (or alongside) updating `reachedEnd`.

### Reveal animation on scroll

Keep the `bind:this` element outside the `{#if intersecting}` block, and only gate the animated content inside it. The bound element stays in the DOM even before the reveal fires, so external triggers like `scrollIntoView()` still work, and the animation replays every time the element crosses into or out of view.

```svelte
<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";
  import { fly } from "svelte/transition";

  let revealNode: HTMLElement | undefined = $state();
  let revealIntersecting = $state(false);
</script>

<header class:intersecting={revealIntersecting}>
  <p>{revealIntersecting ? "In view" : "Not in view"}</p>
  <button
    style="margin-top: 0.75rem;"
    onclick={() => {
      revealNode?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }}
  >
    Scroll to section
  </button>
</header>

<IntersectionObserver element={revealNode} bind:intersecting={revealIntersecting}>
  <div bind:this={revealNode}>
    {#if revealIntersecting}
      <section transition:fly={{ y: 50, duration: 300 }}>
        Hello world
      </section>
    {/if}
  </div>
</IntersectionObserver>
```

### `skip`

Set `skip` to `true` to unobserve without disconnecting the underlying observer or losing `entry`/`intersecting` state. Useful for pausing tracking on an off-screen carousel panel or a closed modal. Set `skip` back to `false` to resume; unlike `once`, this toggles back and forth freely. `MultipleIntersectionObserver` and the `intersect` action support the same `skip` option.

```svelte no-eval
<script lang="ts">
  import IntersectionObserver from "svelte-intersection-observer";

  let elementSkip: HTMLElement | undefined = $state();
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

### List strategy

Both [`MultipleIntersectionObserver`](#multipleintersectionobserver) and [`createIntersectionGroup`](#createintersectiongroup) share one observer across many elements. Pick based on how you want to wire it up:

- Use `MultipleIntersectionObserver` when you're fine wrapping the list in a component and want a ready-made `elementIntersections` map handed to you via the `children` snippet.
- Use `createIntersectionGroup` when you'd rather attach directly to each element with `{@attach}`, no extra component, and are happy tracking intersection state on your own per-item objects (as shown in its example above).

Either way, avoid giving `IntersectionObserver` a single shared `bind:this` variable inside `#each`; see the warning under [pooled component](#multipleintersectionobserver).

## `IntersectionObserverEntry`

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
