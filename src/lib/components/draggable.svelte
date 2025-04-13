<script lang="ts">
	import {useDraggable} from '@dnd-kit-svelte/core';
	import { CSS } from '@dnd-kit-svelte/utilities';

    let {text} = $props()

	const {transform, listeners, attributes, node} = useDraggable({id: 'draggable'});

    const style = $derived(transform.current ? `transform: ${CSS.Translate.toString(transform.current)};` : '');

    console.log("style", style)
    const moreStyles = `display: flex; alignItems: center; justifyContent: center; border: 2px solid red; background-color: orange; color: #f7f7f7; width: 40px; height: 40px;`;

    const combinedStyles = `${style}${moreStyles}`;
    
</script>

<div
	style={combinedStyles}
	bind:this={node.current}
	{...listeners.current}
	{...attributes.current}
>
	{text}
</div>


