import type { SvelteComponent } from "svelte";

/**
 * Svelte 3 components are classes; mount with `new Component({ target })`
 * (the `svelte/mount` helper this mirrors is Svelte 5-only).
 */
export function mount(
  Component: new (options: { target: HTMLElement }) => SvelteComponent,
  target: HTMLElement | null = document.getElementById("app"),
): void {
  if (target) new Component({ target });
}
