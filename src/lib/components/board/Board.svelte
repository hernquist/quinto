<script lang="ts">
	import { onMount } from "svelte";
	import Square from "../square/Square.svelte";
	import { getGameState } from "../../state/game/game.svelte";
    import { getToastState } from "../../state/toast/toast.svelte";
    import { type IHighlightedSquare, type IToast, ToastType } from "$lib/state/toast/types"
    
    const gameState = getGameState();
    let { board } = $derived(gameState.game);
    const toastState = getToastState();
    let { highlightedSquares, toasts }: { highlightedSquares: IHighlightedSquare[], toasts: IToast[] } = $derived(toastState);

    // TODO: why are puttiing this in props AND grabbing game info from context
    const { activePlayer } = $props();

    onMount(() => {
        gameState.specialUpdate();
    });
</script>

<div class="outerBoard__container">
    <div class="board__container" style:--num-of-columns={board.length}>
        {#each board as column, x}
            <div class="board__column" style:--num-of-rows={column.length}>
                {#each column as square, y}
                    <Square {square} {x} {y} {activePlayer} {highlightedSquares} />
                {/each}
            </div>
        {/each}
    </div>
</div>
    
<style lang="postcss">
    .outerBoard__container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .board__container {
        display: grid;
        justify-content: center;
        width: calc(100% - 12px);
        grid-template-columns: repeat(var(--num-of-columns), minmax(25px, 100px));
        
        @media screen and (min-width: 600px) {
            width: 576px;
        }
    }

    .board__column {
        display: grid;
        grid-template-rows: repeat(var(--num-of-rows), minmax(25px, 100px));
        /* aspect-ratio: 1 / 1; */
        height: calc(100vw - 24px); /* width here is key */
        max-height: 496px;
    }
</style>