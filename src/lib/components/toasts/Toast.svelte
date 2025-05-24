<script lang="ts">
	import { type IToast, type IToastState, ToastType } from '$lib/state/toast/types';
	import X from 'phosphor-svelte/lib/X';
	import { getToastState } from '$lib/state/toast/toast.svelte';
  import { send, receive } from "./transition.ts"
  import { fade } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';

	type Props = {
		toast: IToast;
	};

	let { toast }: Props = $props();
	const toastState: IToastState = getToastState();
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
    <div class="totalLine__score" transition:fade={{ duration: 1200 }}>
      {toast.message}
    </div>
  {/if}
{:else}
  <div
    class="relative flex h-16 w-60 flex-col justify-center rounded-md border border-gray-500 bg-gray-300 p-2 shadow-md"
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
  .totalLine__score {
    font-family: cursive;
    font-size: 96px
  }

</style>


