# examples

> Example set-ups that use `svelte-intersection-observer` with popular bundlers/frameworks.

## Local development

For local development, create a link for the package at the root of the repository.

```bash
git clone https://github.com/metonym/svelte-intersection-observer.git
cd svelte-intersection-observer
yarn link
```

Then, link the package for each example.

```bash
cd examples/sveltekit
```

Link the local package:

```bash
yarn link "svelte-intersection-observer"
yarn install
yarn dev
```
