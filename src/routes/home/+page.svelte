<script>
    import { getPlayerState } from "$lib/state/player/player.svelte";
    import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
    import { setUser } from "$lib/utils/setUser";
    
    const { data } = $props();
    const playerState = $derived(getPlayerState());
    const modalState = getModalState()
    
    $effect(() => {
        setUser(playerState, data);
        modalState.toggleModalOn();
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
