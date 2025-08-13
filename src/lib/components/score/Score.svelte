<script lang="ts">
    import { slide } from "svelte/transition";
    import { getPlayerState } from "$lib/state/player/player.svelte";
	import type { IScoreProps } from "./types";

    let { playerPosition, name }: IScoreProps = $props();
    let playerState = getPlayerState();
    let playerScore = $derived(playerState.player[playerPosition]?.score);
    const duration = 300;
</script>

<div class="scoreboard__container">
    <div class="scoreboard__name">
        {name}
    </div>
    {#key playerScore}
        <div
            in:slide={{ duration, delay: duration }}
            out:slide={{ duration }}
            class="scoreboard__score"
        >
            {playerScore} 
        </div>
    {/key}
</div>

<style>
    .scoreboard__container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: baseline;
    }

    .scoreboard__name {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
    }

    .scoreboard__score {
        display: flex;
        flex-direction: row;
        justify-content: center;
        font-size: 24px;
        padding-left: 6px;
    }
</style>