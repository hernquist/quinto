<script lang="ts">
    interface AvatarProps {
        username: string;
    }

    let { username }: AvatarProps = $props();

    const initial = $derived(username?.charAt(0).toUpperCase() || '?');
</script>

<div class="avatar">
    <span class="avatar__letter" alt={username}>{initial}</span>
</div>

<style>
    .avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #FFA07A 0%, #1EB2AA 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        flex-shrink: 0;
    }

    .avatar__letter {
        color: black;
        font-size: 20px;
        line-height: 1;
        user-select: none;
    }
</style>

