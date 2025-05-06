<script lang="ts">
    import { getGameState } from "$lib/state/game/game.svelte";
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { initializeGame } from "../initialize-game/utils/initializeGame";

    let gameState = getGameState();
    let playerState = getPlayerState();
    let modalState = getModalState();

</script>

<div >
    WINNER {playerState.getWinner().name}

    <button onclick={()=>{
        modalState.toggleModalOn();
        initializeGame(gameState, playerState)
    }}>NEW GAME</button>
</div>