<script lang="ts">
	import FinishTurn from "../finish-turn/FinishTurn.svelte";
    import PlayerTiles from "../player-tiles/PlayerTiles.svelte";

    const { tiles, playerPosition, activePlayer } = $props();
    const isActive = $derived(activePlayer === playerPosition);
</script>

<div>
    <PlayerTiles {tiles} {isActive}/>
    <FinishTurn {isActive} />
</div>

