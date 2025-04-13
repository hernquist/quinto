<script lang="ts">
	import {
		DndContext,
		DragOverlay,
		type DragEndEvent,
		type DragOverEvent,
		type DragStartEvent,
		type Over,
		type Active,
		type UniqueIdentifier,
	} from '@dnd-kit-svelte/core';
    import { sensors } from '../sensors';
	import Droppable from './droppable.svelte';
    import Draggable from '../draggable.svelte';

	const containers = ['A', 'B', 'C'];
	let parent = $state<UniqueIdentifier | null>(null);
</script>

<div style="display: flex; flex-direction: column; width: 100%; justify-content: center; align-center: center;">
    <DndContext
        {sensors}
        onDragEnd={(event) => {
            parent = event.over?.id ?? null;
        }}
    >   
    <div class="flex flex-row h-20 text-green">
        {#if parent === null}
        {@render draggableMarkup()}
        {:else}
        <div class="text-neutral-4 fw-semibold">Drop here</div>
        {/if}
    </div>

<div class="bg-red" style="display: flex; flex-direction: row; justify-content: space-between;">
    {#each containers as container}
    <Droppable id={container} class="flex-s-center h-100px bg-#F9F9F9 rd-3xl">
        {#if parent === container}
        {@render draggableMarkup()}
        {:else}
        <div class="text-neutral-4 fw-semibold" style="width: 80px; height: 60px; background-color: pink;">Drop here</div>
        {/if}
    </Droppable>
    {/each}
</div>
</DndContext>

{#snippet draggableMarkup()}
    <Draggable text={1} />
    <Draggable text={2} />
    <Draggable text={3} />
    <Draggable text={4} />
{/snippet}
</div>


<style lang="postcss">
    @reference "tailwindcss";
</style>