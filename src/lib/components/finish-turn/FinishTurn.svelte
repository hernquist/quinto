<script lang="ts">
    import { getGameState } from "../../state/state.svelte";
	import { Players } from "../../state/types";
    
    const { isActive } = $props();
    const { Top, Bottom } = Players;
    const gameState = getGameState();

    const handleClick = (activePlayer: Players) => {
        if (activePlayer === Top) {
            gameState.updateActivePlayer(Bottom);
        } 
        if (activePlayer === Bottom) {
            gameState.updateActivePlayer(Top);
        }
    }
</script>


<button disabled={!isActive} onclick={() => handleClick(gameState.game.activePlayer)}>
    Finish Turn
</button>

<style>
    button {
        color: green;
        background-color: aquamarine;
    }
</style>