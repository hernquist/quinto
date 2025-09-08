<script>
	import Game from "$lib/components/game/Game.svelte";
	import { getPlayerState } from "$lib/state/player/player.svelte";

    const { data } = $props();
    const playerState = getPlayerState();

    $effect(() => {
        if (data?.token) {
            playerState.setUser(data?.user[0]);
        };
    });

</script>

<Game/>

<style lang="postcss">
    @reference "tailwindcss";
</style>