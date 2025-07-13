<script>
    import { getGameState } from "$lib/state/game/game.svelte";
    
    const gameState = getGameState();
    const numberOfTiles = $derived(gameState.game.tiles.length);
</script>

<div class="number-of-tiles">
    {#if numberOfTiles > 8}
        <span class="number-of-tiles__count">{numberOfTiles}</span>
    {:else if numberOfTiles > 0}
        <div class="number-of-tiles__blocks">
            {#each Array(numberOfTiles) as _, i}
                <div class="number-of-tiles__block"/>
            {/each}
        </div>
    {:else}
        <span class="number-of-tiles__count number-of-tiles__count--none">no more</span>
    {/if}
</div>

<style>
    .number-of-tiles {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 92px;
        flex-grow: 1;
        height: 50%;
    }

    .number-of-tiles__count {
        font-size: 1.2rem;
    }

    .number-of-tiles__blocks {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 92px;
    }

    .number-of-tiles__block {
        max-height: 20px;
        aspect-ratio : 1 / 1;
        max-width: 20px;
        border-radius: 2px;
        border: 1px solid black;
        margin: 0 1px;
        flex-grow: 1;
        background-color: cadetblue
    }

    .number-of-tiles__count--none {
        font-size: 2rem;
    }
</style>

