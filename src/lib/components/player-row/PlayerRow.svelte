<script lang="ts">
	import { getGameState } from "../../state/state.svelte";
	import FinishTurn from "../finish-turn/FinishTurn.svelte";
    import PlayerTiles from "../player-tiles/PlayerTiles.svelte";

    const { tiles, playerPosition } = $props();
    const gameState = getGameState();
    const { activePlayer } = gameState;
    const isActive = activePlayer === playerPosition;
</script>

<div>
    <PlayerTiles {tiles} {isActive}/>
    <FinishTurn {isActive} />
</div>

