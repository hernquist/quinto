<script lang="ts">
    import Board from "../board/Board.svelte";
    import Score from "../score/Score.svelte";
	import InitializeGame from "../initialize-game/InitializeGame.svelte";
	import PlayerRow from "../player-row/PlayerRow.svelte";
    import { Players } from "../../state/types";
	import { getPlayerTilesState } from "$lib/state/player.svelte";
    
    const { Top, Bottom } = Players;

    const playerTileState = getPlayerTilesState();
    $effect(() => {
        console.log("playerTileState1", playerTileState.tiles);
        console.log("playerTileState2", playerTileState.tiles[Top]);
        console.log("playerTileState3", playerTileState.tiles[Bottom]);
    })

</script>

<InitializeGame>
    <Score />
    <PlayerRow playerPosition={Top} tiles={playerTileState.tiles[Top]}/>
    <Board />
    <PlayerRow playerPosition={Bottom} tiles={playerTileState.tiles[Bottom]}/>
</InitializeGame>