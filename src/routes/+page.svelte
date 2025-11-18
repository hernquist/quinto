<script>
	import { getPlayerState } from "$lib/state/player/player.svelte";

    const { data } = $props();
    const playerState = getPlayerState();

    $effect(() => {
        if (data?.token) {
            playerState.setUser(data?.user[0]);
        };
    });

</script>

<style lang="postcss">
    @reference "tailwindcss";
</style>