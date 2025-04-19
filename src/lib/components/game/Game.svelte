<script lang="ts">
    import Board from "../board/Board.svelte";
    import Score from "../score/Score.svelte";
	import InitializeGame from "../initialize-game/InitializeGame.svelte";
	import PlayerRow from "../player-row/PlayerRow.svelte";
    import { Players } from "../../state/types";
	import { getPlayerTilesState } from "$lib/state/player.svelte";
	import { getGameState } from "$lib/state/state.svelte";
    
    const { Top, Bottom } = Players;

    const playerTileState = getPlayerTilesState();
    const gameState = getGameState();
    $effect(() => {
        console.log("playerTileState1", playerTileState.tiles);
        console.log("playerTileState2", playerTileState.tiles[Top]);
        console.log("playerTileState3", playerTileState.tiles[Bottom]);
    })

</script>

<InitializeGame>
    <pre>{gameState.game.activePlayer} -- {gameState.game.tiles.length}</pre>
    <Score />
    <PlayerRow playerPosition={Top} activePlayer={gameState.game.activePlayer} tiles={playerTileState.tiles[Top]}/>
    <Board activePlayer={gameState.game.activePlayer}/>
    <PlayerRow playerPosition={Bottom} activePlayer={gameState.game.activePlayer} tiles={playerTileState.tiles[Bottom]}/>
</InitializeGame>