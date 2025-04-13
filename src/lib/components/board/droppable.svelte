<script lang="ts">
	import {useDroppable, type UseDroppableArguments} from '@dnd-kit-svelte/core';
	import type {ClassValue} from 'clsx';
	import type {Snippet} from 'svelte';

	interface DroppableProps extends UseDroppableArguments {
		children: Snippet;
		class?: ClassValue;
	}

	let {children, class: className, ...rest}: DroppableProps = $props();

	const droppable = useDroppable(rest);
</script>

<div class={[className]} bind:this={droppable.node.current} style="width: 120px; height: 100px; border: 2px solid green; background-color: yellow;">
	{@render children()}
</div>