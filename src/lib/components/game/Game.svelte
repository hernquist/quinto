<script lang="ts">
    import Board from "../board/Board.svelte";
    import Score from "../score/Score.svelte";
	import InitializeGame from "../initialize-game/InitializeGame.svelte";
	import PlayerRow from "../player-row/PlayerRow.svelte";
    import { Players } from "../../state/types";
	import { getPlayerTilesState } from "$lib/state/player.svelte";
    
    const { Top, Bottom } = Players;

    const playerTileState = getPlayerTilesState();

</script>

<InitializeGame>
    {playerTileState.tiles.length}
    <Score />
    <PlayerRow playerPosition={Top} tiles={playerTileState.tiles}/>
    <Board />
    <!-- <PlayerRow playerPosition={Bottom}/> -->
</InitializeGame>