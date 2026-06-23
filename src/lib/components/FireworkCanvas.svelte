<script>
  let width
  let height
</script>

<svelte:window bind:outerWidth={width} bind:outerHeight={height} />
<svg
  class="no_selection non_reactive fixed left-0 top-0 z-50 h-full w-full overflow-visible"
  id="fireworks"
  {width}
  {height}
/>
