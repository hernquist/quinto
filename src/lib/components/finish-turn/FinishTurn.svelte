<script lang="ts">
    import { getGameState } from "../../state/game/game.svelte";
    import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getToastState } from "$lib/state/toast/toast.svelte";
	import { asyncWhileLoop } from "$lib/state/game/gameUtils";
    
    const { isActive } = $props();
    const gameState = getGameState();
    const playerState = getPlayerState();
    const toastState = getToastState();

    const handleClick = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const play = gameState.isValidPlay();
        if (play.isValid) {
            await gameState.finishTurn(playerState, toastState);
            // if computer player "on", then run computer turn
            // make a function to share with initializeGame though it is really just a setTimeout
            setTimeout(async () => {
                console.log("[FinishTurn] Computer turn starting");
                console.log("[FinishTurn] ---------------------------------");
                await asyncWhileLoop(gameState, playerState, toastState);
            }, 20);
        } else {
            toastState.addHighlights([play.emptySquares], gameState.game.gameMultiple)
        }
    };
    const disabled = $derived(gameState.game.turn.droppedTiles.length === 0);
</script>


<button disabled={!isActive || disabled} onclick={handleClick}>
    FINISH
</button>

<style>
    button {
        color: black;
        font-weight: bold;
        background-color: cornflowerblue;
        padding: 4px;
        border: 2px solid gray;
        border-radius: 8px;
        height: 40px;
        margin: 2px 2px 2px 8px;

        &:disabled {
            background-color: lightslategray;
        }

        &:hover {
            opacity: 0.8;
        }
    }
</style>