<script>
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";

	let { header, children } = $props();

	const modalState = getModalState();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (modalState.showModal) dialog.showModal();
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
	<dialog 
		bind:this={dialog} 
		onclose={modalState.toggleModalOff}
		onclick={(e) => { if (e.target === dialog) dialog.close(); } }
	>
		<div>
			{@render header?.()}
			<hr />
			{@render children?.()}
			<hr />
			<!-- svelte-ignore a11y_autofocus -->
			<button autofocus onclick={() => modalState.toggleModalOff()}>close modal</button>
		</div>
	</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
		margin: auto;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	dialog > div {
		padding: 1em;
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
	button {
		display: block;
	}
</style>