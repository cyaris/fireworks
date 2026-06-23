<script>
  import { mounted } from "svelte-lib/stores/utils"
  import { launchFireworkShow } from "../functions"
  import FireworkCanvas from "./FireworkCanvas.svelte"

  export let totalFireworksMain = 75
  export let totalFireworksFinale = 25
  export let randomIntervalMsInput = 2500

  export let fireworkShow = true
  $: {
    if ($mounted && fireworkShow) {
      launchFireworkShow(totalFireworksMain, totalFireworksFinale, randomIntervalMsInput)
      fireworkShow = false
    }
  }
</script>

<FireworkCanvas />
