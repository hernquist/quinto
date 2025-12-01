<script>
	import { getPlayerState } from "$lib/state/player/player.svelte";
    import { setUser } from "$lib/utils/setUser";

    const { data } = $props();
    const playerState = $derived(getPlayerState());

    $inspect("[from home/page.svelte].data", data);
    $inspect("[from home/page.svelte].playerState", playerState)
    $inspect("[from home/page.svelte].playerState.isLoggedin()", playerState.isLoggedIn())

    $effect(() => {
        setUser(playerState, data);
    });
</script>

<div class="home__fullscreen">
    HOME {playerState?.humanPlayer.user?.username}
    - {playerState?.humanPlayer.user}
    - {JSON.stringify(playerState?.humanPlayer.user)}
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
