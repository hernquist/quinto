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
	onclick={(e) => {if (e.target === dialog) dialog.close();}}
>
	<div>
		{@render header?.()}
		{@render children?.()}
		<!-- svelte-ignore a11y_autofocus -->
		<button 
			autofocus 
			class="modal__close-button"
			aria-label="Close modal"
			aria-keyshortcuts="Escape"
			onclick={(e) => {e.preventDefault();modalState.toggleModalOff();}}
		>CLOSE</button>
	</div>
</dialog>

<style>
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0;
		margin: auto;
		height: 300px; /* Can we get away with this? */
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.3);
	}

	dialog > div {
		padding: .5em;

		 @media screen and (min-width: 360px) {
			padding: 1em;
		 }
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

	.modal__close-button {
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        font-weight: 700;
        font-size: 16px;
        line-height: 16px;
        padding: 6px 12px;
        border: 1px solid black;
        border-radius: 2px;
        background-color: tan;
        cursor: pointer;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
		margin: 26px 0 0 0;
	}
</style>