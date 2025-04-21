<script lang="ts">
    import { getGameState } from "../../state/game.svelte";
    import { getPlayerState } from "$lib/state/player.svelte";
    
    const { isActive } = $props();
    const gameState = getGameState();
    const playerState = getPlayerState();

    const handleClick = () => {
        gameState.finishTurn(playerState)
    }
</script>


<button disabled={!isActive} onclick={handleClick}>
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
            opacity: 0.5;
        }
    }
</style>