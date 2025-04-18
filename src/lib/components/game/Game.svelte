<script lang="ts">
    import Board from "../board/Board.svelte";
    import Score from "../score/Score.svelte";
	import InitializeGame from "../initialize-game/InitializeGame.svelte";
	import PlayerRow from "../player-row/PlayerRow.svelte";
    import { Players } from "../../../state/types";
    const { Top, Bottom } = Players;
</script>

<InitializeGame>
    <Score />
    <PlayerRow playerPosition={Top}/>
    <Board />
    <PlayerRow playerPosition={Bottom}/>
</InitializeGame>