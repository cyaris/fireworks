# Repository Guidance

## Shared Svelte Infrastructure

- Inherit shared config from `svelte-lib` where available: `svelte.config.js`, `tailwind.config.cjs`, `postcss.config.cjs`, `.prettierrc.cjs`, `eslint.config.js`, and `rollup.config.js`.
- Keep `eslint.config.js` managed by `svelte-lib`; do not replace the re-export with a project-local ESLint configuration. The shared ESLint config assumes ESLint 9 from `svelte-lib`, so refresh the lockfile when shared lint dependencies change.
- Follow the shared `no-use-before-define` convention for JS/CJS files. The shared config intentionally disables this rule for `.svelte` files until `svelte-lib` has a Svelte-aware solution; do not add project-local overrides for it.
- Declare packages imported directly by this package in this package's `package.json`; do not rely on `svelte-lib` to provide transitive runtime dependencies for package-owned imports.
- Keep `rollup.config.js` as a thin call to `createRollupConfig({ scopeClass: "fireworks", entries })`; do not reintroduce project-local Rollup plugin setup or scoped-class PostCSS plugins.
- Keep `linklocal` and the `file:../svelte-lib` dependency in `package.json` so local shared-library development follows the same pattern as the other embedded Svelte apps.
- Keep `vite.config.js` as a thin local wrapper around `createViteConfig()` from the package export `svelte-lib/vite.config.js`. Do not import `sveltekit` locally or reach into `../svelte-lib/src/lib/vite.config.js`; the shared helper owns SvelteKit plugin wiring.

## Code Formatting

- Do not use non-functional trailing commas in multiline syntax. Prefer single-line object, call, command, and Svelte markup attribute definitions when they fit under the repository's effective formatter width.
- Prefer single-line formatting for simple parenthesized expressions and arrow callback bodies when they fit within the repository's formatter rules, such as `onMount(() => (mounted = true))`.
- Do not make cleanup changes that only remove blank lines or linebreaks; preserve existing linebreak structure unless the surrounding code is being changed for a substantive reason or the formatter requires it.
- For repository-wide formatting passes, format non-Python files with Prettier using `trailingComma: "none"` and a wide print width so objects/calls are not wrapped solely for style.

## Documentation

- For README links that intentionally open a new tab, use an HTML anchor with `target="_blank"` and `rel="noopener noreferrer"`.

## Frontend Code Structure

- Import only the D3 subpackages actually used by the animation code, such as `d3-selection`, `d3-transition`, `d3-ease`, `d3-random`, and `d3-timer`. Do not use the umbrella `d3` package import in frontend bundles.
- Avoid introducing static/helper local variables that are referenced only once. Inline those expressions unless a named local is needed to preserve behavior, such as reusing the same random value for multiple coordinates.
- Do not mutate exported Svelte props to control internal component lifecycle. Use local component state, such as mount or one-shot launch flags, for internal gating.

## Embedded Bundles

- Preserve the two Rollup outputs unless deliberately changing the Jekyll integration: `src/main.js` builds `dist/bundle.js` to mount the firework canvas, and `src/main2.js` builds `dist/bundle2.js` to expose the global `window.launchFireworkBurst` helper.
- Import shared CSS in Rollup entry files through `svelte-lib` package exports, such as `svelte-lib/styles/app.css` and `svelte-lib/styles/root.css`. Do not import from `../node_modules/svelte-lib/src/...` source paths.
- Avoid `$lib` aliases in exported library components and code bundled directly by Rollup. Use relative imports inside `src/lib` so package output and Rollup bundles do not depend on SvelteKit-only aliases.
