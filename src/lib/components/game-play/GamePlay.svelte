<script>
	import Board from "../board/Board.svelte";
	import PlayerRow from "../player-row/PlayerRow.svelte";
	import Score from "../score/Score.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getGameState } from "$lib/state/game/game.svelte";
	import { Players } from "$lib/state/player/types";
	import PlayerTurnControls from "../player-turn-controls/PlayerTurnControls.svelte";
    
    const { Top, Bottom } = Players;

    const gameState = getGameState();
    const playerState = getPlayerState();
</script>

<div class="game-play__fullscreen">
    <!-- <pre>Player: {gameState.game.activePlayer}  # tiles: {gameState.game.tiles.length} Round: {gameState.game.round} Turn: {gameState.game.turn.turnStatus} Direction: {gameState.game.turn.direction} </pre> -->
    <Score />
    <PlayerTurnControls 
        playerPosition={gameState.game.activePlayer} 
        activePlayer={gameState.game.activePlayer}
    />
    <PlayerRow 
        playerPosition={Top} 
        activePlayer={gameState.game.activePlayer} 
        tiles={playerState.tiles[Top]} 
    />
    <Board activePlayer={gameState.game.activePlayer}/>
    <PlayerRow 
        playerPosition={Bottom} 
        activePlayer={gameState.game.activePlayer} 
        tiles={playerState.tiles[Bottom]} 
    />
    <Score />
</div>
        
<style>
    .game-play__fullscreen {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 64px 0 0 0;
        width: 100%;
        height: 100vh;
    }

    .game-play__container {
        display: flex;
        flex-direction: column;

    }
</style>