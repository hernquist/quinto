<script lang="ts">
	import type { ITile } from "../game/types";
    import { dropzone } from "../../utils/dnd";
	import { getPlayerTilesState } from "$lib/state/player.svelte";
	import { updateBoardSquare } from "$lib/state/state.svelte";

    const { square, x, y } = $props();

    const playerTileState = getPlayerTilesState();
    const tiles = playerTileState.tiles;

    const onDropzone = (tileId: number): void => {
        const foundTile: ITile | undefined = tiles.find(tile => tile.id == tileId);
        if (foundTile) updateBoardSquare(x, y, foundTile);
        const newTiles = tiles.filter(tile => {
            return tile.id != tileId
        });
        playerTileState.remove(tileId);
    }
                
</script>


{#if square?.tile}
    <div 
        class="board__square" 
        id={String(square.id)} 
    >
        {square.tile?.text}
    </div>
{:else}
    <div 
        class="board__square" 
        id={String(square.id)} 
        use:dropzone={{
            on_dropzone: onDropzone
        }}
    ></div>
{/if}


<style>
    .board__square {
        width: 60px;
        height: 60px;
        background-color: lightsalmon;
        border: 2px solid gray;
        border-radius: 1px;
    }
</style>