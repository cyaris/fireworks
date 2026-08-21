# fireworks

Svelte package and demo app for rendering animated fireworks. It exposes reusable Svelte components and JavaScript functions that other local projects can use for celebratory UI moments.

## Live usage

The fireworks appear in three live contexts:

- the top-left navigation button on <a href="https://charlieyaris.com/" target="_blank" rel="noopener noreferrer">charlieyaris.com</a>
- the <a href="https://github.com/cyaris/profile_photo" target="_blank" rel="noopener noreferrer">profile photo</a> on the home page
- <a href="https://github.com/cyaris/mastermind" target="_blank" rel="noopener noreferrer">Mastermind</a> on its <a href="https://charlieyaris.com/mastermind/" target="_blank" rel="noopener noreferrer">project page</a>

## What it does

- Renders a full-window Canvas 2D fireworks scene, animated with one coordinated `requestAnimationFrame` loop
- Launches randomized firework bursts with D3:
  - color interpolation
  - easing
  - random distributions
  - timers
- Draws plain numerical particle state to Canvas each frame
- Provides a `FireworkShow` component that starts a configurable main show and finale
- Exports both component and function entry points for other Svelte apps

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

The lower-level functions are also available from `fireworks/functions`. Calling `launchFireworkBurst` directly requires
a `<canvas id="fireworks">` element already present in the DOM, since it targets that element instead of creating one;
use the `FireworkCanvas` component, or render an equivalent `canvas` element yourself, before calling the function.

## Credits

The firework burst process is adapted from this D3 blocks example:
<a href="http://bl.ocks.org/s2t2/53e96654487b4b0ef6e5" target="_blank" rel="noopener noreferrer">http://bl.ocks.org/s2t2/53e96654487b4b0ef6e5</a>.
This package keeps the core idea while expanding and improving on it, with adjustments for local preferences and package-version differences.

## GitHub Actions Workflows

These local wrappers inherit their reusable implementations from `cyaris/shared-automation`. The
[shared-automation workflow reference](https://github.com/cyaris/shared-automation#workflows) documents shared
behavior, inputs, and secrets.

### `.github/workflows/auto-create-dev-pr.yml`

The `Auto-create dev pull request` workflow runs on pushes to `dev` and calls the
[shared auto-create-dev-pr workflow](https://github.com/cyaris/shared-automation#githubworkflowsauto-create-dev-pryml).

### `.github/workflows/rollup.yml`

The `Rollup` workflow calls the
[shared rollup workflow](https://github.com/cyaris/shared-automation#githubworkflowsrollupyml) with these local details:

- triggers: pushes to `dev` and `main`, plus manual dispatch
- destination: `s3://cyaris.github.io/fireworks/`
- production naming: unprefixed bundles from `main`
- staged naming: `test_bundle.*` from `dev`
- bundle sets: `bundle.*` and `bundle2.*`

This workflow checks out `svelte-lib` at the latest `main` commit as a local dependency. The shared workflow resolves
that branch to an exact commit SHA before checkout.

### `.github/workflows/upstream-watch.yml`

The `Upstream Watch` workflow runs daily at 12:23 UTC, one hour before the GitHub Pages build for `cyaris.github.io`, and on
manual dispatch, then calls the
[shared upstream-watch workflow](https://github.com/cyaris/shared-automation#githubworkflowsupstream-watchyml). It
watches `svelte-lib`'s `main` branch and, when it has moved since the last check, dispatches this repository's own
`Rollup` workflow on `main` so the build picks up the new upstream commit without waiting for a push here.

### `.github/workflows/auto-release.yml`

The `Auto release` workflow runs from manual dispatch only and calls the
[shared auto-release workflow](https://github.com/cyaris/shared-automation#githubworkflowsauto-releaseyml). This
repository contributes `.github/release-policy.yml` overrides; manual runs read the shared release policy from `main`.
Release creation or existing-release updates require reviewing the generated plan and explicitly enabling publication for
an approved run.

### `.github/workflows/workflow-validation.yml`

The `Workflow validation` workflow runs on local workflow and automation configuration changes, then calls the
[shared workflow-validation workflow](https://github.com/cyaris/shared-automation#githubworkflowsworkflow-validationyml)
to validate rollup upload wrapper logic, release-policy configuration, and Renovate configuration.
