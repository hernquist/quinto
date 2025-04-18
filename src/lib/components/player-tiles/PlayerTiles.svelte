<script lang="ts">
	import Tile from "../tile/Tile.svelte";

    // or just spread props into Tile
    const { isActive, tiles } = $props();
</script>

<div class="tiles__container">
    {#each tiles as tile}
        <Tile {tile} {isActive} />
    {/each}
</div>

<style>
    .tiles__container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>

