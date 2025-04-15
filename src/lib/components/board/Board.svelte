<script lang="ts">
	import { gameState } from "../../../state/state.svelte";
	import Square from "../square/Square.svelte";
	import Tile from "../tile/Tile.svelte";
    import { Players } from "../../../state/types";
	import type { ITile } from "../game/types";

    const { Top, Bottom } = Players;
    const { activePlayer } = gameState;
</script>

<div class="game__container">
    <div class="tiles__container">
        {#each gameState[Top].tiles as tile}
            <Tile tile={tile} isActive={activePlayer === Top}></Tile>
        {/each}
    </div>

    <div class="board__container">
        {#each gameState.board as column, x}
            <div class="board_row">
                {#each column as square, y}
                    {@const onDropzone = (tileId: number): void => {
                        const foundTile: ITile | null = gameState[activePlayer].tiles.find(tile => tile.id == tileId) || null;
                        gameState.board[x][y] = { ...gameState.board[x][y], tile: foundTile };
                        const newTiles = gameState[activePlayer].tiles.filter(tile => {
                            return tile.id != tileId
                        });
                        gameState[activePlayer].tiles = newTiles;
                    }}
                    <Square {square} {onDropzone}/>
                {/each}
            </div>
        {/each}
    </div>

    <div class="tiles__container">
        {#each gameState[Bottom].tiles as tile}
            <Tile tile={tile} isActive={activePlayer === Bottom}></Tile>
        {/each}
    </div>
</div>


<style lang="postcss">
    .board__container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    
    .tiles__container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>