<script lang="ts">
	import FinishTurn from "../finish-turn/FinishTurn.svelte";
	import ResetTurn from "../reset-turn/ResetTurn.svelte";

    const { playerPosition, activePlayer } = $props();
    const isActive = $derived(activePlayer === playerPosition);
</script>

<div class="playerTurnControls__container">
    <ResetTurn {isActive} />
    <FinishTurn {isActive} />
</div>

<style>
    .playerTurnControls__container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        height: 45px;
    }
</style>
