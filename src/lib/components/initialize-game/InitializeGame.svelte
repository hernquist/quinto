<script lang="ts">
    import { getGameState } from "../../state/game/game.svelte";
    import { getPlayerState } from "$lib/state/player/player.svelte";
	import { initializeGame } from "./utils/initializeGame";

    const { children } = $props();
    const gameState = getGameState();
    const playerTileState = getPlayerState();

    initializeGame(gameState, playerTileState);
</script>

{@render children()}