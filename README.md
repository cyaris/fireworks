# fireworks

Svelte package and demo app for rendering animated fireworks. It exposes reusable Svelte components and JavaScript functions that other local projects can use for celebratory UI moments.

## Live usage

The fireworks can be viewed live on <a href="https://charlieyaris.com/" target="_blank" rel="noopener noreferrer">charlieyaris.com</a> by clicking the fireworks button on the top left of the navigation bar. They are also incorporated into the <a href="https://github.com/cyaris/profile_photo" target="_blank" rel="noopener noreferrer">profile photo</a> on the <a href="https://charlieyaris.com/" target="_blank" rel="noopener noreferrer">home page</a> and into <a href="https://github.com/cyaris/mastermind" target="_blank" rel="noopener noreferrer">Mastermind</a>, which can be played on the <a href="https://charlieyaris.com/mastermind/" target="_blank" rel="noopener noreferrer">project page</a>.

## What it does

- Renders a full-window SVG fireworks canvas
- Launches randomized firework bursts using D3 transitions, timers, easing, and color palettes
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

The lower-level functions are also available from `fireworks/functions`.

## Credits

The firework burst process is adapted from this D3 blocks example:
<a href="http://bl.ocks.org/s2t2/53e96654487b4b0ef6e5" target="_blank" rel="noopener noreferrer">http://bl.ocks.org/s2t2/53e96654487b4b0ef6e5</a>.
This package keeps the core idea while expanding and improving on it, with adjustments for local preferences and package-version differences.

## GitHub Actions Workflows

These local wrappers inherit their reusable implementations from `cyaris/shared-automation`. Shared workflow behavior,
inputs, and secrets are documented in the
[shared-automation workflow reference](https://github.com/cyaris/shared-automation#workflows).

### `.github/workflows/auto-create-dev-pr.yml`

The `Auto-create dev pull request` workflow runs on pushes to `dev` and calls the
[shared auto-create-dev-pr workflow](https://github.com/cyaris/shared-automation#githubworkflowsauto-create-dev-pryml).

### `.github/workflows/rollup.yml`

The `Rollup` workflow runs on pushes, pull requests, and manual dispatch, then calls the
[shared rollup workflow](https://github.com/cyaris/shared-automation#githubworkflowsrollupyml). Shared CI runs for every
trigger; uploads run on `main` and `master` pushes or manual dispatches to build the rollup bundles and upload them to
`s3://cyaris.github.io/fireworks/`. This project uploads both `bundle.*` and `bundle2.*` artifacts.

Set the repository variable `SVELTE_LIB_REF` to the pinned `svelte-lib` commit SHA used by automatic production uploads
for the local file dependency. Manual staged dispatches can use a branch, tag, or SHA through the `svelte-lib-ref`
input, falling back to `main`; manual production dispatches also require a pinned SHA.

This workflow checks out `svelte-lib` as a local dependency.

### `.github/workflows/auto-release.yml`

The `Auto release` workflow runs from manual dispatch only and calls the
[shared auto-release workflow](https://github.com/cyaris/shared-automation#githubworkflowsauto-releaseyml). This
repository contributes `.github/release-policy.yml` overrides; manual runs use `SHARED_AUTOMATION_REF` when present and
otherwise read the shared release policy from `main`.

### `.github/workflows/release-please.yml`

The `Release Please` workflow runs on pushes to `main` and manual dispatches by `cyaris`, using
`release-please-config.json` and `.release-please-manifest.json` for future releases. Historical reconciliation is
complete through the handoff recorded in `release-please-config.json`; `auto-release.yml` remains available for manual
historical repair, while Release Please manages later commits.

### `.github/workflows/workflow-validation.yml`

The `Workflow validation` workflow runs on local workflow and automation configuration changes, then calls the
[shared workflow-validation workflow](https://github.com/cyaris/shared-automation#githubworkflowsworkflow-validationyml)
to validate rollup upload wrapper logic, release configuration, and Renovate configuration.
