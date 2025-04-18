<script lang="ts">
	import { getGameState } from "../../../state/state.svelte";
	import FinishTurn from "../finish-turn/FinishTurn.svelte";
    import PlayerTiles from "../player-tiles/PlayerTiles.svelte";
    import type { Players } from "../../../state/types";

    const props = $props();
    const playerPosition: Players = props.playerPosition

    const gameState = getGameState();
    const { activePlayer } = gameState;
    const isActive = activePlayer === playerPosition;
    const { tiles } = gameState[playerPosition];

</script>

<div>
    <PlayerTiles {isActive} {tiles}/>
    <FinishTurn {isActive} />
</div>

