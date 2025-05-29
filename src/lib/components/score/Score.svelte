<script lang="ts">
    import { slide } from "svelte/transition";
    import { getPlayerState } from "$lib/state/player/player.svelte";
	import { Players } from "$lib/state/player/types";

    const { Top, Bottom } = Players;
    let playerState = getPlayerState();

    let topPlayerScore = $derived(playerState.player[Top].score);
    let bottomPlayerScore = $derived(playerState.player[Bottom].score);
    const duration = 300;
</script>

<!-- TODO: spotty transition due to score layout -->
<div class="scoreboard">
    {#key topPlayerScore}
        <div
            in:slide={{ duration, delay: duration }}
            out:slide={{ duration }}
            class="score"
        >
            {topPlayerScore} 
        </div>
    {/key}
        <div class="temp_text">
            to
        </div>
    {#key bottomPlayerScore}
        <div     
            in:slide={{ duration, delay: duration }}
            out:slide={{ duration }}
            class="score"
        >
            {bottomPlayerScore} 
        </div>
    {/key}
</div>

<style>
    .scoreboard {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .score {
        width: 20px;
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .temp_text {
        margin: 0 8px;
    }
</style>