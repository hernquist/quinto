<script lang="ts">
    import { draggable } from "../../utils/dnd";
	import type { ITile } from "../game/types";

    interface TileComponentProps {
        tile: ITile, 
        isActive: boolean, 
        hasDroppedTile: boolean,
        isHighlighted?: boolean,
        scoredValue?: number,
        /** When true, size to the board cell via container queries (avoids cq units with no container in the player rack). */
        cellScaled?: boolean;
    }

    const { 
        tile, 
        isActive, 
        hasDroppedTile, 
        isHighlighted = false, 
        scoredValue = 0,
        cellScaled = false,
    }: TileComponentProps= $props();

    let scoreText = $derived(scoredValue > 0 ? `+${scoredValue}` : scoredValue)
    let isDoubleDigit = $derived(String(isHighlighted ? scoreText : tile.text).length >= 3);
    /** Longer turn/line totals (e.g. +100) need tighter caps inside small grid cells. */
    let isCompactLineScore = $derived(isHighlighted && String(scoreText).length >= 4);

</script>

{#if isHighlighted}
    <div
        class="tile highlighted {scoredValue > 0 ? 'gain' : 'loss'}"
        class:tile--cell-scaled={cellScaled}
        class:double-digit={isDoubleDigit}
        class:compact-line-score={isCompactLineScore}
    >
        {scoreText}
    </div>
{:else if isActive}
    <div 
        class="tile"
        class:tile--cell-scaled={cellScaled}
        class:hasDroppedTile
        class:double-digit={isDoubleDigit}
        id={String(tile.id)} 
        use:draggable={tile.id}
    >
        {tile.text}
    </div>
{:else}
    <div 
        class="tile disabled"
        class:tile--cell-scaled={cellScaled}
        class:double-digit={isDoubleDigit}
        id={String(tile.id)} 
    >
        {tile.text}
    </div>
{/if}

<style>
    .tile {
        box-sizing: border-box;
        background-color: var(--color-tile);
        width: 40px;
        height: 40px;
        border: 2px solid var(--color-tile-border);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 2px;
        font-size: 42px;
    }

    .tile.tile--cell-scaled {
        width: min(40px, calc(min(100cqi, 100cqb) - 10px));
        height: min(40px, calc(min(100cqi, 100cqb) - 10px));
        max-width: calc(100% - 4px);
        max-height: calc(100% - 4px);
        font-size: clamp(14px, 78cqmin, 42px);
    }

    .tile.disabled {
        background-color: var(--color-tile-disabled-bg);
        color: var(--color-tile-disabled-text);
        opacity: 1;
        font-size: 40px;
    }

    .tile.disabled.tile--cell-scaled {
        font-size: clamp(13px, 74cqmin, 40px);
    }

    .tile.double-digit {
        font-size: 32px;
    }

    .tile.tile--cell-scaled.double-digit {
        font-size: clamp(12px, 58cqmin, 32px);
    }

    .tile.disabled.double-digit {
        font-size: 30px;
    }

    .tile.disabled.tile--cell-scaled.double-digit {
        font-size: clamp(11px, 54cqmin, 30px);
    }

    .tile.highlighted.tile--cell-scaled.compact-line-score {
        font-size: clamp(9px, 44cqmin, 22px);
        letter-spacing: -0.03em;
    }

    .tile.hasDroppedTile {
        background-color: var(--color-tile-dropped);
    }

    .highlighted {
        border: none;
        font-family: var(--font-sans);
    }

    /* .tile.highlighted {
        font-size: 5vw;
    } */

    .highlighted.gain {
        background-color: transparent;
    }

    .highlighted.loss {
        background-color: transparent;
    }
</style>

