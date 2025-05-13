<script lang="ts">
    import { getGameState } from "../../state/game/game.svelte";
    import { getPlayerState } from "$lib/state/player/player.svelte";
    
    const { isActive } = $props();
    const gameState = getGameState();
    const playerState = getPlayerState();
    
    const handleClick = (e) => {
        e.preventDefault()
        gameState.resetTurn(playerState);
    }
    
    const disabled = $derived(gameState.game.turn.droppedTiles.length === 0);
</script>


<button disabled={!isActive || disabled} onclick={handleClick}>
    Reset
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