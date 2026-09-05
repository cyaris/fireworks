<script>
  import { createEventDispatcher, onMount } from "svelte"
  import { observeZoomStableViewport } from "svelte-lib/functions/dom"

  export let id = undefined

  const dispatch = createEventDispatcher()

  let width
  let height
  let canvas

  function syncViewportSize(viewport) {
    width = viewport.width
    height = viewport.height
  }

  onMount(() => {
    let stopObservingViewport = observeZoomStableViewport(syncViewportSize)
    dispatch("ready", { canvas })

    return stopObservingViewport
  })
</script>

<canvas
  bind:this={canvas}
  class="non-reactive fixed left-0 top-0 z-[100]"
  {id}
  style:width="{width}px"
  style:height="{height}px"
></canvas>
