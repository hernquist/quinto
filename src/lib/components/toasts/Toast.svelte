<script lang="ts">
	import { type IToast, type IToastState, ToastType } from '$lib/state/toast/types';
	import X from 'phosphor-svelte/lib/X';
	import { getToastState } from '$lib/state/toast/toast.svelte';
  import { fade } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';

	type Props = {
		toast: IToast;
	};

	let { toast }: Props = $props();
	const toastState = getToastState();
  let off = $state(false);

  $effect(() => {
    setTimeout(() => {
      off = true
    }, 100);
  });
</script>

{#if toast.type === ToastType.PLAYER_MESSGAGE}
  <div >
    {toast.message}
  </div>
{:else if toast.type === ToastType.TOTAL_LINE_SCORE}
  {#if !off}
    <div class="totalLine__score" out:fade={{ duration: 1000 }}>
      {toast.message}
    </div>
  {/if}
{:else}
  <div
    class="toast-default relative flex h-16 w-60 flex-col justify-center rounded-md border p-2 shadow-md"
  >
    <span class="text-sm font-medium">{toast.title}</span>
    <span class="text-xs">{toast.message}</span>
    <button class="absolute right-2 top-2 size-5" onclick={() => toastState.remove(toast.id)}>
      <span class="sr-only">Close toast</span>
      <X class="size-4" />
    </button>
  </div>
{/if}

<style>
  .toast-default {
    border-color: var(--color-toast-border);
    background-color: var(--color-toast-bg);
    color: var(--color-text);
  }

  .totalLine__score {
    font-family: var(--font-sans);
    border: 12px double var(--color-total-score-border);
    font-size: 96px;
    padding: 0 16px;
    background-color: var(--color-total-score-bg);
    color: var(--color-text);
  }
</style>


