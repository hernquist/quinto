<script lang="ts">
    import { getGameState } from "../../state/game/game.svelte";
    import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getToastState } from "$lib/state/toast/toast.svelte";
    
    const { isActive } = $props();
    const gameState = getGameState();
    const playerState = getPlayerState();
    const toastState = getToastState();

    const handleClick = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const play = gameState.isValidPlay();
        if (play.isValid) {
            gameState.finishTurn(playerState, toastState);
        } else {
            toastState.addHighlights([play.emptySquares], gameState.game.gameMultiple)
        }
    };
    
    const disabled = $derived(gameState.game.turn.droppedTiles.length === 0);
</script>


<button disabled={!isActive || disabled} onclick={handleClick}>
    Finish Turn
</button>

<style>
    button {
        color: rgb(239, 244, 239);
        background-color: cornflowerblue;
        padding: 2px;
        border: 2px solid gray;
        border-radius: 20px;
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