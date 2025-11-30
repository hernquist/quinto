<script lang="ts">
    import { getPlayerState } from "$lib/state/player/player.svelte.js";

    // clear player state 
    const playerState = getPlayerState();
    playerState.clearUser();

</script>

<div>
    SIGN OUT
</div>