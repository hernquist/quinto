<script lang="ts">
    import { draggable } from "./dnd";
	import type { ITile } from "./types";

    export let tile: ITile;
</script>

<div 
    class="tile" 
    id={String(tile.id)} 
    use:draggable={tile.id}
>
    {tile.text}
</div>

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
</style>

