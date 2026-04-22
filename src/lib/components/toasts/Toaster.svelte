<script lang="ts">
	import { getToastState, ToastState } from '$lib/state/toast/toast.svelte';
  import Toast from "./Toast.svelte";

	const toastState: ToastState = getToastState();
</script>

<div 
  class:blurWrapper={Boolean(toastState.toasts.length)}
>
  <div class="toaster">
    {#each toastState.toasts as toast}
      <Toast {toast} />
    {/each}
  </div>
</div>

<style lang="postcss">
  /* No transform here — it creates a containing block and breaks `position: fixed`
     + viewport `top`/`left` in Toast (board overlays). Center with flex instead. */
  .toaster {
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0;
    padding-top: 1rem;
    z-index: 1000;
    pointer-events: none;
  }

  .toaster :global(.toast-default) {
    pointer-events: auto;
  }

  .blurWrapper {
    position: fixed;
    z-index: 900;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-overlay);
    backdrop-filter: blur(3px);
  }
</style>
