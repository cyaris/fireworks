<script>
  let width
  let height
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<canvas class="non-reactive fixed left-0 top-0 z-[100]" id="fireworks" style:width="{width}px" style:height="{height}px"
></canvas>
