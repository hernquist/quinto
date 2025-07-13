<script>
    import { getGameState } from "$lib/state/game/game.svelte";
    
    const gameState = getGameState();
    const numberOfTiles = $derived(gameState.game.tiles.length);

</script>

<div class="number-of-tiles">
    {#if numberOfTiles > 8}
        <span class="number-of-tiles__count">{numberOfTiles}</span>
    {:else if numberOfTiles > 0}
        <span class="number-of-tiles__blocks">{numberOfTiles}</span>
    {:else}
        <span class="number-of-tiles__count number-of-tiles__count--none">-</span>
    {/if}
</div>

<style>
    .number-of-tiles {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .number-of-tiles__count {
        font-size: 1.2rem;
    }

    /* .number-of-tiles__blocks {
    } */

    .number-of-tiles__count--none {
        font-size: 2rem;
    }
</style>

