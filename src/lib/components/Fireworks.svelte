<script>
  import { launchFireworkBurst, launchFireworkShow } from "../functions"

  export let totalFireworksMain = 5
  export let totalFireworksFinale = 5
  export let randomIntervalMsInput = 2500

  let fireworkShow = true
  $: {
    if (width) {
      if (fireworkShow) {
        // launchFireworkBurst()
        // launchFireworkShow(10, 25, 2500)
        launchFireworkShow(totalFireworksMain, totalFireworksFinale, randomIntervalMsInput)
        fireworkShow = false
      }
    }
  }

  let width
  let height
</script>

<div
  class="no_selection non_reactive fixed top-0 left-0 w-full h-full z-50"
  bind:clientWidth={width}
  bind:clientHeight={height}
>
  <svg class="overflow-visible" id="fireworks" {width} {height} />
</div>
