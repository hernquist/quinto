<script>
    import { getPlayerState } from "$lib/state/player/player.svelte";
    import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
    import { setUser } from "$lib/utils/setUser";
	import { getHighscoresState } from "$lib/state/highscores/highscores.svelte.js";
    
    const { data } = $props();
    const playerState = $derived(getPlayerState());
    const modalState = getModalState();
    const highscoresState = getHighscoresState();
    const { highscores } = $derived(data);

    $effect(() => {
        setUser(playerState, data);
        modalState.toggleModalOn();
        highscoresState.setHighscores(highscores || []);
    });
</script>

<div class="home__fullscreen">
    HOME {playerState?.humanPlayer.user?.username}
    - {playerState?.humanPlayer.user}
    - {JSON.stringify(playerState?.humanPlayer.user)}
    - date {new Date(playerState?.humanPlayer.user?.created_at).toDateString()}
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
