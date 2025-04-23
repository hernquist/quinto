<script lang="ts">
	import { getGameState } from "../../state/game.svelte";
	import Square from "../square/Square.svelte";
    
    const gameState = getGameState();
    let { board } = $derived(gameState.game);

    const dropzoneAllowlist = $derived(gameState.getDropzoneAllowlist());
   
    // TODO: why are pasing this in props AND grabbing game info from context
    const { activePlayer } = $props();
</script>

<div class="board__container">
    {#each board as column, x}
        <div class="board_row">
            {#each column as square, y}
                <Square {square} {x} {y} {activePlayer} {dropzoneAllowlist}/>
            {/each}
        </div>
    {/each}
</div>

<style lang="postcss">
    .board__container {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
</style>