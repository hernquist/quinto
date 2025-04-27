<script lang="ts">
	import { getToastState } from '$lib/state/toast/toast.svelte';
	import type { IToastState } from '$lib/state/toast/types';
  import Toast from "./Toast.svelte";

	const toastState: IToastState = getToastState();
</script>

<div class="toaster">
	{#each toastState.toasts as toast}
		<Toast {toast} />
	{/each}
</div>

<style lang="postcss">
  .toaster {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    margin-top: 1rem;
    justify-content: center;
    flex-direction: column;
    z-index: 1000;
  }
</style>
