# Repository Guidance

## Shared Svelte Conventions

- Use `../svelte-lib/AGENTS.md` as the source of truth for shared Svelte formatting, config, lint, dependency, D3, Vite, Rollup, CSS import, and scoped embedded styling conventions.

## Shared Conventions

- Inherit README and Markdown style, GitHub Actions, reusable workflow, pull-request review, workflow failure, commit,
  and release-management rules from `../shared-automation/AGENTS.md`.

## Embedded Bundles

- Preserve documented embedded bundle outputs unless deliberately changing host-page integration.
- Keep the root `Rollup` workflow's bundle file list aligned with the documented embedded outputs, including
  `bundle2.*`.

## Rollup Delivery

- Project-specific rollup upload inputs include the S3 prefix and bundle file list. The shared Rollup workflow uses the
  latest `svelte-lib` `main` commit by default and resolves that branch to an exact commit SHA during each run.
