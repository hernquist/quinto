<script lang="ts">
    import { getPlayerState } from "$lib/state/player/player.svelte";
	import { Players } from "$lib/state/player/types";

    const { Top, Bottom } = Players;
    const playerState = getPlayerState();
    const topPlayerScore = $derived(playerState.player[Top].score);
    const bottomPlayerScore = $derived(playerState.player[Bottom].score);
</script>

<div>{playerState.player[Top].score} scoreboard {playerState.player[Bottom].score}</div>
<div>{topPlayerScore} scoreboard {bottomPlayerScore}</div>