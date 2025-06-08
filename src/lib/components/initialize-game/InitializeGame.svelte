<script lang="ts">
    import { getGameState } from "../../state/game/game.svelte";
    import { getPlayerState } from "$lib/state/player/player.svelte";
	import { initializeGame } from "./utils/initializeGame";
	import { getToastState } from "$lib/state/toast/toast.svelte";

    const { children } = $props();
    const gameState = getGameState();
    const playerState = getPlayerState();
    const toastState = getToastState();

    initializeGame(gameState, playerState, toastState);
</script>

{@render children()}