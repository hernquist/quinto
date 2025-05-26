<script lang="ts">
    import Board from "../board/Board.svelte";
    import Score from "../score/Score.svelte";
	import InitializeGame from "../initialize-game/InitializeGame.svelte";
	import PlayerRow from "../player-row/PlayerRow.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getGameState } from "$lib/state/game/game.svelte";
	import { getToastState } from "$lib/state/toast/toast.svelte";
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
    const { highlightedSquares, toasts } = $derived(toastState);

    // this is not working...
    // we need a way to signify end of game with async highlights and toasts
    // if there is more than one row or column to score it doesn't work
    $effect(() => {
        if (gameState.game.status === GameStatus.Complete 
            && highlightedSquares?.length === 0 
            && toasts.length === 0
        ) {
            modalState.changeScreen(ModalScreen.GameOver);
            modalState.toggleModalOn();
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