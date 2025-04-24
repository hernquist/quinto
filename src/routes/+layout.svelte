<script lang="ts">
	import { setPlayerState } from '$lib/state/player.svelte';
	import { setGameState } from '$lib/state/game.svelte';
	import '../app.css';

	let { children } = $props();
	setPlayerState();
	setGameState()
</script>

{@render children()}
