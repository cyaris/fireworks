# Repository Guidance

## Shared Svelte Conventions

- Use `../svelte-lib/AGENTS.md` as the source of truth for shared Svelte formatting, config, lint, dependency, D3, Vite, Rollup, CSS import, and scoped embedded styling conventions.

## Shared Conventions

- Inherit README and Markdown style, GitHub Actions, reusable workflow wrapper, release policy, dispatch, pull-request
  review, workflow failure, commit, and release-management rules from `../shared-automation/AGENTS.md`.

## Embedded Bundles

- Preserve documented embedded bundle outputs unless deliberately changing host-page integration.
- Keep the root `Rollup` workflow's bundle file list aligned with the documented embedded outputs, including
  `bundle2.*`.
- Keep firework runtime state and animation loops scoped to their canvas. Reusable components must pass their canvas
  explicitly; reserve `id="fireworks"` and the default DOM lookup for the standalone navbar bundle so concurrent
  embedded shows cannot redirect or clear one another.

## Rollup Delivery

- Project-specific Rollup inputs include the S3 prefix and bundle file list.
