<script>
	import { getPlayerState } from "$lib/state/player/player.svelte";

    const { data } = $props();
    const playerState = getPlayerState();

    $inspect("[from home/page.svelte].data", data);
    console.log("[from home/page.svelte].data", data);

    $effect(() => {
        if (data?.token) {
            console.log("data", data);
            playerState.setUser(data?.user[0]);
        };
    });
</script>

<div class="home__fullscreen">
    HOME
</div>

<style lang="postcss">
    .home__fullscreen {
        position: fixed;
        top: 64px;
        width: 100%;
        height: 100vh;
        background: #447799;
    }    
</style>
