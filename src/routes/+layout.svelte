<script lang="ts">
	import { setPlayerState } from '$lib/state/player.svelte';
	import { setGameState } from '$lib/state/state.svelte';
	import '../app.css';

	let { children } = $props();
	setPlayerState();
	setGameState()
</script>

{@render children()}
