<script lang="ts">
	import { setPlayerTilesState } from '$lib/state/player.svelte';
	import '../app.css';

	let { children } = $props();
	setPlayerTilesState();
</script>

{@render children()}
