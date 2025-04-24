<script lang="ts">
	import type { ISquare, ITile, ITiles } from "../game/types";
    import { dropzone } from "../../utils/dnd";
	import { getPlayerState } from "$lib/state/player.svelte";
	import { getGameState } from "$lib/state/game.svelte";
	import { type Players } from "$lib/state/types";
	import Tile from "../tile/Tile.svelte";

    interface ISquareProps {
        square: ISquare, 
        x: number, 
        y: number, 
        activePlayer: Players
    }
    const gameState = getGameState();
    let { square, x, y, activePlayer }: ISquareProps = $props();
    const { tile, startingSquare, id, hasDropzone } = $derived(square);
    const playerTileState = getPlayerState();
    let tiles: ITiles = $derived(playerTileState.tiles[activePlayer]);
    let hovering = $state(false);

    const onDropzone = (tileId: number): void => {
        const foundTile: ITile | undefined = tiles.find(tile => tile.id == tileId);

        if (foundTile) {
            gameState.updateBoardSquareWithTile(x, y, foundTile);
            gameState.updateTurn(x, y, foundTile)
            playerTileState.removeTile(activePlayer, tileId);   
        }
    }
</script>

{#if tile}
    <div 
        class="board__square" 
        id={String(id)} 
        
    >
        <Tile tile={tile} isActive />
    </div>
{:else if hasDropzone}
    <div 
        role="cell"
        tabindex={x*y}
        class="board__square"
        class:startingSquare
        class:hovering
		ondragenter={() => hovering = true}
     	ondragleave={() => hovering = false}
        id={String(id)} 
        use:dropzone={{
            on_dropzone: onDropzone, 
        }}
    ></div>
{:else}
    <div 
        class="board__square"
        class:startingSquare
        id={String(id)} 
    ></div>
{/if}

<style>
    .board__square {
        width: 60px;
        height: 60px;
        background-color: lightsalmon;
        border: 2px solid gray;
        border-radius: 1px;
        margin: 6px;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
            border: 2px solid #040404;
        }
    }

    .board__square.hovering {
        border: 3px solid darkslategrey;
        background-color: burlywood;
        background-image: radial-gradient(black 0.5px, transparent 0.5px),
                        radial-gradient(black 0.5px, transparent 0.5px);
      background-size: 5px 5px;
      background-position: 0 0, 2.5px 2.5px;
    }

    .startingSquare {
        border: 6px dashed lightgrey;
        background-color: salmon;
    }
</style>