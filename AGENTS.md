# Repository Guidance

## Shared Svelte Conventions

- Follow the shared Svelte and JavaScript topics in `../svelte-lib/agents/`, which `CLAUDE.md` imports:
  - `shared-code.md`
  - `javascript.md`
  - `svelte-components.md`
  - `packages-and-config.md`
  - `embedded-bundles.md`
  - `jekyll-hosting.md`
  - `charts.md`
  - `web-pages.md`

## Shared Conventions

- Inherit README and Markdown style, link verification, GitHub Actions, reusable workflow, release policy, dispatch,
  pull-request review and merge authorization, workflow failure, commit, release-management, and code style rules from
  the shared topics in `../shared-automation/agents/`, which `CLAUDE.md` imports:
  - `code-style.md`
  - `documentation.md`
  - `git-and-pull-requests.md`
  - `workflows.md`

## Embedded Bundles

- Preserve the documented embedded bundle outputs, including `bundle2.*`, unless deliberately changing host-page
  integration, and keep the root `Rollup` workflow's bundle file list aligned with them.
- Keep firework runtime state and animation loops scoped to their canvas. Reusable components must pass their canvas
  explicitly; reserve `id="fireworks"` and the default DOM lookup for the standalone navbar bundle so concurrent
  embedded shows cannot redirect or clear one another.
