<script lang="ts">
    import { getPlayerState } from "$lib/state/player/player.svelte";
	import { Players } from "$lib/state/player/types";

    const { Top, Bottom } = Players;
    let playerState = getPlayerState();

    let topPlayerScore = $derived(playerState.player[Top].score);
    let bottomPlayerScore = $derived(playerState.player[Bottom].score);
</script>

<div>{topPlayerScore} to {bottomPlayerScore}</div>