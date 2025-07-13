<script>
    import { getGameState } from "$lib/state/game/game.svelte";

    const gameState = getGameState();
    const gameMultiple = $derived(gameState.game.gameMultiple);

</script>

<div class="game-multiple">
    {gameMultiple}
</div>

<style>
    .game-multiple {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-grow: 1;
        font-size: 3rem;
        line-height: 1.2;
        padding: 0 6px 4px;
    }

</style>