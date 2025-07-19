<script lang="ts">
    import { getToastState } from "$lib/state/toast/toast.svelte";
    import PlayerTiles from "../player-tiles/PlayerTiles.svelte";
    import PlayerMessage from "$lib/components/toasts/PlayerMessage.svelte"

    const { tiles, playerPosition, activePlayer } = $props();
    const isActive = $derived(activePlayer === playerPosition);
    let toastState = getToastState();
</script>

<div class="playerRow__container">
    <!-- TODO: fix, this is not right [0]-->
    {#if Boolean(toastState.firedQueuedMessages.length) && playerPosition === toastState.firedQueuedMessages[0]?.activePlayer}
        <PlayerMessage {toastState} {playerPosition}/>
    {:else}
        <PlayerTiles {tiles} {isActive}/>
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

