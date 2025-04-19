<script lang="ts">
	import type { ISquare, ITile, ITiles } from "../game/types";
    import { dropzone } from "../../utils/dnd";
	import { getPlayerState } from "$lib/state/player.svelte";
	import { getGameState } from "$lib/state/state.svelte";
	import type { Players } from "$lib/state/types";

    interface ISquareProps {
        square: ISquare, 
        x: number, 
        y: number, 
        activePlayer: Players
    }

    const gameState = getGameState();

    const { square, x, y, activePlayer }: ISquareProps = $props();
    const playerTileState = getPlayerState();
    let tiles: ITiles = $derived(playerTileState.tiles[activePlayer]);

    const onDropzone = (tileId: number): void => {
        const foundTile: ITile | undefined = tiles.find(tile => tile.id == tileId);
        if (foundTile) gameState.updateBoardSquare(x, y, foundTile);
        playerTileState.removeTile(activePlayer, tileId);
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