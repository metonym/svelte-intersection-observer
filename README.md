# svelte-intersection-observer

[![NPM][npm]][npm-url]

> Detect if an element is in the viewport using the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry).

Try it in the [Svelte REPL](https://svelte.dev/repl/8cd2327a580c4f429c71f7df999bd51d?version=3.29.7).

<!-- TOC -->

## Install

```bash
yarn add -D svelte-intersection-observer
# OR
npm i -D svelte-intersection-observer
```

## Usage

<!-- prettier-ignore-start -->
```svelte
<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let element;
  let intersecting;
</script>

<header class:intersecting>
  {intersecting ? 'Element is in view' : 'Element is not in view'}
</header>

<IntersectionObserver {element} bind:intersecting>
  <div bind:this={element}>Hello world</div>
</IntersectionObserver>
```

Working with dispatched events
```svelte
<script>
  import IntersectionObserver from "svelte-intersection-observer";

  let element;
  let observer;

  const onIntersectHandler = (entry) => {
    if (someCondition) {
      observer.unobserve(entry.details.target);
    }
  }
</script>

<IntersectionObserver {element} bind:observer on:intersect={onIntersectHandler}>
  <div bind:this={element}>Hello world</div>
</IntersectionObserver>
```
<!-- prettier-ignore-end -->


## API

### Props

| Prop name    | Description                                                       | Value                                                                                                     |
| :----------- | :---------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| element      | Element observed for intersection                                 | `HTMLElement`                                                                                             |
| root         | Containing element                                                | `null` or `HTMLElement` (default: `null`)                                                                 |
| rootMargin   | Offset of the containing element                                  | `string` (default: `"0px"`)                                                                               |
| threshold    | Percentage of element to trigger an event                         | `number` between 0 and 1 (default: `0`)                                                                   |
| entry        | Observed element metadata                                         | [`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) |
| once         | If `true`, the observed element will be unobserved upon intersect | `boolean` (default: `false`)                                                                              |
| intersecting | `true` if the observed element is intersecting the viewport       | `boolean` (default: `false`)                                                                              |
| observer     | IntersectionObserver instance                                     | [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)           |

### Dispatched events

- **on:observe**: fired when an intersection change occurs (type `IntersectionObserverEntry`)
- **on:intersect**: fired when an intersection change occurs and the element is intersecting (type `IntersectionObserverEntry`)

## TypeScript support

Svelte version 3.31.0 or greater is required to use this module with TypeScript.

## Changelog

[Changelog](CHANGELOG.md)

## License

[MIT](LICENSE)

[npm]: https://img.shields.io/npm/v/svelte-intersection-observer.svg?color=%23ff3e00&style=for-the-badge
[npm-url]: https://npmjs.com/package/svelte-intersection-observer
