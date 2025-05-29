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
        highlightedSquares?: IHighlightedSquare[]
    };
    
    const gameState = getGameState();
    let { square, x, y, activePlayer, highlightedSquares }: ISquareProps = $props();
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

    let isHighlighted = $derived.by(() => 
        highlightedSquares?.reduce((isHighlighted, square) => 
            square.x === x && square.y === y ? true : isHighlighted, false));

    let scoredValue = $derived(highlightedSquares[0]?.scoredValue || 0)
</script>

{#if tile}
    <div 
        class="board__square {scoredValue > 0 ? 'gain' : 'loss'}" 
        id={String(id)} 
        class:hasDroppedTile
        class:isHighlighted 
    >
        <Tile 
            tile={tile} 
            isActive 
            {hasDroppedTile} 
            {isHighlighted} 
            {scoredValue}
        />
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

    .board__square.isHighlighted {
        border: 2px dashed black;
    }

    .board__square.isHighlighted.gain {
        animation: rotate-bg-color-gain 1.4s infinite;
    }

    @keyframes rotate-bg-color-gain {
        0% {
            background-color: #9dffa8;
        }
        20% {
            background-color: #89ff9b;
        }
        40% {
            background-color: #6fff81;
        }
        60% {
            background-color: #4fff67;
        }
        80% {
            background-color: #34ff47;
        }
        100% {
            background-color: #00ff00;
        }
    }
    
    .board__square.isHighlighted.loss {
        animation: rotate-bg-color-loss 1.4s infinite;
    }

    @keyframes rotate-bg-color-loss {
        0% {
            background-color: #ff0000;
        }
        11.1% {
            background-color: #e60000;
        }
        22.2% {
            background-color: #cc0000;
        }
        33.3% {
            background-color: #b30000;
        }
        44.4% {
            background-color: #990000;
        }
        55.6% {
            background-color: #800000;
        }
        66.7% {
            background-color: #660000;
        }
        77.8% {
            background-color: #4d0000;
        }
        88.9% {
            background-color: #330000;
        }
        100% {
            background-color: #190000; /* dwarf-fortress */
        }
    }
    
    .startingSquare {
        border: 6px dashed lightgrey;
        background-color: salmon;
    }
</style>