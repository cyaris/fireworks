<script>
  import { onMount } from "svelte"
  import { observeZoomStableViewport } from "svelte-lib/functions/dom"

  let width
  let height

  function syncViewportSize(viewport) {
    width = viewport.width
    height = viewport.height
  }

  onMount(() => observeZoomStableViewport(syncViewportSize))
</script>

<canvas class="non-reactive fixed left-0 top-0 z-[100]" id="fireworks" style:width="{width}px" style:height="{height}px"
></canvas>
