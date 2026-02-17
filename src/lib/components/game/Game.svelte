<script lang="ts">
	import { getGameState } from "$lib/state/game/game.svelte";
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
    import { Players } from "$lib/state/player/types";
	import { ModalScreen } from "$lib/state/modal-state/types";
    import { GameStatus } from "$lib/state/game/types";
	import GamePlay from "../game-play/GamePlay.svelte";
	import { updateScoreOnGameComplete } from "./updateGame.remote";
    
    const gameState = getGameState();
    const modalState = getModalState();
    const playerState = getPlayerState();

    const { gameId } = $props();
    const { Top, Bottom } = Players; 

    let fire = $state(true);

    $effect(() => {
        if (gameState.game.status === GameStatus.Complete) {

            if (fire) {
                updateScoreOnGameComplete({
                    gameId, 
                    top_score: playerState.player[Top].score,
                    bottom_score: playerState.player[Bottom].score,
                    rows: gameState.game.rows,
                    columns: gameState.game.columns,
                    // brittle based on position on assumption of computer player
                    winner: playerState.player[Top].winner && playerState.humanPlayer.position === 'TOP' ? "H" : "C",
                });
                fire = false
            }
            setTimeout(()=> {
                modalState.changeScreen(ModalScreen.GameOver);
                modalState.toggleModalOn();
            }, 20);
        }
	});
</script>

<GamePlay />