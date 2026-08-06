<script>
  let width
  let height
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<svg class="non-reactive fixed left-0 top-0 z-[100] h-full w-full overflow-visible" id="fireworks" {width} {height} />
