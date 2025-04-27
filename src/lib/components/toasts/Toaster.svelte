<script lang="ts">
	import { getToastState } from '$lib/state/toast/toast.svelte';
  import Toast from "./Toast.svelte";

	const toastState = getToastState();
</script>

<div class="absolute right-2 top-2 flex flex-col gap-2">
	{#each toastState.toasts as toast}
		<Toast {toast} />
	{/each}
</div>

<!-- <script lang="ts">
	import { dismissToast, toasts } from "$lib/state/toast";
	import Toast from "./Toast.svelte";
  
  </script>
  
  {#if $toasts}
    <section>
      {#each $toasts as toast (toast.id)}
        <Toast
          type={toast.type}
          dismissible={toast.dismissible}
          on:dismiss={() => dismissToast(toast.id)}>{toast.message}</Toast
        >
      {/each}
    </section>
  {/if}
  
  <style lang="postcss">
    section {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      display: flex;
      margin-top: 1rem;
      justify-content: center;
      flex-direction: column;
      z-index: 1000;
    }
  </style> -->