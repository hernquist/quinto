<script lang="ts">
	import UserAccountIcon from "$lib/components/icons/UserAccountIcon.svelte";
    import Avatar from "$lib/components/avatar/Avatar.svelte";
    import { getPlayerState } from "$lib/state/player/player.svelte";

    const playerState = getPlayerState();
    const { humanPlayer: { isLoggedIn, user: { id, username } } } = $derived(playerState);
</script>

<div class="user">
    <a href={isLoggedIn ? `/user/${Number(id)}` : "/sign-in"} aria-label="Sign Up">
        {#if isLoggedIn}
            <Avatar {username} />
        {:else}
            <UserAccountIcon/>
        {/if}
    </a>
</div>

<style>
    .user {
        display: flex;
        height: 100%;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
</style>