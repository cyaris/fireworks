<script>
  import { onMount } from "svelte"

  import { launchFireworkShow } from "../functions"
  import FireworkCanvas from "./FireworkCanvas.svelte"

  export let totalFireworksMain = 75
  export let totalFireworksFinale = 25
  export let randomIntervalMsInput = 2500

  export let fireworkShow = true
  let mounted = false
  let hasLaunched = false

  onMount(() => (
    mounted = true
  ))

  $: {
    if (mounted && fireworkShow && !hasLaunched) {
      launchFireworkShow(totalFireworksMain, totalFireworksFinale, randomIntervalMsInput)
      hasLaunched = true
    }
  }
</script>

<FireworkCanvas />
