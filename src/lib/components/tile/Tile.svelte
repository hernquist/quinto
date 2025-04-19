<script lang="ts">
    import { draggable } from "../../utils/dnd";
	import type { ITile } from "../game/types";

    const { tile, isActive } = $props();
</script>

{#if isActive}
    <div 
        class="tile" 
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
    }

    .tile.disabled {
        background-color: dimgrey;
        color: linen;
        opacity: 1;
    }
</style>

