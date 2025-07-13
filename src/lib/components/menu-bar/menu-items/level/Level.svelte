<script>
    import { getGameState } from "$lib/state/game/game.svelte";
	import { textLevelTuple } from "$lib/utils/textual";

    const gameState = getGameState();
    const levelIndex = $derived(gameState.game.playLevel - 1);
</script>

<div class="level">
    LEVEL
    {textLevelTuple[levelIndex]}
</div>

<style>
    .level {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 78px;
    }
</style>