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
  const THINKING_MESSAGE = "Computer is thinking...";

  $effect(() => {
    setTimeout(() => {
      off = true
    }, 100);
  });
</script>

{#if toast.type === ToastType.PLAYER_MESSGAGE}
  {#if toast.message === THINKING_MESSAGE}
    <div class="thinking" role="status" aria-live="polite">
      <span class="sr-only">{THINKING_MESSAGE}</span>
      <span class="thinking__dots" aria-hidden="true">
        <span class="thinking__dot"></span>
        <span class="thinking__dot"></span>
        <span class="thinking__dot"></span>
      </span>
    </div>
  {:else}
    <div>
      {toast.message}
    </div>
  {/if}
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

  .thinking {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 5rem;
    min-height: 2.25rem;
    border-radius: 9999px;
    border: 1px solid var(--color-glass-border);
    background: var(--color-glass-bg);
    backdrop-filter: blur(4px);
  }

  .thinking__dots {
    display: inline-flex;
    gap: 0.35rem;
    padding: 0.25rem 0.75rem;
  }

  .thinking__dot {
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 9999px;
    background: #f0fdfa;
    opacity: 0.55;
    animation: thinking-bounce 900ms infinite ease-in-out;
  }

  .thinking__dot:nth-child(2) {
    animation-delay: 150ms;
  }
  .thinking__dot:nth-child(3) {
    animation-delay: 300ms;
  }

  @keyframes thinking-bounce {
    0%,
    100% {
      transform: translateY(0);
      opacity: 0.5;
    }
    50% {
      transform: translateY(-4px);
      opacity: 0.95;
    }
  }
</style>


