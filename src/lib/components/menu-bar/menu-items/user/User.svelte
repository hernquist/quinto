<script lang="ts">
	import UserAccountIcon from "$lib/components/icons/UserAccountIcon.svelte";
</script>

<div class="user">
    <a href="/sign-up" aria-label="Sign Up">
        <UserAccountIcon />
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