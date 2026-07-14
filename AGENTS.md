# Repository Guidance

## Shared Svelte Conventions

- Use `../svelte-lib/AGENTS.md` as the source of truth for shared Svelte formatting, config, lint, dependency, D3, Vite, Rollup, CSS import, and scoped embedded styling conventions.
- Keep local guidance focused on `fireworks`-specific entrypoints, bundle outputs, and behavior.

## Documentation

- For README links that intentionally open a new tab, use an HTML anchor with `target="_blank"` and `rel="noopener noreferrer"`.

## Frontend Code Structure

- Avoid introducing static/helper local variables that are referenced only once. Inline those expressions unless a named local is needed to preserve behavior, such as reusing the same random value for multiple coordinates.
- Do not mutate exported Svelte props to control internal component lifecycle. Use local component state, such as mount or one-shot launch flags, for internal gating.

## Embedded Bundles

- Preserve the two Rollup outputs unless deliberately changing the Jekyll integration: `src/main.js` builds `dist/bundle.js` to mount the firework canvas, and `src/main2.js` builds `dist/bundle2.js` to expose the global `window.launchFireworkBurst` helper.
