<script lang="ts">
	import { onMount } from "svelte";
	import Game from "$lib/components/game/Game.svelte";
	import { initializeGame } from "$lib/components/initialize-game/utils/initializeGame";
	import { getGameState } from "$lib/state/game/game.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";
	import { getToastState } from "$lib/state/toast/toast.svelte";
    import { setUser } from "$lib/utils/setUser";

	import type { PageProps } from '../../../../$types';

    const gameState = getGameState();
    const playerState = getPlayerState();
    const toastState = getToastState();

	const { data } = $props();
    const { gameData, gameId } = $derived(data);
    
    const options = {
        rows: gameData?.rows,
        columns: gameData?.columns,
        playLevel: gameData?.skillLevel,
        gameMultiple: gameData?.multiple
    };

    function setGame() {
        initializeGame(gameState, playerState, toastState, options);
    }

    onMount(() => setGame());

    function handleClick() {
        console.log("click playerState", 
            JSON.parse(JSON.stringify(playerState))
        );
    }   
    
    $effect(() => {
        setUser(playerState, data);
    });
</script>

<Game gameId={gameId} />
<button style="margin-top: 80px; height: 100px; position: relative" onclick={handleClick}>BUTTON</button>

<style lang="postcss">
    @reference "tailwindcss";
</style>

