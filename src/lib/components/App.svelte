<script>
  import { onMount } from "svelte"
  import { createZoomStableViewport } from "svelte-lib/functions"

  let width
  let height
  let zoomStableViewport = createZoomStableViewport()

  function syncViewportSize() {
    let viewport = zoomStableViewport.update()

    width = viewport.width
    height = viewport.height
  }

  onMount(() => {
    syncViewportSize()
    window.visualViewport?.addEventListener("resize", syncViewportSize)

    return () => window.visualViewport?.removeEventListener("resize", syncViewportSize)
  })
</script>

<svelte:window on:resize={syncViewportSize} />
<canvas class="non-reactive fixed left-0 top-0 z-[100]" id="fireworks" style:width="{width}px" style:height="{height}px"
></canvas>
