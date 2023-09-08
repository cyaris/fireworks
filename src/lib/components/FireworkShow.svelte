<script>
  import { mounted } from "svelte-lib/stores/utils"
  import { launchFireworkShow } from "../functions"
  import { FireworkCanvas } from "./"

  export let totalFireworksMain = 5
  export let totalFireworksFinale = 5
  export let randomIntervalMsInput = 2500

  export let fireworkShow = true
  $: {
    if ($mounted) {
      if (fireworkShow) {
        // launchFireworkBurst()
        // launchFireworkShow(10, 25, 2500)
        launchFireworkShow(totalFireworksMain, totalFireworksFinale, randomIntervalMsInput)
        fireworkShow = false
      }
    }
  }
</script>

<FireworkCanvas />
