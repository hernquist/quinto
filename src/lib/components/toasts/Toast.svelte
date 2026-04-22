<script lang="ts">
	import { type IToast, type IToastState, ToastType } from '$lib/state/toast/types';
	import X from 'phosphor-svelte/lib/X';
	import { getToastState, TOTAL_LINE_SCORE_DISPLAY_MS, TOTAL_LINE_SCORE_FADE_MS } from '$lib/state/toast/toast.svelte';
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { onDestroy } from 'svelte';

	type Props = {
		toast: IToast;
	};

	let { toast }: Props = $props();
	const toastState = getToastState();
  let off = $state(false);
  const THINKING_MESSAGE = "Computer is thinking...";
  type BoardRect = { top: number; left: number; width: number; height: number };
  let boardRect = $state<BoardRect | null>(null);
  let ro: ResizeObserver | null = null;

  /** Union of all playing squares (matches the visible cell area; `.board__container` is often wider). */
  const updateBoardRect = () => {
    const squares = document.querySelectorAll<HTMLElement>('.board__square');
    if (squares.length === 0) {
      const el = document.querySelector('.board__container') as HTMLElement | null;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      boardRect = {
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
      return;
    }

    let minLeft = Infinity;
    let minTop = Infinity;
    let maxRight = -Infinity;
    let maxBottom = -Infinity;

    for (const el of squares) {
      const r = el.getBoundingClientRect();
      minLeft = Math.min(minLeft, r.left);
      minTop = Math.min(minTop, r.top);
      maxRight = Math.max(maxRight, r.right);
      maxBottom = Math.max(maxBottom, r.bottom);
    }

    boardRect = {
      top: Math.round(minTop),
      left: Math.round(minLeft),
      width: Math.round(maxRight - minLeft),
      height: Math.round(maxBottom - minTop)
    };
  };

  const needsBoardOverlay = $derived(
    (toast.type === ToastType.TOTAL_LINE_SCORE && !off) ||
      (toast.type === ToastType.PLAYER_MESSGAGE && toast.message === THINKING_MESSAGE)
  );

  $effect(() => {
    if (!needsBoardOverlay) return;

    updateBoardRect();
    // Observe the grid: layout changes when squares resize. Square rects are read in the callback/updates.
    const el = document.querySelector('.outerBoard__container') as HTMLElement | null
      ?? (document.querySelector('.board__container') as HTMLElement | null);
    if (!el || typeof ResizeObserver === 'undefined') return;

    const onLayout = () => updateBoardRect();
    window.addEventListener('resize', onLayout);
    window.addEventListener('scroll', onLayout, true);

    ro?.disconnect();
    ro = new ResizeObserver(() => updateBoardRect());
    ro.observe(el);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', onLayout);
      window.removeEventListener('scroll', onLayout, true);
    };
  });

  onDestroy(() => ro?.disconnect());
  /* Use $derived.by — a plain `$derived(() => …)` value IS the function, not its return. */
  const parsedTotalScore = $derived.by(() => {
    const raw = String(toast?.message ?? '').trim();
    const match = raw.match(/-?\d+/);
    return match ? Number(match[0]) : 0;
  });
  const scoreTone = $derived.by((): 'gain' | 'loss' | 'neutral' => {
    const n = parsedTotalScore;
    if (n > 0) return 'gain';
    if (n < 0) return 'loss';
    return 'neutral';
  });

  $effect(() => {
    if (toast.type !== ToastType.TOTAL_LINE_SCORE) return;
    off = false;
    const timeout = setTimeout(() => {
      off = true;
    }, TOTAL_LINE_SCORE_DISPLAY_MS);
    return () => clearTimeout(timeout);
  });
</script>

{#if toast.type === ToastType.PLAYER_MESSGAGE}
  {#if toast.message === THINKING_MESSAGE}
    <div
      class="thinking thinking--board"
      style:top={boardRect ? `${boardRect.top}px` : undefined}
      style:left={boardRect ? `${boardRect.left}px` : undefined}
      style:width={boardRect ? `${boardRect.width}px` : undefined}
      style:height={boardRect ? `${boardRect.height}px` : undefined}
      role="status"
      aria-live="polite"
      in:fade={{ duration: 180 }}
    >
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
    <div
      class="totalLine {scoreTone}"
      style:top={boardRect ? `${boardRect.top}px` : undefined}
      style:left={boardRect ? `${boardRect.left}px` : undefined}
      style:width={boardRect ? `${boardRect.width}px` : undefined}
      style:height={boardRect ? `${boardRect.height}px` : undefined}
      role="status"
      aria-live="polite"
      in:scale={{ duration: 160, start: 0.96, easing: cubicOut }}
      out:fade={{ duration: TOTAL_LINE_SCORE_FADE_MS }}
    >
      <div class="totalLine__label">Turn score</div>
      <div class="totalLine__value">{toast.message}</div>
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

  .totalLine {
    /* Size container: score text scales with overlay (board) dimensions via cq* units. */
    container-type: size;
    /* Viewport-fixed so the score sits exactly on the game board. */
    position: fixed;
    z-index: 1001;
    box-sizing: border-box;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: min(0.75rem, 3cqmin);
    margin: 0;
    padding: min(1.25rem, 5cqmin) min(1.5rem, 6cqmin);
    border-radius: 0;
    border: 2px solid var(--color-glass-border);
    background: var(--color-glass-bg);
    backdrop-filter: blur(4px);
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    color: var(--color-text);
    font-family: var(--font-sans);
    /* Until we measure the board, match its responsive size from Board.svelte */
    width: min(calc(100vw - 24px), 496px);
    height: min(calc(100vw - 24px), 496px);
    /* Visual overlay only — don’t block board interaction for this brief toast */
    pointer-events: none;
  }

  /*
   * Positive toast = emerald green (reads clearly as “good”).
   * Board / tile score pulses stay teal via --color-score-gain-* elsewhere.
   */
  .totalLine.gain {
    --toast-pos-mid: #34d399;
    --toast-pos-rich: #10b981;
    --toast-pos-deep: #047857;
    --toast-pos-shadow: #064e3b;
    --toast-pos-shadow2: #065f46;
    --toast-pos-hi: #6ee7b7;
    --toast-pos-bloom: #86efac;
    border-width: 3px;
    border-color: var(--toast-pos-rich);
    backdrop-filter: blur(3px);
    background:
      radial-gradient(
        ellipse 90% 80% at 50% 38%,
        color-mix(in srgb, var(--toast-pos-mid) 58%, transparent) 0%,
        color-mix(in srgb, #059669 72%, transparent) 52%,
        color-mix(in srgb, var(--toast-pos-deep) 88%, transparent) 100%
      ),
      linear-gradient(
        165deg,
        color-mix(in srgb, var(--toast-pos-shadow) 55%, rgba(0, 0, 0, 0.5)) 0%,
        color-mix(in srgb, var(--toast-pos-shadow2) 40%, rgba(0, 0, 0, 0.45)) 100%
      );
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--toast-pos-hi) 38%, transparent) inset,
      0 14px 44px rgba(0, 0, 0, 0.38),
      0 0 72px color-mix(in srgb, var(--toast-pos-rich) 58%, transparent),
      0 0 120px color-mix(in srgb, var(--toast-pos-mid) 26%, transparent);
  }

  .totalLine.gain .totalLine__label {
    color: #ecfdf5;
    opacity: 0.92;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  }

  .totalLine.gain .totalLine__value {
    color: #f0fdf4;
    text-shadow:
      0 2px 0 rgba(0, 0, 0, 0.25),
      0 0 48px color-mix(in srgb, var(--toast-pos-bloom) 75%, transparent);
  }

  /* Strong red “loss” wash + glow. */
  .totalLine.loss {
    border-width: 3px;
    border-color: var(--color-score-loss-2);
    backdrop-filter: blur(3px);
    background:
      radial-gradient(
        ellipse 90% 80% at 50% 38%,
        color-mix(in srgb, var(--color-score-loss-2) 52%, transparent) 0%,
        color-mix(in srgb, var(--color-score-loss-4) 78%, transparent) 52%,
        color-mix(in srgb, var(--color-score-loss-6) 90%, transparent) 100%
      ),
      linear-gradient(
        165deg,
        color-mix(in srgb, var(--color-score-loss-6) 58%, rgba(0, 0, 0, 0.55)) 0%,
        color-mix(in srgb, var(--color-score-loss-5) 42%, rgba(0, 0, 0, 0.5)) 100%
      );
    box-shadow:
      0 0 0 1px color-mix(in srgb, var(--color-score-loss-1) 28%, transparent) inset,
      0 14px 44px rgba(0, 0, 0, 0.4),
      0 0 72px color-mix(in srgb, var(--color-score-loss-3) 58%, transparent),
      0 0 120px color-mix(in srgb, var(--color-score-loss-2) 24%, transparent);
  }

  .totalLine.loss .totalLine__label {
    color: #fef2f2;
    opacity: 0.92;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  }

  .totalLine.loss .totalLine__value {
    color: #fff1f2;
    text-shadow:
      0 2px 0 rgba(0, 0, 0, 0.3),
      0 0 40px color-mix(in srgb, var(--color-score-loss-1) 65%, transparent);
  }

  .totalLine__label {
    font-size: clamp(0.7rem, min(6cqmin, 4.5cqw), 1.35rem);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    opacity: 0.75;
  }

  .totalLine__value {
    /* Large score, bounded by board so multi-digit values still fit. */
    font-size: clamp(2.75rem, min(52cqmin, 34cqw, 62cqh), 14rem);
    line-height: 1;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    max-width: 95%;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
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

  .thinking.thinking--board {
    position: fixed;
    z-index: 1001;
    box-sizing: border-box;
    margin: 0;
    min-width: unset;
    min-height: unset;
    width: min(calc(100vw - 24px), 496px);
    height: min(calc(100vw - 24px), 496px);
    border-radius: 0;
    border-width: 2px;
    border-color: var(--color-glass-border);
    background: var(--color-glass-bg);
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(255, 255, 255, 0.05) inset;
    pointer-events: none;
  }

  .thinking--board .thinking__dots {
    gap: 0.55rem;
    padding: 0.5rem 1rem;
  }

  .thinking--board .thinking__dot {
    width: 0.6rem;
    height: 0.6rem;
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


