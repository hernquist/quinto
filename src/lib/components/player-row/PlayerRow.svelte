<script lang="ts">
    import { getToastState } from "$lib/state/toast/toast.svelte";
	import FinishTurn from "../finish-turn/FinishTurn.svelte";
    import PlayerTiles from "../player-tiles/PlayerTiles.svelte";
	import ResetTurn from "../reset-turn/ResetTurn.svelte";
    import PlayerMessage from "$lib/components/toasts/PlayerMessage.svelte"

    const { tiles, playerPosition, activePlayer, isComputer } = $props();
    const isActive = $derived(activePlayer === playerPosition);
    let toastState = getToastState();

    // TODO: remove
    const mockTurn = {
        "firstTurnOfRound":true,
        "droppedTiles":
            [
                {"x":0,"y":2,"tile":{"id":0,"text":2,"value":2}},
                {"x":1,"y":2,"tile":{"id":1,"text":6,"value":6}},
                {"x":2,"y":2,"tile":{"id":3,"text":5,"value":5}}
            ],
        "turnStatus":"multiPlaced", // TURN_STATUS.MULTI_PLACED;
        "direction":"horizontal"
    }

</script>

<div class="playerRow__container">
    <!-- TODO: fix, this is not right [0]-->
    {#if Boolean(toastState.firedQueuedMessages.length) && playerPosition === toastState.firedQueuedMessages[0]?.activePlayer}
        <PlayerMessage {toastState} {playerPosition}/>
    {:else}
        <PlayerTiles {tiles} {isActive}/>
        {#if !isComputer}
            <FinishTurn {isActive} />
            <ResetTurn {isActive} />
        {/if}
     {/if}
</div>

<style>
    .playerRow__container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        height: 45px;
    }
</style>

