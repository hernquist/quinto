<script lang="ts">
    import Board from "../board/Board.svelte";
    import Score from "../score/Score.svelte";
	import InitializeGame from "../initialize-game/InitializeGame.svelte";
	import PlayerRow from "../player-row/PlayerRow.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getGameState } from "$lib/state/game/game.svelte";
	import { getToastState, MAIN_TOAST_DURATION, HIGHLIGHT_DURATION } from "$lib/state/toast/toast.svelte";
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
	import Modal from "$lib/components/modal/modal.svelte";
	import MainModalWrapper from "$lib/components/main-modal-wrapper/MainModalWrapper.svelte";
	import ModalHeader from "$lib/components/modal-header/ModalHeader.svelte";
	import { ModalScreen } from "$lib/state/modal-state/types";
    import { GameStatus } from "$lib/state/game/types";
	import { Players } from "$lib/state/player/types";
    
    const { Top, Bottom } = Players;

    const playerTileState = getPlayerState();
    const gameState = getGameState();
    const modalState = getModalState();
    const toastState = getToastState();
    const {numberOfLines } = $derived(toastState);
    
    // This is needs more testing and thinking. That calculation should happen out of here probably.
    $effect(() => {
        if (gameState.game.status === GameStatus.Complete) { 
            setTimeout(()=> {
                modalState.changeScreen(ModalScreen.GameOver);
                modalState.toggleModalOn();
            }, numberOfLines * HIGHLIGHT_DURATION + 1 * MAIN_TOAST_DURATION);
        }
	});
</script>

<button onclick={
    (e) => {
        e.preventDefault();
        modalState.toggleModalOn()
    }}>show modal</button>

<InitializeGame>
    {#if gameState.game.status === GameStatus.Complete}
        <pre>DONE</pre>
    {/if}
    <pre>Player: {gameState.game.activePlayer}  # tiles: {gameState.game.tiles.length} Round: {gameState.game.round} Turn: {gameState.game.turn.turnStatus} Direction: {gameState.game.turn.direction} </pre>
    <Score />
    <PlayerRow playerPosition={Top} activePlayer={gameState.game.activePlayer} tiles={playerTileState.tiles[Top]}/>
    <Board activePlayer={gameState.game.activePlayer}/>
    <PlayerRow playerPosition={Bottom} activePlayer={gameState.game.activePlayer} tiles={playerTileState.tiles[Bottom]}/>
    {#if modalState.showModal === true}
        <Modal>
            {#snippet header()}
                <ModalHeader />
            {/snippet}
            <MainModalWrapper/>
        </Modal>
    {/if}
</InitializeGame>