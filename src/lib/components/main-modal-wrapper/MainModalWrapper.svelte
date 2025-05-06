<script lang="ts">
    import GameOverModal from "$lib/components/game-over-modal/index.svelte";
	import { getModalState } from "$lib/state/modal-state/modal-state.svelte";
	import { ModalScreen } from "$lib/state/modal-state/types";
    
    const modalState = getModalState();
    const { Settings, GameOver, HighScores, About} = ModalScreen;
</script>

<div>
    {#if modalState.screen.name === Settings} 
        <div>settings</div>
        
    {:else if modalState.screen.name === GameOver}
        <GameOverModal />

    {:else if modalState.screen.name === HighScores}
        <div>high score</div>

    {:else if modalState.screen.name === About}
        <div>about</div>
    
    {/if}
</div>