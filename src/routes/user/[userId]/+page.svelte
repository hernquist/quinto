<script lang="ts">
    import { goto } from '$app/navigation';
    import { getPlayerState } from "$lib/state/player/player.svelte.js";
    import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
    
    const playerState = getPlayerState();
    const modalState = getModalState()
    
    function handleRedirect() {        
        // clear player state -- a bit hacky but the client-side clearUser is getting 
        playerState.clearUser();
        goto('/sign-out');
    }

    const turnOnModal = (e: MouseEvent) => {
        e.preventDefault();
        modalState.toggleModalOn();
    };
</script>

<div class="user__page">
    <h1>USER PAGE</h1>

    <div>
        <div>USERNAME: {playerState.humanPlayer.user?.username}</div>
        <button on:click={turnOnModal}>SETTINGS</button>
        <button on:click={handleRedirect}>SIGN OUT</button>
    </div>
</div>

<style lang="postcss">
    .user__page {
        height: 100vh;
        background-color: #E0D268;
        padding: 0 24px;
    }

    h1 {
        padding: 100px 0 0 0;
    }

    button {
        background-color: #447799;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
    }
</style>