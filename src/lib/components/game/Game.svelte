<script lang="ts">
    import Board from "../board/Board.svelte";
    import Score from "../score/Score.svelte";
	import InitializeGame from "../initialize-game/InitializeGame.svelte";
	import PlayerRow from "../player-row/PlayerRow.svelte";
    import { GameStatus, Players } from "$lib/state/types";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getGameState } from "$lib/state/game/game.svelte";
	import MainModalWrapper from "$lib/components/main-modal-wrapper/MainModalWrapper.svelte";
	import ModalHeader from "$lib/components/modal-header/ModalHeader.svelte";
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
	import { ModalScreen } from "$lib/state/modal-state/types";
	import Modal from "$lib/components/modal/Modal.svelte";
    
    const { Top, Bottom } = Players;
    const playerTileState = getPlayerState();
    const gameState = getGameState();
    const modalState = getModalState();
    // this should probably be part of modalState
	let showModal = $state(false);

    $effect(() => {
        if (gameState.game.status === GameStatus.Complete) {
            modalState.changeScreen(ModalScreen.GameOver);
            showModal = true;
        }
	});

</script>

<button onclick={() => (showModal = true)}> show modal </button>

<InitializeGame>
    {#if gameState.game.status === GameStatus.Complete}
        <pre>DONE</pre>
    {/if}
    <pre>Player: {gameState.game.activePlayer}  # tiles: {gameState.game.tiles.length} Round: {gameState.game.round} Turn: {gameState.game.turn.turnStatus} Direction: {gameState.game.turn.direction} </pre>
    <Score />
    <PlayerRow playerPosition={Top} activePlayer={gameState.game.activePlayer} tiles={playerTileState.tiles[Top]}/>
    <Board activePlayer={gameState.game.activePlayer}/>
    <PlayerRow playerPosition={Bottom} activePlayer={gameState.game.activePlayer} tiles={playerTileState.tiles[Bottom]}/>
    <Modal bind:showModal>
        {#snippet header()}
            <ModalHeader />
        {/snippet}
        <MainModalWrapper />
    </Modal>
</InitializeGame>