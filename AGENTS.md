# Repository Guidance

## Shared Svelte Conventions

- Use `../svelte-lib/AGENTS.md` as the source of truth for shared Svelte formatting, config, lint, dependency, D3, Vite, Rollup, CSS import, and scoped embedded styling conventions.

## Documentation

- For README links that intentionally open a new tab, use an HTML anchor with `target="_blank"` and `rel="noopener noreferrer"`.

## Embedded Bundles

- Preserve the two Rollup outputs unless deliberately changing the Jekyll integration: `src/main.js` builds `dist/bundle.js` to mount the firework canvas, and `src/main2.js` builds `dist/bundle2.js` to expose the global `window.launchFireworkBurst` helper.
