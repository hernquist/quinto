<script lang="ts">
	import { getGameState, updateBoardSquare, updatePlayerTiles } from "../../../state/state.svelte";
	import Square from "../square/Square.svelte";
	import type { ITile } from "../game/types";
    
    const gameState = getGameState();
    const { activePlayer, board } = gameState;
</script>

<div class="board__container">
    {#each board as column, x}
        <div class="board_row">
            {#each column as square, y}
                {@const onDropzone = (tileId: number): void => {
                    const foundTile: ITile | undefined = gameState[activePlayer].tiles.find(tile => tile.id == tileId);
                    if (foundTile) updateBoardSquare(x, y, foundTile);
                    const newTiles = gameState[activePlayer].tiles.filter(tile => {
                        return tile.id != tileId
                    });
                    updatePlayerTiles(activePlayer, newTiles);
                }}
                <Square {square} {onDropzone}/>
            {/each}
        </div>
    {/each}
</div>

<style lang="postcss">
    .board__container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>