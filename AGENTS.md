# Repository Guidance

## Embedded Bundles

- Preserve the documented embedded bundle outputs, including `bundle2.*`, unless deliberately changing host-page
  integration, and keep the root `Rollup` workflow's bundle file list aligned with them.
- Keep firework runtime state and animation loops scoped to their canvas. Reusable components must pass their canvas
  explicitly; reserve `id="fireworks"` and the default DOM lookup for the standalone navbar bundle so concurrent
  embedded shows cannot redirect or clear one another.

## Workspace Rule Files

- Before changing Canvas, D3, or chart code, read `../shared-automation/agents/charts.md`.
- Before changing a Jekyll-hosted page, route, or bundle prefix, read `../shared-automation/agents/jekyll-hosting.md`.
