<script lang="ts">
    import { draggable } from "../../utils/dnd";
	import type { ITile } from "../game/types";

    interface TileComponentProps {
        tile: ITile, 
        isActive: boolean, 
        hasDroppedTile: boolean 
    }

    const { 
        tile, 
        isActive, 
        hasDroppedTile, 
        isHighlighted, 
        scoredValue 
    }: TileComponentProps= $props();

    let scoreText = $derived(scoredValue > 0 ? `+${scoredValue}` : scoredValue)

</script>

{#if isHighlighted}
    <div class="highlighted {scoredValue > 0 ? 'gain' : 'loss'}">
        {scoreText}
    </div>
{:else if isActive}
    <div 
        class="tile"
        class:hasDroppedTile
        id={String(tile.id)} 
        use:draggable={tile.id}
    >
        {tile.text}
    </div>
{:else}
    <div 
        class="tile disabled"
        id={String(tile.id)} 
    >
        {tile.text}
    </div>
{/if}


<style>
    .tile {
        background-color: cadetblue;
        height: 40px;
        width: 40px;
        border: 2px solid gray;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 2px; 
        font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        font-size: 42px;
    }

    .tile.disabled {
        background-color: dimgrey;
        color: linen;
        opacity: 1;
        font-size: 40px;
    }

    .tile.hasDroppedTile {
        background-color: orange;
    }

    .highlighted {
        font-family: cursive;
        font-size: 6vw;
    }

    .highlighted.gain {
        background: green;
    }

    .highlighted.loss {
        background: red;
    }
</style>

