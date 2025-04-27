<script lang="ts">
	import type { IToast } from '$lib/state/toast/types';
	import X from 'phosphor-svelte/lib/X';
	import { getToastState } from '$lib/state/toast/toast.svelte';

	type Props = {
		toast: IToast;
	};

	let { toast }: Props = $props();
	const toastState = getToastState();
</script>

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

    <!-- import ErrorIcon from "../icons/ErrorIcon.svelte"; -->
    <!-- import InfoIcon from "../icons/InfoIcon.svelte"; -->
    <!-- import CloseIcon from "../icons/CloseIcon.svelte"; -->
	<!-- import SuccessIcon from "../icons/SuccessIcon.svelte"; -->
  
  <!-- <article class={type} role="alert" transition:fade>
    {#if type === "success"}
      <SuccessIcon width="1.1em" />
    {:else if type === "error"}
      <ErrorIcon width="1.1em" />
    {:else}
      <InfoIcon width="1.1em" />
    {/if}
  
    <div class="text">
      <slot />
    </div>
  
    {#if dismissible}
      <button class="close" on:click={() => dispatch("dismiss")}>
        <CloseIcon width="0.8em" />
      </button>
    {/if}
  </article>
  
  <style lang="postcss">
    article {
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.2rem;
      display: flex;
      align-items: center;
      margin: 0 auto 0.5rem auto;
      width: 20rem;
    }
    .error {
      background: IndianRed;
    }
    .success {
      background: MediumSeaGreen;
    }
    .info {
      background: SkyBlue;
    }
    .text {
      margin-left: 1rem;
    }
    button {
      color: white;
      background: transparent;
      border: 0 none;
      padding: 0;
      margin: 0 0 0 auto;
      line-height: 1;
      font-size: 1rem;
    }
  </style> -->
  