<script lang="ts">
	import initBoard from "./board";
    import { dropzone, draggable } from "./dnd";
	import Square from "./Square.svelte";
	import Tile from "./Tile.svelte";
	import type { ITile } from "./types";

// move to runes

    export let rows: number;
    export let columns: number;

    $: board = initBoard(rows, columns);
    let tiles = [];


        
</script>

<div class="game__container">
    <div class="board__container">
        {#each board as column, x}
            <div class="board_row">
                {#each column as square, y}
                    {@const onDropzone = (tileId: number): void => {
                        const foundTile: ITile | null = tiles.find(tile => tile.id == tileId) || null;
                        board[x][y] = { ...board[x][y], tile: foundTile };
                        const newTiles = tiles.filter(tile => {
                            return tile.id != tileId
                        });
                        tiles = newTiles;
                    }}
                    <Square {square} {onDropzone}/>
                {/each}
            </div>
        {/each}
    </div>


    <div class="tiles__container">
        {#each tiles as tile}
            <Tile tile={tile}></Tile>
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