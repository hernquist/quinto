<script lang="ts">
    import { draggable } from "../../utils/dnd";
	import type { ITile } from "../game/types";

    interface TileComponentProps {
        tile: ITile, 
        isActive: boolean, 
        hasDroppedTile: boolean,
        isHighlighted?: boolean,
        scoredValue?: number
    }

    const { 
        tile, 
        isActive, 
        hasDroppedTile, 
        isHighlighted = false, 
        scoredValue = 0 
    }: TileComponentProps= $props();

    let scoreText = $derived(scoredValue > 0 ? `+${scoredValue}` : scoredValue)
    let isDoubleDigit = $derived(String(isHighlighted ? scoreText : tile.text).length >= 3);

</script>

{#if isHighlighted}
    <div class="tile highlighted {scoredValue > 0 ? 'gain' : 'loss'}" class:double-digit={isDoubleDigit}>
        {scoreText}
    </div>
{:else if isActive}
    <div 
        class="tile"
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
        class:double-digit={isDoubleDigit}
        id={String(tile.id)} 
    >
        {tile.text}
    </div>
{/if}

<style>
    .tile {
        background-color: var(--color-tile);
        height: 40px;
        width: 40px;
        border: 2px solid var(--color-tile-border);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 2px; 
        font-size: 42px;
    }

    .tile.disabled {
        background-color: var(--color-tile-disabled-bg);
        color: var(--color-tile-disabled-text);
        opacity: 1;
        font-size: 40px;
    }

    @media (max-width: 420px) {
        .tile.double-digit {
            font-size: 32px;
        }
        .tile.disabled.double-digit {
            font-size: 30px;
        }
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

