import { type Component, flushSync, mount, unmount } from "svelte";

/** Mounts a fixture into a detached container and returns a matching cleanup function. */
export function render(Component: Component) {
  const target = document.createElement("div");
  document.body.appendChild(target);
  const instance = flushSync(() => mount(Component, { target }));

  return {
    target,
    cleanup: () => {
      unmount(instance);
      target.remove();
    },
  };
}
