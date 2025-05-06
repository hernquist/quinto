<script lang="ts">
    import { getGameState } from "$lib/state/game/game.svelte";
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getToastState } from "$lib/state/toast/toast.svelte";
	import { initializeGame } from "../initialize-game/utils/initializeGame";

    let gameState = getGameState();
    let playerState = getPlayerState();
    let modalState = getModalState();
    let toastState = getToastState();

</script>

<div >
    WINNER {playerState.getWinner().name}

    <button onclick={(e)=> {
        e.preventDefault();
        modalState.toggleModalOn();
        initializeGame(gameState, playerState);
        toastState.removeAllToasts;
    }}>NEW GAME</button>
</div>