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
        color: rgb(239, 244, 239);
        background-color: cornflowerblue;
        padding: 2px;
        border: 2px solid gray;
        border-radius: 20px;
        height: 40px;
        margin: 2px;

        &:disabled {
            background-color: lightslategray;
        }

        &:hover {
            opacity: 0.5;
        }
    }
</style>