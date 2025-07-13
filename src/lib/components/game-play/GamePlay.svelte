<script>
	import Board from "../board/Board.svelte";
	import PlayerRow from "../player-row/PlayerRow.svelte";
	import Score from "../score/Score.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getGameState } from "$lib/state/game/game.svelte";
	import { Players } from "$lib/state/player/types";
    
    const { Top, Bottom } = Players;

    const gameState = getGameState();
    const playerState = getPlayerState();
</script>

<div class="game-play">
    <!-- <pre>Player: {gameState.game.activePlayer}  # tiles: {gameState.game.tiles.length} Round: {gameState.game.round} Turn: {gameState.game.turn.turnStatus} Direction: {gameState.game.turn.direction} </pre> -->
    <Score />
    <PlayerRow 
        playerPosition={Top} 
        activePlayer={gameState.game.activePlayer} 
        tiles={playerState.tiles[Top]} 
        isComputer={playerState.player[Top].isComputer}
    />
    <Board activePlayer={gameState.game.activePlayer}/>
    <PlayerRow 
        playerPosition={Bottom} 
        activePlayer={gameState.game.activePlayer} 
        tiles={playerState.tiles[Bottom]} 
        isComputer={playerState.player[Bottom].isComputer}
    />
</div>

<style>
    .game-play {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 64px 0 0 0;
        width: 100%;
        height: 100%;
    }
</style>