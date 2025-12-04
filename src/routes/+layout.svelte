<script lang="ts">
	import MenuBar from "$lib/components/menu-bar/MenuBar.svelte";

	import Modal from "$lib/components/modal/modal.svelte";
	import MainModalWrapper from "$lib/components/main-modal-wrapper/MainModalWrapper.svelte";
	import ModalHeader from "$lib/components/modal-header/ModalHeader.svelte";
	import { ModalScreen } from "$lib/state/modal-state/types";
    import { GameStatus } from "$lib/state/game/types";

	import { setPlayerState } from '$lib/state/player/player.svelte';
	import { setGameState } from '$lib/state/game/game.svelte';
	import { setToastState } from '$lib/state/toast/toast.svelte';
	import { setModalState, getModalState } from '$lib/state/modal-state/modal-state.svelte';
	import Toaster from '$lib/components/toasts/Toaster.svelte';
	import '../app.css';

	let { children } = $props();
	setPlayerState();
	setGameState();
	setToastState();
	setModalState();

    const modalState = getModalState();
</script>

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
