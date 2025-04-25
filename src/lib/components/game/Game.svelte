<script lang="ts">
    import Board from "../board/Board.svelte";
    import Score from "../score/Score.svelte";
	import InitializeGame from "../initialize-game/InitializeGame.svelte";
	import PlayerRow from "../player-row/PlayerRow.svelte";
    import { Players } from "$lib/state/types";
	import { getPlayerState } from "$lib/state/player.svelte";
	import { getGameState } from "$lib/state/game.svelte";
    
    const { Top, Bottom } = Players;
    const playerTileState = getPlayerState();
    const gameState = getGameState();
</script>

<InitializeGame>
    <pre>Player: {gameState.game.activePlayer}  # tiles: {gameState.game.tiles.length} Round: {gameState.game.round} Turn: {gameState.game.turn.turnStatus} Direction: {gameState.game.turn.direction} </pre>
    <Score />
    <PlayerRow playerPosition={Top} activePlayer={gameState.game.activePlayer} tiles={playerTileState.tiles[Top]}/>
    <Board activePlayer={gameState.game.activePlayer}/>
    <PlayerRow playerPosition={Bottom} activePlayer={gameState.game.activePlayer} tiles={playerTileState.tiles[Bottom]}/>
</InitializeGame>