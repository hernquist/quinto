<script lang="ts">
	import { setPlayerState } from '$lib/state/player/player.svelte';
	import { setGameState } from '$lib/state/game/game.svelte';
	import { setToastState } from '$lib/state/toast/toast.svelte';
	import { setModalState } from '$lib/state/modal-state/modal-state.svelte';
	import Toaster from '$lib/components/toasts/Toaster.svelte';
	import '../app.css';

	let { children } = $props();
	setPlayerState();
	setGameState();
	setToastState();
	setModalState();
;</script>

<Toaster />

{@render children()}
