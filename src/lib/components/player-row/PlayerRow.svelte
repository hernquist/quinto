<script lang="ts">
	import FinishTurn from "../finish-turn/FinishTurn.svelte";
    import PlayerTiles from "../player-tiles/PlayerTiles.svelte";

    const { tiles, playerPosition, activePlayer } = $props();
    const isActive = $derived(activePlayer === playerPosition);
</script>

<div class="playerRow__container">
    <PlayerTiles {tiles} {isActive}/>
    <FinishTurn {isActive} />
</div>

<style>
    .playerRow__container {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
</style>

