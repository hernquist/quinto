<script lang="ts">
	import { getGameState } from "../../state/game/game.svelte";
    import { getToastState } from "../../state/toast/toast.svelte";
	import Square from "../square/Square.svelte";
    import { type IHighlightedSquare, ToastType } from "$lib/state/toast/types.ts"
    
    const gameState = getGameState();
    let { board } = $derived(gameState.game);

    const toastState = getToastState();
    let { highlightedSquares, toasts }: { highlightedSquares: IHighlightedSquare[], toasts: IToast[] } = $derived(toastState);
    let totalScoreEffect = $derived(toasts[0]?.type === ToastType.TOTAL_LINE_SCORE);

    // TODO: why are puttiing this in props AND grabbing game info from context
    const { activePlayer } = $props();
    $inspect("[Board]gameState.game:", gameState.game);
</script>

<div class="board__container">
    {#each board as column, x}
        <div class="board_row">
            {#each column as square, y}
                <Square {square} {x} {y} {activePlayer} {highlightedSquares} />
            {/each}
        </div>
    {/each}
</div>

<style lang="postcss">
    .board__container {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
</style>