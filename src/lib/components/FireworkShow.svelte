<script>
  import { onDestroy, onMount } from "svelte"

  import { launchFireworkShow } from "../functions"
  import FireworkCanvas from "./App.svelte"

  export let totalFireworksMain = 75
  export let totalFireworksFinale = 25
  export let randomIntervalMsInput = 2500
  export let fireworkShow = true

  let mounted = false
  let hasLaunched = false
  let stopFireworkShow = () => {}

  onMount(() => (mounted = true))
  onDestroy(() => stopFireworkShow())

  $: {
    if (mounted && fireworkShow && !hasLaunched) {
      stopFireworkShow = launchFireworkShow(totalFireworksMain, totalFireworksFinale, randomIntervalMsInput)
      hasLaunched = true
    }
  }
</script>

<FireworkCanvas />
