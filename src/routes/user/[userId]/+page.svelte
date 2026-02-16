<script lang="ts">
    import { goto } from '$app/navigation';
    import { getPlayerState } from "$lib/state/player/player.svelte.js";
    import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
    
    const playerState = getPlayerState();
    const modalState = getModalState()
    
    const { data } = $props();
    const { userGames } = $derived(data);
    
    function handleRedirect() {        
        // clear player state -- a bit hacky but the client-side clearUser is getting 
        playerState.clearUser();
        goto('/sign-out');
    }

    const turnOnModal = (e: MouseEvent) => {
        e.preventDefault();
        modalState.toggleModalOn();
    };

    function formatDate(date: Date | null) {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString();
    }
    console.log("playerstate. humanPlayer", JSON.parse(JSON.stringify(playerState.humanPlayer)));
</script>

<div class="user__page">
    <h1> {playerState.humanPlayer.user?.username}</h1>

    <div class="games-section">
        <h2>Games played ({userGames?.length || 0})</h2>
        {#if userGames && userGames.length > 0}
            <div class="games-list">
                {#each userGames as game}
                    <div class="game-card">
                        <div class="game-header">
                            <span class="game-id">Game #{game.id}</span>
                            <span class="game-status">{game.winner ? `Winner: ${game.winner}` : 'In Progress'}</span>
                        </div>
                        <div class="game-details">
                            <div class="game-info">
                                <span>Board: {game.rows} × {game.columns}</span>
                                <span>Multiple: {game.multiple}</span>
                                <span>Skill Level: {game.skill_level}</span>
                            </div>
                            <div class="game-scores">
                                <span>Top Score: {game.top_score}</span>
                                <span>Bottom Score: {game.bottom_score}</span>
                            </div>
                            <div class="game-players">
                                <span>Top: {game.top_player}</span>
                                <span>Bottom: {game.bottom_player}</span>
                            </div>
                            <div class="game-dates">
                                <span>Created: {formatDate(game.created_at)}</span>
                                {#if game.completed_at}
                                    <span>Completed: {formatDate(game.completed_at)}</span>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {:else}
            <p class="no-games">No games found for this user.</p>
        {/if}
    </div>

    <div>

        <button on:click={turnOnModal}>SETTINGS</button>
        <button on:click={handleRedirect}>SIGN OUT</button>
    </div>
</div>

<style lang="postcss">
    .user__page {
        min-height: 100vh;
        background-color: #E0D268;
        padding: 0 24px;
    }

    h1 {
        padding: 60px 0 20px 0;
        font-size: 3rem;
    }

    button {
        background-color: #447799;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        border: none;
        cursor: pointer;
        margin-right: 10px;
    }

    /* .games-section {
    } */

    .games-list {
        display: grid;
        gap: 16px;
        margin-top: 20px;
    }

    .game-card {
        background-color: white;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .game-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #e0e0e0;
    }

    .game-id {
        font-weight: bold;
        font-size: 1.1rem;
    }

    .game-status {
        background-color: #447799;
        color: white;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 0.9rem;
    }

    .game-details {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .game-info,
    .game-scores,
    .game-players,
    .game-dates {
        display: flex;
        gap: 16px;
        font-size: 0.9rem;
    }

    .game-info span,
    .game-scores span,
    .game-players span,
    .game-dates span {
        color: #555;
    }

    .no-games {
        margin-top: 20px;
        color: #666;
        font-style: italic;
    }
</style>