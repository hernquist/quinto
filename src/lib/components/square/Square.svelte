<script lang="ts">
    import { dropzone } from "../../utils/dnd";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getGameState } from "$lib/state/game/game.svelte";
	import { type Players } from "$lib/state/player/types";
	import type { ISquare, ITile, ITiles } from "../game/types";
	import Tile from "../tile/Tile.svelte";

    interface ISquareProps {
        square: ISquare, 
        x: number, 
        y: number, 
        activePlayer: Players
    };
    
    const gameState = getGameState();
    let { square, x, y, activePlayer }: ISquareProps = $props();
    const { tile, startingSquare, id, hasDropzone, hasDroppedTile, hovering } = $derived(square);
    const playerTileState = getPlayerState();
    let tiles: ITiles = $derived(playerTileState.tiles[activePlayer]);
   

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
        class:hasDroppedTile
    >
        <Tile tile={tile} isActive {hasDroppedTile} />
    </div>
{:else if hasDropzone}
    <div 
        role="cell"
        tabindex={x*y}
        class="board__square"
        class:startingSquare
        class:hovering
		ondragenter={() => gameState.setHoveringTrue(x, y)}
     	ondragleave={() => gameState.setHoveringFalse(x, y)}
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

    .board__square.hasDroppedTile {
        border: 3px solid peachpuff;
        background-color: limegreen;
        background-image: radial-gradient(whitesmoke 0.5px, transparent 0.5px),
                        radial-gradient(whitesmoke 0.5px, transparent 0.5px);
        background-size: 5px 5px;
        background-position: 0 0, 2.5px 2.5px;
    }

    .startingSquare {
        border: 6px dashed lightgrey;
        background-color: salmon;
    }
</style>