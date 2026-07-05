# svelte-intersection-observer

<!-- HIDE_START -->
[![NPM][npm]][npm-url]
<!-- HIDE_END -->

## About

`svelte-intersection-observer` wraps the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). It tells you when an element enters or leaves the viewport, without scroll listeners. Typical uses include lazy-loading, scroll animations, infinite scroll, autoplaying video, and impression tracking. See [Use cases](#use-cases).

Six exports, pick by how you want to wire it up:

| Kind | Export | Use it when... |
| :-------- | :----- | :--------------------- |
| [Component](#intersectionobserver) | `IntersectionObserver` | you want a component with a bound `intersecting` prop |
| [Pooled component](#multipleintersectionobserver) | `MultipleIntersectionObserver` | you're observing many elements and want one shared observer |
| [Action](#intersect) | `intersect` | you want `use:` on a plain element, no extra markup |
| [Attachment](#intersectattachment) | `intersectAttachment` | same as the action, composed via `{@attach}` (Svelte 5.29+) |
| [Composable](#createintersectionobserver) | `createIntersectionObserver` | you want reactive state from `<script>`, no directive |
| [Factory](#createintersectiongroup) | `createIntersectionGroup` | you're rendering a list with `{@attach}` and want one shared observer |

Full docs for each are under [API](#api). Try it in the [Svelte REPL](https://svelte.dev/repl/8cd2327a580c4f429c71f7df999bd51d).

### Compatibility

| Package version | Svelte version    | Notes                                     |
| :--------------- | :----------------- | :----------------------------------------- |
| [1.x](https://github.com/metonym/svelte-intersection-observer/tree/v1.2.x) | 3, 4, 5 (legacy/non-runes) | Uses `export let`, slots, and `on:` events |
| 2.x              | ≥5.29 (legacy + runes) | Uses `$props()`, snippets, and callback props |

Internals use runes. A legacy (non-runes) Svelte 5 component can still consume them: `bind:`, callback props, snippets, and `{@attach}` work across that boundary. One exception is [`createIntersectionObserver`](#createintersectionobserver). It exposes `intersecting`/`entry` as plain getters, with no `bind:` or callback prop. Legacy templates do not reactively track getter reads, so the UI only updates if the consuming component is in runes mode.

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

## API

Every export takes the same core options (`root`, `rootMargin`, `threshold`, `once`, `skip`) and the same `onobserve`/`onintersect`/`onexit` callbacks. What changes is how you attach it in markup. [Use cases](#use-cases) shows concrete setups.

#### Callbacks `onobserve` `onintersect` and `onexit`

All six exports expose these three callbacks. Each receives an [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry). Components pass the entry directly; the action and attachment put it on `event.detail`.

- **onobserve**: fires when the element is first observed, then on every intersection change
- **onintersect**: fires only while the element intersects the viewport
- **onexit**: fires when the element leaves view; not called for the initial off-screen report

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

### `IntersectionObserver`

Pass an element with [`bind:this`](https://svelte.dev/docs#bind_element), then bind `intersecting` to know whether it is in the viewport.

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

Set `once` to `true` to unobserve after the first intersection. Good for a one-shot reveal, lazy-load, or analytics impression.

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

Instead of binding `intersecting`, you can use the `children` snippet. It receives `intersecting`, `entry`, and `observer`.

Here, "Hello world" fades in when its container enters the viewport.

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

**Note**: for `threshold` values above `0`, the observed `element` needs a non-zero width and height. That comes from the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), not this component.

#### Callback props

Same `onobserve`/`onintersect`/`onexit` behavior as described in [Callbacks](#callbacks-onobserve-onintersect-and-onexit) above.

#### `children` snippet props

| Name         | Type                                                                                                                |
| :----------- | :------------------------------------------------------------------------------------------------------------------ |
| intersecting | `boolean`                                                                                                           |
| entry        | `null` or [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) |
| observer     | [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)                     |

### `MultipleIntersectionObserver`

Use `MultipleIntersectionObserver` when you have many elements and want one shared observer instead of one per element.

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

`MultipleIntersectionObserver` works with a dynamic `#each` list. Give every item its own slot in an array or object; do not reuse one shared variable.

```svelte
<script lang="ts">
  import { MultipleIntersectionObserver } from "svelte-intersection-observer";

  let items = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    text: `Item ${i + 1}`,
  }));

  let refs: (HTMLElement | undefined)[] = $state([]);
  let itemsContainer: HTMLElement | undefined = $state();
</script>

<MultipleIntersectionObserver elements={refs} root={itemsContainer}>
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

Same rule as the scroll-to-end example: `root` must scroll on its own. Here `itemsContainer` has an explicit `height` and `overflow-y: auto`.

**Avoid** putting the single-element `IntersectionObserver` inside an `#each` with one variable shared across iterations, such as `let node;` outside the loop and `bind:this={node}` inside. Every iteration overwrites `node`, so each observer keeps chasing a moving target and can loop forever. Use `MultipleIntersectionObserver` with a per-item ref instead.

#### Props

| Name                  | Description                                                            | Type                                                              | Default value |
| :-------------------- | :--------------------------------------------------------------------- | :---------------------------------------------------------------- | :------------ |
| elements              | Array of elements to observe                                           | `Array<null \| undefined \| Element>`                             | `[]`          |
| root                  | Containing element                                                     | `Element` \| `Document` \| `null`                                  | `null`        |
| rootMargin            | Margin offset of the containing element                                | `string`                                                          | `"0px"`       |
| threshold             | Percentage of element visibility to trigger an event                   | `number` between 0 and 1, or an array of `number`s between 0 and 1 | `0`           |
| once                  | Unobserve each element after its first intersection event              | `boolean`                                                         | `false`       |
| skip                  | Pause observing all elements without clearing current state            | `boolean`                                                         | `false`       |
| elementIntersections  | Map of each element to its current intersecting state                  | `Map<null \| undefined \| Element, boolean>`                      | `new Map()`   |
| elementEntries        | Map of each element to its latest observer entry                       | `Map<null \| undefined \| Element, IntersectionObserverEntry>`    | `new Map()`   |
| observer              | Shared `IntersectionObserver` instance                                 | `null` or [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) | `null` |

#### Callback props

Same `onobserve`/`onintersect`/`onexit` behavior as described in [Callbacks](#callbacks-onobserve-onintersect-and-onexit) above. Each callback receives the element's individual `IntersectionObserverEntry`.

#### `children` snippet props

| Name                 | Type                                                                                             |
| :------------------- | :----------------------------------------------------------------------------------------------- |
| elementIntersections | `Map<null \| undefined \| Element, boolean>`                                                    |
| elementEntries       | `Map<null \| undefined \| Element, IntersectionObserverEntry>`                                  |
| observer             | [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) |

### `intersect`

Use the `intersect` action to observe an element with `use:` and no wrapper component.

```svelte no-eval
<script lang="ts">
  import { intersect } from "svelte-intersection-observer";

  let inView = $state(false);
</script>

<div
  use:intersect
  onobserve={(e) => {
    inView = e.detail.isIntersecting;
  }}
>
  {inView ? "In view" : "Not in view"}
</div>
```

#### Parameters

| Name       | Description                                               | Type                                                    | Default value |
| :--------- | :-------------------------------------------------------- | :------------------------------------------------------ | :------------ |
| once       | Unobserve the element after the first intersection event  | `boolean`                                               | `false`       |
| skip       | Pause observing without losing `entry`/`intersecting` state | `boolean`                                            | `false`       |
| root       | Containing element                                        | `Element` \| `Document` \| `null`                       | `null`        |
| rootMargin | Margin offset of the containing element                   | `string`                                                | `"0px"`       |
| threshold  | Percentage of element visibility to trigger an event      | `number` between 0 and 1, or an array of `number`s between 0 and 1 | `0` |
| onobserve  | Called when the element is first observed or when an intersection change occurs | `(entry: IntersectionObserverEntry) => void` | `undefined` |
| onintersect | Called when the element is intersecting the viewport     | `(entry: IntersectionObserverEntry) => void`            | `undefined`   |
| onexit     | Called when the element stops intersecting                | `(entry: IntersectionObserverEntry) => void`            | `undefined`   |

### `intersectAttachment`

Use `intersectAttachment` in Svelte 5.29+ if you prefer `{@attach}` over `use:`.

```svelte no-eval
<script lang="ts">
  import { intersectAttachment } from "svelte-intersection-observer";

  let inView = $state(false);
</script>

<div
  {@attach intersectAttachment()}
  onobserve={(e) => {
    inView = e.detail.isIntersecting;
  }}
>
  {inView ? "In view" : "Not in view"}
</div>
```

#### Parameters

Same options and callbacks as [`intersect`](#intersect).

### `createIntersectionObserver`

Use `createIntersectionObserver` to create and control observation from `<script>` without a directive or wrapper.

```svelte no-eval
<script lang="ts">
  import { createIntersectionObserver } from "svelte-intersection-observer";

  let target: HTMLElement | undefined = $state();

  const observer = createIntersectionObserver(() => ({
    element: target,
    threshold: 0.5,
  }));
</script>

<div bind:this={target}>
  {observer.intersecting ? "Half visible" : "Less than half visible"}
</div>
```

#### Signature

```ts
function createIntersectionObserver(
  getOptions?: () => IntersectOptions,
): {
  readonly intersecting: boolean;
  readonly entry: IntersectionObserverEntry | null;
  readonly observer: IntersectionObserver | null;
};
```

#### Options

Same core options as [`IntersectionObserver`](#intersectionobserver): `element`, `root`, `rootMargin`, `threshold`, `once`, and `skip`.

#### Callback options

Same `onobserve`/`onintersect`/`onexit` behavior as described in [Callbacks](#callbacks-onobserve-onintersect-and-onexit) above.

### `createIntersectionGroup`

Use `createIntersectionGroup` for one shared observer across many elements, attaching to each node with `{@attach}`.

```svelte no-eval
<script lang="ts">
  import { createIntersectionGroup } from "svelte-intersection-observer";

  let sections = [
    { id: "intro", title: "Intro", visible: false },
    { id: "details", title: "Details", visible: false },
    { id: "summary", title: "Summary", visible: false },
  ];

  let sectionRoot: HTMLElement | undefined = $state();

  const group = createIntersectionGroup(() => ({
    root: sectionRoot,
    threshold: 0.25,
  }));
</script>

<div bind:this={sectionRoot} style="height: 200px; overflow-y: auto;">
  {#each sections as section (section.id)}
    <section
      id={section.id}
      style="height: 160px;"
      {@attach group.attach({
        onobserve: (entry) => {
          section.visible = entry.isIntersecting;
        },
      })}
    >
      <h3>{section.title}</h3>
      <p>{section.visible ? "Visible" : "Not visible"}</p>
    </section>
  {/each}
</div>
```

#### Signature

```ts
function createIntersectionGroup(
  getSharedOptions?: () => IntersectGroupSharedOptions,
): IntersectionGroup;
```

#### Shared options

Passed once to `createIntersectionGroup`. Apply to every element in the group.

| Name       | Description                                           | Type                                                               | Default value |
| :--------- | :----------------------------------------------------- | :----------------------------------------------------------------- | :------------ |
| root       | Containing element                                    | `null` or `HTMLElement`                                            | `null`        |
| rootMargin | Margin offset of the containing element               | `string`                                                           | `"0px"`       |
| threshold  | Percentage of element visibility to trigger an event  | `number` between 0 and 1, or an array of `number`s between 0 and 1 | `0`           |

#### `group.attach(options)` per-node options

Passed once per element, to `group.attach(...)`.

| Name       | Description                                               | Type                                                    | Default value |
| :--------- | :-------------------------------------------------------- | :------------------------------------------------------ | :------------ |
| once       | Unobserve the element after the first intersection event  | `boolean`                                               | `false`       |
| skip       | Skip observing this element without affecting the group   | `boolean`                                               | `false`       |
| onobserve  | Called when the element is first observed or when an intersection change occurs | `(entry: IntersectionObserverEntry) => void` | `undefined` |
| onintersect | Called when the element is intersecting the viewport     | `(entry: IntersectionObserverEntry) => void`            | `undefined`   |
| onexit     | Called when the element stops intersecting                | `(entry: IntersectionObserverEntry) => void`            | `undefined`   |

### SSR

All exports are SSR-safe. You do not need guards. On the server nothing is observed, so `intersecting` is `false` and `entry` is `null`. Observation starts after mount in the browser. If above-the-fold content must look correct in the server HTML, do not gate its critical rendering on `intersecting`.

## Use cases

Concrete setups using the exports above.

### Lazy-loading images

Delay the real `src` until the image is about to enter view. `rootMargin` starts the fetch a bit early so it is ready when the user scrolls to it. `once` stops observing after load.

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

Play a `<video>` while it is on screen, pause when it leaves. This needs a reaction on every visibility change, so use `onintersect`/`onexit` and skip `once`.

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

Fire an impression the first time an element is meaningfully visible. `threshold` defines "visible enough." `once` keeps it to a single event per element.

```svelte no-eval
<div
  use:intersect={{ once: true, threshold: 0.5 }}
  onintersect={() => analytics.track("ad_impression", { id: "banner-1" })}
>
  <!-- ad content -->
</div>
```

### Infinite scroll

To detect scroll-to-end in a scrollable container, put a sentinel after the content and set `root` to the container. `intersecting` becomes `true` when the sentinel enters view.

**Note**: `root` must be the scrollable element itself. It needs its own `overflow` and fixed `height`, not merely an ancestor that scrolls. If `root` only sits inside a scrollable ancestor, the sentinel moves with `root` and never changes position relative to it, so it stays permanently intersecting.

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

Same sentinel pattern for infinite scroll: call `loadMore()` from `onintersect` instead of, or as well as, updating `reachedEnd`.

### Reveal animation on scroll

Keep the `bind:this` element outside `{#if intersecting}`. Only gate the animated content inside. The bound element stays in the DOM before the reveal, so things like `scrollIntoView()` still work, and the animation can replay each time the element enters or leaves view.

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

Respect `prefers-reduced-motion` by gating the transition, for example with Svelte's [`prefersReducedMotion`](https://svelte.dev/docs/svelte/svelte-motion#prefersReducedMotion) store from `svelte/motion` (≥5.7).

### `skip`

Set `skip` to `true` to unobserve without disconnecting the observer or clearing `entry`/`intersecting`. Handy for pausing on an off-screen carousel panel or a closed modal. Set it back to `false` to resume. Unlike `once`, this toggles freely. `MultipleIntersectionObserver` and the `intersect` action support `skip` too.

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

[`MultipleIntersectionObserver`](#multipleintersectionobserver) and [`createIntersectionGroup`](#createintersectiongroup) both share one observer across many elements. Choose by wiring style:

- `MultipleIntersectionObserver` if you are fine wrapping the list in a component and want an `elementIntersections` map from the `children` snippet.
- `createIntersectionGroup` if you would rather `{@attach}` on each element with no wrapper, and track intersection on your own per-item objects.

Either way, do not give `IntersectionObserver` a single shared `bind:this` inside `#each`. See the warning under [pooled component](#multipleintersectionobserver).

## `IntersectionObserverEntry`

Fields on an [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) are read-only. The ones you reach for most are `isIntersecting`, `intersectionRatio`, and `target`. MDN covers the rest.

[npm]: https://img.shields.io/npm/v/svelte-intersection-observer.svg?color=%23ff3e00&style=for-the-badge
[npm-url]: https://npmjs.com/package/svelte-intersection-observer
