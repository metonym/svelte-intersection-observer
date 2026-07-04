import { type Component, mount as svelteMount } from "svelte";

export function mount(
  Component: Component,
  target: HTMLElement | null = document.getElementById("app"),
): void {
  if (target) svelteMount(Component, { target });
}
