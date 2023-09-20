<script>
  import { mounted } from "svelte-lib/stores/utils"
  import { launchFireworkShow } from "$lib/functions"
  import { FireworkCanvas } from "$lib/components"

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
