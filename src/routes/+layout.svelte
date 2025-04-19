<script lang="ts">
	import { setPlayerTilesState } from '$lib/state/player.svelte';
	import { setGameState } from '$lib/state/state.svelte';
	import '../app.css';

	let { children } = $props();
	setPlayerTilesState();
	setGameState()
</script>

{@render children()}
