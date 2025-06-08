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
  .toaster {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    z-index: 1000;
  }

  .blurWrapper {
    position: fixed;
    z-index: 900;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(3px);
  }
</style>
