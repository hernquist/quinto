<script lang="ts">
    import Board from "../board/Board.svelte";
    import Score from "../score/Score.svelte";
    import FinishTurn from "../finish-turn/FinishTurn.svelte";
	import InitializeGame from "../initialize-game/InitializeGame.svelte";
</script>

<InitializeGame>
    <Score />
    <Board />
    <FinishTurn />
</InitializeGame>