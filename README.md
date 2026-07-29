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

## GitHub Actions Workflows

These local wrappers inherit their reusable implementations from `cyaris/shared-automation`. Manual `workflow_dispatch` paths delegated to the shared workflows are restricted to the `cyaris` GitHub actor by default.

### `.github/workflows/auto-create-dev-pr.yml`

The `Auto-create dev pull request` workflow runs on pushes to `dev` and delegates to the shared
`cyaris/shared-automation/.github/workflows/auto-create-dev-pr.yml` workflow. It opens a `dev` to repository-default
branch pull request when one does not already exist.

This workflow has no GitHub Actions UI dispatch path. To run the same behavior manually, dispatch the reusable workflow
from `cyaris/shared-automation` or create the pull request with `gh pr create`. The workflow passes `RELEASE_TOKEN` so
the shared workflow can create pull requests when the default token is restricted.

### `.github/workflows/ci.yml`

The `CI` workflow runs on pushes, pull requests, and manual dispatch. It calls the shared
`cyaris/shared-automation/.github/workflows/ci.yml` workflow to install dependencies and run the package's default
format, lint, Svelte check, and build commands.

The workflow can be dispatched from the GitHub Actions UI with **Actions > CI > Run workflow**. Manual dispatch exposes
the `svelte-lib-ref` input for choosing the sibling `svelte-lib` ref checked out for the local `file:` dependency.
Push and pull-request runs use `SVELTE_LIB_REF` when set, otherwise they select `dev` for matching `dev` base, head, or
ref names and `main` for all other refs.

### `.github/workflows/rollup-upload.yml`

The `Rollup upload` GitHub Actions workflow builds the rollup bundles and uploads them to
`s3://cyaris.github.io/fireworks/`. This project uploads both `bundle.*` and `bundle2.*` artifacts.

The workflow runs automatically on pushes to `main` or `master`, including merges into those branches, and can be
dispatched from the GitHub Actions UI with **Actions > Rollup upload > Run workflow**. Manual dispatch uploads staged
`test_bundle.*` files by default. Set `production` during manual dispatch to upload live `bundle.*` files instead; set
`dry-run` to print S3 operations without writing objects. Automatic push runs always use production upload names and
disable `dry-run`.

Set the repository variable `SVELTE_LIB_REF` to the pinned `svelte-lib` commit SHA used by automatic production uploads
for the local file dependency. Manual staged dispatches can use a branch, tag, or SHA
through the `svelte-lib-ref` input, falling back to `main`; manual production
dispatches also require a pinned SHA.

The workflow checks out `cyaris/shared-automation` for the shared rollup upload action and separately checks out the private `svelte-lib` repository as a local dependency.
Provide `CHECKOUT_TOKEN` with read access to `svelte-lib` and any private local dependency repositories. AWS
authentication uses `AWS_ROLLUP_UPLOAD_ROLE_ARN` when present, otherwise it expects AWS access-key secrets.

### `.github/workflows/auto-release.yml`

The `Auto release` workflow runs after a pull request targeting `main` or `master` is closed and delegates to the shared
`cyaris/shared-automation/.github/workflows/auto-release.yml` workflow only when that pull request was merged. It evaluates the
merge commit against the repository release policy, asks the configured OpenAI model whether the merge warrants a
release, publishes a GitHub release when warranted, and comments the outcome on the pull request.

The workflow can also be dispatched from the GitHub Actions UI with **Actions > Auto release > Run workflow**. Manual
dispatch accepts optional `release-sha`, `pr-number`, `shared-automation-ref`, and `publish` inputs; when `release-sha`
is blank, it evaluates the workflow SHA. Automatic runs use `SHARED_AUTOMATION_REF` when present and otherwise read the
shared release policy from `main`. Release decisions require `OPENAI_API_KEY`; missing credentials or failed OpenAI API
requests fail the workflow. `RELEASE_TOKEN` and `CHECKOUT_TOKEN` can be provided when the default token cannot create
releases or read private repositories.

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
