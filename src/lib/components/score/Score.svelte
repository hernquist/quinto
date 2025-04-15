<script lang="ts">
	import { gameState } from "../../../state/state.svelte";
	import { Players } from "../../../state/types";
</script>
<div>{gameState[Players.Top].score} scoreboard {gameState[Players.Bottom].score}</div>