<script lang="ts">
    import Board from "./Board.svelte";
    import Score from "../score/Score.svelte";
    import FinishTurn from "./FinishTurn.svelte";
	import InitializeGame from "../initializeGame/InitializeGame.svelte";
</script>

<InitializeGame>
    <Score />
    <Board />
    <FinishTurn />
</InitializeGame>