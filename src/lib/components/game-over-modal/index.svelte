<script lang="ts">
    import { getGameState } from "$lib/state/game/game.svelte";
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getToastState } from "$lib/state/toast/toast.svelte";
	import { initializeGame } from "../initialize-game/utils/initializeGame";

    let gameState = getGameState();
    let playerState = getPlayerState();
</script>

<div class="gameOverModal__container">
    <div class="gameOverModal__title">
        WINNER {playerState.getWinnerName(gameState)}
    </div>
    
    <div>
        <form method="POST">
            <button 
                class="modal__button"
                formaction="?/createNewGame"
            >NEW GAME</button>
        </form>
    </div>
</div>

<style>
    .gameOverModal__container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background-color: #f9f9f9;
        flex: 1;
    }

    .gameOverModal__title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .modal__button {
        font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        font-weight: 700;
        font-size: 16px;
        line-height: 16px;
        padding: 6px 12px;
        border: 1px solid black;
        border-radius: 2px;
        background-color: tan;
        cursor: pointer;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
		margin: 26px 0 0 0;
	}
</style>