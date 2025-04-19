<script lang="ts">
    import { getPlayerState } from "$lib/state/player.svelte";
	import { Players } from "$lib/state/types";

    const { Top, Bottom } = Players;
    const playerState = getPlayerState()
    const topPlayer = playerState.player[Top];
    const bottomPlayer = playerState.player[Bottom];
</script>

<div>{topPlayer.score} scoreboard {bottomPlayer.score}</div>