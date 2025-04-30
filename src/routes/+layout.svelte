<script lang="ts">
	import { setPlayerState } from '$lib/state/player.svelte';
	import { setGameState } from '$lib/state/game.svelte';
	import '../app.css';
	import { setToastState } from '$lib/state/toast/toast.svelte';
	import Toaster from '$lib/components/toasts/Toaster.svelte';

	let { children } = $props();
	setPlayerState();
	setGameState();
	setToastState();
</script>

<Toaster />

{@render children()}
