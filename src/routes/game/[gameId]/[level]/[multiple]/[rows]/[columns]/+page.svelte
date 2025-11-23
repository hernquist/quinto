<script lang="ts">
	import Game from "$lib/components/game/Game.svelte";
	import { initializeGame } from "$lib/components/initialize-game/utils/initializeGame";
	import { getGameState } from "$lib/state/game/game.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getToastState } from "$lib/state/toast/toast.svelte";
	import { onMount } from "svelte";
	import type { PageProps } from '../../../../$types';

    const gameState = getGameState();
    const playerState = getPlayerState();
    const toastState = getToastState();

	let { data }  : PageProps = $props();
    
    const options = {
        rows: (data as any)?.rows,
        columns: (data as any)?.columns,
        playLevel: (data as any)?.skillLevel,
        gameMultiple: (data as any)?.multiple
    };

    function setGame() {
        initializeGame(gameState, playerState, toastState, options);
    }

    onMount(() => setGame());;
</script>

<Game />

<style lang="postcss">
    @reference "tailwindcss";
</style>

