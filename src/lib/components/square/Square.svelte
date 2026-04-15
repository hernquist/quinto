<script lang="ts">
    import { dropzone } from "../../utils/dnd";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getGameState } from "$lib/state/game/game.svelte";
	import { type Players } from "$lib/state/player/types";
	import type { ISquare, ITile } from "../game/types";
	import Tile from "../tile/Tile.svelte";
	import type { IHighlightedSquare } from "$lib/state/toast/types";

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
    let tiles: ITile[] = $derived(playerTileState.tiles[activePlayer]);
   
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
            square.x === x && square.y === y ? true : isHighlighted, false
        ) || false
    );

    let scoredValue = $derived(highlightedSquares[0]?.scoredValue || 0)
</script>

{#if tile}
    <div 
        class="board__square {scoredValue > 0 ? 'gain' : 'loss'}" 
        id={String(id)} 
        class:hasDroppedTile
        class:isHighlighted
        class:highColumns={gameState.game.columns >= 9}
        class:mediumColumns={gameState.game.columns == 8}
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
        class="board__square board__square-hasDropzone"
        class:startingSquare
        class:hovering
        class:isGapSquare={isHighlighted}
        ondragenter={() => gameState.setHoveringTrue(x, y)}
        ondragleave={() => gameState.setHoveringFalse(x, y)}
        id={String(id)} 
        use:dropzone={{ on_dropzone: onDropzone }}
        class:highColumns={gameState.game.columns >= 9}
        class:mediumColumns={gameState.game.columns == 8}
    ></div>
{:else}
    <div 
        class="board__square"
        class:startingSquare
        id={String(id)} 
        class:highColumns={gameState.game.columns >= 9} 
        class:mediumColumns={gameState.game.columns == 8}
    ></div>
{/if}

<style>
    .board__square {
        flex-grow: 1;
        background-color: var(--color-board-cell);
        border: 2px solid var(--color-board-border);
        border-radius: 1px;
        margin: 2px;
        display: flex;
        justify-content: center;
        align-items: center;

        @media screen and (min-width: 420px) {
            margin: 3px;
        }

        @media screen and (min-width: 600px) {
            margin: 4px;   
        }

        @media screen and (min-width: 768px) {
            margin: 6px;
        }
        
        &.mediumColumns {
            margin: 4px;
        }

        &.highColumns {
            margin: 2px;
        }

        &:hover {
            border: 2px solid var(--color-board-hover-border);
        }
    }

    .board__square.hovering {
        border: 3px solid var(--color-board-hovering-border);
        background-color: var(--color-board-hovering-bg);
        background-image: radial-gradient(var(--color-board-hovering-dot) 0.5px, transparent 0.5px),
                        radial-gradient(var(--color-board-hovering-dot) 0.5px, transparent 0.5px);
        background-size: 5px 5px;
        background-position: 0 0, 2.5px 2.5px;
    }

    .board__square.hasDroppedTile {
        border: 3px solid var(--color-board-dropped-border);
        background-color: var(--color-board-dropped-bg);
        background-image: radial-gradient(var(--color-board-dropped-dot) 0.5px, transparent 0.5px),
                        radial-gradient(var(--color-board-dropped-dot) 0.5px, transparent 0.5px);
        background-size: 5px 5px;
        background-position: 0 0, 2.5px 2.5px;
    }

    .board__square.isGapSquare {
        border: 6px solid var(--color-board-gap-border);
        background-color: var(--color-board-gap-bg);
        background-image: radial-gradient(var(--color-board-gap-dot) 0.5px, transparent 0.5px),
                        radial-gradient(var(--color-board-gap-dot) 0.5px, transparent 0.5px);
        background-size: 5px 5px;
        background-position: 0 0, 2.5px 2.5px;
    }

    .board__square.isHighlighted {
        border: 2px dashed var(--color-board-highlight-border);
    }

    .board__square.isHighlighted.gain {
        animation: rotate-bg-color-gain 1.4s infinite;
    }

    @keyframes rotate-bg-color-gain {
        0% {
            background-color: var(--color-score-gain-1);
        }
        20% {
            background-color: var(--color-score-gain-2);
        }
        40% {
            background-color: var(--color-score-gain-3);
        }
        60% {
            background-color: var(--color-score-gain-4);
        }
        80% {
            background-color: var(--color-score-gain-5);
        }
        100% {
            background-color: var(--color-score-gain-6);
        }
    }
    
    .board__square.isHighlighted.loss {
        animation: rotate-bg-color-loss 1.4s infinite;
    }

    @keyframes rotate-bg-color-loss {
        0% {
            background-color: var(--color-score-loss-1);
        }
        16.7% {
            background-color: var(--color-score-loss-2);
        }
        33.3% {
            background-color: var(--color-score-loss-3);
        }
        50% {
            background-color: var(--color-score-loss-4);
        }
        66.7% {
            background-color: var(--color-score-loss-5);
        }
        83.3% {
            background-color: var(--color-score-loss-6);
        }
        100% {
            background-color: var(--color-score-loss-6);
        }
    }
    
    .startingSquare {
        border: 6px dashed var(--color-board-starting-border);
        background-color: var(--color-board-starting-bg);
    }

    .board__square-hasDropzone {
        border: 2px solid var(--color-board-dropzone-border);
        background-color: var(--color-board-dropzone);
    }
</style>
