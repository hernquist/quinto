<script>
	import Board from "../board/Board.svelte";
	import PlayerRow from "../player-row/PlayerRow.svelte";
	import Score from "../score/Score.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getGameState } from "$lib/state/game/game.svelte";
	import { Players } from "$lib/state/player/types";
	import { textLevelTuple } from "$lib/utils/textual";
	import PlayerTurnControls from "../player-turn-controls/PlayerTurnControls.svelte";
    
    const { Top, Bottom } = Players;

    const gameState = getGameState();
    const playerState = getPlayerState();
    const levelIndex = $derived(gameState.game.playLevel - 1);

</script>

<div class="game-play__fullscreen">
    <div class="game-play__gamescreen">
        <!-- TODO: make separate component -->
        <div class="game-play__score">
            <Score playerPosition={Top} name={"HUMAN"}/>
            <PlayerTurnControls 
                playerPosition={gameState.game.activePlayer} 
                activePlayer={gameState.game.activePlayer}
            />
            <Score playerPosition={Bottom} name={textLevelTuple[levelIndex]}/>
        </div>

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
    </div>
</div>
        
<style>
    .game-play__fullscreen {
        position: fixed;
        top: 64px;
        width: 100%;
        height: 100vh;
        background: lightseagreen;
    }

    .game-play__gamescreen {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 6px 0 6px;
        width: 100%;
        height: calc(100% - 64px);
    }

    .game-play__score {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: calc(100% - 12px); 
        margin: 8px 0 4px;

        @media screen and (min-width: 420px) {
            width: 396px;
        }
    }
</style>