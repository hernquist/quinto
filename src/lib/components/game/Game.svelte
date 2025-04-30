<script lang="ts">
    import Board from "../board/Board.svelte";
    import Score from "../score/Score.svelte";
	import InitializeGame from "../initialize-game/InitializeGame.svelte";
	import PlayerRow from "../player-row/PlayerRow.svelte";
    import { GameStatus, Players } from "$lib/state/types";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getGameState } from "$lib/state/game/game.svelte";
	import MainModalWrapper from "../main-modal-wrapper/MainModalWrapper.svelte";
	import ModalHeader from "../modal-header/ModalHeader.svelte";
    import Modal from "../modal/Modal.svelte";
    
    const { Top, Bottom } = Players;
    const playerTileState = getPlayerState();
    const gameState = getGameState();
	let showModal = $state(false);

    $effect(() => {
        if (gameState.game.status === GameStatus.Complete) {
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