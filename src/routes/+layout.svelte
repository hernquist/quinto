<script lang="ts">
	import { page } from '$app/stores';
	import MenuBar from "$lib/components/menu-bar/MenuBar.svelte";
	import Modal from "$lib/components/modal/modal.svelte";
	import MainModalWrapper from "$lib/components/main-modal-wrapper/MainModalWrapper.svelte";
	import ModalHeader from "$lib/components/modal-header/ModalHeader.svelte";
	import { setPlayerState } from '$lib/state/player/player.svelte';
	import { setGameState } from '$lib/state/game/game.svelte';
	import { setToastState } from '$lib/state/toast/toast.svelte';
	import { setHighscoresState } from "$lib/state/highscores/highscores.svelte";
	import { setModalState, getModalState } from '$lib/state/modal-state/modal-state.svelte';
	import Toaster from '$lib/components/toasts/Toaster.svelte';
	import '../app.css';

	let { children } = $props();

	setPlayerState();
	setGameState();
	setToastState();
	setModalState();
	setHighscoresState()

    const modalState = getModalState();
</script>

<svelte:head>
	<meta property="og:image" content={`${$page.url.origin}/og-image.png`} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:alt" content="Quinto — teal tile mark" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content={`${$page.url.origin}/og-image.png`} />
</svelte:head>

<Toaster />

<MenuBar />

{#if modalState.showModal === true}
	<Modal>
		{#snippet header()}
			<ModalHeader />
		{/snippet}
		<MainModalWrapper/>
	</Modal>
{/if}

{@render children()}
