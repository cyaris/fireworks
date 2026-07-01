# fireworks

Svelte package and demo app for rendering animated fireworks. It exposes reusable Svelte components and JavaScript functions that other local projects can use for celebratory UI moments.

## What it does

- Renders a full-window SVG fireworks canvas.
- Launches randomized firework bursts using D3 transitions, timers, easing, and color palettes.
- Provides a `FireworkShow` component that starts a configurable main show and finale.
- Exports both component and function entry points for use in other Svelte apps.

## Project layout

```text
src/lib/components/   FireworkCanvas and FireworkShow components
src/lib/functions/    Firework launch/show functions
src/lib/static/       Firework color palettes
src/routes/           Local Svelte demo route
dist/                 Generated package output
```

## Development

Install dependencies from this directory:

```sh
npm install
```

Start the local Vite dev server:

```sh
npm run dev
```

Build and package:

```sh
npm run build
npm run rollup
```

Run validation:

```sh
npm run check
npm run lint
npm run format:check
```

## Local usage

Projects in this workspace use the package through a local file dependency, for example:

```json
"fireworks": "file:../fireworks"
```

Import the Svelte component when an app needs a ready-made show:

```svelte
<script>
  import { FireworkShow } from "fireworks/components"
</script>

<div class="fixed left-0 top-0">
  <FireworkShow totalFireworksMain={75} totalFireworksFinale={25} />
</div>
```

The lower-level functions are also available from `fireworks/functions`.

## Credits

The firework burst process is adapted from this D3 blocks example:
[http://bl.ocks.org/s2t2/53e96654487b4b0ef6e5](http://bl.ocks.org/s2t2/53e96654487b4b0ef6e5).
This package keeps the core idea while expanding and improving on it, with adjustments for local preferences and package-version differences.
