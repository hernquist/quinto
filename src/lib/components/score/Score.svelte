<script lang="ts">
	import { getGameState } from "../../../state/state.svelte";
	import { Players } from "../../../state/types";

    const gameState = getGameState();
</script>
<div>{gameState[Players.Top].score} scoreboard {gameState[Players.Bottom].score}</div>