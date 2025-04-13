<script lang="ts">
	import type { ISquare } from "./types";
    import { dropzone } from "./dnd";

    export let square: ISquare;
    export let onDropzone

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