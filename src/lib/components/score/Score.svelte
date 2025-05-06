<script lang="ts">
    import { getPlayerState } from "$lib/state/player/player.svelte";
	import { Players } from "$lib/state/player/types";
    import { getModalState } from "$lib/state/modal-state/modal-state.svelte";

    const { Top, Bottom } = Players;
    const playerState = getPlayerState()
    const topPlayer = playerState.player[Top];
    const bottomPlayer = playerState.player[Bottom];
    let modalState = getModalState();
</script>

<div>{topPlayer.score} scoreboard {bottomPlayer.score} --- {modalState.showModal}</div>